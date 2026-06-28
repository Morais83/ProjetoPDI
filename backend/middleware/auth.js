const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Acesso negado' });

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.utilizador = verificado;
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
};