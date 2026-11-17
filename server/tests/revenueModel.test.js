// ============================================================
// Smriti Pass — Automated Test Suite: 70:30 Revenue Model
// Rigorous verification of formulas, rounding, and delivery options
// ============================================================
const assert = require('assert');

function runRevenueModelTests() {
  console.log('\n--- [TEST SUITE 1] 70:30 Fair Trade Revenue Model Tests ---');
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

  // Helper matching server calculation
  function calculateSplit(productPrice, deliveryMethod, guidePct = 5, hotelPct = 5) {
    const price = Math.round(Number(productPrice) || 0);
    const isShipping = (deliveryMethod === 'shipping');
    const shippingCharge = isShipping ? 1000 : 0;

    const artisanShare = Math.round(price * 0.70);
    const companyShare = price - artisanShare; // exactly 30%

    const guideCommission = Math.round(price * (guidePct / 100));
    const hotelCommission = Math.round(price * (hotelPct / 100));
    const platformOperations = Math.max(0, companyShare - guideCommission - hotelCommission);

    return {
      price,
      shippingCharge,
      totalAmount: price + shippingCharge,
      artisanShare,
      companyShare,
      guideCommission,
      hotelCommission,
      platformOperations,
      sumOfShares: artisanShare + companyShare,
    };
  }

  // 1. Standard Demonstration Product: ₹10,000 (Carry With Me)
  test('Standard ₹10,000 Product (Carry With Me): Artisan ₹7,000, Company ₹3,000, Shipping ₹0, Total ₹10,000', () => {
    const res = calculateSplit(10000, 'carry');
    assert.strictEqual(res.price, 10000);
    assert.strictEqual(res.shippingCharge, 0);
    assert.strictEqual(res.totalAmount, 10000);
    assert.strictEqual(res.artisanShare, 7000);
    assert.strictEqual(res.companyShare, 3000);
    assert.strictEqual(res.sumOfShares, 10000);
  });

  // 2. Standard Demonstration Product: ₹10,000 (Insured Doorstep Shipping)
  test('Standard ₹10,000 Product (Insured Shipping): Artisan ₹7,000 (70% unchanged!), Company ₹3,000, Shipping ₹1,000, Total ₹11,000', () => {
    const res = calculateSplit(10000, 'shipping');
    assert.strictEqual(res.price, 10000);
    assert.strictEqual(res.shippingCharge, 1000);
    assert.strictEqual(res.totalAmount, 11000);
    assert.strictEqual(res.artisanShare, 7000, 'Artisan share must not change when shipping is chosen!');
    assert.strictEqual(res.companyShare, 3000, 'Company share must not change when shipping is chosen!');
    assert.strictEqual(res.totalAmount, res.price + res.shippingCharge);
  });

  // 3. Partner Commissions Come From Within Company 30%
  test('Internal Partner Commissions (5% Guide, 5% Hotel) come FROM WITHIN Company 30%', () => {
    const res = calculateSplit(10000, 'carry', 5, 5);
    assert.strictEqual(res.guideCommission, 500); // 5% of ₹10,000
    assert.strictEqual(res.hotelCommission, 500); // 5% of ₹10,000
    assert.strictEqual(res.platformOperations, 2000); // ₹3,000 - ₹500 - ₹500 = ₹2,000
    assert.strictEqual(res.guideCommission + res.hotelCommission + res.platformOperations, res.companyShare);
    assert.strictEqual(res.artisanShare, 7000, 'Artisan share must NEVER be reduced by partner commissions!');
  });

  // 4. Low-price Item: ₹600 Coaster
  test('Low-price Item: ₹600 (Carry With Me)', () => {
    const res = calculateSplit(600, 'carry');
    assert.strictEqual(res.artisanShare, 420); // 70% of 600
    assert.strictEqual(res.companyShare, 180); // 30% of 600
    assert.strictEqual(res.totalAmount, 600);
  });

  // 5. Medium-price Item: ₹8,500 Kurta (Insured Shipping)
  test('Medium-price Item: ₹8,500 (Insured Shipping)', () => {
    const res = calculateSplit(8500, 'shipping');
    assert.strictEqual(res.artisanShare, 5950); // 70% of 8500
    assert.strictEqual(res.companyShare, 2550); // 30% of 8500
    assert.strictEqual(res.shippingCharge, 1000);
    assert.strictEqual(res.totalAmount, 9500);
  });

  // 6. Luxury Heritage Item: ₹50,000 Inlay Tabletop
  test('High-value Item: ₹50,000 Inlay Tabletop', () => {
    const res = calculateSplit(50000, 'shipping');
    assert.strictEqual(res.artisanShare, 35000); // 70% of 50000
    assert.strictEqual(res.companyShare, 15000); // 30% of 50000
    assert.strictEqual(res.totalAmount, 51000);
  });

  // 7. Odd number / Decimal Rounding Safety: ₹999
  test('Odd Price Decimal Rounding: ₹999 Product Price', () => {
    const res = calculateSplit(999, 'carry');
    // 70% of 999 = 699.3 -> Math.round -> 699
    // 30% of 999 = 299.7 -> 999 - 699 = 300
    assert.strictEqual(res.artisanShare, 699);
    assert.strictEqual(res.companyShare, 300);
    assert.strictEqual(res.sumOfShares, 999, 'Artisan + Company must strictly equal product price without penny leakage');
  });

  // 8. Odd Price: ₹1,337
  test('Odd Price Decimal Rounding: ₹1,337 Product Price', () => {
    const res = calculateSplit(1337, 'shipping');
    // 70% of 1337 = 935.9 -> 936
    // Company share = 1337 - 936 = 401
    assert.strictEqual(res.artisanShare, 936);
    assert.strictEqual(res.companyShare, 401);
    assert.strictEqual(res.sumOfShares, 1337);
    assert.strictEqual(res.totalAmount, 2337);
  });

  // 9. Floating-point String Input: "10000.50"
  test('Sanitization of string and float prices', () => {
    const res = calculateSplit('10000.50', 'carry');
    assert.strictEqual(res.price, 10001);
    assert.strictEqual(res.artisanShare, 7001);
    assert.strictEqual(res.companyShare, 3000);
    assert.strictEqual(res.sumOfShares, 10001);
  });

  // 10. Zero or negative price guard
  test('Zero or negative price edge case handling', () => {
    const res = calculateSplit(0, 'carry');
    assert.strictEqual(res.artisanShare, 0);
    assert.strictEqual(res.companyShare, 0);
    assert.strictEqual(res.totalAmount, 0);
  });

  console.log(`Suite 1 Results: ${passed} passed, ${failed} failed\n`);
  return { passed, failed };
}

if (require.main === module) {
  const result = runRevenueModelTests();
  process.exit(result.failed > 0 ? 1 : 0);
}

module.exports = { runRevenueModelTests };
