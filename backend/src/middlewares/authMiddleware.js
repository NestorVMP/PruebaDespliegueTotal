/*const jwt = require('jsonwebtoken');

module.exports = (secretKey) => (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido o expirado' });
    req.user = decoded;
    next();
  });
};*/

const jwt = require('jsonwebtoken');

function authMiddleware(secretKey) {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado: token no encontrado' });
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
  };
}

module.exports = authMiddleware;