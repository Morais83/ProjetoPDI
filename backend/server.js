const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', require('./routes/auth'));

// Teste de ligação
app.get('/api/teste', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ mensagem: 'Ligação à base de dados OK!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro na ligação à base de dados' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});