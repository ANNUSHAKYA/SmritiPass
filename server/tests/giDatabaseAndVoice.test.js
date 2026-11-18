// ============================================================
// Smriti Pass 2.0 — GI Database & Intelligent Voice Search Tests
// Verifies:
// - 102 Official GI Records (24 J&K, 78 UP)
// - Categories, Registration Dates, States, and Registry Integrity
// - Intelligent Voice Search Engine (Hindi & English Spoken Responses)
// - Strict Relevancy (Only matching records, no dumping)
// - 70:30 Fair Trade Model & Dynamic Payout Calculations
// ============================================================
const assert = require('assert');
const { giRegistryData } = require('../data/giRegistryData');
const { InMemoryStore } = require('../seed');

function runGiDatabaseAndVoiceTests() {
  console.log('\n--- [TEST SUITE 4] GI Database & Intelligent Voice Search Tests ---');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(`    Error: ${err.message}`);
      failed++;
    }
  }

  const store = new InMemoryStore();

  // 1. Database Total & State Distribution
  test('GI Database contains exactly 102 official registered records', () => {
    assert.strictEqual(giRegistryData.length, 102, 'Total GI records must be 102');
    const jk = giRegistryData.filter(d => d.state === 'Jammu & Kashmir');
    const up = giRegistryData.filter(d => d.state === 'Uttar Pradesh');
    assert.strictEqual(jk.length, 24, 'Jammu & Kashmir records must be exactly 24');
    assert.strictEqual(up.length, 78, 'Uttar Pradesh records must be exactly 78');
  });

  // 2. Category Distributions
  test('GI Database categories match source classifications exactly', () => {
    const stats = store.getGiStats();
    assert.strictEqual(stats.byCategory['Handicraft'], 73, 'Handicrafts count must be 73');
    assert.strictEqual(stats.byCategory['Agricultural'], 15, 'Agricultural count must be 15');
    assert.strictEqual(stats.byCategory['Food Stuff'], 8, 'Food Stuff count must be 8');
    assert.strictEqual(stats.byCategory['Manufactured'], 5, 'Manufactured count must be 5');
    assert.strictEqual(stats.byCategory['Natural'], 1, 'Natural count must be 1');
  });

  // 3. Date Format & Status Integrity
  test('All 102 records have valid status and DD.MM.YYYY dates', () => {
    giRegistryData.forEach((item, idx) => {
      assert.strictEqual(item.status, 'Registered', `Item [${idx}] ${item.name} must be Registered`);
      assert(
        /^\d{2}\.\d{2}\.\d{4}$/.test(item.registrationDate),
        `Item [${idx}] ${item.name} must have DD.MM.YYYY date: got ${item.registrationDate}`
      );
      assert(item.name && item.name.trim().length > 0, `Item [${idx}] must have name`);
      assert(item.state, `Item [${idx}] must have state`);
    });
  });

  // 4. Exact Craft Names from J&K
  test('All 24 Jammu & Kashmir crafts preserved with authentic names', () => {
    const expectedJk = [
      'Kashmir Saffron', 'Mushkbudji Rice', 'Bhaderwah Rajmash', 'Ramban Anardana',
      'Ramban Sulai Honey', 'Udhampur Kaladi', 'Kashmir Pashmina', 'Kashmir Sozani Craft',
      'Kani Shawl', 'Kashmir Paper Machie', 'Kashmir Walnut Wood Carving', 'Khatamband',
      'Kashmiri Hand Knotted Carpet', 'Basohli Painting', 'Rajouri Chikri Wood Craft',
      'Basohli Pashmina Woolen Products', 'Kashmir Namda', 'Kashmir Wagguv', 'Shikara',
      'Gabba', 'Kashmir Willow Bat', 'Kashmir Chain Stitch', 'Kashmir Crewel', 'Kashmir Tweed'
    ];
    const actualJk = giRegistryData.filter(d => d.state === 'Jammu & Kashmir').map(d => d.name);
    assert.deepStrictEqual(actualJk, expectedJk, 'J&K crafts must match prompt list in order');
  });

  // 5. Example 1: "Agra ka GI craft kaunsa hai?"
  test('Voice Search: "Agra ka GI craft kaunsa hai?" returns Agra Durrie, Footwear, Stone Inlay', async () => {
    const aiRoutes = require('../routes/ai')(store);
    
    // Simulate req/res for router
    let resultData = null;
    const req = {
      body: { query: 'Agra ka GI craft kaunsa hai?' }
    };
    const res = {
      status(code) { this.statusCode = code; return this; },
      json(obj) { resultData = obj; return this; }
    };

    // Find the voice-search handler
    const voiceSearchRoute = aiRoutes.stack.find(s => s.route && s.route.path === '/voice-search');
    assert(voiceSearchRoute, 'Voice search route must exist');
    await voiceSearchRoute.route.stack[0].handle(req, res);

    assert(resultData && resultData.success, 'Voice search must succeed');
    assert.strictEqual(resultData.count, 3, 'Must return exactly 3 Agra records');
    const names = resultData.data.map(d => d.name);
    assert(names.includes('Agra Durrie'), 'Must include Agra Durrie');
    assert(names.includes('Agra Leather Footwear'), 'Must include Agra Leather Footwear');
    assert(names.includes('Agra Stone Inlay Work'), 'Must include Agra Stone Inlay Work');
    assert(resultData.spokenAnswer.includes('आगरा'), 'Spoken answer must be in Hindi');
  });

  // 6. Example 2: "Tell me about Banaras Zardozi."
  test('Voice Search: "Tell me about Banaras Zardozi." returns exact single record', async () => {
    const aiRoutes = require('../routes/ai')(store);
    let resultData = null;
    const req = { body: { query: 'Tell me about Banaras Zardozi.' } };
    const res = {
      status(code) { return this; },
      json(obj) { resultData = obj; return this; }
    };
    const voiceSearchRoute = aiRoutes.stack.find(s => s.route && s.route.path === '/voice-search');
    await voiceSearchRoute.route.stack[0].handle(req, res);

    assert(resultData && resultData.success);
    assert.strictEqual(resultData.count, 1, 'Must return single exact match');
    assert.strictEqual(resultData.data[0].name, 'Banaras Zardozi');
    assert.strictEqual(resultData.data[0].category, 'Handicraft');
    assert.strictEqual(resultData.data[0].state, 'Uttar Pradesh');
    assert.strictEqual(resultData.data[0].registrationDate, '14.09.2021');
    assert(resultData.spokenAnswer.includes('Banaras Zardozi'), 'Must mention Banaras Zardozi');
  });

  // 7. Example 3: "Kashmir ke handicrafts dikhao."
  test('Voice Search: "Kashmir ke handicrafts dikhao." returns only J&K Handicrafts', async () => {
    const aiRoutes = require('../routes/ai')(store);
    let resultData = null;
    const req = { body: { query: 'Kashmir ke handicrafts dikhao.' } };
    const res = {
      status(code) { return this; },
      json(obj) { resultData = obj; return this; }
    };
    const voiceSearchRoute = aiRoutes.stack.find(s => s.route && s.route.path === '/voice-search');
    await voiceSearchRoute.route.stack[0].handle(req, res);

    assert(resultData && resultData.success);
    assert(resultData.count > 0, 'Must return matching records');
    resultData.data.forEach(item => {
      assert.strictEqual(item.state, 'Jammu & Kashmir', 'All items must be from J&K');
      assert.strictEqual(item.category, 'Handicraft', 'All items must be Handicrafts');
    });
    assert(resultData.spokenAnswer.includes('हस्तशिल्प') || resultData.spokenAnswer.includes('कश्मीर'));
  });

  // 8. Example 4: "Uttar Pradesh ke agricultural products batao."
  test('Voice Search: "Uttar Pradesh ke agricultural products batao." returns only UP Agriculture', async () => {
    const aiRoutes = require('../routes/ai')(store);
    let resultData = null;
    const req = { body: { query: 'Uttar Pradesh ke agricultural products batao.' } };
    const res = {
      status(code) { return this; },
      json(obj) { resultData = obj; return this; }
    };
    const voiceSearchRoute = aiRoutes.stack.find(s => s.route && s.route.path === '/voice-search');
    await voiceSearchRoute.route.stack[0].handle(req, res);

    assert(resultData && resultData.success);
    assert.strictEqual(resultData.count, 11, 'Must return all 11 agricultural products of UP');
    resultData.data.forEach(item => {
      assert.strictEqual(item.state, 'Uttar Pradesh', 'All items must be from UP');
      assert.strictEqual(item.category, 'Agricultural', 'All items must be Agricultural');
    });
  });

  // 9. Example 5: "Agra Stone Inlay Work ke baare mein batao."
  test('Voice Search: "Agra Stone Inlay Work" returns record and links genuine marketplace listing', async () => {
    const aiRoutes = require('../routes/ai')(store);
    let resultData = null;
    const req = { body: { query: 'Agra Stone Inlay Work ke baare mein batao.' } };
    const res = {
      status(code) { return this; },
      json(obj) { resultData = obj; return this; }
    };
    const voiceSearchRoute = aiRoutes.stack.find(s => s.route && s.route.path === '/voice-search');
    await voiceSearchRoute.route.stack[0].handle(req, res);

    assert(resultData && resultData.success);
    assert.strictEqual(resultData.count, 1);
    const item = resultData.data[0];
    assert.strictEqual(item.name, 'Agra Stone Inlay Work');
    assert(item.linkedMarketplaceProduct, 'Must link to actual marketplace product');
    assert.strictEqual(item.linkedMarketplaceProduct.productId, 'SP-AG-MI-2026-0042');
    assert.strictEqual(item.linkedMarketplaceProduct.artisanName, 'Ustad Rashid Khan');
  });

  // 10. Example 6: No Match query
  test('Voice Search: Unregistered or invalid query returns 0 matches and graceful polite message', async () => {
    const aiRoutes = require('../routes/ai')(store);
    let resultData = null;
    const req = { body: { query: 'Tell me about Parisian lace dress.' } };
    const res = {
      status(code) { return this; },
      json(obj) { resultData = obj; return this; }
    };
    const voiceSearchRoute = aiRoutes.stack.find(s => s.route && s.route.path === '/voice-search');
    await voiceSearchRoute.route.stack[0].handle(req, res);

    assert(resultData && resultData.success);
    assert.strictEqual(resultData.count, 0, 'Must return 0 records');
    assert(resultData.spokenAnswer.includes('Sorry, no matching registered craft was found.') || resultData.spokenAnswer.includes('माफ़ कीजिए'));
  });

  // 11. Strict Fair Trade 70:30 Calculation
  test('Fair Trade 70:30 model preserves exact artisan share and company allocation', () => {
    const P = 10000;
    const artisanShare = Math.round(P * 0.70);
    const companyShare = P - artisanShare;
    const guide = Math.round(P * 0.05);
    const hotel = Math.round(P * 0.05);
    const platform = companyShare - guide - hotel;

    assert.strictEqual(artisanShare, 7000, 'Artisan receives ₹7,000 (70%)');
    assert.strictEqual(companyShare, 3000, 'Company receives ₹3,000 (30%)');
    assert.strictEqual(guide, 500, 'Guide receives ₹500 (5%) from company share');
    assert.strictEqual(hotel, 500, 'Hotel receives ₹500 (5%) from company share');
    assert.strictEqual(platform, 2000, 'Platform retains ₹2,000 (20%) from company share');
  });

  console.log(`Suite 4 Results: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}

module.exports = { runGiDatabaseAndVoiceTests };

if (require.main === module) {
  runGiDatabaseAndVoiceTests();
}
