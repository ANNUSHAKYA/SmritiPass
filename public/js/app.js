/**
 * Smriti Pass — Main SPA Router & Utilities
 * Three Core Screens: Tourist Trail (/#tourist), Secure Checkout (/#checkout), Artisan Portal (/#artisan)
 */

// ─── Configuration ───────────────────────────────────────────────────
const APP_CONFIG = {
  API_BASE: '/api',
  TRANSITION_DURATION: 250,
  TOAST_DURATION: 3500,
  CURRENCY: '₹',
  LOCALE: 'en-IN'
};

// ─── Global State ────────────────────────────────────────────────────
const AppState = {
  currentRoute: 'tourist',
  previousRoute: null,
  selectedProduct: null, // Holds dynamically chosen product for checkout
  artisans: [],
  products: [],
  orders: [],
  isLoading: false,
  language: 'hi' // Default Hindi for artisan accessibility
};

// ─── Utility Functions ───────────────────────────────────────────────

/** Format currency in Indian Rupees (INR) */
function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return `${APP_CONFIG.CURRENCY}0`;
  return `${APP_CONFIG.CURRENCY}${amount.toLocaleString(APP_CONFIG.LOCALE)}`;
}

/** Sleep/delay helper */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── API Fetch Wrapper ───────────────────────────────────────────────

async function apiFetch(endpoint, options = {}) {
  const url = `${APP_CONFIG.API_BASE}${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error ${response.status}: ${errorBody}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

const api = {
  get: (endpoint) => apiFetch(endpoint),
  post: (endpoint, data) => apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  upload: (endpoint, formData) => apiFetch(endpoint, {
    method: 'POST',
    headers: {}, // Browser sets boundary
    body: formData
  })
};

// ─── Toast Notifications ─────────────────────────────────────────────

function showToast(message, type = 'info', duration = APP_CONFIG.TOAST_DURATION) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span class="toast__message">${message}</span>
    <button class="toast__dismiss" aria-label="Dismiss">&times;</button>
  `;

  toast.querySelector('.toast__dismiss').addEventListener('click', () => {
    dismissToast(toast);
  });

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast--visible');
  });

  if (duration > 0) {
    setTimeout(() => dismissToast(toast), duration);
  }
}

function dismissToast(toast) {
  toast.classList.remove('toast--visible');
  toast.classList.add('toast--exit');
  setTimeout(() => toast.remove(), 250);
}

// ─── Modal Management ────────────────────────────────────────────────

function openModal(contentHTML) {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  if (!overlay || !content) return;

  content.innerHTML = contentHTML;
  overlay.classList.add('modal-overlay--visible');
  document.body.classList.add('body--modal-open');
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;

  overlay.classList.remove('modal-overlay--visible');
  document.body.classList.remove('body--modal-open');
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});

// ─── Loading State ───────────────────────────────────────────────────

function showLoading() {
  AppState.isLoading = true;
  const loader = document.getElementById('appLoading');
  if (loader) loader.classList.add('app__loading--visible');
}

function hideLoading() {
  AppState.isLoading = false;
  const loader = document.getElementById('appLoading');
  if (loader) loader.classList.remove('app__loading--visible');
}

// ─── Three Primary Routes ────────────────────────────────────────────

const routes = {
  tourist: {
    render: () => typeof renderTouristScreen === 'function' ? renderTouristScreen() : '<p>Tourist screen loading...</p>',
    init: () => typeof initTouristScreen === 'function' && initTouristScreen(),
    title: 'Discover Heritage Crafts'
  },
  checkout: {
    render: () => typeof renderCheckoutScreen === 'function' ? renderCheckoutScreen() : '<p>Checkout loading...</p>',
    init: () => typeof initCheckoutScreen === 'function' && initCheckoutScreen(),
    title: 'Secure Fair Trade Checkout (70:30)'
  },
  artisan: {
    render: () => typeof renderArtisanScreen === 'function' ? renderArtisanScreen() : '<p>Artisan Portal loading...</p>',
    init: () => typeof initArtisanScreen === 'function' && initArtisanScreen(),
    title: 'Artisan Zero-Literacy Voice Portal'
  },
  admin: {
    render: () => typeof renderAdminScreen === 'function' ? renderAdminScreen() : '<p>Admin Portal loading...</p>',
    init: () => typeof initAdminScreen === 'function' && initAdminScreen(),
    title: 'Agra Pilot Control Center'
  }
};

/** Parse the hash route */
function parseHash() {
  const raw = window.location.hash.slice(1) || 'tourist';
  const parts = raw.split('/');
  const route = parts[0];

  if (!routes[route]) {
    return { route: 'tourist' };
  }
  return { route };
}

/** Navigate to a route */
function navigateTo(route, params = {}) {
  if (params && params.product) {
    AppState.selectedProduct = params.product;
  }
  window.location.hash = route;
}

/** Update active navigation tab */
function updateNavTabs(activeRoute) {
  const tabs = document.querySelectorAll('.nav__tab');
  tabs.forEach(tab => {
    const tabRoute = tab.dataset.route;
    if (tabRoute === activeRoute) {
      tab.classList.add('nav__tab--active');
    } else {
      tab.classList.remove('nav__tab--active');
    }
  });
}

/** Handle route change */
async function handleRouteChange() {
  const { route } = parseHash();
  const routeConfig = routes[route] || routes.tourist;

  const app = document.getElementById('app');
  if (!app) return;

  AppState.previousRoute = AppState.currentRoute;
  AppState.currentRoute = route;

  updateNavTabs(route);
  document.title = `${routeConfig.title} — Smriti Pass`;

  app.classList.add('app--transitioning');
  await sleep(150);

  app.innerHTML = routeConfig.render();

  requestAnimationFrame(() => {
    app.classList.remove('app--transitioning');
  });

  await sleep(40);
  routeConfig.init();
}

window.addEventListener('hashchange', handleRouteChange);

document.addEventListener('DOMContentLoaded', () => {
  handleRouteChange();
});
