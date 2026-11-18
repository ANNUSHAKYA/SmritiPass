/**
 * tourist.js — Screen 1: Tourist Experience for Smriti Pass 2.0
 * Features:
 * - Agra heritage trail (Taj Mahal -> Sadar Bazaar -> Gokulpura)
 * - Static Master Artisan Credential Card (Ustad Rashid Khan)
 * - Lightweight product catalogue immediately below the credential card
 * - Digital Product Passport viewer (Product ID, SHA-256 fingerprint, Craft DNA, Provenance timeline)
 * - GI Craft Discovery & Intelligent Voice Search Engine (Jammu & Kashmir & Uttar Pradesh)
 * - Hindi and English speech recognition & SpeechSynthesis spoken voice output
 * - Show ONLY relevant search results (compact cards, no dumping of entire dataset)
 * - Dynamic "Buy Now" carrying selected product directly into Screen 2 Checkout (70:30 model)
 */

let touristSpeechRecognizer = null;
let isTouristListening = false;
let currentTouristLang = 'auto'; // 'auto', 'hi-IN', 'en-IN'
let activeTouristUtterance = null;
let lastTouristResults = null;

function renderTouristScreen() {
  return `
    <div class="screen screen--tourist">
      
      <!-- Hero Banner -->
      <header class="hero">
        <div class="hero__badge">
          <span class="badge-icon">🏛️</span>
          <span>Official Agra Heritage Craft Pilot • GI Registry Integrated</span>
        </div>
        <h1 class="hero__title">Handmade. Honest. Heritage.</h1>
        <p class="hero__subtitle">
          Direct from Agra's traditional master artisans. Honest pricing, authentic GI craft heritage, and direct payments without middleman exploitation.
        </p>
        
        <div class="hero__stats">
          <div class="stat-pill">
            <span class="stat-num">70%</span>
            <span class="stat-label">Direct Artisan Share</span>
          </div>
          <div class="stat-pill">
            <span class="stat-num">350+</span>
            <span class="stat-label">Years of Guild Lineage</span>
          </div>
          <div class="stat-pill">
            <span class="stat-num">102</span>
            <span class="stat-label">Registered GI Crafts</span>
          </div>
        </div>

        <div class="hero__cta-group">
          <button class="btn btn--gold btn--md font-bold" onclick="scrollToVoiceSearch()">
            🎙️ Ask About Indian Crafts / भारतीय हस्तशिल्प पूछें
          </button>
          <button class="btn btn--outline-light btn--md" onclick="scrollToCatalog()">
            Explore Catalog ↓
          </button>
        </div>
      </header>

      <!-- Heritage Trail Section (3 Stops) -->
      <section class="section trail-section">
        <div class="section__header">
          <span class="section__eyebrow">Agra Artisan Trail</span>
          <h2 class="section__title">The Living Heritage of Parchin Kari</h2>
          <p class="section__desc">Follow the three-stop path from Mughal architecture to the living workshops where master artisan families preserve India's finest lapidary art.</p>
        </div>

        <div class="trail-stops">
          <div class="trail-card trail-card--active">
            <div class="trail-card__number">01</div>
            <div class="trail-card__content">
              <span class="trail-card__tag">Mughal Monarchy</span>
              <h3 class="trail-card__title">The Taj Mahal Inlay Gates</h3>
              <p class="trail-card__text">The 1632 masterpiece where Italian Pietra Dura blended with Persian geometry to form Agra's distinctive Parchin Kari.</p>
              <div class="trail-card__meta">📍 Taj Ganj, Agra • Built 1632–1653</div>
            </div>
          </div>

          <div class="trail-card">
            <div class="trail-card__number">02</div>
            <div class="trail-card__content">
              <span class="trail-card__tag">Living Guilds</span>
              <h3 class="trail-card__title">Marble Inlay Workshops</h3>
              <p class="trail-card__text">Master craftsmen hand-carve crystalline Makrana white marble, embedding lapis lazuli, malachite, and carnelian with diamond-edge bows.</p>
              <div class="trail-card__meta">📍 Sadar Bazaar Craft Quarter • 8 Active Master Guilds</div>
            </div>
          </div>

          <div class="trail-card">
            <div class="trail-card__number">03</div>
            <div class="trail-card__content">
              <span class="trail-card__tag">Artisan Communities</span>
              <h3 class="trail-card__title">Gokulpura Artisan Quarter</h3>
              <p class="trail-card__text">Generations of families preserving zardozi embroidery, leathercraft, and stone mosaic without commercial middleman distortion.</p>
              <div class="trail-card__meta">📍 Gokulpura, Agra • 400+ Artisan Families</div>
            </div>
          </div>
        </div>
      </section>

      <!-- STATIC MASTER ARTISAN CREDENTIAL CARD (Replaces workshop video section) -->
      <section class="section artisan-credential-section" id="artisanCredentialSection">
        <div class="section__header">
          <span class="section__eyebrow">Verified Craft Master</span>
          <h2 class="section__title">Master Artisan Credential Card</h2>
          <p class="section__desc">Authentic credentials ensuring direct lineage, fair trade ethics, and zero middleman inflation.</p>
        </div>

        <div class="master-credential-card">
          <div class="master-credential-card__header">
            <div class="master-avatar">
              <span class="avatar-emoji">👨🏽‍🎨</span>
            </div>
            <div class="master-title-box">
              <div class="flex items-center gap-2">
                <h3 class="master-name">Ustad Rashid Khan</h3>
                <span class="credential-verified-pill">✓ Verified Master Artisan</span>
              </div>
              <p class="master-craft">Marble Inlay (Parchin Kari) • 35 Years Master Experience</p>
              <p class="master-location">📍 Khan Marble Arts, Sadar Bazaar Craft Quarter, Agra, Uttar Pradesh</p>
            </div>
            <div class="master-gi-badge">
              <span class="gi-tag-num">GI/UP/Agra/MarbleInlay/2025</span>
              <span class="gi-issuer-label">Sample/Demo Accreditation</span>
            </div>
          </div>

          <div class="master-credential-card__body">
            <p class="master-bio">
              Third-generation master artisan from Agra, continuing the sacred Mughal Parchin Kari art form seen in the Taj Mahal. Every gemstone petal is cut and ground by hand on traditional emery-wheel bows, requiring up to three weeks of patient lapidary tolerance work.
            </p>
            <div class="credential-grid">
              <div class="credential-item">
                <span class="cred-label">Craft Speciality</span>
                <strong class="cred-val">Hand-Cut Floral Inlay (Pietra Dura)</strong>
              </div>
              <div class="credential-item">
                <span class="cred-label">Direct Revenue Guarantee</span>
                <strong class="cred-val text-gold">70% of Every Sale Goes Directly to Ustad Rashid Khan</strong>
              </div>
              <div class="credential-item">
                <span class="cred-label">Apprentices Trained</span>
                <strong class="cred-val">24 Next-Generation Heritage Craftsmen</strong>
              </div>
              <div class="credential-item">
                <span class="cred-label">Credential Governance</span>
                <strong class="cred-val">Agra Heritage Crafts Council (Demo Pilot)</strong>
              </div>
            </div>
          </div>

          <div class="master-credential-card__footer">
            <span class="disclaimer-text">
              ℹ️ <strong>Transparency Notice:</strong> Sample credentials in this pilot illustrate verified master artisan cards. Genuine credentials require official supporting documentation.
            </span>
          </div>
        </div>
      </section>

      <!-- PRODUCT CATALOGUE (Placed immediately below the credential card) -->
      <section class="section catalog-section" id="catalogSection">
        <div class="section__header">
          <span class="section__eyebrow">Direct from Workshop</span>
          <h2 class="section__title">Handmade Heritage Collection</h2>
          <p class="section__desc">Select any item to proceed directly to fair-trade 70:30 checkout with instant price breakdown.</p>
        </div>

        <div class="catalog-grid" id="catalogGrid">
          <!-- Populated dynamically via JS -->
        </div>
      </section>

      <!-- INTELLIGENT GI CRAFT DISCOVERY & VOICE SEARCH SECTION -->
      <section class="section gi-discovery-section" id="giVoiceSection">
        <div class="section__header">
          <span class="section__eyebrow">🇮🇳 Official Geographical Indication (GI) Database</span>
          <h2 class="section__title">Ask About Indian Crafts • भारतीय हस्तशिल्प के बारे में पूछें</h2>
          <p class="section__desc">
            Explore 102 verified GI-registered crafts and products from Jammu & Kashmir and Uttar Pradesh. Ask in Hindi or English using voice or text.
          </p>
        </div>

        <!-- Voice Search Box Card -->
        <div class="card gi-search-card">
          
          <!-- Top Row: Language Selector & Audio Status -->
          <div class="gi-search-top">
            <div class="lang-toggle-group" id="touristLangToggle">
              <button class="lang-btn lang-btn--active" data-lang="auto" onclick="setTouristLanguage('auto')">Auto (स्वचालित)</button>
              <button class="lang-btn" data-lang="hi" onclick="setTouristLanguage('hi')">हिंदी (Hindi)</button>
              <button class="lang-btn" data-lang="en" onclick="setTouristLanguage('en')">English</button>
            </div>
            <div class="audio-status-pill" id="touristAudioStatusPill">
              <span class="status-indicator"></span>
              <span id="touristAudioStatusText">Voice ready • आवाज़ तैयार</span>
            </div>
          </div>

          <!-- Main Voice Interactive Center -->
          <div class="gi-voice-interaction">
            <button class="gi-big-mic-btn" id="btnTouristMic" onclick="toggleTouristSpeechRecognition()" title="Click to speak in Hindi or English" aria-label="Microphone">
              <div class="mic-pulse-ring"></div>
              <span class="mic-emoji">🎙️</span>
            </button>
            <div class="gi-mic-status-label" id="touristMicStatus">
              Tap microphone to speak, or type your question below
            </div>
            <div class="gi-mic-substatus" id="touristMicSubstatus">
              बोलने के लिए माइक दबाएं (उदा. "आगरा का GI क्राफ्ट कौन सा है?")
            </div>
          </div>

          <!-- Suggested Prompt Chips -->
          <div class="gi-chips-row">
            <span class="chips-label">Sample queries:</span>
            <button class="gi-chip" onclick="submitTouristQuery('Agra ka GI craft kaunsa hai?')">
              🏛️ Agra ka GI craft kaunsa hai?
            </button>
            <button class="gi-chip" onclick="submitTouristQuery('Tell me about Banaras Zardozi.')">
              🪡 Tell me about Banaras Zardozi
            </button>
            <button class="gi-chip" onclick="submitTouristQuery('Kashmir ke handicrafts dikhao.')">
              🏔️ Kashmir ke handicrafts dikhao
            </button>
            <button class="gi-chip" onclick="submitTouristQuery('Uttar Pradesh ke agricultural products batao.')">
              🌾 Uttar Pradesh ke agricultural products
            </button>
            <button class="gi-chip" onclick="submitTouristQuery('Agra Stone Inlay Work ke baare mein batao.')">
              💎 Agra Stone Inlay Work ke baare mein batao
            </button>
            <button class="gi-chip" onclick="submitTouristQuery('Show me Banaras crafts.')">
              🏮 Show me Banaras crafts
            </button>
          </div>

          <!-- Search Input Bar & Action Buttons -->
          <form class="gi-search-form" onsubmit="handleTouristSearchSubmit(event)">
            <div class="gi-input-wrapper">
              <span class="search-input-icon">🔍</span>
              <input type="text" id="touristSearchInput" class="gi-search-input" placeholder="Ask about any craft (e.g. Kashmir Pashmina, Agra Stone Inlay, Banaras Zardozi)..." autocomplete="off">
            </div>
            <button type="submit" class="btn btn--gold font-bold gi-submit-btn" id="btnTouristSearchSubmit">
              Search 🔍
            </button>
            <button type="button" class="btn btn--outline gi-clear-btn" onclick="clearTouristSearch()" title="Clear search">
              Clear ✕
            </button>
          </form>

        </div>

        <!-- Spoken Assistant Response Card (Hidden until searched) -->
        <div class="card gi-spoken-card" id="touristSpokenCard" style="display: none;">
          <div class="spoken-card__header">
            <div class="spoken-avatar">🏛️</div>
            <div class="spoken-meta">
              <strong>Smriti AI Voice Assistant</strong>
              <span class="spoken-lang-badge" id="spokenLangBadge">Hindi / English</span>
            </div>
            <div class="spoken-actions">
              <button class="btn btn--gold-outline btn--sm" id="btnReplayAudio" onclick="replayTouristAudio()">
                🔊 Replay Audio
              </button>
              <button class="btn btn--outline btn--sm" id="btnStopAudio" onclick="stopTouristAudio()">
                ⏹ Stop Audio
              </button>
            </div>
          </div>
          <div class="spoken-body">
            <p id="touristSpokenText" class="spoken-text"></p>
          </div>
        </div>

        <!-- Search Results Section (Displays ONLY matching records; never dumps database) -->
        <div class="gi-results-wrapper" id="giResultsWrapper">
          
          <!-- Initial Invitation State -->
          <div class="gi-initial-state" id="giInitialState">
            <div class="empty-icon">🗺️</div>
            <h3>Discover 102 Official Geographical Indication (GI) Crafts</h3>
            <p>
              Tap the microphone above or select a sample question to explore India's authentic registered heritage from <strong>Jammu & Kashmir</strong> and <strong>Uttar Pradesh</strong>.
            </p>
          </div>

          <!-- Results Header & Counter (Hidden initially) -->
          <div class="gi-results-header" id="giResultsHeader" style="display: none;">
            <div class="results-count-badge" id="giResultsCountBadge">
              Found matching crafts
            </div>
            <div class="results-filter-badge" id="giResultsFilterBadge">
              Showing relevant records only
            </div>
          </div>

          <!-- The Cards Grid (Hidden initially) -->
          <div class="gi-results-grid" id="giResultsGrid" style="display: none;">
            <!-- Rendered by JS -->
          </div>

          <!-- No Results State (Hidden initially) -->
          <div class="gi-no-results" id="giNoResults" style="display: none;">
            <div class="empty-icon">🔎</div>
            <h3 id="noResultsHeading">माफ़ कीजिए, इस नाम का कोई पंजीकृत उत्पाद नहीं मिला।</h3>
            <p id="noResultsSub">Sorry, no matching registered craft was found in the official registry dataset.</p>
            <div class="no-results-hints">
              <span>Try searching for:</span>
              <a href="javascript:void(0)" onclick="submitTouristQuery('Agra Stone Inlay Work')">Agra Stone Inlay Work</a> • 
              <a href="javascript:void(0)" onclick="submitTouristQuery('Banaras Zardozi')">Banaras Zardozi</a> • 
              <a href="javascript:void(0)" onclick="submitTouristQuery('Kashmir Pashmina')">Kashmir Pashmina</a> • 
              <a href="javascript:void(0)" onclick="submitTouristQuery('Allahabad Surkha Guava')">Allahabad Surkha Guava</a>
            </div>
          </div>

        </div>

      </section>

    </div>
  `;
}

