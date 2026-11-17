// ============================================================
// Smriti Pass — Products Routes
// Secure Uploads, Input Sanitization & Catalogue Management
// ============================================================
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { imageFileFilter } = require('../middleware/security');
const { sanitizeString, sanitizeNumber } = require('../utils/cryptoAuth');

// Multer storage config with file type verification
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', 'uploads', 'products')),
  filename: (_req, file, cb) => {
    // Generate safe alphanumeric filename
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max per image
});

module.exports = function productRoutes(store) {

  // GET / — list all products
  router.get('/', (_req, res, next) => {
    try {
      const products = store.getAllProducts();
      res.json({ success: true, count: products.length, data: products });
    } catch (err) { next(err); }
  });

  // GET /:id — get single product
  router.get('/:id', (req, res, next) => {
    try {
      const product = store.getProduct(req.params.id) || store.getProductByProductId(req.params.id);
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
      res.json({ success: true, data: product });
    } catch (err) { next(err); }
  });

  // POST / — create product (voice-to-catalog or form upload)
  router.post('/', upload.array('images', 4), async (req, res, next) => {
    try {
      const {
        name,
        category,
        description,
        price,
        artisanId,
        artisanName,
        materials,
        dimensions,
        weight,
        productId,
      } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Product name is required' });
      }

      const numPrice = sanitizeNumber(price, 0, 100, 10000000);
      if (numPrice <= 0) {
        return res.status(400).json({ success: false, error: 'A valid product price is required' });
      }

      // Parse materials safely
      let parsedMaterials = [];
      if (Array.isArray(materials)) {
        parsedMaterials = materials.map(m => sanitizeString(m, 50));
      } else if (typeof materials === 'string') {
        try {
          parsedMaterials = JSON.parse(materials).map(m => sanitizeString(m, 50));
        } catch (_) {
          parsedMaterials = materials.split(',').map(m => sanitizeString(m.trim(), 50));
        }
      }

      const safeId = productId ? sanitizeString(productId, 30) : `SP-AG-MI-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const product = store.createProduct({
        productId: safeId,
        name: sanitizeString(name, 100),
        category: sanitizeString(category || 'Marble Inlay (Parchin Kari)', 60),
        description: sanitizeString(description || '', 1000),
        price: numPrice,
        artisanId: artisanId || 'art-rashid-001',
        artisanName: artisanName || 'Ustad Rashid Khan',
        materials: parsedMaterials.length > 0 ? parsedMaterials : ['Makrana White Marble', 'Lapis Lazuli', 'Carnelian'],
        dimensions: sanitizeString(dimensions || '15cm x 15cm x 8cm', 40),
        weight: sanitizeString(weight || '1.2 kg', 30),
        images: req.files ? req.files.map(f => `/uploads/products/${f.filename}`) : [],
        isVerified: true,
        status: 'available',
      });

      res.status(201).json({ success: true, data: product });
    } catch (err) { next(err); }
  });

  // PUT /:id — update product
  router.put('/:id', (req, res, next) => {
    try {
      const product = store.updateProduct(req.params.id, req.body);
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
      res.json({ success: true, data: product });
    } catch (err) { next(err); }
  });

  return router;
};
