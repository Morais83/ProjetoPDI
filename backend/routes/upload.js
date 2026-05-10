const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();

// ── Configuração Cloudinary ───────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer — guarda em memória (sem disco) ────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // máx 10MB
  fileFilter: (req, file, cb) => {
    const valido = /jpeg|jpg|png|webp|gif/.test(file.mimetype);
    valido ? cb(null, true) : cb(new Error('Apenas imagens são permitidas'));
  },
});

// ── Envia buffer para Cloudinary via stream ───────────────────────────────────
function uploadParaCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'lilistore', resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// ── POST /api/upload ──────────────────────────────────────────────────────────
router.post('/', upload.single('imagem'), async (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Nenhum ficheiro enviado' });
  try {
    const resultado = await uploadParaCloudinary(req.file.buffer);
    res.json({ url: resultado.secure_url });
  } catch (err) {
    console.error('Erro Cloudinary:', err);
    res.status(500).json({ erro: 'Erro ao fazer upload da imagem' });
  }
});

module.exports = router;
