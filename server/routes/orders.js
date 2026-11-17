// ============================================================
// Smriti Pass — Orders Routes (70:30 Business Revenue Model)
// Production & Agra Pilot Ready with Idempotency & Validation
// ============================================================
const express = require('express');
const router = express.Router();
const { checkIdempotency, recordIdempotency, sanitizeString, sanitizeNumber } = require('../utils/cryptoAuth');
const { orderRateLimiter } = require('../middleware/security');

module.exports = function orderRoutes(store) {

  /**
   * Authoritative 70:30 Split Calculation:
   * - Artisan Share = Product Price * 0.70 (Strict 70%, non-negotiable)
   * - Company Share = Product Price * 0.30 (Strict 30%)
   * - Guide and Hotel Partner commissions come FROM WITHIN the 30% Company Share
   * - Shipping (₹0 or ₹1,000) is separately collected for logistics
   * - Exact rounding: Artisan always absorbs any fractions to protect the artisan guarantee
   */
  function calculate70_30Split(rawPrice, deliveryMethod, hotelId, guideId) {
    const price = Math.round(sanitizeNumber(rawPrice, 0, 0, 50000000));
    const isShipping = (deliveryMethod === 'shipping');
    const shippingCharge = isShipping ? 1000 : 0;

    // Strict 70% artisan share (Math.round protects against floating point imprecision)
    const artisanShare = Math.round(price * 0.70);

    // Strict 30% company share
    const companyShare = price - artisanShare; // exactly 30%

    // Configurable internal partner percentages from WITHIN the company's 30%
    const hotel = hotelId ? store.getHotel(hotelId) : null;
    const guide = guideId ? store.getGuide(guideId) : null;

    const guidePct = guide ? (guide.commissionPct || 5) : (Number(process.env.GUIDE_COMMISSION_PCT) || 5);
    const hotelPct = hotel ? (hotel.commissionPct || 5) : (Number(process.env.HOTEL_COMMISSION_PCT) || 5);

    const guideCommission = Math.round(price * (guidePct / 100));
    const hotelCommission = Math.round(price * (hotelPct / 100));
    const platformOperations = Math.max(0, companyShare - guideCommission - hotelCommission);

    const totalAmount = price + shippingCharge;

    return {
      productPrice: price,
      shippingCharge,
      totalAmount,
      artisanShare,
      companyShare,
      companyBreakdown: {
        guideCommission,
        hotelCommission,
        platformOperations,
        guidePct,
        hotelPct,
      },
      shippingFee: shippingCharge,
      deliveryMethod: isShipping ? 'shipping' : 'carry',
      hotelId: hotel ? hotel.hotelId : null,
      guideId: guide ? guide.guideId : null,
    };
  }

  // GET / — list all orders
  router.get('/', (req, res, next) => {
    try {
      const orders = store.getAllOrders();
      res.json({ success: true, count: orders.length, data: orders });
    } catch (err) { next(err); }
  });

  // GET /artisan/:artisanId — get orders for a specific artisan
  router.get('/artisan/:artisanId', (req, res, next) => {
    try {
      const orders = store.getAllOrders().filter(o => o.artisanId === req.params.artisanId);
      res.json({ success: true, count: orders.length, data: orders });
    } catch (err) { next(err); }
  });

  // GET /latest — get most recent order (used by artisan portal audio alerts)
  router.get('/latest', (req, res, next) => {
    try {
      const orders = store.getAllOrders();
      const latest = orders.length > 0 ? orders[orders.length - 1] : null;
      res.json({ success: true, data: latest });
    } catch (err) { next(err); }
  });

  // GET /:id — get single order
  router.get('/:id', (req, res, next) => {
    try {
      const order = store.getOrder(req.params.id) || store.getOrderByOrderId(req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
      res.json({ success: true, data: order });
    } catch (err) { next(err); }
  });

  // POST /calculate — quote / calculate payment split without creating order
  router.post('/calculate', (req, res) => {
    const { productPrice, deliveryMethod, hotelId, guideId } = req.body;
    const split = calculate70_30Split(productPrice, deliveryMethod, hotelId, guideId);
    res.json({ success: true, data: split });
  });

  // POST / — create order with idempotency & rate limiting
  router.post('/', orderRateLimiter, async (req, res, next) => {
    try {
      // 1. Idempotency Check (protect against double clicks and duplicate payment requests)
      const idempotencyKey = req.headers['x-idempotency-key'] || req.body.idempotencyKey;
      if (idempotencyKey) {
        const cached = checkIdempotency(idempotencyKey);
        if (cached) {
          return res.status(200).json({
            ...cached,
            _idempotency: 'replayed_from_cache',
          });
        }
      }

      const {
        productId,
        buyerName,
        buyerEmail,
        buyerPhone,
        deliveryMethod,
        shippingAddress,
        hotelId,
        guideId,
      } = req.body;

      if (!buyerName || typeof buyerName !== 'string' || buyerName.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Buyer name is required' });
      }

      // Resolve product to get true authoritative price
      const product = store.getProduct(productId) || store.getProductByProductId(productId);
      const productName = product ? product.name : sanitizeString(req.body.productName || 'Agra Floral Marble Inlay Box');
      const productPrice = product ? product.price : (Number(req.body.productPrice) || 10000);
      const artisanId = product ? (product.artisanId || 'art-rashid-001') : 'art-rashid-001';
      const artisanName = product ? (product.artisanName || 'Ustad Rashid Khan') : 'Ustad Rashid Khan';

      const split = calculate70_30Split(productPrice, deliveryMethod, hotelId, guideId);
      const isShipping = (split.deliveryMethod === 'shipping');
      const orderId = `SP-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderData = {
        orderId,
        productId: product ? product._id : productId,
        productName,
        productPrice: split.productPrice,
        artisanId,
        artisanName,
        buyerName: sanitizeString(buyerName, 100),
        buyerEmail: sanitizeString(buyerEmail || 'tourist@smritipass.org', 150),
        buyerPhone: sanitizeString(buyerPhone || '', 30),
        deliveryMethod: split.deliveryMethod,
        shippingAddress: isShipping ? sanitizeString(shippingAddress || 'Hotel / Home Delivery', 300) : 'Handover at Workshop',
        shippingCharge: split.shippingCharge,
        totalAmount: split.totalAmount,
        paymentSplit: {
          artisanShare: split.artisanShare,
          companyShare: split.companyShare,
          companyBreakdown: split.companyBreakdown,
          shippingFee: split.shippingFee,
        },
        hotelId: split.hotelId,
        guideId: split.guideId,
        status: 'confirmed',
        payoutStatus: 'initiated', // 'initiated' -> 'processing' -> 'credited'
        courierStatus: isShipping ? 'scheduled' : 'not_required',
        courierPickupDate: isShipping ? 'Tomorrow 11:30 AM IST' : null,
        courierInstructions: isShipping ? 'Standard fragile art-crate packing with tamper seal required.' : null,
        createdAt: new Date(),
      };

      const createdOrder = store.createOrder(orderData);

      const responsePayload = {
        success: true,
        data: createdOrder,
        message: 'Order created and 70:30 distribution calculated successfully',
      };

      // Record idempotency response if key supplied
      if (idempotencyKey) {
        recordIdempotency(idempotencyKey, responsePayload);
      }

      res.status(201).json(responsePayload);
    } catch (err) { next(err); }
  });

  // POST /:id/cancel — customer / admin cancellation
  router.post('/:id/cancel', (req, res, next) => {
    try {
      const { reason } = req.body;
      const order = store.cancelOrder(req.params.id, reason || 'Customer requested cancellation');
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
      res.json({ success: true, data: order, message: `Order ${order.orderId} cancelled` });
    } catch (err) { next(err); }
  });

  // PUT /:id/payout-status — update payout status (e.g. processing -> credited)
  router.put('/:id/payout-status', (req, res, next) => {
    try {
      const { payoutStatus } = req.body;
      const order = store.updateOrder(req.params.id, { payoutStatus });
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
      res.json({ success: true, data: order });
    } catch (err) { next(err); }
  });

  return router;
};
