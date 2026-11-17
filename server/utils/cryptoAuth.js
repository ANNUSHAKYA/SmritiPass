// ============================================================
// Smriti Pass — Built-in Cryptographic Auth & Security Utilities
// Zero external dependency: uses Node.js standard `crypto` module.
// ============================================================
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'smriti-pass-heritage-secret-key-change-in-prod-2026';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─── 1. Password Hashing (PBKDF2-SHA512) ─────────────────────
function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return `${salt}:${derivedKey.toString('hex')}`;
}

function verifyPassword(password, storedHash) {
  if (!password || !storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt, originalHash] = storedHash.split(':');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return crypto.timingSafeEqual(Buffer.from(derivedKey.toString('hex')), Buffer.from(originalHash));
}

// ─── 2. JSON Web Token (HMAC-SHA256 / RFC 7519) ──────────────
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString('utf8');
}

function generateToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Date.now();
  const tokenPayload = {
    ...payload,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + TOKEN_EXPIRY_MS) / 1000),
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token missing' };
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Malformed token' };
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSignature) {
    return { valid: false, error: 'Invalid signature' };
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Token expired' };
    }
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: 'Invalid payload encoding' };
  }
}

// ─── 3. In-Memory Idempotency Cache ──────────────────────────
const idempotencyStore = new Map();
function checkIdempotency(key) {
  if (!key) return null;
  const entry = idempotencyStore.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > 15 * 60 * 1000) {
    // 15 min TTL
    idempotencyStore.delete(key);
    return null;
  }
  return entry.response;
}

function recordIdempotency(key, response) {
  if (!key) return;
  idempotencyStore.set(key, {
    timestamp: Date.now(),
    response,
  });
}

// ─── 4. Input Sanitization Helpers ───────────────────────────
function sanitizeString(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .slice(0, maxLen)
    .replace(/[<>]/g, ''); // Basic XSS mitigation
}

function sanitizeNumber(val, fallback = 0, min = 0, max = 10000000) {
  const num = Number(val);
  if (isNaN(num)) return fallback;
  return Math.min(Math.max(num, min), max);
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  checkIdempotency,
  recordIdempotency,
  sanitizeString,
  sanitizeNumber,
};
