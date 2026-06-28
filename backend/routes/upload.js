const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

// ── Pasta de destino ──────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── Multer — guarda em disco ──────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // máx 10 MB
  fileFilter: (req, file, cb) => {
    const valido = /jpeg|jpg|png|webp|gif/.test(file.mimetype);
    valido ? cb(null, true) : cb(new Error('Apenas imagens são permitidas'));
  },
});

// ── POST /api/upload ──────────────────────────────────────────────────────────
router.post('/', upload.single('imagem'), (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Nenhum ficheiro enviado' });

  const url = `${process.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
