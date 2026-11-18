// ============================================================
// Smriti Pass — Express Server Entrypoint
// Production & Agra Pilot Ready Architecture
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { InMemoryStore } = require('./seed');
const { secureHeaders, rateLimiter } = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure upload directories exist (Safe for Vercel / serverless read-only filesystems)
const uploadBaseDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'uploads');

const uploadDirs = [
  uploadBaseDir,
  path.join(uploadBaseDir, 'products'),
  path.join(uploadBaseDir, 'artisans'),
];

uploadDirs.forEach(dir => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    // Read-only filesystem on serverless environment — gracefully catch
    console.warn('[Storage] Skipping dir creation on serverless runtime:', dir);
  }
});

// Security Middleware
app.use(secureHeaders);

// CORS Configuration — Supports local dev, custom domain & any *.vercel.app preview
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (
      origin.startsWith('http://localhost:') ||
      origin.endsWith('.vercel.app') ||
      (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) ||
      (process.env.PUBLIC_URL && origin === process.env.PUBLIC_URL)
    ) {
      return callback(null, true);
    }
    // Permissive fallback so production doesn't break on unforeseen subdomains
    callback(null, true);
  },
  credentials: true,
}));

// Body Parsers with limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Global Rate Limiter on API routes
app.use('/api', rateLimiter('global', 200, 60 * 1000));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-Memory Store initialization
const store = new InMemoryStore();
console.log('🏛️  [SmritiPass] In-Memory Store initialized (70:30 Revenue Model & Agra Pilot Partners)');

// Optional MongoDB Connection
if (process.env.MONGODB_URI) {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('🍃 [SmritiPass] Connected to MongoDB Atlas'))
    .catch((err) => console.warn('⚠️  [SmritiPass] MongoDB connection failed, staying on In-Memory Store:', err.message));
}

// API Routes
app.use('/api/auth', require('./routes/auth')(store));
app.use('/api/admin', require('./routes/admin')(store));
app.use('/api/artisans', require('./routes/artisans')(store));
app.use('/api/products', require('./routes/products')(store));
app.use('/api/orders', require('./routes/orders')(store));
app.use('/api/qr', require('./routes/qr')(store));
app.use('/api/ai', require('./routes/ai')(store));
app.use('/api/gi', require('./routes/gi')(store));

// Health / Status endpoint with production telemetry
const serverStartTime = Date.now();
app.get('/api/health', (_req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    status: 'online',
    platform: 'Smriti Pass',
    version: '2.0.0',
    tagline: 'Handmade. Honest. Heritage. — Direct from Master Artisans',
    pilot: 'Agra, Uttar Pradesh, India',
    revenueModel: '70% Master Artisan, 30% Smriti Pass Company',
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    memory: {
      rssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
      heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
    },
    activePartners: {
      hotels: store.getAllHotels().length,
      guides: store.getAllGuides().length,
      artisans: store.getAllArtisans().length,
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend static assets from public/
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Fallback all other client routes to SPA index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message,
  });
});

// Export app and server starter for testing
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🏛️  Smriti Pass PWA & Backend running`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🗺️  Tourist Trail:  http://localhost:${PORT}/#tourist`);
    console.log(`🛒  70:30 Checkout: http://localhost:${PORT}/#checkout`);
    console.log(`🎨  Artisan Portal: http://localhost:${PORT}/#artisan`);
    console.log(`⚙️  Admin Dashboard: http://localhost:${PORT}/#admin`);
    console.log(`====================================================`);
  });
}

// Export app for Vercel serverless functions, testing & modularity
module.exports = app;
module.exports.app = app;
module.exports.store = store;
