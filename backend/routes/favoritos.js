const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getUser = (req) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// GET favoritos do utilizador
router.get('/', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  try {
    const [rows] = await db.query(`
      SELECT f.id_favorito, f.id_produto, f.id_variante, f.data_adicao,
             p.nome_produto, p.preco, p.preco_anterior,
             (SELECT url FROM imagens_produto WHERE id_produto = p.id_produto AND ordem = 1) AS imagem_url
      FROM favoritos f
      JOIN produtos p ON f.id_produto = p.id_produto
      WHERE f.id_utilizador = ?
      ORDER BY f.data_adicao DESC
    `, [user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter favoritos' });
  }
});

// POST adicionar favorito
router.post('/', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  const { id_produto } = req.body;
  try {
    await db.query(
      'INSERT IGNORE INTO favoritos (id_utilizador, id_produto) VALUES (?, ?)',
      [user.id, id_produto]
    );
    res.status(201).json({ mensagem: 'Adicionado aos favoritos!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao adicionar favorito' });
  }
});

// DELETE remover favorito
router.delete('/:id_produto', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  try {
    await db.query(
      'DELETE FROM favoritos WHERE id_utilizador = ? AND id_produto = ?',
      [user.id, req.params.id_produto]
    );
    res.json({ mensagem: 'Removido dos favoritos!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover favorito' });
  }
});

// GET verificar se produto é favorito
router.get('/verificar/:id_produto', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.json({ favorito: false });
  try {
    const [rows] = await db.query(
      'SELECT id_favorito FROM favoritos WHERE id_utilizador = ? AND id_produto = ?',
      [user.id, req.params.id_produto]
    );
    res.json({ favorito: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao verificar favorito' });
  }
});

module.exports = router;