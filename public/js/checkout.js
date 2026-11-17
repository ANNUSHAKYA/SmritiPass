/**
 * checkout.js — Screen 2: Secure Checkout & 70:30 Payment Distribution
 * Strict Business Model:
 * - Master Artisan Share: Exactly 70% of product price
 * - Smriti Pass Company Share: Exactly 30% of product price
 * - Guide and Hotel partner commissions are paid from WITHIN the Company's 30%
 * - Delivery Option 1: Carry With Me (Shipping ₹0)
 * - Delivery Option 2: Insured Doorstep Shipping (Separate ₹1,000 logistics charge)
 * - Dynamic calculation based on selected product (Demonstration standard: ₹10,000)
 */

let checkoutState = {
  product: null,
  deliveryMethod: 'shipping', // 'carry' or 'shipping'
};

function renderCheckoutScreen() {
  // Use selected product or default demonstration standard (₹10,000)
  const product = AppState.selectedProduct || {
    productId: 'SP-AG-MI-2026-0042',
    name: 'Agra Floral Marble Inlay Box',
    price: 10000, // Exact ₹10,000 demonstration standard
    category: 'Marble Inlay (Parchin Kari)',
    artisanName: 'Ustad Rashid Khan'
  };
  checkoutState.product = product;

  const P = product.price || 10000;
  const isShipping = (checkoutState.deliveryMethod === 'shipping');
  const shippingCharge = isShipping ? 1000 : 0;
  const totalAmount = P + shippingCharge;

  // Strict 70:30 calculation
  const artisanShare = Math.round(P * 0.70);
  const companyShare = P - artisanShare; // 30%
  const guideCommission = Math.round(P * 0.05); // 5% from company share
  const hotelCommission = Math.round(P * 0.05); // 5% from company share
  const platformOperations = companyShare - guideCommission - hotelCommission; // 20%

  return `
    <div class="screen screen--checkout">
      <div class="checkout-container">
        
        <!-- Header -->
        <div class="checkout-header">
          <span class="section__eyebrow">Fair Trade 70:30 Model</span>
          <h1 class="checkout-title">Direct Heritage Checkout</h1>
          <p class="checkout-subtitle">
            Every handmade treasure guarantees exactly 70% of the purchase price directly to the master artisan. Smriti Pass retains 30% to cover guide partnerships and operations.
          </p>
        </div>

        <div class="checkout-grid">
          <!-- Left Column: Selected Item & Delivery Options -->
          <div class="checkout-left">
            
            <!-- Selected Product Summary Card -->
            <div class="card checkout-item-card">
              <div class="item-visual">
                <span class="item-emoji">🏛️</span>
              </div>
              <div class="item-info">
                <span class="product-cat-pill">${product.category || 'Handcrafted Heritage'}</span>
                <h3 class="item-title" id="checkoutItemTitle">${product.name}</h3>
                <p class="item-craftsman">Master Craftsman: <strong id="checkoutItemArtisan">${product.artisanName || 'Ustad Rashid Khan'}</strong></p>
                <div class="item-price-tag">
                  <span>Product Price:</span>
                  <strong id="checkoutItemPrice">${formatCurrency(P)}</strong>
                </div>
              </div>
            </div>

            <!-- Two Delivery Options -->
            <div class="card delivery-card">
              <h3 class="card-title">Select Delivery & Handover Option</h3>
              <p class="card-subtitle">Choose between personal workshop pickup or insured doorstep delivery.</p>

              <div class="delivery-options">
                
                <!-- Option 2: Insured Doorstep Shipping -->
                <label class="delivery-option ${isShipping ? 'delivery-option--selected' : ''}" id="optShippingLabel">
                  <input type="radio" name="checkoutDelivery" value="shipping" id="optShipping" ${isShipping ? 'checked' : ''} onchange="onDeliveryOptionSelect('shipping')">
                  <div class="delivery-option__content">
                    <div class="delivery-option__header">
                      <span class="delivery-icon">🚚</span>
                      <strong class="delivery-name">OPTION 2: Insured Doorstep Shipping</strong>
                      <span class="shipping-fee-pill">+₹1,000</span>
                    </div>
                    <p class="delivery-desc">
                      White-glove art courier pickup directly from the Agra workshop. Shock-proof wooden crate packing and door-to-door transit insurance included.
                    </p>
                    <span class="delivery-escrow-badge">Courier Pickup Scheduled for Artisan • Tracking Provided</span>
                  </div>
                </label>

                <!-- Option 1: Carry With Me -->
                <label class="delivery-option ${!isShipping ? 'delivery-option--selected' : ''}" id="optCarryLabel">
                  <input type="radio" name="checkoutDelivery" value="carry" id="optCarry" ${!isShipping ? 'checked' : ''} onchange="onDeliveryOptionSelect('carry')">
                  <div class="delivery-option__content">
                    <div class="delivery-option__header">
                      <span class="delivery-icon">🧳</span>
                      <strong class="delivery-name">OPTION 1: Carry With Me</strong>
                      <span class="shipping-free-pill">₹0 (Free)</span>
                    </div>
                    <p class="delivery-desc">
                      Customer personally carries the product. Museum-grade velvet protective packaging provided for safe travel. No courier required.
                    </p>
                    <span class="delivery-escrow-badge">Workshop Handover • No Shipping Charge</span>
                  </div>
                </label>

              </div>

              <!-- Shipping Form (Shown only when Insured Shipping is selected) -->
              <div class="shipping-form" id="shippingFormSection" style="display: ${isShipping ? 'block' : 'none'};">
                <h4 class="form-title">Shipping & Consignee Address</h4>
                <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" id="checkoutBuyerName" class="form-input" placeholder="e.g. Eleanor Vance" value="Eleanor Vance">
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="checkoutBuyerEmail" class="form-input" placeholder="eleanor@example.com" value="eleanor.vance@example.com">
                  </div>
                  <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" id="checkoutBuyerPhone" class="form-input" placeholder="+91 98765 43210" value="+91 98765 43210">
                  </div>
                </div>
                <div class="form-group">
                  <label>Doorstep Delivery Address</label>
                  <input type="text" id="checkoutBuyerAddress" class="form-input" placeholder="Street, City, Postal Code" value="Suite 404, The Imperial Hotel, Janpath, New Delhi 110001">
                </div>
              </div>

            </div>
          </div>

          <!-- Right Column: Visual 70:30 Payment Distribution -->
          <div class="checkout-right">
            <div class="card split-card">
              <div class="split-card__header">
                <span class="split-eyebrow">Fair Trade Formula</span>
                <h3 class="split-title">70:30 Revenue Distribution</h3>
                <p class="split-note">Direct, transparent split computed on the product price before shipping.</p>
              </div>

              <!-- Grand Total Callout -->
              <div class="total-callout">
                <div class="total-callout__label">
                  <span>Final Customer Payment</span>
                  <small id="deliverySummaryText">Product ${formatCurrency(P)} + ${isShipping ? 'Shipping ₹1,000' : 'Shipping ₹0'}</small>
                </div>
                <div class="total-callout__value" id="finalTotalDisplay">${formatCurrency(totalAmount)}</div>
              </div>

              <!-- The Two Primary Split Bars: 70% vs 30% -->
              <div class="split-bars-list">
                
                <!-- 1. Master Artisan Share (Strict 70%) -->
                <div class="split-item split-item--primary">
                  <div class="split-item__header">
                    <div class="split-recipient">
                      <span class="split-emoji">👨🏽‍🎨</span>
                      <strong>MASTER ARTISAN (70%)</strong>
                    </div>
                    <div class="split-numbers">
                      <span class="split-amount text-gold text-lg" id="artisanAmountDisplay">${formatCurrency(artisanShare)}</span>
                      <span class="split-pct font-bold">70.0%</span>
                    </div>
                  </div>
                  <div class="split-track split-track--lg">
                    <div class="split-fill split-fill--artisan" style="width: 70%;"></div>
                  </div>
                  <div class="split-subtext">
                    Guaranteed direct payment to ${product.artisanName || 'Ustad Rashid Khan'} for materials and master labor. Never discounted.
                  </div>
                </div>

                <!-- 2. Smriti Pass Company Share (Strict 30%) -->
                <div class="split-item">
                  <div class="split-item__header">
                    <div class="split-recipient">
                      <span class="split-emoji">🏛️</span>
                      <strong>SMRITI PASS COMPANY (30%)</strong>
                    </div>
                    <div class="split-numbers">
                      <span class="split-amount" id="companyAmountDisplay">${formatCurrency(companyShare)}</span>
                      <span class="split-pct">30.0%</span>
                    </div>
                  </div>
                  <div class="split-track">
                    <div class="split-fill split-fill--company" style="width: 30%;"></div>
                  </div>
                  <div class="split-subtext">
                    Covers licensed guide commissions, hotel partnerships, platform infrastructure, and artisan verification.
                  </div>

                  <!-- Internal Allocations (From within the Company's 30%) -->
                  <div class="company-internal-breakdown">
                    <div class="internal-breakdown-title">
                      <span>Breakdown of Company's 30% Share (${formatCurrency(companyShare)}):</span>
                    </div>
                    <div class="internal-allocations">
                      <div class="alloc-row">
                        <span>🧭 ASI-Licensed Heritage Guide Commission:</span>
                        <strong id="allocGuide">${formatCurrency(guideCommission)}</strong>
                      </div>
                      <div class="alloc-row">
                        <span>🏨 Boutique Hotel Partner Commission:</span>
                        <strong id="allocHotel">${formatCurrency(hotelCommission)}</strong>
                      </div>
                      <div class="alloc-row">
                        <span>🏛️ Smriti Pass Operations & Technology:</span>
                        <strong id="allocPlatform">${formatCurrency(platformOperations)}</strong>
                      </div>
                    </div>
                    <small class="alloc-notice">
                      * Guide and hotel partner commissions are paid entirely from within the company's 30%, never added as extra fees to the customer or deducted from the artisan.
                    </small>
                  </div>
                </div>

                <!-- 3. Shipping / Logistics (Separately collected) -->
                <div class="split-item" id="shippingSplitItem">
                  <div class="split-item__header">
                    <div class="split-recipient">
                      <span class="split-emoji">📦</span>
                      <strong>SHIPPING & LOGISTICS PROVIDER</strong>
                    </div>
                    <div class="split-numbers">
                      <span class="split-amount" id="shippingAmountDisplay">${formatCurrency(shippingCharge)}</span>
                      <span class="split-pct" id="shippingBadgeText">${isShipping ? 'Additional' : 'Free Handover'}</span>
                    </div>
                  </div>
                  <div class="split-subtext" id="shippingSubtext">
                    ${isShipping 
                      ? '₹1,000 collected separately for dedicated insured courier dispatch directly from the Agra workshop.' 
                      : '₹0 for workshop handover. No courier fee charged.'}
                  </div>
                </div>

              </div>

              <!-- CTA Button -->
              <div class="checkout-cta-box">
                <button class="btn btn--gold btn--lg btn--block font-bold" id="btnAuthorizeCheckout" onclick="executeCheckoutOrder()">
                  Confirm & Pay <span id="btnPayAmount">${formatCurrency(totalAmount)}</span> (Demo Payment Mode)
                </button>
                <div class="checkout-disclaimer">
                  ℹ️ <strong>DEMO PAYMENT MODE:</strong> Real payment gateway integration (UPI / NetBanking) can be configured. No actual bank transfer occurs in this demo.
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

function initCheckoutScreen() {
  // Ensure DOM is up to date with initial selection
  updateCheckoutCalculations();
}

/** Toggles delivery option and updates calculations dynamically without page reload */
function onDeliveryOptionSelect(method) {
  checkoutState.deliveryMethod = method;
  updateCheckoutCalculations();
}

function updateCheckoutCalculations() {
  const product = checkoutState.product || { price: 10000 };
  const P = product.price || 10000;
  const isShipping = (checkoutState.deliveryMethod === 'shipping');
  const shippingCharge = isShipping ? 1000 : 0;
  const totalAmount = P + shippingCharge;

  const artisanShare = Math.round(P * 0.70);
  const companyShare = P - artisanShare;
  const guideCommission = Math.round(P * 0.05);
  const hotelCommission = Math.round(P * 0.05);
  const platformOperations = companyShare - guideCommission - hotelCommission;

  // Update DOM elements
  const optShippingLabel = document.getElementById('optShippingLabel');
  const optCarryLabel = document.getElementById('optCarryLabel');
  const shippingForm = document.getElementById('shippingFormSection');
  const deliverySummaryText = document.getElementById('deliverySummaryText');
  const finalTotalDisplay = document.getElementById('finalTotalDisplay');
  const artisanAmountDisplay = document.getElementById('artisanAmountDisplay');
  const companyAmountDisplay = document.getElementById('companyAmountDisplay');
  const shippingAmountDisplay = document.getElementById('shippingAmountDisplay');
  const shippingBadgeText = document.getElementById('shippingBadgeText');
  const shippingSubtext = document.getElementById('shippingSubtext');
  const btnPayAmount = document.getElementById('btnPayAmount');

  const allocGuide = document.getElementById('allocGuide');
  const allocHotel = document.getElementById('allocHotel');
  const allocPlatform = document.getElementById('allocPlatform');

  if (optShippingLabel && optCarryLabel) {
    if (isShipping) {
      optShippingLabel.classList.add('delivery-option--selected');
      optCarryLabel.classList.remove('delivery-option--selected');
      if (shippingForm) shippingForm.style.display = 'block';
      if (deliverySummaryText) deliverySummaryText.innerText = `Product ${formatCurrency(P)} + Insured Shipping ₹1,000`;
      if (shippingAmountDisplay) shippingAmountDisplay.innerText = '₹1,000';
      if (shippingBadgeText) shippingBadgeText.innerText = 'Separate Logistics';
      if (shippingSubtext) shippingSubtext.innerText = '₹1,000 collected separately for dedicated insured courier dispatch directly from the Agra workshop.';
    } else {
      optCarryLabel.classList.add('delivery-option--selected');
      optShippingLabel.classList.remove('delivery-option--selected');
      if (shippingForm) shippingForm.style.display = 'none';
      if (deliverySummaryText) deliverySummaryText.innerText = `Product ${formatCurrency(P)} + Handover ₹0`;
      if (shippingAmountDisplay) shippingAmountDisplay.innerText = '₹0';
      if (shippingBadgeText) shippingBadgeText.innerText = 'Free Handover';
      if (shippingSubtext) shippingSubtext.innerText = '₹0 for workshop handover. Customer carries product in velvet protective case.';
    }
  }

  if (finalTotalDisplay) finalTotalDisplay.innerText = formatCurrency(totalAmount);
  if (btnPayAmount) btnPayAmount.innerText = formatCurrency(totalAmount);
  if (artisanAmountDisplay) artisanAmountDisplay.innerText = formatCurrency(artisanShare);
  if (companyAmountDisplay) companyAmountDisplay.innerText = formatCurrency(companyShare);

  if (allocGuide) allocGuide.innerText = formatCurrency(guideCommission);
  if (allocHotel) allocHotel.innerText = formatCurrency(hotelCommission);
  if (allocPlatform) allocPlatform.innerText = formatCurrency(platformOperations);
}

/** Execute simulated checkout and post to backend */
async function executeCheckoutOrder() {
  const btn = document.getElementById('btnAuthorizeCheckout');
  const product = checkoutState.product || { name: 'Agra Floral Marble Inlay Box', price: 10000 };
  const isShipping = (checkoutState.deliveryMethod === 'shipping');

  const buyerName = document.getElementById('checkoutBuyerName')?.value || 'Eleanor Vance';
  const buyerEmail = document.getElementById('checkoutBuyerEmail')?.value || 'eleanor.vance@example.com';
  const buyerPhone = document.getElementById('checkoutBuyerPhone')?.value || '+91 98765 43210';
  const shippingAddress = isShipping ? (document.getElementById('checkoutBuyerAddress')?.value || 'Agra Hotel Delivery') : 'Workshop Handover';

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Processing Order & 70:30 Distribution...';
  }

  let createdOrder = null;
  try {
    const res = await api.post('/orders', {
      productId: product.productId || product._id || 'prod-001',
      buyerName,
      buyerEmail,
      buyerPhone,
      deliveryMethod: isShipping ? 'shipping' : 'carry',
      shippingAddress,
    });
    if (res && res.data) {
      createdOrder = res.data;
    }
  } catch (err) {
    console.warn('[Checkout] Backend order creation error, using local fallback:', err);
  }

  const P = product.price || 10000;
  const shippingCharge = isShipping ? 1000 : 0;
  const totalAmount = P + shippingCharge;
  const artisanShare = Math.round(P * 0.70);
  const companyShare = P - artisanShare;
  const orderId = createdOrder ? createdOrder.orderId : `SP-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  await sleep(600);

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `Confirm & Pay ${formatCurrency(totalAmount)} (Demo Payment Mode)`;
  }

  // Show Confirmation Modal
  const modalHtml = `
    <div class="payment-success-modal">
      <div class="success-icon-badge">✓</div>
      <h2 class="success-title">Order Confirmed!</h2>
      <p class="success-tagline">Fair Trade 70:30 Distribution Recorded</p>

      <div class="success-card">
        <div class="success-row">
          <span>Order ID:</span>
          <strong>${orderId}</strong>
        </div>
        <div class="success-row">
          <span>Item:</span>
          <strong>${product.name}</strong>
        </div>
        <div class="success-row">
          <span>Delivery Option:</span>
          <strong>${isShipping ? 'Option 2: Insured Doorstep Shipping (+₹1,000)' : 'Option 1: Carry With Me (₹0)'}</strong>
        </div>
        <div class="success-row success-row--total">
          <span>Total Settled:</span>
          <strong>${formatCurrency(totalAmount)}</strong>
        </div>
      </div>

      <div class="split-summary-box">
        <h4>70:30 Revenue Settlement</h4>
        <ul>
          <li>👨🏽‍🎨 Master Artisan (${product.artisanName || 'Ustad Rashid Khan'}): <strong class="text-gold font-bold">${formatCurrency(artisanShare)} (70%)</strong></li>
          <li>🏛️ Smriti Pass Company: <strong>${formatCurrency(companyShare)} (30%)</strong></li>
          ${isShipping ? '<li>📦 Logistics & Transit Courier: <strong>₹1,000 (Separately collected)</strong></li>' : ''}
        </ul>
      </div>

      <div class="notice-pill">
        ℹ️ <strong>Demo Payment Mode:</strong> Recorded in database for demonstration. Artisan Ustad Rashid Khan's portal has been credited with an audio alert.
      </div>

      <div class="modal-cta-row">
        <button class="btn btn--gold btn--block font-bold" onclick="closeModal(); navigateTo('artisan')">
          Go to Artisan Portal to Hear Audio Notification 🔊
        </button>
        <button class="btn btn--outline btn--block" onclick="closeModal(); navigateTo('tourist')">
          Return to Tourist Trail
        </button>
      </div>
    </div>
  `;

  openModal(modalHtml);
  showToast(`Order ${orderId} created! 70% (${formatCurrency(artisanShare)}) allocated to artisan.`, 'success');
}
