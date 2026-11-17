/**
 * tourist.js — Screen 1: Tourist Experience for Smriti Pass
 * Features:
 * - Agra heritage trail (Taj Mahal -> Sadar Bazaar -> Gokulpura)
 * - Static Master Artisan Credential Card (replacing any video sections)
 * - Lightweight product catalogue immediately below the credential card
 * - Dynamic "Buy Now" carrying selected product directly into Screen 2 Checkout
 * - Spoken provenance narration using browser SpeechSynthesis
 */

function renderTouristScreen() {
  return `
    <div class="screen screen--tourist">
      <!-- Hero Banner -->
      <header class="hero">
        <div class="hero__badge">
          <span class="badge-icon">🏛️</span>
          <span>Official Agra Heritage Craft Pilot</span>
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
            <span class="stat-num">GI Tag</span>
            <span class="stat-label">Agra Marble Inlay</span>
          </div>
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
              <span class="gi-tag-num">GI/UP/Agra/MarbleInlay/2019</span>
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
    </div>
  `;
}

async function initTouristScreen() {
  const catalogContainer = document.getElementById('catalogGrid');

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
}

function renderCatalogProducts(products, container) {
  if (!container) return;
  if (!products || products.length === 0) {
    renderDefaultCatalogProducts(container);
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.productId || p._id}">
      <div class="product-card__visual">
        <div class="product-card__pattern-art">
          <span class="product-icon">${getProductIcon(p.category)}</span>
          <span class="product-cat-tag">${p.category || 'Handcrafted Heritage'}</span>
        </div>
      </div>
      <div class="product-card__content">
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
            <button class="btn btn--outline btn--sm" onclick="openStoryModal('${p.productId || p._id}')">
              Story 🔊
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
  if (category.includes('Marble')) return '🏛️';
  if (category.includes('Chikan') || category.includes('Embroidery')) return '🪡';
  if (category.includes('Pottery')) return '🏺';
  return '✨';
}

/** Product Selection Handler — carries chosen product into Screen 2 Checkout */
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

/** Spoken Story Modal */
function openStoryModal(productId) {
  const product = (AppState.products || []).find(p => (p.productId === productId || p._id === productId)) || {
    name: 'Agra Floral Marble Inlay Box',
    price: 10000,
    artisanName: 'Ustad Rashid Khan',
    description: 'Museum-grade hexagonal jewelry box crafted from translucent Makrana white marble, inlaid with over 180 individually cut semi-precious lapis lazuli and carnelian petals.'
  };

  const storyText = `${product.name}, hand-crafted in Agra by ${product.artisanName}. ${product.description}. Product price is ${product.price} rupees. With our seventy-thirty fair trade model, seven thousand rupees goes directly to the master artisan.`;

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
  if (!('speechSynthesis' in window)) {
    showToast('Speech synthesis not supported in this browser.', 'warning');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  utterance.rate = 0.95;

  const btn = document.getElementById('btnAudioPlay');
  if (btn) {
    btn.innerText = '⏸️ Narrating Craft Story...';
    btn.disabled = true;
  }

  utterance.onend = utterance.onerror = () => {
    if (btn) {
      btn.innerText = '🔊 Listen to Craft Story (Audio)';
      btn.disabled = false;
    }
  };

  window.speechSynthesis.speak(utterance);
}
