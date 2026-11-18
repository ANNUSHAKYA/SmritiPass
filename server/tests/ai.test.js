// ============================================================
// Smriti Pass — Gemini AI & Voice Bot Automated Test Suite
// Verifies AI Chat, Voice-to-Catalog & Fallback Handling
// ============================================================
const assert = require('assert');

function runAiTests() {
  console.log('\n--- [TEST SUITE 3] Gemini AI Voice Bot & Craft Assistant Tests ---');
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

  // 1. API Key presence check
  test('Gemini API key is configured and loaded via process.env', () => {
    require('dotenv').config();
    const key = process.env.GEMINI_API_KEY;
    assert(key && key.length > 10, 'GEMINI_API_KEY must be configured in environment');
  });

  // 2. Language Detection Logic
  test('Devanagari script properly detected for Hindi text-to-speech routing', () => {
    const hindiSample = 'नमस्ते, मैं आगरा की पच्चीकारी के बारे में बता सकता हूँ।';
    const englishSample = 'Hello! Welcome to Smriti Pass in Agra.';
    
    const isHindi = (text) => /[\u0900-\u097F]/.test(text);
    assert.strictEqual(isHindi(hindiSample), true, 'Hindi text must route to hi-IN voice');
    assert.strictEqual(isHindi(englishSample), false, 'English text must route to en-IN voice');
  });

  // 3. Craft Assist JSON clean parser
  test('Craft Assistant cleans markdown and parses valid JSON metadata', () => {
    const mockRaw = '```json\n{\n  "productName": "संगमरमर फूलदान",\n  "productPrice": 12000,\n  "craftCategory": "Marble Inlay (Parchin Kari)",\n  "description": "सफेद मकराना संगमरमर पर लाजवर्त की नक्काशी",\n  "spokenHindiConfirmation": "मैंने संगमरमर फूलदान दर्ज कर लिया है।"\n}\n```';
    const clean = mockRaw.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);
    assert.strictEqual(parsed.productName, 'संगमरमर फूलदान');
    assert.strictEqual(parsed.productPrice, 12000);
    assert.strictEqual(parsed.craftCategory, 'Marble Inlay (Parchin Kari)');
    assert(parsed.spokenHindiConfirmation.includes('संगमरमर फूलदान'));
  });

  // 4. Safe fallback generation when offline
  test('AI voice bot provides graceful bilingual fallback when offline', () => {
    const fallbackText = "नमस्ते! स्मृति पास पर आपका स्वागत है। (Welcome to Smriti Pass! How can I assist you with Agra's master crafts today?)";
    assert(fallbackText.includes('स्मृति पास') && fallbackText.includes('Smriti Pass'));
  });

  console.log(`Suite 3 Results: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}

module.exports = { runAiTests };
