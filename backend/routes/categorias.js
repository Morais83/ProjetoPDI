const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categorias ORDER BY id_categoria_pai, nome_categoria');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter categorias' });
  }
});

router.post('/', async (req, res) => {
  const { nome_categoria, descricao, id_categoria_pai } = req.body;
  try {
    const [resultado] = await db.query(
      'INSERT INTO categorias (nome_categoria, descricao, id_categoria_pai) VALUES (?, ?, ?)',
      [nome_categoria, descricao || null, id_categoria_pai || null]
    );
    res.status(201).json({ mensagem: 'Categoria criada!', id: resultado.insertId });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar categoria' });
  }
});

router.put('/:id', async (req, res) => {
  const { nome_categoria, descricao } = req.body;
  try {
    await db.query(
      'UPDATE categorias SET nome_categoria=?, descricao=? WHERE id_categoria=?',
      [nome_categoria, descricao || null, req.params.id]
    );
    res.json({ mensagem: 'Categoria atualizada!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar categoria' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM categorias WHERE id_categoria=?', [req.params.id]);
    res.json({ mensagem: 'Categoria eliminada!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao eliminar categoria' });
  }
});

module.exports = router;