const express = require('express');
const router  = express.Router();
const db      = require('../db');
const auth    = require('../middleware/auth');
const { enviarRespostaSuporte } = require('../services/notificacoes');

// Middleware: apenas admin
const apenasAdmin = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT perfil FROM utilizadores WHERE id_utilizador = ?', [req.utilizador.id]);
    if (!rows[0] || rows[0].perfil !== 'admin') return res.status(403).json({ erro: 'Acesso negado' });
    next();
  } catch { res.status(500).json({ erro: 'Erro de autenticação' }); }
};

// ── Cliente ────────────────────────────────────────────────────────────────────

// GET /api/suporte/minhas
router.get('/minhas', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*,
        (SELECT COUNT(*) FROM respostas_suporte r WHERE r.id_mensagem = m.id_mensagem) AS total_respostas,
        (SELECT r.criado_em FROM respostas_suporte r WHERE r.id_mensagem = m.id_mensagem ORDER BY r.criado_em DESC LIMIT 1) AS ultima_resposta_em
      FROM mensagens_suporte m
      WHERE m.id_utilizador = ?
      ORDER BY m.criado_em DESC
    `, [req.utilizador.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao obter mensagens' });
  }
});

// GET /api/suporte/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const [msgs] = await db.query(
      'SELECT * FROM mensagens_suporte WHERE id_mensagem = ? AND id_utilizador = ?',
      [req.params.id, req.utilizador.id]
    );
    if (!msgs.length) return res.status(404).json({ erro: 'Não encontrado' });

    const [respostas] = await db.query(
      'SELECT * FROM respostas_suporte WHERE id_mensagem = ? ORDER BY criado_em ASC',
      [req.params.id]
    );

    await db.query('UPDATE mensagens_suporte SET lida_cliente = TRUE WHERE id_mensagem = ?', [req.params.id]);

    res.json({ ...msgs[0], respostas });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter mensagem' });
  }
});

// POST /api/suporte/nova
router.post('/nova', auth, async (req, res) => {
  const { assunto, mensagem } = req.body;
  if (!assunto?.trim() || !mensagem?.trim())
    return res.status(400).json({ erro: 'Assunto e mensagem são obrigatórios' });

  try {
    const [result] = await db.query(
      'INSERT INTO mensagens_suporte (id_utilizador, assunto, mensagem) VALUES (?, ?, ?)',
      [req.utilizador.id, assunto.trim(), mensagem.trim()]
    );

    // Notifica o admin em tempo real
    const io = req.app.get('io');
    const [[utilizador]] = await db.query('SELECT nome FROM utilizadores WHERE id_utilizador = ?', [req.utilizador.id]);
    io.to('admin').emit('nova_mensagem_suporte', {
      id_mensagem: result.insertId,
      assunto: assunto.trim(),
      nome: utilizador?.nome || 'Cliente',
    });

    res.status(201).json({ mensagem: 'Mensagem enviada!', id_mensagem: result.insertId });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao enviar mensagem' });
  }
});

// POST /api/suporte/:id/responder (cliente)
router.post('/:id/responder', auth, async (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem?.trim()) return res.status(400).json({ erro: 'Mensagem obrigatória' });

  try {
    const [ticket] = await db.query(
      'SELECT * FROM mensagens_suporte WHERE id_mensagem = ? AND id_utilizador = ?',
      [req.params.id, req.utilizador.id]
    );
    if (!ticket.length) return res.status(404).json({ erro: 'Não encontrado' });
    if (ticket[0].estado === 'fechada') return res.status(400).json({ erro: 'Ticket fechado' });

    const [result] = await db.query(
      'INSERT INTO respostas_suporte (id_mensagem, mensagem, is_admin) VALUES (?, ?, FALSE)',
      [req.params.id, mensagem.trim()]
    );
    await db.query(
      'UPDATE mensagens_suporte SET estado = "aberta", lida_admin = FALSE WHERE id_mensagem = ?',
      [req.params.id]
    );

    const novaResposta = {
      id_resposta: result.insertId,
      id_mensagem: parseInt(req.params.id),
      mensagem: mensagem.trim(),
      is_admin: false,
      criado_em: new Date(),
    };

    const io = req.app.get('io');
    // Envia a mensagem para quem está no ticket (admin e cliente)
    io.to(`ticket_${req.params.id}`).emit('nova_resposta', novaResposta);
    // Notifica o admin na lista de tickets
    io.to('admin').emit('cliente_respondeu', { id_mensagem: parseInt(req.params.id) });

    res.json({ mensagem: 'Resposta enviada!', resposta: novaResposta });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao responder' });
  }
});

// ── Admin ──────────────────────────────────────────────────────────────────────

// GET /api/suporte/admin/todas
router.get('/admin/todas', auth, apenasAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, u.nome, u.email,
        (SELECT COUNT(*) FROM respostas_suporte r WHERE r.id_mensagem = m.id_mensagem) AS total_respostas
      FROM mensagens_suporte m
      LEFT JOIN utilizadores u ON m.id_utilizador = u.id_utilizador
      ORDER BY m.lida_admin ASC, m.criado_em DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter mensagens' });
  }
});

// GET /api/suporte/admin/:id
router.get('/admin/:id', auth, apenasAdmin, async (req, res) => {
  try {
    const [msgs] = await db.query(
      `SELECT m.*, u.nome, u.email
       FROM mensagens_suporte m
       LEFT JOIN utilizadores u ON m.id_utilizador = u.id_utilizador
       WHERE m.id_mensagem = ?`,
      [req.params.id]
    );
    if (!msgs.length) return res.status(404).json({ erro: 'Não encontrado' });

    const [respostas] = await db.query(
      'SELECT * FROM respostas_suporte WHERE id_mensagem = ? ORDER BY criado_em ASC',
      [req.params.id]
    );

    await db.query('UPDATE mensagens_suporte SET lida_admin = TRUE WHERE id_mensagem = ?', [req.params.id]);

    res.json({ ...msgs[0], respostas });
  } catch (err) {
    res.status(500).json({ erro: 'Erro' });
  }
});

// POST /api/suporte/admin/:id/responder
router.post('/admin/:id/responder', auth, apenasAdmin, async (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem?.trim()) return res.status(400).json({ erro: 'Mensagem obrigatória' });

  try {
    const [ticket] = await db.query(
      `SELECT m.*, u.nome, u.email
       FROM mensagens_suporte m
       LEFT JOIN utilizadores u ON m.id_utilizador = u.id_utilizador
       WHERE m.id_mensagem = ?`,
      [req.params.id]
    );
    if (!ticket.length) return res.status(404).json({ erro: 'Não encontrado' });

    const [result] = await db.query(
      'INSERT INTO respostas_suporte (id_mensagem, mensagem, is_admin) VALUES (?, ?, TRUE)',
      [req.params.id, mensagem.trim()]
    );
    await db.query(
      'UPDATE mensagens_suporte SET estado = "respondida", lida_cliente = FALSE WHERE id_mensagem = ?',
      [req.params.id]
    );

    const novaResposta = {
      id_resposta: result.insertId,
      id_mensagem: parseInt(req.params.id),
      mensagem: mensagem.trim(),
      is_admin: true,
      criado_em: new Date(),
    };

    const io = req.app.get('io');
    // Envia resposta em tempo real para quem está no ticket
    io.to(`ticket_${req.params.id}`).emit('nova_resposta', novaResposta);
    // Notifica o cliente que tem nova resposta
    io.to(`suporte_${ticket[0].id_utilizador}`).emit('admin_respondeu', {
      id_mensagem: parseInt(req.params.id),
      assunto: ticket[0].assunto,
    });

    const { email, nome, id_mensagem, assunto } = ticket[0];
    if (email) enviarRespostaSuporte({ email, nome, id_mensagem, assunto, resposta: mensagem.trim() });

    res.json({ mensagem: 'Resposta enviada!', resposta: novaResposta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao responder' });
  }
});

// PUT /api/suporte/admin/:id/estado
router.put('/admin/:id/estado', auth, apenasAdmin, async (req, res) => {
  const { estado } = req.body;
  try {
    await db.query('UPDATE mensagens_suporte SET estado = ? WHERE id_mensagem = ?', [estado, req.params.id]);
    res.json({ mensagem: 'Estado atualizado!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro' });
  }
});

module.exports = router;
