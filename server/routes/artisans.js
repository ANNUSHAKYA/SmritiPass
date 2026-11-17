// ============================================================
// Smriti Pass 2.0 — Artisans Routes
// ============================================================
const express = require('express');
const router = express.Router();

module.exports = function artisanRoutes(store) {
  // GET / — list all artisans
  router.get('/', async (_req, res, next) => {
    try {
      const artisans = store.getAllArtisans();
      res.json({ success: true, count: artisans.length, data: artisans });
    } catch (err) { next(err); }
  });

  // GET /:id — get single artisan
  router.get('/:id', async (req, res, next) => {
    try {
      const artisan = store.getArtisan(req.params.id);
      if (!artisan) return res.status(404).json({ success: false, error: 'Artisan not found' });
      res.json({ success: true, data: artisan });
    } catch (err) { next(err); }
  });

  // POST / — create artisan
  router.post('/', async (req, res, next) => {
    try {
      const artisan = store.createArtisan(req.body);
      res.status(201).json({ success: true, data: artisan });
    } catch (err) { next(err); }
  });

  // PUT /:id — update artisan
  router.put('/:id', async (req, res, next) => {
    try {
      const artisan = store.updateArtisan(req.params.id, req.body);
      if (!artisan) return res.status(404).json({ success: false, error: 'Artisan not found' });
      res.json({ success: true, data: artisan });
    } catch (err) { next(err); }
  });

  return router;
};
