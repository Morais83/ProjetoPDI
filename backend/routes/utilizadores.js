const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
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

// GET todos os utilizadores (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id_utilizador, u.nome, u.email, u.perfil, u.data_criada,
             COUNT(e.id_encomenda) AS total_encomendas
      FROM utilizadores u
      LEFT JOIN encomendas e ON u.id_utilizador = e.id_utilizador
      GROUP BY u.id_utilizador
      ORDER BY u.data_criada DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter utilizadores' });
  }
});

// GET perfil do utilizador logado
router.get('/me', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  try {
    const [rows] = await db.query(
      'SELECT id_utilizador, nome, email, telefone, prefixo_tel, data_criada FROM utilizadores WHERE id_utilizador = ?',
      [user.id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: 'Utilizador não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter perfil' });
  }
});

// PUT atualizar dados pessoais
router.put('/me', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  try {
    const { nome, email, telefone, prefixo_tel } = req.body;
    await db.query(
      'UPDATE utilizadores SET nome=?, email=?, telefone=?, prefixo_tel=? WHERE id_utilizador=?',
      [nome, email, telefone, prefixo_tel, user.id]
    );
    res.json({ mensagem: 'Perfil atualizado!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
});

// PUT alterar password
router.put('/me/password', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  try {
    const { atual, nova } = req.body;
    const [rows] = await db.query('SELECT password FROM utilizadores WHERE id_utilizador=?', [user.id]);
    const correta = await bcrypt.compare(atual, rows[0].password);
    if (!correta) return res.status(400).json({ erro: 'Palavra-passe atual incorreta' });
    const hash = await bcrypt.hash(nova, 10);
    await db.query('UPDATE utilizadores SET password=? WHERE id_utilizador=?', [hash, user.id]);
    res.json({ mensagem: 'Palavra-passe atualizada!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar palavra-passe' });
  }
});

// GET encomendas do utilizador logado
router.get('/me/encomendas', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });

  try {
    const [encomendas] = await db.query(
      'SELECT * FROM encomendas WHERE id_utilizador = ? ORDER BY data_pedido DESC',
      [user.id]
    );

    for (const enc of encomendas) {
      const [linhas] = await db.query(`
        SELECT 
          le.*, 
          p.nome_produto, 
          p.id_produto, 
          v.tamanho, 
          v.cor,
          (
            SELECT url 
            FROM imagens_produto 
            WHERE id_produto = p.id_produto 
            ORDER BY ordem ASC 
            LIMIT 1
          ) AS imagem_url
        FROM linhas_encomenda le
        INNER JOIN variante v ON le.id_variante = v.id_variante
        INNER JOIN produtos p ON v.id_produto = p.id_produto
        WHERE le.id_encomenda = ?
      `, [enc.id_encomenda]);
      
      enc.linhas = linhas;
    }

    res.json(encomendas);
  } catch (err) {
    console.error("ERRO COMPLETO DO BACKEND:", err); 
    res.status(500).json({ erro: 'Erro ao obter encomendas', detalhe: err.sqlMessage });
  }
});

// GET moradas do utilizador logado
router.get('/me/moradas', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  try {
    const [rows] = await db.query('SELECT * FROM moradas WHERE id_utilizador=?', [user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter moradas' });
  }
});

// POST adicionar morada
router.post('/me/moradas', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  try {
    const { rua, cidade, codigo_postal, pais, predefinida } = req.body;
    if (predefinida) {
      await db.query('UPDATE moradas SET predefinida=0 WHERE id_utilizador=?', [user.id]);
    }
    const [resultado] = await db.query(
      'INSERT INTO moradas (id_utilizador, rua, cidade, codigo_postal, pais, predefinida) VALUES (?,?,?,?,?,?)',
      [user.id, rua, cidade, codigo_postal, pais || 'Portugal', predefinida || false]
    );
    res.status(201).json({ mensagem: 'Morada adicionada!', id: resultado.insertId });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao adicionar morada' });
  }
});

// PUT atualizar morada
router.put('/me/moradas/:id', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  try {
    const { rua, cidade, codigo_postal, pais, predefinida } = req.body;
    if (predefinida) {
      await db.query('UPDATE moradas SET predefinida=0 WHERE id_utilizador=?', [user.id]);
    }
    await db.query(
      'UPDATE moradas SET rua=?, cidade=?, codigo_postal=?, pais=?, predefinida=? WHERE id_morada=? AND id_utilizador=?',
      [rua, cidade, codigo_postal, pais, predefinida || false, req.params.id, user.id]
    );
    res.json({ mensagem: 'Morada atualizada!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar morada' });
  }
});

// DELETE remover morada
router.delete('/me/moradas/:id', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  try {
    await db.query('DELETE FROM moradas WHERE id_morada=? AND id_utilizador=?', [req.params.id, user.id]);
    res.json({ mensagem: 'Morada removida!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover morada' });
  }
});

// PUT editar utilizador (admin)
router.put('/:id', async (req, res) => {
  const { nome, email, perfil } = req.body;
  try {
    await db.query(
      'UPDATE utilizadores SET nome=?, email=?, perfil=? WHERE id_utilizador=?',
      [nome, email, perfil, req.params.id]
    );
    res.json({ mensagem: 'Utilizador atualizado!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar utilizador' });
  }
});

// DELETE eliminar utilizador (admin)
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM utilizadores WHERE id_utilizador=?', [req.params.id]);
    res.json({ mensagem: 'Utilizador eliminado!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao eliminar utilizador' });
  }
});

// GET medidas do utilizador
router.get('/me/medidas', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  try {
    const [rows] = await db.query('SELECT * FROM medidas WHERE id_utilizador = ?', [user.id]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter medidas' });
  }
});

// POST/PUT guardar medidas
router.post('/me/medidas', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ erro: 'Não autenticado' });
  try {
    const { busto, cintura, anca, altura } = req.body;
    const [existe] = await db.query('SELECT id_medida FROM medidas WHERE id_utilizador = ?', [user.id]);
    if (existe.length > 0) {
      await db.query(
        'UPDATE medidas SET busto=?, cintura=?, anca=?, altura=? WHERE id_utilizador=?',
        [busto || null, cintura || null, anca || null, altura || null, user.id]
      );
    } else {
      await db.query(
        'INSERT INTO medidas (id_utilizador, busto, cintura, anca, altura) VALUES (?,?,?,?,?)',
        [user.id, busto || null, cintura || null, anca || null, altura || null]
      );
    }
    res.json({ mensagem: 'Medidas guardadas!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao guardar medidas' });
  }
});

module.exports = router;