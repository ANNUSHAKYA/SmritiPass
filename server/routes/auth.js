// ============================================================
// Smriti Pass — Authentication & User Routes
// ============================================================
const express = require('express');
const router = express.Router();
const { hashPassword, verifyPassword, generateToken } = require('../utils/cryptoAuth');
const { authenticateToken } = require('../middleware/auth');

module.exports = function authRoutes(store) {

  // Seed default admin and artisan in memory
  const users = [
    {
      id: 'usr-admin-01',
      email: 'admin@smritipass.org',
      name: 'Smriti Pass Agra Pilot Admin',
      passwordHash: hashPassword('AgraPilot2026!'),
      role: 'admin',
    },
    {
      id: 'usr-artisan-01',
      email: 'rashid@smritipass.org',
      name: 'Ustad Rashid Khan',
      passwordHash: hashPassword('ParchinKari123!'),
      role: 'artisan',
      artisanId: 'art-rashid-001',
    },
  ];

  // POST /login — login as admin or artisan
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      artisanId: user.artisanId || null,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        artisanId: user.artisanId || null,
      },
      message: `Logged in successfully as ${user.role}`,
    });
  });

  // GET /me — get current user profile
  router.get('/me', authenticateToken, (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  });

  return router;
};
