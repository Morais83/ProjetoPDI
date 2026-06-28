const express    = require('express');
const cors       = require('cors');
const http       = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const db        = require('./db');
const adminAuth = require('./middleware/admin');
const path      = require('path');

const app        = express();
const httpServer = http.createServer(app);
const io         = new Server(httpServer, { cors: { origin: '*' } });

// Torna o io disponível nas rotas via req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('entrar_admin',   ()  => socket.join('admin'));
  socket.on('entrar_suporte', (id) => socket.join(`suporte_${id}`));
  socket.on('entrar_ticket',  (id) => socket.join(`ticket_${id}`));
  socket.on('sair_ticket',    (id) => socket.leave(`ticket_${id}`));
});

app.use(cors());
app.use(express.json());

// ── Servir imagens locais ─────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/produtos', require('./routes/produtos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/marcas', require('./routes/marcas'));
app.use('/api/encomendas', require('./routes/encomendas'));
app.use('/api/utilizadores', require('./routes/utilizadores'));
app.use('/api/favoritos', require('./routes/favoritos'));
app.use('/api/upload', adminAuth, require('./routes/upload'));
app.use('/api/pagamentos', require('./routes/pagamentos'));
app.use('/api/suporte', require('./routes/suporte'));

app.get('/api/teste', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ mensagem: 'Ligação à base de dados OK!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro na ligação à base de dados' });
  }
});

// Migração: adiciona colunas e corrige constraints (compatível com MySQL < 8)
async function runMigrations() {
  const colExists = async (tabela, coluna) => {
    const [r] = await db.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [tabela, coluna]
    );
    return r.length > 0;
  };
  const idxExists = async (tabela, index) => {
    const [r] = await db.query(
      `SELECT INDEX_NAME FROM information_schema.STATISTICS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
      [tabela, index]
    );
    return r.length > 0;
  };

  try {
    // 1. Coluna cor em imagens_produto
    if (!(await colExists('imagens_produto', 'cor'))) {
      await db.query('ALTER TABLE imagens_produto ADD COLUMN cor VARCHAR(100) NULL');
      console.log('Migração: cor adicionada a imagens_produto');
    }
    // 2. Coluna hex_cor em variante
    if (!(await colExists('variante', 'hex_cor'))) {
      await db.query('ALTER TABLE variante ADD COLUMN hex_cor VARCHAR(7) NULL');
      console.log('Migração: hex_cor adicionada a variante');
    }
    // 3. Corrige unique constraint imagem_unica para incluir cor
    const [idxCols] = await db.query(
      `SELECT GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS cols
       FROM information_schema.STATISTICS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'imagens_produto' AND INDEX_NAME = 'imagem_unica'
       GROUP BY INDEX_NAME`
    );
    const colsAtuais = idxCols[0]?.cols || '';
    if (colsAtuais && !colsAtuais.includes('cor')) {
      if (!(await idxExists('imagens_produto', 'idx_id_produto'))) {
        await db.query('ALTER TABLE imagens_produto ADD INDEX idx_id_produto (id_produto)');
      }
      await db.query('ALTER TABLE imagens_produto DROP INDEX imagem_unica');
      await db.query('ALTER TABLE imagens_produto ADD UNIQUE KEY imagem_unica (id_produto, ordem, cor)');
      console.log('Migração: imagem_unica actualizada para (id_produto, ordem, cor)');
    }
    // 4. Tabela mensagens_suporte
    await db.query(`
      CREATE TABLE IF NOT EXISTS mensagens_suporte (
        id_mensagem    INT AUTO_INCREMENT PRIMARY KEY,
        id_utilizador  INT NOT NULL,
        assunto        VARCHAR(255) NOT NULL,
        mensagem       TEXT NOT NULL,
        estado         ENUM('aberta','respondida','fechada') DEFAULT 'aberta',
        lida_admin     BOOLEAN DEFAULT FALSE,
        lida_cliente   BOOLEAN DEFAULT TRUE,
        criado_em      DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_utilizador) REFERENCES utilizadores(id_utilizador) ON DELETE CASCADE
      )
    `);
    // 5. Tabela respostas_suporte
    await db.query(`
      CREATE TABLE IF NOT EXISTS respostas_suporte (
        id_resposta   INT AUTO_INCREMENT PRIMARY KEY,
        id_mensagem   INT NOT NULL,
        mensagem      TEXT NOT NULL,
        is_admin      BOOLEAN DEFAULT FALSE,
        criado_em     DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_mensagem) REFERENCES mensagens_suporte(id_mensagem) ON DELETE CASCADE
      )
    `);
    console.log('Migrações de BD concluídas.');
  } catch (err) {
    console.error('Erro nas migrações:', err.message);
  }
}
runMigrations();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});

httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Erro: a porta ${PORT} já está em uso. Fecha o servidor anterior e tenta novamente.`);
  } else {
    console.error('Erro ao iniciar servidor:', err.message);
  }
  process.exit(1);
});
