const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// REGISTO
router.post('/registo', async (req, res) => {
  const { nome, email, password, telefone, prefixo_tel, aceita_termos } = req.body;

  if (!nome || !email || !password) {
    return res.status(400).json({ erro: 'Nome, email e password são obrigatórios' });
  }

  try {
    const [existe] = await db.query('SELECT id_utilizador FROM utilizadores WHERE email = ?', [email]);
    if (existe.length > 0) {
      return res.status(409).json({ erro: 'Este email já está registado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [resultado] = await db.query(
      'INSERT INTO utilizadores (nome, email, password, telefone, prefixo_tel, aceita_termos) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, email, passwordHash, telefone || null, prefixo_tel || '+351', aceita_termos || false]
    );

    res.status(201).json({ mensagem: 'Conta criada com sucesso!', id: resultado.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar conta' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ erro: 'Email e password são obrigatórios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM utilizadores WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou password incorretos' });
    }

    const utilizador = rows[0];
    const passwordCorreta = await bcrypt.compare(password, utilizador.password);
    if (!passwordCorreta) {
      return res.status(401).json({ erro: 'Email ou password incorretos' });
    }

    const token = jwt.sign(
      { id: utilizador.id_utilizador, perfil: utilizador.perfil },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      mensagem: 'Login efetuado com sucesso!',
      token,
      utilizador: {
        id: utilizador.id_utilizador,
        nome: utilizador.nome,
        email: utilizador.email,
        perfil: utilizador.perfil,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
});

// PERFIL (rota protegida)
router.get('/perfil', require('../middleware/auth'), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_utilizador, nome, email, telefone, prefixo_tel, perfil, data_criada FROM utilizadores WHERE id_utilizador = ?',
      [req.utilizador.id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: 'Utilizador não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter perfil' });
  }
});

module.exports = router;