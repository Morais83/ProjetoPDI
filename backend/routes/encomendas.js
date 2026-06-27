const express   = require('express');
const router    = express.Router();
const db        = require('../db');
const jwt       = require('jsonwebtoken');
const adminAuth = require('../middleware/admin');
const auth      = require('../middleware/auth');
const { enviarConfirmacaoEncomenda, enviarAtualizacaoEstado } = require('../services/notificacoes');

// ── GET todas as encomendas (admin) ───────────────────────────────────────────
router.get('/', adminAuth, async (req, res) => {
  try {
    const [encomendas] = await db.query(`
      SELECT e.*, u.nome, u.email,
             m.rua, m.cidade, m.codigo_postal, m.pais
      FROM encomendas e
      LEFT JOIN utilizadores u ON e.id_utilizador = u.id_utilizador
      LEFT JOIN moradas m ON e.id_morada = m.id_morada
      ORDER BY e.processado_em DESC
    `);
    res.json(encomendas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao obter encomendas' });
  }
});

// ── GET encomenda por id com linhas ───────────────────────────────────────────
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const [encomenda] = await db.query(`
      SELECT e.*, u.nome, u.email,
             m.rua, m.cidade, m.codigo_postal, m.pais
      FROM encomendas e
      LEFT JOIN utilizadores u ON e.id_utilizador = u.id_utilizador
      LEFT JOIN moradas m ON e.id_morada = m.id_morada
      WHERE e.id_encomenda = ?
    `, [req.params.id]);

    if (encomenda.length === 0) return res.status(404).json({ erro: 'Encomenda não encontrada' });

    const [linhas] = await db.query(`
      SELECT le.*, p.nome_produto, p.id_produto, v.tamanho, v.cor,
            (SELECT url FROM imagens_produto WHERE id_produto = p.id_produto ORDER BY ordem LIMIT 1) AS imagem_url
      FROM linhas_encomenda le
      LEFT JOIN variante v ON le.id_variante = v.id_variante
      LEFT JOIN produtos p ON v.id_produto = p.id_produto
      WHERE le.id_encomenda = ?
    `, [req.params.id]);

    res.json({ ...encomenda[0], linhas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao obter encomenda' });
  }
});

// ── PUT atualizar estado (admin) ──────────────────────────────────────────────
// Cancelamento → restaura stock automaticamente
router.put('/:id/estado', adminAuth, async (req, res) => {
  const { estado } = req.body;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Buscar estado atual para decidir se restaura stock
    const [[enc]] = await conn.query(
      'SELECT estado FROM encomendas WHERE id_encomenda = ?',
      [req.params.id]
    );
    if (!enc) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Encomenda não encontrada' });
    }

    // Se muda para cancelado e ainda não estava cancelado → restaura stock
    if (estado === 'cancelado' && enc.estado !== 'cancelado') {
      const [linhas] = await conn.query(
        'SELECT id_variante, quantidade FROM linhas_encomenda WHERE id_encomenda = ?',
        [req.params.id]
      );
      for (const linha of linhas) {
        await conn.query(
          'UPDATE variante SET stock_variante = stock_variante + ? WHERE id_variante = ?',
          [linha.quantidade, linha.id_variante]
        );
      }
      console.log(`Stock restaurado para encomenda #${req.params.id}`);
    }

    await conn.query(
      'UPDATE encomendas SET estado = ? WHERE id_encomenda = ?',
      [estado, req.params.id]
    );

    await conn.commit();

    // Buscar dados para email (não bloqueia)
    const [rows] = await db.query(`
      SELECT e.total_pago, u.nome, u.email
      FROM encomendas e
      LEFT JOIN utilizadores u ON e.id_utilizador = u.id_utilizador
      WHERE e.id_encomenda = ?
    `, [req.params.id]);

    if (rows.length > 0 && rows[0].email) {
      const { nome, email, total_pago } = rows[0];
      enviarAtualizacaoEstado({ email, nome, id_encomenda: req.params.id, estado, total: total_pago });
    }

    res.json({ mensagem: 'Estado atualizado!' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar estado' });
  } finally {
    conn.release();
  }
});

