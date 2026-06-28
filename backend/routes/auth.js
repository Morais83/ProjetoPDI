const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); 
const db = require('../db');
require('dotenv').config();

// NODEMAILER
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

// REGISTO
router.post('/registo', async (req, res) => {
  const { nome, email, password, telefone, prefixo_tel, aceita_termos } = req.body;

  if (!nome || !email || !password) {
    return res.status(400).json({ erro: 'Nome, email e password são obrigatórios' });
  }

  // Validar email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    return res.status(400).json({ erro: 'Email inválido' });
  }

  // Validar telefone
  if (telefone) {
    const telLimpo = telefone.replace(/\s/g, "");
    if (!/^\d+$/.test(telLimpo) || telLimpo.length < 9 || telLimpo.length > 13) {
      return res.status(400).json({ erro: 'Telefone inválido' });
    }
  }

  // Validar password
  if (password.length < 8) {
    return res.status(400).json({ erro: 'A password deve ter pelo menos 8 caracteres' });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ erro: 'A password deve ter pelo menos uma letra maiúscula' });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ erro: 'A password deve ter pelo menos um número' });
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

// RECUPERAR PASSWORD
router.post('/esqueci-senha', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ erro: 'Por favor, introduz o teu email.' });
  }

  try {
    const [rows] = await db.query('SELECT id_utilizador FROM utilizadores WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.json({ mensagem: 'Se o email existir, enviámos um link de recuperação.' });
    }

    const utilizadorId = rows[0].id_utilizador;

    const resetToken = crypto.randomBytes(32).toString('hex');
    
    const resetTokenExpira = new Date(Date.now() + 3600000); 

    await db.query(
      'UPDATE utilizadores SET reset_token = ?, reset_token_expira = ? WHERE id_utilizador = ?',
      [resetToken, resetTokenExpira, utilizadorId]
    );

    const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const resetUrl = `${baseUrl}/recuperar-senha/${resetToken}`;

    const mailOptions = {
      from: `"Moda Chique" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperação de Palavra-Passe - Moda Chique',
      html: `
        <h2>Recuperação de Palavra-Passe</h2>
        <p>Recebemos um pedido para repor a palavra-passe da tua conta Moda Chique.</p>
        <p>Clica no link abaixo para escolheres uma nova palavra-passe:</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background-color: #3D6B4A; color: white; text-decoration: none; border-radius: 5px;">Repor Palavra-Passe</a>
        <p>Ou copia e cola este link no teu browser: <br> ${resetUrl}</p>
        <p><em>Este link expira em 1 hora. Se não pediste esta alteração, podes ignorar este email.</em></p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ mensagem: 'Link de recuperação enviado para o teu email.' });

  } catch (err) {
    console.error('Erro na recuperação de senha:', err);
    res.status(500).json({ erro: 'Ocorreu um erro. Tenta novamente mais tarde.' });
  }
});

// PERFIL 
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

// VERIFICAR TOKEN DE RESET (usado pelo frontend ao carregar a página)
router.post('/verificar-token-reset', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ erro: 'Token em falta.' });

  try {
    const [rows] = await db.query(
      'SELECT id_utilizador FROM utilizadores WHERE reset_token = ? AND reset_token_expira > NOW()',
      [token]
    );
    if (rows.length === 0) {
      return res.status(400).json({ erro: 'Token inválido ou expirado.' });
    }
    res.json({ valido: true });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao verificar token.' });
  }
});

// GUARDAR PASSWORD
router.post('/repor-senha', async (req, res) => {
  const { token, novaPassword } = req.body;

  if (!token || !novaPassword) {
    return res.status(400).json({ erro: 'Dados inválidos.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id_utilizador FROM utilizadores WHERE reset_token = ? AND reset_token_expira > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ erro: 'O link de recuperação é inválido ou já expirou.' });
    }

    const utilizadorId = rows[0].id_utilizador;

    const passwordHash = await bcrypt.hash(novaPassword, 10);

    await db.query(
      'UPDATE utilizadores SET password = ?, reset_token = NULL, reset_token_expira = NULL WHERE id_utilizador = ?',
      [passwordHash, utilizadorId]
    );

    res.json({ mensagem: 'Palavra-passe alterada com sucesso! Já podes fazer login.' });

  } catch (err) {
    console.error('Erro ao repor senha:', err);
    res.status(500).json({ erro: 'Ocorreu um erro ao alterar a palavra-passe.' });
  }
});

module.exports = router;