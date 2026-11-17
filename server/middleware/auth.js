// ============================================================
// Smriti Pass — Role-Based Authentication Middleware
// ============================================================
const { verifyToken } = require('../utils/cryptoAuth');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please provide a Bearer token.' });
  }

  const result = verifyToken(token);
  if (!result.valid) {
    return res.status(403).json({ success: false, error: `Invalid or expired token: ${result.error}` });
  }

  req.user = result.payload;
  next();
}

function optionalToken(req, _res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    const result = verifyToken(token);
    if (result.valid) {
      req.user = result.payload;
    }
  }
  next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}]`,
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  optionalToken,
  requireRole,
};
