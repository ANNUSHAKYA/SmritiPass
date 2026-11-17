// ============================================================
// Smriti Pass — QR Code Routes (Physical Fridge Magnet Channel)
// Production & Print-Ready Asset Generation
// ============================================================
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

module.exports = function qrRoutes(store) {

  // GET /magnet — generate high-contrast QR code for physical fridge magnet
  router.get('/magnet', async (req, res, next) => {
    try {
      const { hotelId, magnetId, format } = req.query;

      // Track the scan in analytics
      if (store && typeof store.recordScan === 'function') {
        store.recordScan(hotelId || null);
      }

      // Public target URL (configurable via env for production)
      const baseUrl = process.env.PUBLIC_URL || process.env.FRONTEND_URL || 'http://localhost:3001';
      let targetUrl = `${baseUrl}/#tourist`;
      if (hotelId) {
        targetUrl += `?hotelId=${encodeURIComponent(hotelId)}`;
      }

      // 1. Vector SVG format (Ideal for lossless 300+ DPI print on physical magnets)
      if (format === 'svg') {
        const svgString = await QRCode.toString(targetUrl, {
          type: 'svg',
          margin: 4, // Ample quiet zone for scannability
          color: { dark: '#1a1a3e', light: '#ffffff' },
          errorCorrectionLevel: 'H', // 30% error correction allows logo center
        });
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.send(svgString);
      }

      // 2. High-Resolution PNG (1200x1200px print ready)
      const qrDataUrl = await QRCode.toDataURL(targetUrl, {
        width: 1200,
        margin: 4,
        color: { dark: '#1a1a3e', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      });

      res.json({
        success: true,
        data: {
          targetUrl,
          qrDataUrl,
          type: 'physical_fridge_magnet',
          hotelId: hotelId || 'AGRA-DIRECT',
          magnetId: magnetId || 'MAG-001',
          resolution: '1200x1200px (Print-Ready 300 DPI at 5cm x 5cm)',
          quietZone: '4 modules',
          errorCorrection: 'Level H (30% redundancy)',
        },
      });
    } catch (err) { next(err); }
  });

  // GET /product/:productId — generate QR code for physical product tags
  router.get('/product/:productId', async (req, res, next) => {
    try {
      const baseUrl = process.env.PUBLIC_URL || process.env.FRONTEND_URL || 'http://localhost:3001';
      const targetUrl = `${baseUrl}/#tourist`;

      const qrDataUrl = await QRCode.toDataURL(targetUrl, {
        width: 600,
        margin: 3,
        color: { dark: '#1a1a3e', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      });

      res.json({
        success: true,
        data: {
          productId: req.params.productId,
          targetUrl,
          qrDataUrl,
        },
      });
    } catch (err) { next(err); }
  });

  return router;
};
