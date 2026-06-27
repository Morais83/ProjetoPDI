const express   = require('express');
const router    = express.Router();
const db        = require('../db');
const adminAuth = require('../middleware/admin');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM marcas ORDER BY nome_marca');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter marcas' });
  }
});

router.post('/', adminAuth, async (req, res) => {
  const { nome_marca, descricao, imagem_url } = req.body;
  try {
    const [resultado] = await db.query(
      'INSERT INTO marcas (nome_marca, descricao, imagem_url) VALUES (?, ?, ?)',
      [nome_marca, descricao || null, imagem_url || null]
    );
    res.status(201).json({ mensagem: 'Marca criada!', id: resultado.insertId });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar marca' });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  const { nome_marca, descricao, imagem_url } = req.body;
  try {
    await db.query(
      'UPDATE marcas SET nome_marca=?, descricao=?, imagem_url=? WHERE id_marca=?',
      [nome_marca, descricao || null, imagem_url || null, req.params.id]
    );
    res.json({ mensagem: 'Marca atualizada!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar marca' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM marcas WHERE id_marca=?', [req.params.id]);
    res.json({ mensagem: 'Marca eliminada!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao eliminar marca' });
  }
});

module.exports = router;