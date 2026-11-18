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

  // Helper to escape regex special characters
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Format date nicely for spoken Hindi & English synthesis
  function formatSpokenDate(dStr, isHindi) {
    if (!dStr || !/^\d{2}\.\d{2}\.\d{4}$/.test(dStr)) return dStr;
    const [day, month, year] = dStr.split('.');
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
    const mIdx = parseInt(month, 10) - 1;
    const dNum = parseInt(day, 10);
    if (isHindi) {
      return `${dNum} ${monthsHi[mIdx] || month} ${year}`;
    } else {
      return `${dNum} ${monthsEn[mIdx] || month} ${year}`;
    }
  }

  // POST /voice-search — Intelligent GI Craft Voice Search Engine
  router.post('/voice-search', async (req, res) => {
    try {
      const { query = '', language = 'auto' } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: 'Query is required.' });
      }

      const qRaw = query.trim();
      const qClean = qRaw.replace(/[.,?!;:।]/g, ' ').replace(/\s+/g, ' ').trim();
      const qLower = qClean.toLowerCase();

      // Detect language
      let isHindi = false;
      if (language === 'hi' || language === 'hi-IN') {
        isHindi = true;
      } else if (language === 'en' || language === 'en-IN') {
        isHindi = false;
      } else {
        isHindi = /[\u0900-\u097F]/.test(qRaw) ||
          /\b(kaunsa|kaunse|kaun|kya|batao|dikhao|karein|baare|bare|mein|ke|ki|ko|aur|hain|hai)\b/i.test(qLower);
      }

      const allGi = store.getAllGiProducts();
      const marketplaceProducts = store.getAllProducts();

      // 1. EXACT PRODUCT MATCH
      let exactMatch = null;
      const sortedByLength = [...allGi].sort((a, b) => b.name.length - a.name.length);
      for (const item of sortedByLength) {
        const nLower = item.name.toLowerCase();
        const hLower = (item.hindiName || '').toLowerCase();

        const nRegex = new RegExp('(^|\\b)' + escapeRegex(nLower) + '(\\b|$)', 'i');
        if (nRegex.test(qLower)) {
          exactMatch = item;
          break;
        }
        if (hLower && (qLower.includes(hLower) || (item.region && qLower.includes(item.region.toLowerCase()) && qLower.includes(nLower)))) {
          exactMatch = item;
          break;
        }
      }

      if (exactMatch) {
        let linkedProduct = null;
        if (exactMatch.name.toLowerCase().includes('inlay') || exactMatch.name.toLowerCase().includes('stone')) {
          const found = marketplaceProducts.find(p => p.productId === 'SP-AG-MI-2026-0042' || (p.craft && p.craft.includes('Marble Inlay')));
          if (found) {
            linkedProduct = {
              productId: found.productId,
              name: found.name,
              price: found.price,
              artisanName: 'Ustad Rashid Khan',
              workshopLocation: 'Sadar Bazaar Craft Quarter, Agra',
              imageUrl: found.imageUrl || '/assets/marble_inlay_box.jpg'
            };
          }
        }

        const catHindi = exactMatch.category === 'Handicraft' ? 'हस्तशिल्प'
          : exactMatch.category === 'Agricultural' ? 'कृषि उत्पाद'
          : exactMatch.category === 'Food Stuff' ? 'खाद्य सामग्री'
          : exactMatch.category === 'Manufactured' ? 'विनिर्मित वस्तु' : 'प्राकृतिक संसाधन';
        const stateHindi = exactMatch.state === 'Jammu & Kashmir' ? 'जम्मू और कश्मीर' : 'उत्तर प्रदेश';
        const spokenDate = formatSpokenDate(exactMatch.registrationDate, isHindi);

        let spokenAnswer = '';
        if (isHindi) {
          spokenAnswer = `यह ${exactMatch.hindiName || exactMatch.name} है। यह ${stateHindi} की पंजीकृत ${catHindi} श्रेणी में आता है। इसका पंजीकरण ${spokenDate} को हुआ था।`;
          if (linkedProduct) {
            spokenAnswer += ` उस्ताद रशीद खान की कार्यशाला का सत्यापित उत्पाद कैटलॉग में उपलब्ध है।`;
          }
        } else {
          spokenAnswer = `This is ${exactMatch.name}, a registered ${exactMatch.category.toLowerCase()} from ${exactMatch.state}. Its registration date is ${spokenDate}.`;
          if (linkedProduct) {
            spokenAnswer += ` Authentic master artisan work by Ustad Rashid Khan is available in the catalogue.`;
          }
        }

        return res.json({
          success: true,
          query: qRaw,
          isExactMatch: true,
          interpretedFilters: { exactProduct: exactMatch.name },
          count: 1,
          spokenAnswer,
          detectedLanguage: isHindi ? 'hi-IN' : 'en-IN',
          data: [{ ...exactMatch, linkedMarketplaceProduct: linkedProduct }]
        });
      }

      // 2. STATE INTENT
      let stateFilter = '';
      if (/\b(kashmir|jammu|j&k|jk)\b/i.test(qLower) || /कश्मीर|जम्मू/.test(qRaw)) {
        stateFilter = 'Jammu & Kashmir';
      } else if (/\b(uttar pradesh|u\.p\.|up)\b/i.test(qLower) || /उत्तर प्रदेश/.test(qRaw)) {
        stateFilter = 'Uttar Pradesh';
      }

      // 3. CATEGORY INTENT
      let categoryFilter = '';
      if (/\b(agricultural|agriculture|farming|crop|कृषि|खेती|फसल)\b/i.test(qLower) || /कृषि|खेती/.test(qRaw)) {
        categoryFilter = 'Agricultural';
      } else if (/\b(food stuffs?|food products?|खाद्य सामग्री|खानपान|food|sweets?|mithai)\b/i.test(qLower) || /खाद्य|खानपान|मिठाई/.test(qRaw)) {
        categoryFilter = 'Food Stuff';
      } else if (/\b(handicrafts?|हस्तशिल्प|कारीगरी)\b/i.test(qLower) || /हस्तशिल्प|कारीगरी/.test(qRaw)) {
        categoryFilter = 'Handicraft';
      } else if (/\b(manufactured goods?|manufactured|विनिर्मित|उद्योग)\b/i.test(qLower) || /विनिर्मित|उद्योग/.test(qRaw)) {
        categoryFilter = 'Manufactured';
      } else if (/\b(natural goods?|natural resources?|प्राकृतिक संसाधन|natural)\b/i.test(qLower) || /प्राकृतिक/.test(qRaw)) {
        categoryFilter = 'Natural';
      }

      // 4. REGION / CITY INTENT
      const cities = [
        { key: 'agra', name: 'Agra', state: 'Uttar Pradesh', hindi: 'आगरा' },
        { key: 'banaras', name: 'Banaras', state: 'Uttar Pradesh', hindi: 'बनारस' },
        { key: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', hindi: 'वाराणसी' },
        { key: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', hindi: 'लखनऊ' },
        { key: 'bareilly', name: 'Bareilly', state: 'Uttar Pradesh', hindi: 'बरेली' },
        { key: 'aligarh', name: 'Aligarh', state: 'Uttar Pradesh', hindi: 'अलीगढ़' },
        { key: 'mirzapur', name: 'Mirzapur', state: 'Uttar Pradesh', hindi: 'मिर्ज़ापुर' },
        { key: 'bhadohi', name: 'Bhadohi', state: 'Uttar Pradesh', hindi: 'भदोही' },
        { key: 'mathura', name: 'Mathura', state: 'Uttar Pradesh', hindi: 'मथुरा' },
        { key: 'meerut', name: 'Meerut', state: 'Uttar Pradesh', hindi: 'मेरठ' },
        { key: 'firozabad', name: 'Firozabad', state: 'Uttar Pradesh', hindi: 'फ़िरोज़ाबाद' },
        { key: 'khurja', name: 'Khurja', state: 'Uttar Pradesh', hindi: 'खुरजा' },
        { key: 'saharanpur', name: 'Saharanpur', state: 'Uttar Pradesh', hindi: 'सहारनपुर' },
        { key: 'moradabad', name: 'Moradabad', state: 'Uttar Pradesh', hindi: 'मुरादाबाद' },
        { key: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', hindi: 'कानपुर' },
        { key: 'farrukhabad', name: 'Farrukhabad', state: 'Uttar Pradesh', hindi: 'फर्रुखाबाद' },
        { key: 'gorakhpur', name: 'Gorakhpur', state: 'Uttar Pradesh', hindi: 'गोरखपुर' },
        { key: 'kannauj', name: 'Kannauj', state: 'Uttar Pradesh', hindi: 'कन्नौज' },
        { key: 'rampur', name: 'Rampur', state: 'Uttar Pradesh', hindi: 'रामपुर' },
        { key: 'pilibhit', name: 'Pilibhit', state: 'Uttar Pradesh', hindi: 'पीलीभीत' },
        { key: 'chunar', name: 'Chunar', state: 'Uttar Pradesh', hindi: 'चुनार' },
        { key: 'srinagar', name: 'Srinagar', state: 'Jammu & Kashmir', hindi: 'श्रीनगर' },
        { key: 'bhaderwah', name: 'Bhaderwah', state: 'Jammu & Kashmir', hindi: 'भद्रवाह' },
        { key: 'ramban', name: 'Ramban', state: 'Jammu & Kashmir', hindi: 'रामबन' },
        { key: 'udhampur', name: 'Udhampur', state: 'Jammu & Kashmir', hindi: 'उधमपुर' },
        { key: 'basohli', name: 'Basohli', state: 'Jammu & Kashmir', hindi: 'बसोहली' },
        { key: 'rajouri', name: 'Rajouri', state: 'Jammu & Kashmir', hindi: 'राजौरी' }
      ];

      let detectedCity = null;
      for (const c of cities) {
        const reg = new RegExp('(^|\\b)(' + escapeRegex(c.key) + '|' + escapeRegex(c.hindi) + ')(\\b|$)', 'i');
        if (reg.test(qLower)) {
          detectedCity = c;
          if (!stateFilter) stateFilter = c.state;
          break;
        }
      }

      // Filtering
      let pool = allGi;

      if (stateFilter) {
        pool = pool.filter(item => item.state === stateFilter);
      }

      if (categoryFilter) {
        pool = pool.filter(item => item.category === categoryFilter);
      }

      if (detectedCity) {
        const cKey = detectedCity.key.toLowerCase();
        const cityRegex = new RegExp('(^|\\b)' + escapeRegex(cKey) + '(\\b|$)', 'i');
        const cityMatches = pool.filter(item => {
          const inName = cityRegex.test(item.name);
          const inRegion = cityRegex.test(item.region);
          const syn = (cKey === 'banaras' || cKey === 'varanasi') &&
            (item.name.toLowerCase().includes('banaras') || item.name.toLowerCase().includes('varanasi'));
          return inName || inRegion || syn;
        });

        if (cityMatches.length > 0) {
          pool = cityMatches;
        }
      }

      // Keyword fallback if neither city nor state/category matched
      if (!detectedCity && !stateFilter && !categoryFilter) {
        const stopWords = /\b(tell me about|show me|what is|what are|search for|gi craft|gi tag|registered|crafts?|products?|kaunsa|hai|kya|batao|dikhao|ke baare mein|ke bare me|ke bare mein|ke|ki|ko|aur|mein|me|se)\b/gi;
        const cleanKw = qLower.replace(stopWords, ' ').replace(/\s+/g, ' ').trim();
        if (cleanKw.length >= 2) {
          const kwReg = new RegExp(escapeRegex(cleanKw), 'i');
          pool = pool.filter(item => kwReg.test(item.name) || kwReg.test(item.hindiName) || kwReg.test(item.region));
        } else {
          pool = [];
        }
      }

      if (pool.length === 0) {
        return res.json({
          success: true,
          query: qRaw,
          isExactMatch: false,
          count: 0,
          spokenAnswer: isHindi
            ? 'माफ़ कीजिए, इस नाम का कोई पंजीकृत उत्पाद नहीं मिला।'
            : 'Sorry, no matching registered craft was found.',
          detectedLanguage: isHindi ? 'hi-IN' : 'en-IN',
          data: []
        });
      }

      // Manageable return limit (maximum 12 to prevent dumping)
      const matches = pool.slice(0, 12).map(item => {
        let linkedProduct = null;
        if (item.name.toLowerCase().includes('inlay') || item.name.toLowerCase().includes('stone')) {
          const found = marketplaceProducts.find(p => p.productId === 'SP-AG-MI-2026-0042' || (p.craft && p.craft.includes('Marble Inlay')));
          if (found) {
            linkedProduct = {
              productId: found.productId,
              name: found.name,
              price: found.price,
              artisanName: 'Ustad Rashid Khan',
              workshopLocation: 'Sadar Bazaar Craft Quarter, Agra',
              imageUrl: found.imageUrl || '/assets/marble_inlay_box.jpg'
            };
          }
        }
        return { ...item, linkedMarketplaceProduct: linkedProduct };
      });

      // Construct spoken response
      let spokenAnswer = '';
      const names = matches.slice(0, 3).map(m => isHindi ? (m.hindiName || m.name) : m.name).join(', ');
      const locationLabel = detectedCity ? (isHindi ? detectedCity.hindi : detectedCity.name)
        : stateFilter ? (isHindi && stateFilter === 'Jammu & Kashmir' ? 'जम्मू और कश्मीर' : isHindi ? 'उत्तर प्रदेश' : stateFilter)
        : (isHindi ? 'खोज' : 'this category');

      const catLabel = categoryFilter ? (
        categoryFilter === 'Handicraft' ? (isHindi ? 'हस्तशिल्प' : 'handicrafts')
        : categoryFilter === 'Agricultural' ? (isHindi ? 'कृषि उत्पादों' : 'agricultural products')
        : categoryFilter === 'Food Stuff' ? (isHindi ? 'खाद्य उत्पादों' : 'food items')
        : (isHindi ? 'उत्पादों' : 'products')
      ) : (isHindi ? 'पंजीकृत उत्पादों' : 'registered crafts');

      if (isHindi) {
        spokenAnswer = `${locationLabel} के ${catLabel} में ${names} शामिल हैं।`;
      } else {
        spokenAnswer = `Matching ${catLabel} from ${locationLabel} include ${names}.`;
      }

      res.json({
        success: true,
        query: qRaw,
        isExactMatch: false,
        interpretedFilters: {
          state: stateFilter || null,
          category: categoryFilter || null,
          city: detectedCity ? detectedCity.name : null
        },
        count: matches.length,
        spokenAnswer,
        detectedLanguage: isHindi ? 'hi-IN' : 'en-IN',
        data: matches
      });
    } catch (err) {
      console.error('[AI Voice Search Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
};
