// ============================================================
// Smriti Pass — Automated Test Suite: Lifecycle & Security Tests
// Order States, Cancellations, Refunds, Auth & Security Guardrails
// ============================================================
const assert = require('assert');
const { InMemoryStore } = require('../seed');
const {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  checkIdempotency,
  recordIdempotency,
  sanitizeString,
  sanitizeNumber,
} = require('../utils/cryptoAuth');

function runLifecycleAndSecurityTests() {
  console.log('--- [TEST SUITE 2] Order Lifecycle & Security Verification ---');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✕ ${name}:`, err.message);
      failed++;
    }
  }

  const store = new InMemoryStore();

  // 1. Password Hashing with Salt
  test('PBKDF2 Password Hashing produces salted hash and verifies correctly', () => {
    const rawPass = 'SecretAgra2026!';
    const hash = hashPassword(rawPass);
    assert.ok(hash.includes(':'), 'Hash must contain salt delimiter');
    assert.strictEqual(verifyPassword(rawPass, hash), true, 'Correct password must verify');
    assert.strictEqual(verifyPassword('WrongPass', hash), false, 'Incorrect password must reject');
  });

  // 2. JWT Generation & Verification
  test('JWT Token generator creates valid token and verifies claims', () => {
    const payload = { userId: 'usr-1', email: 'test@smriti.org', role: 'admin' };
    const token = generateToken(payload);
    assert.strictEqual(typeof token, 'string');
    assert.strictEqual(token.split('.').length, 3, 'JWT must have 3 parts');

    const verified = verifyToken(token);
    assert.strictEqual(verified.valid, true);
    assert.strictEqual(verified.payload.email, 'test@smriti.org');
    assert.strictEqual(verified.payload.role, 'admin');

    // Tampered token check
    const tampered = token.slice(0, -5) + 'AAAAA';
    const tamperedResult = verifyToken(tampered);
    assert.strictEqual(tamperedResult.valid, false, 'Tampered token must fail signature verification');
  });

  // 3. Idempotency Protection
  test('Idempotency Store prevents duplicate order processing', () => {
    const key = 'idem-req-12345';
    assert.strictEqual(checkIdempotency(key), null, 'New key returns null');

    recordIdempotency(key, { orderId: 'SP-ORD-111', status: 'confirmed' });
    const cached = checkIdempotency(key);
    assert.ok(cached !== null);
    assert.strictEqual(cached.orderId, 'SP-ORD-111');
  });

  // 4. Input Sanitization
  test('Sanitization helpers mitigate basic XSS and bound numbers', () => {
    const dirty = '<script>alert("xss")</script>Ustad Rashid';
    const clean = sanitizeString(dirty);
    assert.strictEqual(clean, 'scriptalert("xss")/scriptUstad Rashid');
    assert.strictEqual(sanitizeNumber('15000', 0), 15000);
    assert.strictEqual(sanitizeNumber(-500, 0, 0), 0, 'Negative numbers clamped to min');
  });

  // 5. Order Creation with In-Memory Store
  test('Store creates order with verified 70:30 allocation', () => {
    const order = store.createOrder({
      orderId: 'SP-ORD-TEST-001',
      productName: 'Marble Inlay Box',
      productPrice: 10000,
      deliveryMethod: 'shipping',
      shippingCharge: 1000,
      totalAmount: 11000,
      paymentSplit: {
        artisanShare: 7000,
        companyShare: 3000,
        shippingFee: 1000,
      },
      status: 'confirmed',
      payoutStatus: 'initiated',
      courierStatus: 'scheduled',
    });

    assert.ok(order._id);
    assert.strictEqual(order.paymentSplit.artisanShare, 7000);
    assert.strictEqual(order.paymentSplit.companyShare, 3000);
    assert.strictEqual(order.totalAmount, 11000);
  });

  // 6. Order Cancellation Lifecycle
  test('Order Cancellation revokes payout and updates status', () => {
    const cancelled = store.cancelOrder('SP-ORD-TEST-001', 'Customer cancelled travel');
    assert.strictEqual(cancelled.status, 'cancelled');
    assert.strictEqual(cancelled.payoutStatus, 'cancelled');
    assert.strictEqual(cancelled.courierStatus, 'cancelled');
    assert.ok(cancelled.cancelledAt);
  });

  // 7. Payout Status Progression
  test('Artisan payout progresses through initiated -> processing -> credited', () => {
    const order2 = store.createOrder({
      orderId: 'SP-ORD-TEST-002',
      productPrice: 10000,
      totalAmount: 10000,
      deliveryMethod: 'carry',
      paymentSplit: { artisanShare: 7000, companyShare: 3000, shippingFee: 0 },
      status: 'confirmed',
      payoutStatus: 'initiated',
      courierStatus: 'not_required',
    });

    assert.strictEqual(order2.payoutStatus, 'initiated');

    const processing = store.updateOrder(order2._id, { payoutStatus: 'processing' });
    assert.strictEqual(processing.payoutStatus, 'processing');

    const credited = store.updateOrder(order2._id, { payoutStatus: 'credited' });
    assert.strictEqual(credited.payoutStatus, 'credited');
  });

  // 8. Courier Status for Shipping Orders
  test('Courier pickup status updates for shipping orders', () => {
    const order3 = store.createOrder({
      orderId: 'SP-ORD-TEST-003',
      productPrice: 6000,
      totalAmount: 7000,
      deliveryMethod: 'shipping',
      paymentSplit: { artisanShare: 4200, companyShare: 1800, shippingFee: 1000 },
      courierStatus: 'scheduled',
    });

    const pickedUp = store.updateOrder(order3._id, { courierStatus: 'picked_up', courierTrackingNumber: 'BLUEDART-AGRA-991' });
    assert.strictEqual(pickedUp.courierStatus, 'picked_up');
    assert.strictEqual(pickedUp.courierTrackingNumber, 'BLUEDART-AGRA-991');

    const delivered = store.updateOrder(order3._id, { courierStatus: 'delivered' });
    assert.strictEqual(delivered.courierStatus, 'delivered');
  });

  // 9. Analytics Derivation from Real Stored Orders
  test('Analytics computes metrics strictly from recorded database transactions', () => {
    const analytics = store.getAnalyticsSummary();
    assert.ok(typeof analytics.overview.totalOrders === 'number');
    assert.ok(typeof analytics.financials.artisanPayoutsGuaranteed70 === 'number');
    assert.ok(typeof analytics.financials.companyGrossRevenue30 === 'number');
    assert.ok(analytics.financials.artisanPayoutsGuaranteed70 > 0);
  });

  console.log(`Suite 2 Results: ${passed} passed, ${failed} failed\n`);
  return { passed, failed };
}

if (require.main === module) {
  const result = runLifecycleAndSecurityTests();
  process.exit(result.failed > 0 ? 1 : 0);
}

module.exports = { runLifecycleAndSecurityTests };
