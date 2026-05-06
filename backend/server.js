const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/produtos', require('./routes/produtos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/marcas', require('./routes/marcas'));
app.use('/api/encomendas', require('./routes/encomendas'));
app.use('/api/utilizadores', require('./routes/utilizadores'));
app.use('/api/favoritos', require('./routes/favoritos'));

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

const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', require('./routes/upload'));