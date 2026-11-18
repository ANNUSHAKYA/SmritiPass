// ============================================================
// Smriti Pass — Gemini AI Heritage & Voice Bot Service
// Powers Conversational Voice Bot & Artisan Voice-to-Catalog
// ============================================================
const express = require('express');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PREFERRED_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];

/** Helper to call Gemini GenerateContent with automatic model fallback */
async function callGemini(systemInstruction, contents, temperature = 0.7) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  let lastError = null;

  for (const model of PREFERRED_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens: 600,
        }
      };
      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Gemini AI] Model ${model} returned ${res.status}: ${errText.slice(0, 120)}`);
        lastError = new Error(`Gemini ${model} ${res.status}: ${errText}`);
        continue; // Try next model in fallback list
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return { text, model };
      }
    } catch (err) {
      console.warn(`[Gemini AI] Model ${model} network error:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini AI models failed');
}

module.exports = function aiRoutes(store) {

  // GET /status — check AI service readiness
  router.get('/status', (_req, res) => {
    res.json({
      status: 'online',
      provider: 'Google Gemini AI',
      model: PREFERRED_MODELS[0],
      supportedFeatures: ['voice-bot', 'voice-to-catalog', 'spoken-audio-synthesis']
    });
  });

  // POST /chat — Conversational AI Voice Bot for Tourists & Visitors
  router.post('/chat', async (req, res) => {
    try {
      const { message, history = [], language = 'auto' } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, error: 'A valid message string is required.' });
      }

      const systemInstruction = `You are "Smriti", the official AI Heritage & Voice Assistant for the Smriti Pass platform in Agra, Uttar Pradesh, India.
Your mission is to connect travelers directly with authentic master artisans and protect traditional Indian crafts.

Key Knowledge & Principles:
1. 70:30 Fair Trade Model: Master artisans receive 70% of every handicraft sale directly. Smriti Pass company takes 30% to fund ASI-licensed guide commissions (5%), boutique hotel commissions (5%), platform operations, and craft verification. Partner commissions are never deducted from the artisan's 70%.
2. Crafts of Agra:
   - Parchin Kari (Mughal Marble Inlay): Makrana white marble inlaid with semi-precious stones (Lapis Lazuli, Malachite, Carnelian, Jasper, Mother of Pearl). GI Tag protected.
   - Zardozi: Traditional gold and metallic wire embroidery on silk and velvet.
   - Handcrafted Leathercraft & Mojaris.
3. Master Artisans: Ustad Rashid Khan (35 years experience, UP State Award winner, workshop in Gokulpura Quarter), Mohammad Aslam (Taj Heritage Guild Master in Sadar Bazaar).
4. Fulfillment: Option 1 Carry With Me (free at Agra workshop in velvet padded packaging) or Option 2 Insured Doorstep Shipping (₹1,000 flat white-glove art courier to India or worldwide).
5. Language & Tone: You are warm, articulate, culturally respectful, and concise (2-3 sentences max). If the user speaks in Hindi, reply in fluent, natural Hindi. If in English, reply in English.`;

      // Build contents array with conversation history
      const contents = [];
      if (Array.isArray(history)) {
        history.slice(-4).forEach(item => {
          if (item.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'bot') {
            contents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        });
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const { text, model } = await callGemini(systemInstruction, contents, 0.7);

      // Detect language for text-to-speech auto-tuning
      const hasDevanagari = /[\u0900-\u097F]/.test(text);
      const detectedLang = hasDevanagari ? 'hi-IN' : 'en-IN';

      res.json({
        success: true,
        reply: text.trim(),
        detectedLang,
        model
      });
    } catch (err) {
      console.error('[AI Chat Error]', err.message);
      // Fallback friendly response if network fails
      res.json({
        success: true,
        reply: "नमस्ते! स्मृति पास में आपका स्वागत है। मैं आगरा के हस्तशिल्प और कारीगरों के बारे में आपकी सहायता के लिए तैयार हूँ। (Welcome to Smriti Pass! How can I assist you with Agra's master crafts today?)",
        detectedLang: 'hi-IN',
        fallback: true
      });
    }
  });

  // POST /craft-assist — AI Voice-to-Catalog parser for Artisan Zero-Literacy Portal
  router.post('/craft-assist', async (req, res) => {
    try {
      const { transcript = '', craft = 'Marble Inlay (Parchin Kari)' } = req.body;
      if (!transcript) {
        return res.status(400).json({ success: false, error: 'Spoken transcript is required.' });
      }

      const systemInstruction = `You are the AI Craft Assistant for Indian master artisans on Smriti Pass.
The artisan spoke in Hindi or English describing a handicraft they made.
Extract the product details and format as a valid JSON object with EXACTLY these keys:
{
  "productName": "Short descriptive name in Hindi/English, e.g. ताज फ्लोरल मार्बल इनले डिब्बी (Floral Marble Inlay Box)",
  "productPrice": 10000,
  "craftCategory": "Marble Inlay (Parchin Kari)",
  "description": "Rich description detailing materials, stones used, handwork process",
  "spokenHindiConfirmation": "A warm, 1-2 sentence spoken Hindi response confirming the product name and price, e.g. 'मैंने आपका उत्पाद ताज फ्लोरल डिब्बी, मूल्य ₹10,000 दर्ज कर लिया है।'"
}
If price is not mentioned, default productPrice to 10000. Output ONLY JSON, no markdown.`;

      const contents = [{ role: 'user', parts: [{ text: `Craft Category: ${craft}\nArtisan Spoken Words: "${transcript}"` }] }];
      const { text } = await callGemini(systemInstruction, contents, 0.2);

      let parsed;
      try {
        const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsed = JSON.parse(clean);
      } catch (pe) {
        parsed = {
          productName: 'आगरा हस्तशिल्प कलाकृति',
          productPrice: 10000,
          craftCategory: craft,
          description: transcript,
          spokenHindiConfirmation: 'मैंने आपका सामान सफलतापूर्वक जोड़ लिया है।'
        };
      }

      res.json({
        success: true,
        data: parsed
      });
    } catch (err) {
      console.error('[AI Craft Assist Error]', err.message);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  });

  return router;
};