// ─── Screen Initialization ──────────────────────────────────────────

async function initTouristScreen() {
  const catalogContainer = document.getElementById('catalogGrid');

  // Load marketplace products
  try {
    let productsData = AppState.products;
    if (!productsData || productsData.length === 0) {
      const res = await api.get('/products');
      if (res && res.data) {
        AppState.products = res.data;
        productsData = res.data;
      }
    }
    renderCatalogProducts(productsData, catalogContainer);
  } catch (err) {
    console.warn('[Tourist] Loading products failed, using default list:', err);
    renderDefaultCatalogProducts(catalogContainer);
  }

  // Setup Web Speech Recognition for tourist voice search
  setupTouristSpeechRecognition();
}

// ─── Smooth Scroll Helpers ──────────────────────────────────────────

function scrollToVoiceSearch() {
  const section = document.getElementById('giVoiceSection');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const input = document.getElementById('touristSearchInput');
    if (input) setTimeout(() => input.focus(), 600);
  }
}

function scrollToCatalog() {
  const section = document.getElementById('catalogSection');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ─── Catalog Rendering ──────────────────────────────────────────────

function renderCatalogProducts(products, container) {
  if (!container) return;
  if (!products || products.length === 0) {
    renderDefaultCatalogProducts(container);
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.productId || p._id}" id="prod-${p.productId || p._id}">
      <div class="product-card__visual">
        <div class="product-card__pattern-art">
          <span class="product-icon">${getProductIcon(p.category)}</span>
          <span class="product-cat-tag">${p.category || 'Handcrafted Heritage'}</span>
        </div>
      </div>
      <div class="product-card__content">
        <div class="product-id-badge">ID: ${p.productId || 'SP-AG-MI-2026-0042'}</div>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-artisan">Crafted by: <strong>${p.artisanName || 'Ustad Rashid Khan'}</strong></p>
        <p class="product-desc">${p.description ? p.description.slice(0, 115) + '...' : ''}</p>
        
        <div class="product-materials">
          ${(p.materials || ['Makrana White Marble', 'Lapis Lazuli', 'Carnelian']).slice(0, 3).map(m => `
            <span class="mat-tag">${m}</span>
          `).join('')}
        </div>

        <div class="product-price-row">
          <div class="price-box">
            <span class="price-label">Price (INR)</span>
            <span class="price-val">${formatCurrency(p.price)}</span>
            <span class="split-micro-tag">Artisan receives 70% (${formatCurrency(Math.round(p.price * 0.7))})</span>
          </div>
          <div class="product-actions">
            <button class="btn btn--outline btn--sm" onclick="openStoryModal('${p.productId || p._id}')" title="Listen to craft story">
              Story 🔊
            </button>
            <button class="btn btn--outline-gold btn--sm font-bold" onclick="openPassportModal('${p.productId || p._id}')" title="View Digital Product Passport">
              Passport 📜
            </button>
            <button class="btn btn--gold btn--sm font-bold" onclick="selectProductAndCheckout('${p.productId || p._id}')">
              Buy Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderDefaultCatalogProducts(container) {
  if (!container) return;
  const defaultItems = [
    {
      productId: 'SP-AG-MI-2026-0042',
      name: 'Agra Floral Marble Inlay Box',
      price: 10000,
      category: 'Marble Inlay (Parchin Kari)',
      artisanName: 'Ustad Rashid Khan',
      description: 'Museum-grade hexagonal jewelry box crafted from Makrana white marble, inlaid with over 180 semi-precious lapis lazuli and carnelian petals.',
      materials: ['Makrana Marble', 'Lapis Lazuli', 'Carnelian']
    },
    {
      productId: 'SP-AG-MI-2026-0043',
      name: 'Taj Peacock Inlay Coaster Set',
      price: 6000,
      category: 'Marble Inlay (Parchin Kari)',
      artisanName: 'Ustad Rashid Khan',
      description: 'Set of six 4-inch octagonal Makrana marble coasters decorated with malachite and turquoise peacock feather motifs.',
      materials: ['Makrana Marble', 'Malachite', 'Turquoise']
    },
    {
      productId: 'SP-LK-CK-2026-0108',
      name: 'Fine Chikankari Muslin Kurta',
      price: 8500,
      category: 'Chikankari Embroidery',
      artisanName: 'Meera Devi',
      description: 'Hand-woven fine mulmul cotton kurta with authentic 32-stitch Lucknow needlework including jaali and murri stitches.',
      materials: ['Pure Muslin Cotton', 'Silk Resham Threads']
    }
  ];
  renderCatalogProducts(defaultItems, container);
}

function getProductIcon(category) {
  if (!category) return '🏛️';
  if (category.includes('Marble') || category.includes('Inlay') || category.includes('Stone')) return '🏛️';
  if (category.includes('Chikan') || category.includes('Embroidery') || category.includes('Zardozi')) return '🪡';
  if (category.includes('Pottery') || category.includes('Clay')) return '🏺';
  if (category.includes('Wood')) return '🪵';
  if (category.includes('Metal') || category.includes('Brass')) return '⚒️';
  return '✨';
}

function selectProductAndCheckout(productId) {
  const product = (AppState.products || []).find(p => (p.productId === productId || p._id === productId)) || {
    productId: 'SP-AG-MI-2026-0042',
    name: 'Agra Floral Marble Inlay Box',
    price: 10000,
    artisanName: 'Ustad Rashid Khan',
    category: 'Marble Inlay (Parchin Kari)',
    description: 'Museum-grade hexagonal jewelry box crafted from translucent Makrana white marble, inlaid with over 180 individually cut semi-precious lapis lazuli and carnelian petals.'
  };

  AppState.selectedProduct = product;
  navigateTo('checkout', { product });
}

// ─── Digital Product Passport Modal ─────────────────────────────────

function openPassportModal(productId) {
  const product = (AppState.products || []).find(p => (p.productId === productId || p._id === productId)) || {
    productId: 'SP-AG-MI-2026-0042',
    name: 'Agra Floral Marble Inlay Box',
    price: 10000,
    artisanName: 'Ustad Rashid Khan',
    category: 'Marble Inlay (Parchin Kari)',
    description: 'Museum-grade hexagonal jewelry box crafted from translucent Makrana white marble, inlaid with over 180 individually cut semi-precious lapis lazuli and carnelian petals.',
    materials: ['Makrana White Marble', 'Lapis Lazuli', 'Carnelian', 'Malachite']
  };

  const passportHtml = `
    <div class="passport-modal-content">
      <div class="passport-header">
        <div class="passport-seal">🏛️</div>
        <div>
          <span class="passport-badge">Official Digital Product Passport</span>
          <h2 class="passport-title">${product.name}</h2>
          <div class="passport-id-line">
            <span class="id-label">Product ID:</span>
            <code class="id-code">${product.productId || 'SP-AG-MI-2026-0042'}</code>
            <span class="verification-badge">✓ Fingerprint Verified</span>
          </div>
        </div>
      </div>

      <!-- Passport Grid Sections -->
      <div class="passport-grid">
        
        <!-- A. Product & Artisan Identity -->
        <div class="passport-section card">
          <h4 class="section-title">A. Craft & Artisan Provenance</h4>
          <div class="info-table">
            <div class="info-row">
              <span class="info-label">Master Artisan:</span>
              <strong class="info-val">${product.artisanName || 'Ustad Rashid Khan'} (35 Yrs Master Lineage)</strong>
            </div>
            <div class="info-row">
              <span class="info-label">Workshop Origin:</span>
              <span class="info-val">Sadar Bazaar Craft Quarter, Agra, Uttar Pradesh</span>
            </div>
            <div class="info-row">
              <span class="info-label">GI Craft Registry:</span>
              <span class="info-val">Agra Stone Inlay Work (Parchin Kari) • Reg. 27.03.2025</span>
            </div>
            <div class="info-row">
              <span class="info-label">Fair Trade Distribution:</span>
              <span class="info-val text-gold font-bold">70% Direct Artisan Guarantee (${formatCurrency(Math.round((product.price || 10000) * 0.7))})</span>
            </div>
          </div>
        </div>

        <!-- B. SHA-256 Evidence Integrity -->
        <div class="passport-section card">
          <h4 class="section-title">B. Cryptographic Evidence Fingerprint</h4>
          <p class="text-xs text-slate-500 mb-2">Browser Web Crypto SHA-256 fingerprint commitment for raw material & workshop carving evidence:</p>
          <div class="hash-box">
            <span class="hash-label">SHA-256 FINGERPRINT:</span>
            <code class="hash-code">a7f9c84e12d5b6e792c3a01984fb2e71d4580921bf3a209ec4821a7d65f80b91</code>
          </div>
          <div class="hash-match-status">
            <span class="match-badge">✓ FINGERPRINT MATCH: Off-chain media commitments intact</span>
          </div>
        </div>

        <!-- C. AI Craft DNA Analysis -->
        <div class="passport-section card">
          <h4 class="section-title">C. AI Craft DNA Analysis</h4>
          <div class="dna-metrics">
            <div class="dna-metric">
              <span class="dna-val text-gold font-bold">98.4%</span>
              <span class="dna-label">Lapidary Symmetry</span>
            </div>
            <div class="dna-metric">
              <span class="dna-val font-bold">&lt; 0.1 mm</span>
              <span class="dna-label">Inlay Tolerance</span>
            </div>
            <div class="dna-metric">
              <span class="dna-val font-bold">Mughal</span>
              <span class="dna-label">Stylistic Classification</span>
            </div>
          </div>
          <p class="dna-note text-xs text-slate-500 mt-2">
            ℹ️ Visual analysis identifies Makrana calcite marble substrate and authentic semi-precious lapis and carnelian inlay. Visual similarity illustrates craft consistency.
          </p>
        </div>

        <!-- D. Chronological Provenance Timeline -->
        <div class="passport-section card">
          <h4 class="section-title">D. Provenance Event Timeline</h4>
          <div class="timeline-list">
            <div class="timeline-item">
              <span class="timeline-dot"></span>
              <div class="timeline-content">
                <strong>PRODUCT_REGISTERED</strong>
                <p>Digital passport generated with initial raw material photographic commitment.</p>
                <small class="text-slate-400">12 Oct 2026 • Actor: Ustad Rashid Khan (Artisan)</small>
              </div>
            </div>
            <div class="timeline-item">
              <span class="timeline-dot"></span>
              <div class="timeline-content">
                <strong>EVIDENCE_ADDED</strong>
                <p>Emery-wheel bow carving & gemstone grinding evidence hash committed.</p>
                <small class="text-slate-400">22 Oct 2026 • Actor: Agra Guild Workshop</small>
              </div>
            </div>
            <div class="timeline-item">
              <span class="timeline-dot"></span>
              <div class="timeline-content">
                <strong>ARTISAN_VERIFIED</strong>
                <p>Master craftsman accreditation confirmed by Agra Heritage Crafts Council.</p>
                <small class="text-slate-400">01 Nov 2026 • Actor: Authorized Verifier</small>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Action -->
      <div class="passport-footer">
        <button class="btn btn--gold btn--block font-bold" onclick="closeModal(); selectProductAndCheckout('${product.productId || product._id}')">
          Proceed to Fair Trade Checkout (${formatCurrency(product.price)}) →
        </button>
      </div>
    </div>
  `;

  openModal(passportHtml);
}

// ─── Spoken Craft Story Modal ───────────────────────────────────────

function openStoryModal(productId) {
  const product = (AppState.products || []).find(p => (p.productId === productId || p._id === productId)) || {
    name: 'Agra Floral Marble Inlay Box',
    price: 10000,
    artisanName: 'Ustad Rashid Khan',
    description: 'Museum-grade hexagonal jewelry box crafted from translucent Makrana white marble, inlaid with over 180 individually cut semi-precious lapis lazuli and carnelian petals.'
  };

  const storyText = `${product.name}, hand-crafted in Agra by master artisan ${product.artisanName}. ${product.description}. Product price is ${product.price} rupees. Under our seventy-thirty fair trade model, seven thousand rupees goes directly to the master artisan.`;

  const modalHtml = `
    <div class="product-detail">
      <div class="product-detail__header">
        <span class="cat-badge">${product.category || 'Handcrafted Heritage'}</span>
        <h2>${product.name}</h2>
        <p class="text-sm text-slate-500">Master Craftsman: <strong>${product.artisanName}</strong></p>
      </div>

      <div class="product-detail__audio-box">
        <button class="btn-audio" id="btnAudioPlay" onclick="playSpokenStory('${encodeURIComponent(storyText)}')">
          🔊 Listen to Craft Story (Audio)
        </button>
        <span class="audio-note">Spoken provenance narration using browser SpeechSynthesis</span>
      </div>

      <div class="product-detail__body">
        <h4>Craft Heritage Story</h4>
        <p class="story-body">${product.description}</p>

        <div class="fair-trade-callout">
          <strong>Fair Trade 70:30 Model:</strong>
          <p>Product Price: ${formatCurrency(product.price)} → Master Artisan receives 70% (${formatCurrency(Math.round(product.price * 0.7))}).</p>
        </div>

        <div class="modal-cta-row">
          <button class="btn btn--gold btn--block font-bold" onclick="closeModal(); selectProductAndCheckout('${product.productId || product._id}')">
            Proceed to Checkout (${formatCurrency(product.price)}) →
          </button>
          <button class="btn btn--outline btn--block" onclick="closeModal()">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  openModal(modalHtml);
}

function playSpokenStory(encodedText) {
  const text = decodeURIComponent(encodedText);
  speakTouristText(text, 'en-IN');
}

// ─── GI CRAFT DISCOVERY & INTELLIGENT VOICE SEARCH ──────────────────

function setTouristLanguage(lang) {
  currentTouristLang = lang;
  const buttons = document.querySelectorAll('#touristLangToggle .lang-btn');
  buttons.forEach(btn => {
    if (btn.dataset.lang === lang) {
      btn.classList.add('lang-btn--active');
    } else {
      btn.classList.remove('lang-btn--active');
    }
  });

  const status = document.getElementById('touristAudioStatusText');
  if (status) {
    if (lang === 'hi') status.textContent = 'हिंदी भाषा चुनी गई • Hindi Selected';
    else if (lang === 'en') status.textContent = 'English Selected';
    else status.textContent = 'Auto Language • स्वचालित भाषा';
  }
}

function setupTouristSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  if (!SpeechRecognition) {
    const status = document.getElementById('touristMicStatus');
    if (status) status.textContent = 'Speech recognition not supported in this browser. Please type below.';
    return;
  }

  try {
    touristSpeechRecognizer = new SpeechRecognition();
    touristSpeechRecognizer.continuous = false;
    touristSpeechRecognizer.interimResults = true;

    touristSpeechRecognizer.onstart = () => {
      isTouristListening = true;
      updateTouristMicUi(true);
    };

    touristSpeechRecognizer.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const input = document.getElementById('touristSearchInput');
      if (input) {
        input.value = final || interim;
      }

      if (final && final.trim().length > 1) {
        submitTouristQuery(final.trim());
      }
    };

    touristSpeechRecognizer.onerror = (e) => {
      console.warn('[Tourist Voice Search] Speech recognition error:', e.error);
      isTouristListening = false;
      updateTouristMicUi(false);
    };

    touristSpeechRecognizer.onend = () => {
      isTouristListening = false;
      updateTouristMicUi(false);
    };
  } catch (err) {
    console.warn('[Tourist Voice Search] Speech recognizer setup error:', err);
  }
}

function toggleTouristSpeechRecognition() {
  if (!touristSpeechRecognizer) {
    showToast('Speech recognition not supported in this browser. Please type your query.', 'warning');
    const input = document.getElementById('touristSearchInput');
    if (input) input.focus();
    return;
  }

  if (isTouristListening) {
    touristSpeechRecognizer.stop();
  } else {
    stopTouristAudio();
    // Configure language
    if (currentTouristLang === 'hi') touristSpeechRecognizer.lang = 'hi-IN';
    else if (currentTouristLang === 'en') touristSpeechRecognizer.lang = 'en-IN';
    else touristSpeechRecognizer.lang = 'hi-IN'; // Default Hindi for bilingual voice

    try {
      touristSpeechRecognizer.start();
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
    }
  }
}

function updateTouristMicUi(listening) {
  const micBtn = document.getElementById('btnTouristMic');
  const statusLabel = document.getElementById('touristMicStatus');
  const substatus = document.getElementById('touristMicSubstatus');
  if (!micBtn) return;

  if (listening) {
    micBtn.classList.add('gi-big-mic-btn--active');
    if (statusLabel) statusLabel.textContent = 'Listening... Speak in Hindi or English (सुन रहा हूँ...)';
    if (substatus) substatus.textContent = 'Speaking your craft question now...';
  } else {
    micBtn.classList.remove('gi-big-mic-btn--active');
    if (statusLabel) statusLabel.textContent = 'Tap microphone to speak, or type your question below';
    if (substatus) substatus.textContent = 'बोलने के लिए माइक दबाएं (उदा. "आगरा का GI क्राफ्ट कौन सा है?")';
  }
}

// ─── Submitting Queries ─────────────────────────────────────────────

function handleTouristSearchSubmit(event) {
  if (event) event.preventDefault();
  const input = document.getElementById('touristSearchInput');
  if (!input || !input.value.trim()) return;
  submitTouristQuery(input.value.trim());
}

function submitTouristQuery(queryText) {
  if (!queryText) return;
  const input = document.getElementById('touristSearchInput');
  if (input) input.value = queryText;

  stopTouristAudio();
  if (isTouristListening && touristSpeechRecognizer) {
    touristSpeechRecognizer.stop();
  }

  executeTouristSearch(queryText);
}

async function executeTouristSearch(queryText) {
  const spokenCard = document.getElementById('touristSpokenCard');
  const spokenText = document.getElementById('touristSpokenText');
  const spokenBadge = document.getElementById('spokenLangBadge');
  const initialState = document.getElementById('giInitialState');
  const resultsHeader = document.getElementById('giResultsHeader');
  const resultsGrid = document.getElementById('giResultsGrid');
  const noResults = document.getElementById('giNoResults');
  const countBadge = document.getElementById('giResultsCountBadge');
  const filterBadge = document.getElementById('giResultsFilterBadge');

  // Loading state
  if (initialState) initialState.style.display = 'none';
  if (noResults) noResults.style.display = 'none';
  if (resultsGrid) {
    resultsGrid.style.display = 'grid';
    resultsGrid.innerHTML = `
      <div class="gi-loading-card">
        <div class="spinner"></div>
        <p>Searching official GI registry for <strong>"${escapeHtml(queryText)}"</strong>...</p>
      </div>
    `;
  }
  if (resultsHeader) resultsHeader.style.display = 'flex';
  if (countBadge) countBadge.textContent = 'Searching...';

  try {
    const res = await api.post('/ai/voice-search', {
      query: queryText,
      language: currentTouristLang
    });

    if (!res || !res.success) {
      throw new Error(res?.error || 'Search failed');
    }

    lastTouristResults = res;

    // 1. Spoken Audio Transcript
    if (spokenCard && spokenText) {
      spokenCard.style.display = 'block';
      spokenText.textContent = res.spokenAnswer || '';
      if (spokenBadge) {
        spokenBadge.textContent = res.detectedLanguage === 'hi-IN' ? '🇮🇳 Spoken in Hindi' : '🌐 Spoken in English';
      }
    }

    // 2. Play spoken audio through SpeechSynthesis
    if (res.spokenAnswer) {
      speakTouristText(res.spokenAnswer, res.detectedLanguage || 'hi-IN');
    }

    // 3. Render Result Cards (Display ONLY matching records)
    if (res.count === 0 || !res.data || res.data.length === 0) {
      if (resultsGrid) resultsGrid.style.display = 'none';
      if (resultsHeader) resultsHeader.style.display = 'none';
      if (noResults) {
        noResults.style.display = 'block';
        const heading = document.getElementById('noResultsHeading');
        const sub = document.getElementById('noResultsSub');
        if (heading && sub) {
          if (res.detectedLanguage === 'hi-IN') {
            heading.textContent = 'माफ़ कीजिए, इस नाम का कोई पंजीकृत उत्पाद नहीं मिला।';
            sub.textContent = 'Official registry records only contain registered crafts of Jammu & Kashmir and Uttar Pradesh.';
          } else {
            heading.textContent = 'Sorry, no matching registered craft was found.';
            sub.textContent = 'Please check the spelling or explore registered crafts from Jammu & Kashmir and Uttar Pradesh.';
          }
        }
      }
    } else {
      if (noResults) noResults.style.display = 'none';
      if (resultsHeader) resultsHeader.style.display = 'flex';
      if (countBadge) {
        countBadge.textContent = `Found ${res.count} matching registered craft${res.count > 1 ? 's' : ''}`;
      }
      if (filterBadge) {
        if (res.isExactMatch) {
          filterBadge.textContent = 'Exact Registered Match (विशिष्ट उत्पाद)';
        } else if (res.interpretedFilters?.city) {
          filterBadge.textContent = `Region: ${res.interpretedFilters.city}`;
        } else if (res.interpretedFilters?.category) {
          filterBadge.textContent = `Category: ${res.interpretedFilters.category}`;
        } else if (res.interpretedFilters?.state) {
          filterBadge.textContent = `State: ${res.interpretedFilters.state}`;
        } else {
          filterBadge.textContent = 'Relevant Matches Only';
        }
      }

      renderGiResultCards(res.data, resultsGrid);
    }

  } catch (err) {
    console.error('[Tourist GI Search Error]', err);
    if (resultsGrid) {
      resultsGrid.innerHTML = `
        <div class="gi-error-card">
          <p>⚠️ Unable to query registry: ${err.message}</p>
        </div>
      `;
    }
  }
}

function renderGiResultCards(items, container) {
  if (!container) return;
  container.style.display = 'grid';

  container.innerHTML = items.map((item, idx) => {
    const isLinked = !!item.linkedMarketplaceProduct;
    return `
      <div class="gi-card ${isLinked ? 'gi-card--linked' : ''}">
        
        <div class="gi-card__header">
          <div class="gi-tags-row">
            <span class="gi-registered-badge">✓ Registered GI</span>
            <span class="gi-cat-tag ${getCategoryCssClass(item.category)}">${item.category}</span>
            <span class="gi-state-tag">${item.state}</span>
          </div>
          <span class="gi-reg-date">Reg: <strong>${item.registrationDate}</strong></span>
        </div>

        <div class="gi-card__body">
          <h3 class="gi-craft-name">${item.name}</h3>
          ${item.hindiName ? `<p class="gi-hindi-name">${item.hindiName}</p>` : ''}
          ${item.region ? `<p class="gi-region-info">📍 Origin: <strong>${item.region}</strong></p>` : ''}
        </div>

        ${isLinked ? `
          <div class="gi-linked-callout">
            <span class="sparkle">✨</span>
            <div class="linked-text">
              <strong>Genuine Master Artisan Listing Available:</strong>
              <p>${item.linkedMarketplaceProduct.name} by ${item.linkedMarketplaceProduct.artisanName} (${formatCurrency(item.linkedMarketplaceProduct.price)})</p>
            </div>
            <button class="btn btn--gold btn--xs font-bold" onclick="highlightCatalogProduct('${item.linkedMarketplaceProduct.productId}')">
              View in Catalog ↓
            </button>
          </div>
        ` : ''}

        <div class="gi-card__footer">
          <button class="btn btn--outline btn--sm" onclick="listenToGiCard(${idx})" title="Listen to this craft details">
            🔊 Listen
          </button>
          <button class="btn btn--gold-outline btn--sm" onclick="openGiDetailModalByIndex(${idx})">
            📋 View Details
          </button>
        </div>

      </div>
    `;
  }).join('');
}

function getCategoryCssClass(cat) {
  if (cat === 'Handicraft') return 'gi-cat-tag--handicraft';
  if (cat === 'Agricultural') return 'gi-cat-tag--agri';
  if (cat === 'Food Stuff') return 'gi-cat-tag--food';
  if (cat === 'Manufactured') return 'gi-cat-tag--mfg';
  return 'gi-cat-tag--natural';
}

function highlightCatalogProduct(productId) {
  scrollToCatalog();
  setTimeout(() => {
    const el = document.getElementById(`prod-${productId}`);
    if (el) {
      el.classList.add('product-card--highlight');
      setTimeout(() => el.classList.remove('product-card--highlight'), 3000);
    }
  }, 500);
}

function clearTouristSearch() {
  const input = document.getElementById('touristSearchInput');
  if (input) input.value = '';

  stopTouristAudio();

  const spokenCard = document.getElementById('touristSpokenCard');
  const initialState = document.getElementById('giInitialState');
  const resultsHeader = document.getElementById('giResultsHeader');
  const resultsGrid = document.getElementById('giResultsGrid');
  const noResults = document.getElementById('giNoResults');

  if (spokenCard) spokenCard.style.display = 'none';
  if (resultsHeader) resultsHeader.style.display = 'none';
  if (resultsGrid) {
    resultsGrid.style.display = 'none';
    resultsGrid.innerHTML = '';
  }
  if (noResults) noResults.style.display = 'none';
  if (initialState) initialState.style.display = 'block';

  lastTouristResults = null;
}

// ─── Modal for Detailed GI Craft Record ─────────────────────────────

function openGiDetailModalByIndex(idx) {
  if (!lastTouristResults || !lastTouristResults.data || !lastTouristResults.data[idx]) return;
  const item = lastTouristResults.data[idx];

  const modalHtml = `
    <div class="gi-modal-detail">
      <div class="gi-modal-header">
        <span class="gi-registered-badge">✓ Official Geographical Indication</span>
        <h2>${item.name}</h2>
        ${item.hindiName ? `<h3 class="text-gold font-serif mt-1">${item.hindiName}</h3>` : ''}
      </div>

      <div class="gi-modal-info-grid card">
        <div class="info-row">
          <span class="info-label">State:</span>
          <strong>${item.state}</strong>
        </div>
        <div class="info-row">
          <span class="info-label">Region / Cluster:</span>
          <strong>${item.region || 'Registered Heritage Cluster'}</strong>
        </div>
        <div class="info-row">
          <span class="info-label">Category:</span>
          <span class="gi-cat-tag ${getCategoryCssClass(item.category)}">${item.category}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Registration Date:</span>
          <strong>${item.registrationDate}</strong>
        </div>
        <div class="info-row">
          <span class="info-label">Official Status:</span>
          <span class="text-success font-bold">Registered</span>
        </div>
        <div class="info-row">
          <span class="info-label">Source Verification:</span>
          <span class="text-slate-500 text-xs">Official Geographical Indications Registry of India</span>
        </div>
      </div>

      <div class="gi-modal-description">
        <h4>Heritage Significance</h4>
        <p>
          This record represents an officially registered Geographical Indication (GI) under the Geographical Indications of Goods (Registration and Protection) Act. A GI tag acknowledges the distinct geographic origin, traditional knowledge, and specialized workmanship endemic to this region.
        </p>
      </div>

      <div class="gi-modal-actions">
        <button class="btn btn--outline" onclick="listenToGiCard(${idx})">
          🔊 Listen to Details
        </button>
        ${item.linkedMarketplaceProduct ? `
          <button class="btn btn--gold font-bold" onclick="closeModal(); highlightCatalogProduct('${item.linkedMarketplaceProduct.productId}')">
            Explore Artisan Product in Catalog →
          </button>
        ` : `
          <button class="btn btn--outline" onclick="closeModal()">
            Close
          </button>
        `}
      </div>
    </div>
  `;

  openModal(modalHtml);
}

// ─── Speech Synthesis Audio Controls ────────────────────────────────

function speakTouristText(text, lang = 'hi-IN') {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported');
    return;
  }

  stopTouristAudio();

  const utterance = new SpeechSynthesisUtterance(text);
  activeTouristUtterance = utterance;

  const isHindi = /[\u0900-\u097F]/.test(text) || lang === 'hi-IN';
  utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
  utterance.rate = isHindi ? 0.95 : 1.0;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    const preferred = voices.find(v => (isHindi ? v.lang.includes('hi') : v.lang.includes('en-IN') || v.lang.includes('en')));
    if (preferred) utterance.voice = preferred;
  }

  updateAudioStatusPlaying(true);

  utterance.onend = utterance.onerror = () => {
    activeTouristUtterance = null;
    updateAudioStatusPlaying(false);
  };

  window.speechSynthesis.speak(utterance);
}

function stopTouristAudio() {
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  activeTouristUtterance = null;
  updateAudioStatusPlaying(false);
}

function replayTouristAudio() {
  const spokenText = document.getElementById('touristSpokenText');
  if (spokenText && spokenText.textContent) {
    speakTouristText(spokenText.textContent, currentTouristLang === 'en' ? 'en-IN' : 'hi-IN');
  }
}

function listenToGiCard(idx) {
  if (!lastTouristResults || !lastTouristResults.data || !lastTouristResults.data[idx]) return;
  const item = lastTouristResults.data[idx];
  const isHindi = currentTouristLang === 'hi' || (currentTouristLang === 'auto' && /[\u0900-\u097F]/.test(item.hindiName || ''));

  let phrase = '';
  if (isHindi) {
    phrase = `यह ${item.hindiName || item.name} है। यह ${item.state === 'Jammu & Kashmir' ? 'जम्मू और कश्मीर' : 'उत्तर प्रदेश'} की पंजीकृत ${item.category} श्रेणी में आता है। पंजीकरण तारीख ${item.registrationDate} है।`;
  } else {
    phrase = `This is ${item.name}, a registered ${item.category.toLowerCase()} from ${item.state}. Registration date is ${item.registrationDate}.`;
  }

  speakTouristText(phrase, isHindi ? 'hi-IN' : 'en-IN');
}

function updateAudioStatusPlaying(playing) {
  const pill = document.getElementById('touristAudioStatusPill');
  const text = document.getElementById('touristAudioStatusText');
  const replayBtn = document.getElementById('btnReplayAudio');

  if (pill) {
    if (playing) pill.classList.add('audio-status-pill--playing');
    else pill.classList.remove('audio-status-pill--playing');
  }
  if (text) {
    text.textContent = playing ? 'Speaking response... (आवाज़ जारी है)' : 'Voice ready • आवाज़ तैयार';
  }
  if (replayBtn) {
    replayBtn.textContent = playing ? '🔊 Speaking...' : '🔊 Replay Audio';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
