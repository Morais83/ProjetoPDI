const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todas as encomendas
router.get('/', async (req, res) => {
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

// GET encomenda por id com linhas
router.get('/:id', async (req, res) => {
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
            (SELECT url FROM imagens_produto WHERE id_produto = p.id_produto AND ordem = 1) AS imagem_url
      FROM linhas_encomenda le
      LEFT JOIN variante v ON le.id_variante = v.id_variante
      LEFT JOIN produtos p ON v.id_produto = p.id_produto
      WHERE le.id_encomenda = ?
    `, [enc.id_encomenda]);

    res.json({ ...encomenda[0], linhas });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter encomenda' });
  }
});

// PUT atualizar estado
router.put('/:id/estado', async (req, res) => {
  const { estado } = req.body;
  try {
    await db.query('UPDATE encomendas SET estado = ? WHERE id_encomenda = ?', [estado, req.params.id]);
    res.json({ mensagem: 'Estado atualizado!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar estado' });
  }
});

// POST criar encomenda
router.post('/', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Não autenticado' });
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id_morada, metodo_pagamento, itens, portes_envio } = req.body;

    // Calcular total
    const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0) + portes_envio;

    const [resultado] = await db.query(
      'INSERT INTO encomendas (id_utilizador, id_morada, total_pago, portes_envio, estado, metodo_pagamento) VALUES (?, ?, ?, ?, ?, ?)',
      [decoded.id, id_morada || null, total, portes_envio, 'pendente', metodo_pagamento]
    );

    const id_encomenda = resultado.insertId;

    // Inserir linhas
    for (const item of itens) {
      await db.query(
        'INSERT INTO linhas_encomenda (id_encomenda, id_variante, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
        [id_encomenda, item.id_variante, item.quantidade, item.preco]
      );
    }

    res.status(201).json({ mensagem: 'Encomenda criada!', id_encomenda });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar encomenda' });
  }
});

module.exports = router;