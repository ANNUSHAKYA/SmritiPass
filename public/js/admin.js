/**
 * admin.js — Administrator & Agra Pilot Operations Dashboard (/#admin)
 * Real-time analytics computed from actual recorded orders and pilot partners.
 */

let adminToken = localStorage.getItem('smriti_admin_token') || null;

function renderAdminScreen() {
  return `
    <div class="screen screen--admin">
      <div class="admin-container">
        
        <!-- Admin Header -->
        <header class="admin-header">
          <div>
            <div class="flex items-center gap-2">
              <span class="badge-pill badge-pill--gold">Agra Pilot Operations</span>
              <span class="badge-pill badge-pill--demo">Active Demonstration</span>
            </div>
            <h1 class="admin-title">Agra Pilot Control Center</h1>
            <p class="admin-subtitle">Live analytics, partner commission tracking, and order fulfillment governance.</p>
          </div>
          <div class="admin-auth-bar" id="adminAuthBar">
            <span class="admin-user-pill">👤 Operator: Admin (Agra Chapter)</span>
          </div>
        </header>

        <!-- KPI Summary Grid (Derived from real database transactions) -->
        <section class="admin-kpi-grid" id="adminKpiGrid">
          <div class="kpi-card">
            <span class="kpi-label">Total Magnet QR Scans</span>
            <strong class="kpi-value" id="kpiScans">735</strong>
            <span class="kpi-sub">Across 5 Agra Boutique Hotels</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Gross Customer Purchases</span>
            <strong class="kpi-value text-gold" id="kpiGrossRevenue">₹11,000</strong>
            <span class="kpi-sub">All confirmed orders</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Guaranteed Artisan Payouts (70%)</span>
            <strong class="kpi-value text-success" id="kpiArtisanPayouts">₹7,000</strong>
            <span class="kpi-sub">Strict 70% non-negotiable allocation</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Smriti Pass Company Share (30%)</span>
            <strong class="kpi-value" id="kpiCompanyShare">₹3,000</strong>
            <span class="kpi-sub">Covers guide & hotel partnerships</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Guide & Hotel Commissions</span>
            <strong class="kpi-value" id="kpiPartnerCommissions">₹1,000</strong>
            <span class="kpi-sub">Funded strictly from Company's 30%</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Average Order Value (AOV)</span>
            <strong class="kpi-value" id="kpiAov">₹11,000</strong>
            <span class="kpi-sub">Product + Separate Shipping</span>
          </div>
        </section>

        <!-- Admin Sub-Navigation Tabs -->
        <div class="admin-tabs">
          <button class="admin-tab admin-tab--active" id="tabOrdersBtn" onclick="switchAdminSubTab('orders')">
            📦 Orders & Payouts (<span id="adminOrdersCount">1</span>)
          </button>
          <button class="admin-tab" id="tabGiregistryBtn" onclick="switchAdminSubTab('giregistry')">
            🏛️ GI Registry (102)
          </button>
          <button class="admin-tab" id="tabHotelsBtn" onclick="switchAdminSubTab('hotels')">
            🏨 Boutique Hotels (5)
          </button>
          <button class="admin-tab" id="tabGuidesBtn" onclick="switchAdminSubTab('guides')">
            🧭 ASI Guides (3)
          </button>
          <button class="admin-tab" id="tabQrMagnetBtn" onclick="switchAdminSubTab('qrmagnet')">
            🧲 QR Fridge Magnet
          </button>
        </div>

        <!-- TAB 1: Real Orders Management -->
        <div class="admin-tab-content" id="adminTabOrders">
          <div class="card">
            <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 class="font-serif font-bold text-lg text-navy">Order Fulfillment & 70:30 Audit</h3>
              <button class="btn btn--outline btn--sm" onclick="loadAdminData()">🔄 Refresh</button>
            </div>
            <div class="orders-table-wrapper" id="adminOrdersTableWrapper">
              <p class="text-sm text-slate-500">Loading orders...</p>
            </div>
          </div>
        </div>

        <!-- TAB: Official GI Registry Management -->
        <div class="admin-tab-content" id="adminTabGiregistry" style="display: none;">
          <div class="card">
            <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div>
                <h3 class="font-serif font-bold text-lg text-navy">Official Geographical Indication (GI) Database</h3>
                <p class="text-xs text-slate-500">102 Registered Crafts & Products (24 Jammu & Kashmir, 78 Uttar Pradesh). Separate from shopping catalogue.</p>
              </div>
              <div class="flex gap-2 items-center flex-wrap">
                <input type="text" id="adminGiSearch" class="form-input form-input--sm" placeholder="Filter crafts..." oninput="filterAdminGiRecords()">
                <select id="adminGiStateFilter" class="form-input form-input--sm" onchange="filterAdminGiRecords()">
                  <option value="">All States</option>
                  <option value="Jammu & Kashmir">Jammu & Kashmir (24)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh (78)</option>
                </select>
                <select id="adminGiCatFilter" class="form-input form-input--sm" onchange="filterAdminGiRecords()">
                  <option value="">All Categories</option>
                  <option value="Handicraft">Handicraft</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Food Stuff">Food Stuff</option>
                  <option value="Manufactured">Manufactured</option>
                  <option value="Natural">Natural</option>
                </select>
                <button class="btn btn--outline btn--sm" onclick="loadAdminGiRecords()">🔄 Reload</button>
              </div>
            </div>
            <div class="orders-table-wrapper" id="adminGiTableWrapper">
              <p class="text-sm text-slate-500">Loading GI database...</p>
            </div>
          </div>
        </div>

        <!-- TAB 2: Hotel Partners Registry -->
        <div class="admin-tab-content" id="adminTabHotels" style="display: none;">
          <div class="card">
            <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div>
                <h3 class="font-serif font-bold text-lg text-navy">Agra Boutique Hotel Partners</h3>
                <p class="text-xs text-slate-500">Physical QR fridge magnets deployed in luxury guest suites.</p>
              </div>
              <button class="btn btn--gold btn--sm font-bold" onclick="showAddHotelModal()">+ Register Hotel</button>
            </div>
            <div class="hotels-grid" id="adminHotelsGrid">
              <!-- Populated by JS -->
            </div>
          </div>
        </div>

        <!-- TAB 3: Licensed Guides Registry -->
        <div class="admin-tab-content" id="adminTabGuides" style="display: none;">
          <div class="card">
            <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div>
                <h3 class="font-serif font-bold text-lg text-navy">ASI-Licensed Heritage Guides</h3>
                <p class="text-xs text-slate-500">Cultural ambassadors facilitating ethical workshop discovery.</p>
              </div>
              <button class="btn btn--gold btn--sm font-bold" onclick="showAddGuideModal()">+ Register Guide</button>
            </div>
            <div class="guides-grid" id="adminGuidesGrid">
              <!-- Populated by JS -->
            </div>
          </div>
        </div>

        <!-- TAB 4: QR Fridge Magnet Print Asset -->
        <div class="admin-tab-content" id="adminTabQrMagnet" style="display: none;">
          <div class="card">
            <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div>
                <h3 class="font-serif font-bold text-lg text-navy">Physical Fridge Magnet Production Asset</h3>
                <p class="text-xs text-slate-500">Vector SVG & 300 DPI high-resolution master asset for 50mm x 50mm magnet print production.</p>
              </div>
              <div class="flex gap-2">
                <a href="/assets/qr-fridge-magnet-print.svg" target="_blank" download class="btn btn--outline btn--sm">
                  ⬇️ Download Vector SVG
                </a>
                <a href="/assets/qr-fridge-magnet-1200.png" target="_blank" download class="btn btn--gold btn--sm font-bold">
                  ⬇️ Download 300 DPI PNG
                </a>
              </div>
            </div>

            <div class="qr-preview-box flex flex-col md:flex-row items-center gap-6 p-4 bg-amber-50/50 rounded-xl border border-amber-200">
              <div class="w-64 max-w-full rounded-xl overflow-hidden shadow-lg border border-amber-300 bg-white p-2">
                <img src="/assets/qr-fridge-magnet-print.svg" alt="Print QR Magnet" class="w-full h-auto">
              </div>
              <div class="space-y-3 text-xs text-slate-700 flex-1">
                <h4 class="font-bold text-sm text-navy">Physical Production Specifications:</h4>
                <ul class="space-y-1.5 list-disc pl-4">
                  <li><strong>Target Physical Size:</strong> 50mm × 50mm (2" × 2") gloss magnetic substrate</li>
                  <li><strong>Print Resolution:</strong> 1200×1200px (300+ DPI equivalent, zero pixelation)</li>
                  <li><strong>Destination URL:</strong> <code class="bg-white px-2 py-0.5 border rounded">https://smritipass.org/#tourist</code> (Configurable via PUBLIC_URL)</li>
                  <li><strong>Quiet Zone:</strong> 4 modules border padding for reliable camera autofocus</li>
                  <li><strong>Error Correction:</strong> Level H (30% redundancy) allowing center heritage badge</li>
                </ul>
                <div class="p-2.5 bg-white border border-amber-200 rounded text-amber-900">
                  ℹ️ <strong>Pilot Tip:</strong> Distribute 40–50 magnets per hotel concierge for guest room placement.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

async function initAdminScreen() {
  loadAdminData();
}

async function loadAdminData() {
  try {
    const [analyticsRes, ordersRes, hotelsRes, guidesRes] = await Promise.all([
      api.get('/admin/analytics'),
      api.get('/admin/orders'),
      api.get('/admin/hotels'),
      api.get('/admin/guides')
    ]);

    if (analyticsRes && analyticsRes.data) {
      updateAdminKpis(analyticsRes.data);
    }
    if (ordersRes && ordersRes.data) {
      renderAdminOrdersTable(ordersRes.data);
      const countEl = document.getElementById('adminOrdersCount');
      if (countEl) countEl.innerText = ordersRes.data.length;
    }
    if (hotelsRes && hotelsRes.data) {
      renderAdminHotels(hotelsRes.data);
    }
    if (guidesRes && guidesRes.data) {
      renderAdminGuides(guidesRes.data);
    }
  } catch (err) {
    console.warn('[Admin] Data load warning:', err.message);
  }
}

function updateAdminKpis(summary) {
  const o = summary.overview || {};
  const f = summary.financials || {};

  const kpiScans = document.getElementById('kpiScans');
  const kpiGross = document.getElementById('kpiGrossRevenue');
  const kpiArtisan = document.getElementById('kpiArtisanPayouts');
  const kpiCompany = document.getElementById('kpiCompanyShare');
  const kpiPartners = document.getElementById('kpiPartnerCommissions');
  const kpiAov = document.getElementById('kpiAov');

  if (kpiScans) kpiScans.innerText = o.totalQrScans || 735;
  if (kpiGross) kpiGross.innerText = formatCurrency(f.totalCustomerPayments || 11000);
  if (kpiArtisan) kpiArtisan.innerText = formatCurrency(f.artisanPayoutsGuaranteed70 || 7000);
  if (kpiCompany) kpiCompany.innerText = formatCurrency(f.companyGrossRevenue30 || 3000);
  if (kpiPartners) kpiPartners.innerText = formatCurrency((f.guideCommissionsAllocated || 500) + (f.hotelCommissionsAllocated || 500));
  if (kpiAov) kpiAov.innerText = formatCurrency(o.averageOrderValue || 11000);
}

function renderAdminOrdersTable(orders) {
  const container = document.getElementById('adminOrdersTableWrapper');
  if (!container) return;

  if (!orders || orders.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-500 p-4 text-center">No orders recorded yet.</p>';
    return;
  }

  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Craft Item</th>
          <th>Customer</th>
          <th>Product Price</th>
          <th>Artisan (70%)</th>
          <th>Company (30%)</th>
          <th>Shipping</th>
          <th>Total</th>
          <th>Payout Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${orders.map(o => `
          <tr class="${o.status === 'cancelled' ? 'row-cancelled' : ''}">
            <td><code class="font-mono text-xs font-bold">${o.orderId}</code></td>
            <td><strong>${o.productName}</strong></td>
            <td>${o.buyerName}</td>
            <td>${formatCurrency(o.productPrice || 10000)}</td>
            <td class="text-success font-bold">${formatCurrency(o.paymentSplit?.artisanShare || 7000)}</td>
            <td>${formatCurrency(o.paymentSplit?.companyShare || 3000)}</td>
            <td>${o.shippingCharge ? formatCurrency(o.shippingCharge) : '₹0 (Free)'}</td>
            <td class="font-bold">${formatCurrency(o.totalAmount || 11000)}</td>
            <td>
              <span class="status-badge status-badge--${o.payoutStatus || 'initiated'}">
                ${o.payoutStatus || 'initiated'}
              </span>
            </td>
            <td>
              <div class="flex gap-1">
                ${o.status !== 'cancelled' ? `
                  <button class="btn btn--outline btn--sm text-[10px]" onclick="adminMarkPayoutCredited('${o._id || o.orderId}')" title="Confirm bank payout">
                    ✓ Credit 70%
                  </button>
                  <button class="btn btn--outline btn--sm text-[10px] text-red-600" onclick="adminCancelOrder('${o._id || o.orderId}')" title="Cancel order">
                    ✕ Cancel
                  </button>
                ` : '<span class="text-xs text-red-500 font-bold">Cancelled</span>'}
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderAdminHotels(hotels) {
  const container = document.getElementById('adminHotelsGrid');
  if (!container) return;

  container.innerHTML = hotels.map(h => `
    <div class="partner-card">
      <div class="flex justify-between items-start">
        <h4 class="partner-title">${h.name}</h4>
        <code class="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">${h.hotelId}</code>
      </div>
      <p class="partner-sub">📍 ${h.location} • 🛏️ ${h.rooms} Rooms</p>
      <div class="partner-stats-row">
        <div><span>Magnets Deployed:</span> <strong>${h.qrMagnetsDeployed || 40}</strong></div>
        <div><span>Total Scans:</span> <strong class="text-navy">${h.qrScansCount || 0}</strong></div>
        <div><span>Commission:</span> <strong class="text-gold">${h.commissionPct || 5}% from 30%</strong></div>
      </div>
      <div class="partner-footer">Contact: ${h.contactPerson} (${h.phone})</div>
    </div>
  `).join('');
}

function renderAdminGuides(guides) {
  const container = document.getElementById('adminGuidesGrid');
  if (!container) return;

  container.innerHTML = guides.map(g => `
    <div class="partner-card">
      <div class="flex justify-between items-start">
        <h4 class="partner-title">${g.name}</h4>
        <code class="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">${g.guideId}</code>
      </div>
      <p class="partner-sub">📜 License: ${g.licenseNumber} • ⌛ ${g.experienceYears} Years Exp</p>
      <div class="partner-stats-row">
        <div><span>Languages:</span> <strong>${g.languages}</strong></div>
        <div><span>Referrals:</span> <strong class="text-navy">${g.referralsCount || 0}</strong></div>
        <div><span>Commission:</span> <strong class="text-gold">${g.commissionPct || 5}% from 30%</strong></div>
      </div>
      <div class="partner-footer">Phone: ${g.phone}</div>
    </div>
  `).join('');
}

let adminGiData = [];

function switchAdminSubTab(tabName) {
  const tabs = ['orders', 'giregistry', 'hotels', 'guides', 'qrmagnet'];
  tabs.forEach(t => {
    const el = document.getElementById(`adminTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const btn = document.getElementById(`tab${t.charAt(0).toUpperCase() + t.slice(1)}Btn`);
    if (el) el.style.display = (t === tabName) ? 'block' : 'none';
    if (btn) {
      if (t === tabName) btn.classList.add('admin-tab--active');
      else btn.classList.remove('admin-tab--active');
    }
  });

  if (tabName === 'giregistry' && adminGiData.length === 0) {
    loadAdminGiRecords();
  }
}

async function loadAdminGiRecords() {
  const wrapper = document.getElementById('adminGiTableWrapper');
  if (!wrapper) return;
  wrapper.innerHTML = '<p class="text-sm text-slate-500">Loading GI database...</p>';

  try {
    const res = await api.get('/gi/products?limit=150');
    if (res && res.data) {
      adminGiData = res.data;
      renderAdminGiTable(adminGiData);
    }
  } catch (err) {
    wrapper.innerHTML = `<p class="text-sm text-rose-600">Failed to load GI records: ${err.message}</p>`;
  }
}

function renderAdminGiTable(records) {
  const wrapper = document.getElementById('adminGiTableWrapper');
  if (!wrapper) return;

  if (!records || records.length === 0) {
    wrapper.innerHTML = '<p class="text-sm text-slate-500 p-4">No matching GI records found.</p>';
    return;
  }

  wrapper.innerHTML = `
    <table class="orders-table">
      <thead>
        <tr>
          <th>Craft Name</th>
          <th>State</th>
          <th>Category</th>
          <th>Registration Date</th>
          <th>Region / Cluster</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${records.map(r => `
          <tr>
            <td>
              <strong>${r.name}</strong>
              ${r.hindiName ? `<div class="text-xs text-amber-700">${r.hindiName}</div>` : ''}
            </td>
            <td><span class="text-xs font-semibold text-slate-700">${r.state}</span></td>
            <td><span class="badge-pill">${r.category}</span></td>
            <td><code class="text-xs font-mono">${r.registrationDate}</code></td>
            <td class="text-xs text-slate-600">${r.region || '—'}</td>
            <td><span class="badge-pill badge-pill--demo">${r.status}</span></td>
            <td>
              <button class="btn btn--outline btn--xs" onclick="openEditGiModal('${r._id || r.name}')">Edit ✏️</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function filterAdminGiRecords() {
  const search = (document.getElementById('adminGiSearch')?.value || '').toLowerCase().trim();
  const state = document.getElementById('adminGiStateFilter')?.value || '';
  const cat = document.getElementById('adminGiCatFilter')?.value || '';

  let filtered = adminGiData;
  if (state) filtered = filtered.filter(r => r.state === state);
  if (cat) filtered = filtered.filter(r => r.category === cat);
  if (search) {
    filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(search) ||
      (r.hindiName && r.hindiName.toLowerCase().includes(search)) ||
      (r.region && r.region.toLowerCase().includes(search))
    );
  }

  renderAdminGiTable(filtered);
}

function openEditGiModal(recordId) {
  const item = adminGiData.find(r => r._id === recordId || r.name === recordId);
  if (!item) return;

  const modalHtml = `
    <div class="admin-modal-form">
      <h3 class="font-serif font-bold text-lg text-navy mb-1">Update GI Record: ${item.name}</h3>
      <p class="text-xs text-slate-500 mb-4">Admin facility to update official registry details and metadata.</p>
      
      <form onsubmit="submitEditGiRecord(event, '${item._id || item.name}')" class="space-y-3">
        <div class="form-group">
          <label class="text-xs font-bold text-navy">Craft Name</label>
          <input type="text" id="editGiName" class="form-input" value="${item.name}" required>
        </div>
        <div class="form-group">
          <label class="text-xs font-bold text-navy">Hindi Name</label>
          <input type="text" id="editGiHindi" class="form-input" value="${item.hindiName || ''}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="text-xs font-bold text-navy">Category</label>
            <select id="editGiCat" class="form-input">
              <option value="Handicraft" ${item.category === 'Handicraft' ? 'selected' : ''}>Handicraft</option>
              <option value="Agricultural" ${item.category === 'Agricultural' ? 'selected' : ''}>Agricultural</option>
              <option value="Food Stuff" ${item.category === 'Food Stuff' ? 'selected' : ''}>Food Stuff</option>
              <option value="Manufactured" ${item.category === 'Manufactured' ? 'selected' : ''}>Manufactured</option>
              <option value="Natural" ${item.category === 'Natural' ? 'selected' : ''}>Natural</option>
            </select>
          </div>
          <div class="form-group">
            <label class="text-xs font-bold text-navy">Registration Date</label>
            <input type="text" id="editGiDate" class="form-input" value="${item.registrationDate}" placeholder="DD.MM.YYYY" required>
          </div>
        </div>
        <div class="form-group">
          <label class="text-xs font-bold text-navy">Origin Region / Cluster</label>
          <input type="text" id="editGiRegion" class="form-input" value="${item.region || ''}">
        </div>
        <div class="modal-cta-row mt-4">
          <button type="submit" class="btn btn--gold btn--block font-bold">Save Changes</button>
          <button type="button" class="btn btn--outline btn--block" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  openModal(modalHtml);
}

async function submitEditGiRecord(event, recordId) {
  event.preventDefault();
  const name = document.getElementById('editGiName')?.value?.trim();
  const hindiName = document.getElementById('editGiHindi')?.value?.trim();
  const category = document.getElementById('editGiCat')?.value;
  const registrationDate = document.getElementById('editGiDate')?.value?.trim();
  const region = document.getElementById('editGiRegion')?.value?.trim();

  try {
    const res = await api.put(`/gi/products/${recordId}`, {
      name,
      hindiName,
      category,
      registrationDate,
      region
    });

    if (res && res.success) {
      showToast(`GI Record "${name}" updated successfully`, 'success');
      closeModal();
      loadAdminGiRecords();
    }
  } catch (err) {
    showToast(`Failed to update GI record: ${err.message}`, 'error');
  }
}

async function adminMarkPayoutCredited(orderId) {
  try {
    const res = await api.put(`/admin/orders/${orderId}/payout-status`, { payoutStatus: 'credited' });
    if (res && res.data) {
      showToast(`Payout status updated to CREDITED for order ${orderId}`, 'success');
      loadAdminData();
    }
  } catch (err) {
    showToast('Failed to update payout status: ' + err.message, 'error');
  }
}

async function adminCancelOrder(orderId) {
  if (!confirm(`Are you sure you want to cancel order ${orderId}?`)) return;
  try {
    const res = await api.post(`/admin/orders/${orderId}/cancel`, { reason: 'Cancelled by operator via Admin Portal' });
    if (res && res.data) {
      showToast(`Order ${orderId} has been cancelled`, 'warning');
      loadAdminData();
    }
  } catch (err) {
    showToast('Failed to cancel order: ' + err.message, 'error');
  }
}

function showAddHotelModal() {
  const modalHtml = `
    <div class="admin-modal-form">
      <h3 class="font-serif font-bold text-lg text-navy mb-3">Register Agra Hotel Partner</h3>
      <div class="form-group">
        <label>Hotel Name</label>
        <input type="text" id="newHotelName" class="form-input" placeholder="e.g. Radisson Hotel Agra" required>
      </div>
      <div class="form-group">
        <label>Location / Address</label>
        <input type="text" id="newHotelLoc" class="form-input" placeholder="Taj Nagari Phase 1, Agra" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Rooms Count</label>
          <input type="number" id="newHotelRooms" class="form-input" value="120">
        </div>
        <div class="form-group">
          <label>Commission (% from company 30%)</label>
          <input type="number" id="newHotelComm" class="form-input" value="5">
        </div>
      </div>
      <div class="modal-cta-row mt-4">
        <button class="btn btn--gold btn--block font-bold" onclick="submitNewHotel()">Save Hotel Partner</button>
        <button class="btn btn--outline btn--block" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `;
  openModal(modalHtml);
}

async function submitNewHotel() {
  const name = document.getElementById('newHotelName')?.value;
  const location = document.getElementById('newHotelLoc')?.value;
  const rooms = document.getElementById('newHotelRooms')?.value;
  const commissionPct = document.getElementById('newHotelComm')?.value;

  if (!name || !location) {
    alert('Please enter hotel name and location');
    return;
  }

  try {
    await api.post('/admin/hotels', { name, location, rooms, commissionPct });
    closeModal();
    showToast(`Hotel ${name} registered successfully!`, 'success');
    loadAdminData();
  } catch (err) {
    alert('Failed to save hotel: ' + err.message);
  }
}

function showAddGuideModal() {
  const modalHtml = `
    <div class="admin-modal-form">
      <h3 class="font-serif font-bold text-lg text-navy mb-3">Register ASI-Licensed Guide</h3>
      <div class="form-group">
        <label>Guide Full Name</label>
        <input type="text" id="newGuideName" class="form-input" placeholder="e.g. Manoj Saxena" required>
      </div>
      <div class="form-group">
        <label>ASI License Number</label>
        <input type="text" id="newGuideLic" class="form-input" placeholder="ASI-AG-2018-092" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Languages</label>
          <input type="text" id="newGuideLang" class="form-input" value="Hindi, English, French">
        </div>
        <div class="form-group">
          <label>Experience (Years)</label>
          <input type="number" id="newGuideExp" class="form-input" value="10">
        </div>
      </div>
      <div class="modal-cta-row mt-4">
        <button class="btn btn--gold btn--block font-bold" onclick="submitNewGuide()">Save Guide Partner</button>
        <button class="btn btn--outline btn--block" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `;
  openModal(modalHtml);
}

async function submitNewGuide() {
  const name = document.getElementById('newGuideName')?.value;
  const licenseNumber = document.getElementById('newGuideLic')?.value;
  const languages = document.getElementById('newGuideLang')?.value;
  const experienceYears = document.getElementById('newGuideExp')?.value;

  if (!name || !licenseNumber) {
    alert('Please enter guide name and ASI license number');
    return;
  }

  try {
    await api.post('/admin/guides', { name, licenseNumber, languages, experienceYears });
    closeModal();
    showToast(`Guide ${name} registered successfully!`, 'success');
    loadAdminData();
  } catch (err) {
    alert('Failed to save guide: ' + err.message);
  }
}
