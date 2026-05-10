const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ── GET todos os produtos ─────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [produtos] = await db.query(`
      SELECT p.*,
             c.nome_categoria,
             m.nome_marca,
             (SELECT url FROM imagens_produto
              WHERE id_produto = p.id_produto
              ORDER BY ordem LIMIT 1) AS imagem_principal
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      ORDER BY p.id_produto DESC
    `);
    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao obter produtos' });
  }
});

// ── GET pesquisa ──────────────────────────────────────────────────────────────
router.get('/pesquisa', async (req, res) => {
  const termo = req.query.q;
  if (!termo) return res.status(400).json({ erro: 'Termo de pesquisa não fornecido.' });
  try {
    const [resultados] = await db.query(`
      SELECT p.*,
             c.nome_categoria,
             m.nome_marca,
             (SELECT url FROM imagens_produto
              WHERE id_produto = p.id_produto
              ORDER BY ordem LIMIT 1) AS imagem_principal
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      WHERE p.nome_produto LIKE ? OR p.descricao LIKE ?
      ORDER BY p.id_produto DESC
    `, [`%${termo}%`, `%${termo}%`]);
    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor ao pesquisar.' });
  }
});

// ── GET promoções ─────────────────────────────────────────────────────────────
router.get('/promocoes', async (req, res) => {
  try {
    const [produtos] = await db.query(`
      SELECT p.*,
             c.nome_categoria,
             m.nome_marca,
             (SELECT url FROM imagens_produto
              WHERE id_produto = p.id_produto
              ORDER BY ordem LIMIT 1) AS imagem_principal,
             ROUND((1 - p.preco / p.preco_anterior) * 100) AS desconto
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      WHERE p.preco_anterior IS NOT NULL AND p.preco_anterior > p.preco
      ORDER BY desconto DESC
    `);
    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao obter promoções' });
  }
});

// ── GET produto por id ────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [produto] = await db.query(`
      SELECT p.*, c.nome_categoria, c.id_categoria_pai, m.nome_marca
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      WHERE p.id_produto = ?
    `, [req.params.id]);

    if (produto.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });

    const [imagens] = await db.query(
      'SELECT * FROM imagens_produto WHERE id_produto = ? ORDER BY cor, ordem',
      [req.params.id]
    );
    const [variantes] = await db.query(
      'SELECT * FROM variante WHERE id_produto = ?',
      [req.params.id]
    );

    res.json({ ...produto[0], imagens, variantes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao obter produto' });
  }
});

// ── POST criar produto ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { id_categoria, id_marca, nome_produto, preco, preco_anterior,
          descricao, materiais, guia_cuidados, stock, imagens, variantes } = req.body;
  try {
    const [resultado] = await db.query(
      `INSERT INTO produtos
         (id_categoria, id_marca, nome_produto, preco, preco_anterior,
          descricao, materiais, guia_cuidados, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_categoria, id_marca, nome_produto, preco, preco_anterior || null,
       descricao, materiais, guia_cuidados, stock || 0]
    );
    const id_produto = resultado.insertId;

    if (imagens?.length) {
      for (const img of imagens) {
        await db.query(
          'INSERT INTO imagens_produto (id_produto, url, ordem, cor) VALUES (?, ?, ?, ?)',
          [id_produto, img.url, img.ordem, (img.cor || '').trim() || null]
        );
      }
    }
    if (variantes?.length) {
      for (const v of variantes) {
        await db.query(
          'INSERT INTO variante (id_produto, tamanho, cor, hex_cor, stock_variante) VALUES (?, ?, ?, ?, ?)',
          [id_produto, v.tamanho, (v.cor || '').trim(), v.hex_cor || null, v.stock_variante || 0]
        );
      }
    }

    res.status(201).json({ mensagem: 'Produto criado com sucesso!', id: id_produto });
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ erro: 'Erro ao criar produto' });
  }
});

// ── PUT editar produto ────────────────────────────────────────────────────────
// Usa transação + merge de variantes para não quebrar FK de encomendas.
router.put('/:id', async (req, res) => {
  const id_produto = req.params.id;
  const { id_categoria, id_marca, nome_produto, preco, preco_anterior,
          descricao, materiais, guia_cuidados, stock, imagens, variantes } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Atualiza campos do produto
    await conn.query(
      `UPDATE produtos
       SET id_categoria=?, id_marca=?, nome_produto=?, preco=?,
           preco_anterior=?, descricao=?, materiais=?, guia_cuidados=?, stock=?
       WHERE id_produto=?`,
      [id_categoria, id_marca, nome_produto, preco,
       preco_anterior || null, descricao, materiais, guia_cuidados, stock, id_produto]
    );

    // 2. Imagens — substitui totalmente (sem FK de encomendas → seguro)
    if (imagens !== undefined) {
      await conn.query('DELETE FROM imagens_produto WHERE id_produto = ?', [id_produto]);
      for (const img of (imagens || [])) {
        await conn.query(
          'INSERT INTO imagens_produto (id_produto, url, ordem, cor) VALUES (?, ?, ?, ?)',
          [id_produto, img.url, img.ordem, (img.cor || '').trim() || null]
        );
      }
    }

    // 3. Variantes — merge para preservar id_variante referenciado em encomendas
    if (variantes !== undefined) {
      const novasVariantes = (variantes || []).map(v => ({
        ...v,
        cor: (v.cor || '').trim(),
      }));

      // IDs das variantes que vamos manter/atualizar
      const idsKeep = [];

      for (const v of novasVariantes) {
        // Procura variante existente com mesmo tamanho+cor
        const [existe] = await conn.query(
          'SELECT id_variante FROM variante WHERE id_produto=? AND tamanho=? AND cor=?',
          [id_produto, v.tamanho, v.cor]
        );

        if (existe.length > 0) {
          // Atualiza stock e hex sem alterar o id_variante
          const idV = existe[0].id_variante;
          await conn.query(
            'UPDATE variante SET hex_cor=?, stock_variante=? WHERE id_variante=?',
            [v.hex_cor || null, v.stock_variante || 0, idV]
          );
          idsKeep.push(idV);
        } else {
          // Insere nova variante
          const [ins] = await conn.query(
            'INSERT INTO variante (id_produto, tamanho, cor, hex_cor, stock_variante) VALUES (?,?,?,?,?)',
            [id_produto, v.tamanho, v.cor, v.hex_cor || null, v.stock_variante || 0]
          );
          idsKeep.push(ins.insertId);
        }
      }

      // Remove variantes que:
      // • não estão na nova lista E
      // • não têm encomendas associadas (seguro apagar)
      if (idsKeep.length > 0) {
        await conn.query(
          `DELETE FROM variante
           WHERE id_produto = ?
             AND id_variante NOT IN (?)
             AND id_variante NOT IN (SELECT id_variante FROM linhas_encomenda)`,
          [id_produto, idsKeep]
        );
      } else {
        // Sem variantes novas — apaga apenas as sem encomendas
        await conn.query(
          `DELETE FROM variante
           WHERE id_produto = ?
             AND id_variante NOT IN (SELECT id_variante FROM linhas_encomenda)`,
          [id_produto]
        );
      }
    }

    await conn.commit();
    res.json({ mensagem: 'Produto atualizado com sucesso!' });
  } catch (err) {
    await conn.rollback();
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ erro: 'Erro ao atualizar produto: ' + err.message });
  } finally {
    conn.release();
  }
});

// ── DELETE eliminar produto ───────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM produtos WHERE id_produto = ?', [req.params.id]);
    res.json({ mensagem: 'Produto eliminado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao eliminar produto' });
  }
});

module.exports = router;
