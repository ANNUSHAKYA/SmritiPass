// ============================================================
// Smriti Pass — Production Security Middleware
// ============================================================

// In-Memory Rate Limiting Cache
const ipRequestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 150;     // 150 req/min for general APIs
const ORDER_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ORDERS_PER_WINDOW = 25;       // 25 orders / 10 min

// Clean expired rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipRequestCounts.entries()) {
    if (now - record.startTime > record.windowMs) {
      ipRequestCounts.delete(key);
    }
  }
}, 60 * 1000);

function rateLimiter(prefix = 'global', max = MAX_REQUESTS_PER_WINDOW, windowMs = RATE_LIMIT_WINDOW_MS) {
  return (req, res, next) => {
    // Determine client identifier
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const key = `${prefix}:${clientIp}`;
    const now = Date.now();

    let record = ipRequestCounts.get(key);
    if (!record || now - record.startTime > windowMs) {
      record = { count: 1, startTime: now, windowMs };
      ipRequestCounts.set(key, record);
    } else {
      record.count++;
    }

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please slow down.',
        retryAfterSeconds: Math.ceil((record.startTime + windowMs - now) / 1000),
      });
    }

    next();
  };
}

// Secure HTTP Headers Middleware
function secureHeaders(req, res, next) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Cross-Origin policies
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  // XSS protection legacy header
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // HSTS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
}

// Safe File Filter for Multer
function imageFileFilter(_req, file, cb) {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and SVG images are allowed.'), false);
  }
}

module.exports = {
  rateLimiter,
  orderRateLimiter: rateLimiter('orders', MAX_ORDERS_PER_WINDOW, ORDER_LIMIT_WINDOW_MS),
  secureHeaders,
  imageFileFilter,
};
