// ============================================================
// Smriti Pass — GI Products API Routes
// Official Registry Data (Jammu & Kashmir & Uttar Pradesh)
// ============================================================
const express = require('express');
const router = express.Router();

module.exports = function giRoutes(store) {

  // GET /products — list all or filtered GI products
  router.get('/products', (req, res) => {
    try {
      const { state, category, status, search, limit = 50, page = 1 } = req.query;

      let results;
      if (search || state || category || status) {
        results = store.searchGiProducts({
          query: search || '',
          state: state || '',
          category: category || '',
          status: status || '',
          limit: Number(limit) || 100,
        });
      } else {
        results = store.getAllGiProducts();
      }

      res.json({
        success: true,
        count: results.length,
        totalInRegistry: store.getAllGiProducts().length,
        data: results,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /stats — breakdown by state and category
  router.get('/stats', (_req, res) => {
    try {
      const stats = store.getGiStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /search — Intelligent Craft Search for Voice & Text queries
  router.post('/search', (req, res) => {
    try {
      const { query = '', state = '', category = '', limit = 10 } = req.body;
      const results = store.searchGiProducts({
        query,
        state,
        category,
        limit: Number(limit) || 10,
      });

      res.json({
        success: true,
        query,
        count: results.length,
        data: results,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /products/:id — single product by ID or exact name
  router.get('/products/:id', (req, res) => {
    try {
      const item = store.getGiProduct(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, error: 'GI craft record not found' });
      }
      res.json({ success: true, data: item });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // PUT /products/:id — Admin facility to update a GI record
  router.put('/products/:id', (req, res) => {
    try {
      const updated = store.updateGiProduct(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'GI craft record not found to update' });
      }
      res.json({ success: true, data: updated, message: 'GI record updated successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
};
