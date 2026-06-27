const express   = require('express');
const router    = express.Router();
const db        = require('../db');
const adminAuth = require('../middleware/admin');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categorias ORDER BY id_categoria_pai, nome_categoria');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter categorias' });
  }
});

// Apenas UMA rota POST (com imagem)
router.post('/', adminAuth, async (req, res) => {
  const { nome_categoria, descricao, id_categoria_pai, imagem } = req.body;

  try {
    const [resultado] = await db.query(
      'INSERT INTO categorias (nome_categoria, descricao, id_categoria_pai, imagem) VALUES (?, ?, ?, ?)',
      [nome_categoria, descricao || null, id_categoria_pai || null, imagem || null]
    );
    res.status(201).json({ id: resultado.insertId, mensagem: 'Categoria criada com sucesso' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar categoria' });
  }
});

// Apenas UMA rota PUT (com imagem)
router.put('/:id', adminAuth, async (req, res) => {
  const { nome_categoria, descricao, imagem } = req.body;
  const { id } = req.params;

  try {
    await db.query(
      'UPDATE categorias SET nome_categoria = ?, descricao = ?, imagem = ? WHERE id_categoria = ?',
      [nome_categoria, descricao || null, imagem || null, id]
    );
    res.json({ mensagem: 'Categoria atualizada com sucesso' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar categoria' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM categorias WHERE id_categoria=?', [req.params.id]);
    res.json({ mensagem: 'Categoria eliminada!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao eliminar categoria' });
  }
});

module.exports = router;