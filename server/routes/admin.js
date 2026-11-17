// ============================================================
// Smriti Pass — Admin & Agra Pilot Analytics Routes
// Powers the Phase 8 & 9 Admin Management & Reporting Dashboard
// ============================================================
const express = require('express');
const router = express.Router();
const { optionalToken } = require('../middleware/auth');

module.exports = function adminRoutes(store) {

  // GET /analytics — dynamic analytics summary
  router.get('/analytics', (req, res) => {
    try {
      const summary = store.getAnalyticsSummary();
      res.json({
        success: true,
        data: summary,
        pilotLocation: 'Agra, Uttar Pradesh',
        mode: 'active_demonstration',
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /orders — all orders with search/filter
  router.get('/orders', (req, res) => {
    try {
      const { status, deliveryMethod, hotelId, guideId } = req.query;
      let orders = store.getAllOrders();

      if (status) orders = orders.filter(o => o.status === status);
      if (deliveryMethod) orders = orders.filter(o => o.deliveryMethod === deliveryMethod);
      if (hotelId) orders = orders.filter(o => o.hotelId === hotelId);
      if (guideId) orders = orders.filter(o => o.guideId === guideId);

      res.json({ success: true, count: orders.length, data: orders });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /orders/:id/cancel — cancel an order
  router.post('/orders/:id/cancel', (req, res) => {
    try {
      const { reason } = req.body;
      const order = store.cancelOrder(req.params.id, reason || 'Admin cancelled');
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
      res.json({
        success: true,
        data: order,
        message: `Order ${order.orderId} cancelled successfully. Payout and courier status revoked.`,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /orders/:id/refund — process refund
  router.post('/orders/:id/refund', (req, res) => {
    try {
      const order = store.getOrder(req.params.id) || store.getOrderByOrderId(req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      const refundAmount = order.totalAmount;
      const updated = store.updateOrder(order._id, {
        status: 'refunded',
        refundAmount,
        refundedAt: new Date(),
        payoutStatus: 'cancelled',
      });

      res.json({
        success: true,
        data: updated,
        refundAmount,
        message: `Refund of ₹${refundAmount} recorded for order ${order.orderId}.`,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // PUT /orders/:id/payout-status — update artisan payout status
  router.put('/orders/:id/payout-status', (req, res) => {
    try {
      const { payoutStatus } = req.body;
      const allowed = ['initiated', 'processing', 'credited', 'cancelled'];
      if (!allowed.includes(payoutStatus)) {
        return res.status(400).json({ success: false, error: `Invalid status. Allowed: [${allowed.join(', ')}]` });
      }

      const order = store.updateOrder(req.params.id, { payoutStatus });
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
      res.json({ success: true, data: order });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // PUT /orders/:id/courier-status — update courier pickup status
  router.put('/orders/:id/courier-status', (req, res) => {
    try {
      const { courierStatus, courierPickupDate, courierTrackingNumber } = req.body;
      const allowed = ['not_required', 'scheduled', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
      if (!allowed.includes(courierStatus)) {
        return res.status(400).json({ success: false, error: `Invalid status. Allowed: [${allowed.join(', ')}]` });
      }

      const updates = { courierStatus };
      if (courierPickupDate) updates.courierPickupDate = courierPickupDate;
      if (courierTrackingNumber) updates.courierTrackingNumber = courierTrackingNumber;

      const order = store.updateOrder(req.params.id, updates);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
      res.json({ success: true, data: order });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /hotels — list all 5 Agra hotel partners
  router.get('/hotels', (req, res) => {
    res.json({ success: true, count: store.getAllHotels().length, data: store.getAllHotels() });
  });

  // POST /hotels — register hotel partner
  router.post('/hotels', (req, res) => {
    try {
      const { name, location, rooms, contactPerson, phone, hotelId, commissionPct } = req.body;
      if (!name || !location) {
        return res.status(400).json({ success: false, error: 'Hotel name and location are required' });
      }
      const hotel = store.createHotel({
        hotelId: hotelId || `HTL-${name.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase()}`,
        name,
        location,
        rooms: Number(rooms) || 50,
        contactPerson: contactPerson || '',
        phone: phone || '',
        commissionPct: Number(commissionPct) || 5,
        qrMagnetsDeployed: 25,
      });
      res.status(201).json({ success: true, data: hotel });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /guides — list ASI-licensed guides
  router.get('/guides', (req, res) => {
    res.json({ success: true, count: store.getAllGuides().length, data: store.getAllGuides() });
  });

  // POST /guides — register licensed guide
  router.post('/guides', (req, res) => {
    try {
      const { name, licenseNumber, phone, languages, experienceYears, guideId, commissionPct } = req.body;
      if (!name || !licenseNumber) {
        return res.status(400).json({ success: false, error: 'Guide name and ASI license number are required' });
      }
      const guide = store.createGuide({
        guideId: guideId || `GDE-${name.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase()}`,
        name,
        licenseNumber,
        phone: phone || '',
        languages: languages || 'Hindi, English',
        experienceYears: Number(experienceYears) || 5,
        commissionPct: Number(commissionPct) || 5,
      });
      res.status(201).json({ success: true, data: guide });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // PUT /artisans/:id/verify — approve & verify artisan
  router.put('/artisans/:id/verify', (req, res) => {
    try {
      const { isVerified, credentialIssuer, giTag } = req.body;
      const artisan = store.updateArtisan(req.params.id, {
        isVerified: isVerified !== undefined ? isVerified : true,
        verificationStatus: isVerified ? 'VERIFIED' : 'PENDING',
        verificationDate: new Date(),
        credentialIssuer: credentialIssuer || 'Agra Heritage Crafts Council',
        giTag: giTag || 'GI/UP/Agra/MarbleInlay/2019',
      });
      if (!artisan) return res.status(404).json({ success: false, error: 'Artisan not found' });
      res.json({ success: true, data: artisan });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
};