// ── POST criar encomenda ──────────────────────────────────────────────────────
// Usa transação: valida stock → reduz stock → cria encomenda (tudo atómico)
router.post('/', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Não autenticado' });

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id_morada, metodo_pagamento, itens, portes_envio, taxa_cobranca = 0 } = req.body;

    if (!itens || itens.length === 0) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Carrinho vazio' });
    }

    // ── 1. Validar e reduzir stock (FOR UPDATE bloqueia a linha para evitar race conditions)
    for (const item of itens) {
      const [[variante]] = await conn.query(
        `SELECT v.stock_variante, p.nome_produto, v.tamanho, v.cor
         FROM variante v
         LEFT JOIN produtos p ON v.id_produto = p.id_produto
         WHERE v.id_variante = ? FOR UPDATE`,
        [item.id_variante]
      );

      if (!variante) {
        await conn.rollback();
        return res.status(400).json({ erro: `Produto não encontrado (variante ${item.id_variante})` });
      }

      if (variante.stock_variante < item.quantidade) {
        await conn.rollback();
        const nome = `${variante.nome_produto} (${variante.cor} / ${variante.tamanho})`;
        return res.status(400).json({
          erro: `Stock insuficiente para "${nome}". Disponível: ${variante.stock_variante}, pedido: ${item.quantidade}`,
          id_variante: item.id_variante,
          stock_disponivel: variante.stock_variante,
        });
      }

      // Reduz stock
      await conn.query(
        'UPDATE variante SET stock_variante = stock_variante - ? WHERE id_variante = ?',
        [item.quantidade, item.id_variante]
      );
    }

    // ── 2. Buscar dados do utilizador
    const [[utilizador]] = await conn.query(
      'SELECT nome, email FROM utilizadores WHERE id_utilizador = ?',
      [decoded.id]
    );

    // ── 3. Calcular total e criar encomenda
    const subtotal = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    const total    = subtotal + (portes_envio || 0) + (taxa_cobranca || 0);

    const [resultado] = await conn.query(
      `INSERT INTO encomendas
        (id_utilizador, id_morada, total_pago, portes_envio, taxa_cobranca, estado, metodo_pagamento)
       VALUES (?, ?, ?, ?, ?, 'confirmado', ?)`,
      [decoded.id, id_morada || null, total, portes_envio || 0, taxa_cobranca || 0, metodo_pagamento]
    );

    const id_encomenda = resultado.insertId;

    // ── 4. Inserir linhas da encomenda
    for (const item of itens) {
      await conn.query(
        'INSERT INTO linhas_encomenda (id_encomenda, id_variante, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
        [id_encomenda, item.id_variante, item.quantidade, item.preco]
      );
    }

    await conn.commit();

    // ── 5. Email de confirmação (não bloqueia a resposta)
    if (utilizador?.email) {
      const [linhas] = await db.query(`
        SELECT le.quantidade, le.preco_unitario, p.nome_produto, v.tamanho, v.cor
        FROM linhas_encomenda le
        LEFT JOIN variante v ON le.id_variante = v.id_variante
        LEFT JOIN produtos p ON v.id_produto = p.id_produto
        WHERE le.id_encomenda = ?
      `, [id_encomenda]);

      enviarConfirmacaoEncomenda({
        email: utilizador.email,
        nome: utilizador.nome,
        id_encomenda,
        total,
        itens: linhas,
      });
    }

    res.status(201).json({ mensagem: 'Encomenda criada!', id_encomenda });

  } catch (err) {
    await conn.rollback();
    console.error('Erro ao criar encomenda:', err);
    res.status(500).json({ erro: 'Erro ao criar encomenda' });
  } finally {
    conn.release();
  }
});

// ── DELETE /limpar — apaga todas as encomendas e restaura stock (apenas admin) ──
router.delete('/limpar', adminAuth, async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Restaurar stock de todas as linhas existentes
    const [linhas] = await conn.query(
      'SELECT id_variante, quantidade FROM linhas_encomenda'
    );
    for (const linha of linhas) {
      await conn.query(
        'UPDATE variante SET stock_variante = stock_variante + ? WHERE id_variante = ?',
        [linha.quantidade, linha.id_variante]
      );
    }

    // Apagar linhas e encomendas
    await conn.query('DELETE FROM linhas_encomenda');
    await conn.query('DELETE FROM encomendas');

    await conn.commit();
    res.json({ mensagem: 'Todas as encomendas apagadas e stock restaurado.' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ erro: 'Erro ao limpar encomendas' });
  } finally {
    conn.release();
  }
});

module.exports = router;
