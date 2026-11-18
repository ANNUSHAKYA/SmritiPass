// ============================================================
// Smriti Pass — Seed Data & In-Memory Store (70:30 Business Model)
// Production & Agra Pilot Ready Store
// ============================================================

const artisanIds = {
  rashid: 'art-rashid-001',
  meera: 'art-meera-002',
  arjun: 'art-arjun-003',
};

// --------------- Master Artisans ---------------
const artisans = [
  {
    _id: artisanIds.rashid,
    name: 'Ustad Rashid Khan',
    craft: 'Marble Inlay (Parchin Kari)',
    location: 'Agra, Uttar Pradesh',
    experience: 35,
    bio: 'Third-generation master artisan from Agra, continuing the sacred Mughal Parchin Kari art form seen in the Taj Mahal. Every petal is individually cut and inlaid by hand using diamond-edged bows.',
    photoUrl: '/uploads/artisans/rashid-khan.jpg',
    isVerified: true,
    verificationStatus: 'VERIFIED',
    verificationDate: new Date('2026-01-15'),
    credentialIssuer: 'Agra Heritage Crafts Council',
    bankAccountVerified: true,
    bankMasked: 'HDFC Bank •••• 4021',
    language: 'Hindi, Urdu, English',
    rating: 4.9,
    workshopName: 'Khan Marble Arts',
    workshopLocation: 'Sadar Bazaar Craft Quarter, Agra, UP 282001',
    giTag: 'GI/UP/Agra/MarbleInlay/2019',
    createdAt: new Date('2026-01-10'),
  },
  {
    _id: artisanIds.meera,
    name: 'Meera Devi',
    craft: 'Chikankari Embroidery',
    location: 'Lucknow, Uttar Pradesh',
    experience: 22,
    bio: 'Award-winning master of shadow-work (tepchi) and raised (murri) embroidery, mentoring women in rural artisan cooperatives across Uttar Pradesh.',
    photoUrl: '/uploads/artisans/meera-devi.jpg',
    isVerified: true,
    verificationStatus: 'VERIFIED',
    verificationDate: new Date('2026-02-10'),
    credentialIssuer: 'Lucknow Chikan Craft Association',
    bankAccountVerified: true,
    bankMasked: 'State Bank of India •••• 1198',
    language: 'Hindi, English',
    rating: 4.8,
    workshopName: 'Meera Heritage Studio',
    workshopLocation: 'Chowk, Lucknow, UP 226003',
    giTag: 'GI/UP/Lucknow/Chikankari/2008',
    createdAt: new Date('2026-02-05'),
  },
  {
    _id: artisanIds.arjun,
    name: 'Arjun Prajapati',
    craft: 'Blue Pottery & Terracotta',
    location: 'Jaipur, Rajasthan',
    experience: 28,
    bio: 'Master of quartz-based low-fire ceramic art, preserving non-clay Egyptian paste pottery traditions passed down through five generations.',
    photoUrl: '/uploads/artisans/arjun-prajapati.jpg',
    isVerified: true,
    verificationStatus: 'VERIFIED',
    verificationDate: new Date('2026-03-01'),
    credentialIssuer: 'Rajasthan Crafts Development Guild',
    bankAccountVerified: true,
    bankMasked: 'Bank of Baroda •••• 8821',
    language: 'Hindi, Rajasthani, English',
    rating: 4.9,
    workshopName: 'Prajapati Traditional Kilns',
    workshopLocation: 'Kot Jewar, Jaipur, RJ 303007',
    giTag: 'GI/RJ/Jaipur/BluePottery/2006',
    createdAt: new Date('2026-03-01'),
  },
];

// --------------- Products ---------------
// Primary demonstration product is ₹10,000 as specified!
const products = [
  {
    _id: 'prod-001',
    productId: 'SP-AG-MI-2026-0042',
    name: 'Agra Floral Marble Inlay Box',
    category: 'Marble Inlay (Parchin Kari)',
    description: 'Museum-grade hexagonal jewelry box crafted from translucent Makrana white marble, inlaid with over 180 individually cut semi-precious lapis lazuli and carnelian petals.',
    price: 10000, // Exact ₹10,000 demonstration standard
    artisanId: artisanIds.rashid,
    artisanName: 'Ustad Rashid Khan',
    materials: ['Makrana White Marble', 'Lapis Lazuli (Afghanistan)', 'Carnelian (Gujarat)', 'Mother of Pearl'],
    dimensions: '15cm x 15cm x 8cm',
    weight: '1.2 kg',
    isVerified: true,
    viewsCount: 142,
    status: 'available',
    createdAt: new Date('2026-01-20'),
  },
  {
    _id: 'prod-002',
    productId: 'SP-AG-MI-2026-0043',
    name: 'Taj Peacock Inlay Coaster Set (6 pcs)',
    category: 'Marble Inlay (Parchin Kari)',
    description: 'Set of six 4-inch octagonal Makrana marble coasters decorated with malachite and turquoise peacock feather motifs.',
    price: 6000,
    artisanId: artisanIds.rashid,
    artisanName: 'Ustad Rashid Khan',
    materials: ['Makrana Marble', 'Malachite', 'Turquoise', 'Jasper'],
    dimensions: '10cm diameter each',
    weight: '0.9 kg',
    isVerified: true,
    viewsCount: 89,
    status: 'available',
    createdAt: new Date('2026-01-25'),
  },
  {
    _id: 'prod-003',
    productId: 'SP-LK-CK-2026-0108',
    name: 'Fine Chikankari Muslin Kurta',
    category: 'Chikankari Embroidery',
    description: 'Hand-woven fine mulmul cotton kurta with authentic 32-stitch Lucknow needlework including jaali and murri stitches.',
    price: 8500,
    artisanId: artisanIds.meera,
    artisanName: 'Meera Devi',
    materials: ['Pure Muslin Cotton', 'Silk Resham Threads'],
    dimensions: 'Size 40 (Chest 42in)',
    weight: '250g',
    isVerified: true,
    viewsCount: 64,
    status: 'available',
    createdAt: new Date('2026-02-15'),
  },
  {
    _id: 'prod-004',
    productId: 'SP-JP-BP-2026-0219',
    name: 'Cobalt Floral Blue Pottery Urn',
    category: 'Blue Pottery',
    description: 'Hand-turned quartz stone urn painted with natural cobalt oxide in classic Persian floral scrolls.',
    price: 5500,
    artisanId: artisanIds.arjun,
    artisanName: 'Arjun Prajapati',
    materials: ['Ground Quartz', 'Glass Frit', 'Natural Gum', 'Cobalt Oxide'],
    dimensions: '25cm height x 14cm diameter',
    weight: '1.8 kg',
    isVerified: true,
    viewsCount: 45,
    status: 'available',
    createdAt: new Date('2026-03-05'),
  },
];

// --------------- Hotel Partners (Agra Pilot Target: 5 Partners) ---------------
const hotels = [
  {
    _id: 'htl-001',
    hotelId: 'HTL-AMARVILAS',
    name: 'The Oberoi Amarvilas',
    location: 'Taj East Gate Road, Agra',
    rooms: 102,
    contactPerson: 'Aditya Mathur (GM)',
    phone: '+91 562 223 1515',
    qrMagnetsDeployed: 50,
    qrScansCount: 184,
    commissionPct: 5, // 5% of product price from company's 30%
    status: 'active',
  },
  {
    _id: 'htl-002',
    hotelId: 'HTL-ITCMUGHAL',
    name: 'ITC Mughal, Luxury Collection',
    location: 'Fatehabad Road, Agra',
    rooms: 233,
    contactPerson: 'Sunita Rawat (Guest Relations)',
    phone: '+91 562 402 1111',
    qrMagnetsDeployed: 80,
    qrScansCount: 245,
    commissionPct: 5,
    status: 'active',
  },
  {
    _id: 'htl-003',
    hotelId: 'HTL-TAJCONV',
    name: 'Taj Hotel & Convention Centre',
    location: 'Taj Nagari Phase 1, Agra',
    rooms: 239,
    contactPerson: 'Karan Mehra (Concierge)',
    phone: '+91 562 233 5555',
    qrMagnetsDeployed: 60,
    qrScansCount: 132,
    commissionPct: 5,
    status: 'active',
  },
  {
    _id: 'htl-004',
    hotelId: 'HTL-CLARKSSHIRAZ',
    name: 'Hotel Clarks Shiraz',
    location: '54 Taj Road, Agra Cantt',
    rooms: 237,
    contactPerson: 'Deepak Sharma',
    phone: '+91 562 222 6121',
    qrMagnetsDeployed: 40,
    qrScansCount: 96,
    commissionPct: 5,
    status: 'active',
  },
  {
    _id: 'htl-005',
    hotelId: 'HTL-COURTYARD',
    name: 'Courtyard by Marriott Agra',
    location: 'Fatehabad Road, Agra',
    rooms: 189,
    contactPerson: 'Pooja Tandon',
    phone: '+91 562 245 7777',
    qrMagnetsDeployed: 40,
    qrScansCount: 78,
    commissionPct: 5,
    status: 'active',
  },
];

// --------------- Licensed Guides (ASI Certified) ---------------
const guides = [
  {
    _id: 'gde-001',
    guideId: 'GDE-VIKRAM',
    name: 'Vikramaditya Sharma',
    licenseNumber: 'ASI-AG-1998-042',
    phone: '+91 98370 12345',
    languages: 'English, French, Hindi',
    experienceYears: 26,
    commissionPct: 5, // 5% of product price from company's 30%
    referralsCount: 42,
    status: 'active',
  },
  {
    _id: 'gde-002',
    guideId: 'GDE-FATIMA',
    name: 'Fatima Bano',
    licenseNumber: 'ASI-AG-2005-118',
    phone: '+91 98371 67890',
    languages: 'English, German, Hindi, Urdu',
    experienceYears: 19,
    commissionPct: 5,
    referralsCount: 31,
    status: 'active',
  },
  {
    _id: 'gde-003',
    guideId: 'GDE-RAJIV',
    name: 'Rajiv Verma',
    licenseNumber: 'ASI-AG-2012-076',
    phone: '+91 98372 34567',
    languages: 'English, Spanish, Hindi',
    experienceYears: 12,
    commissionPct: 5,
    referralsCount: 18,
    status: 'active',
  },
];

// --------------- Seed Orders (70:30 Model) ---------------
const orders = [
  {
    _id: 'ord-001',
    orderId: 'SP-ORD-882190',
    productId: 'prod-001',
    productName: 'Agra Floral Marble Inlay Box',
    productPrice: 10000,
    artisanId: artisanIds.rashid,
    artisanName: 'Ustad Rashid Khan',
    buyerName: 'Eleanor Vance',
    buyerEmail: 'eleanor.vance@example.com',
    buyerPhone: '+91 98765 43210',
    deliveryMethod: 'shipping',
    shippingAddress: 'Suite 404, The Imperial Hotel, Janpath, New Delhi 110001',
    shippingCharge: 1000,
    totalAmount: 11000, // ₹10,000 product + ₹1,000 shipping
    paymentSplit: {
      artisanShare: 7000, // Exactly 70% of product price
      companyShare: 3000, // Exactly 30% of product price
      companyBreakdown: {
        guideCommission: 500,     // 5% from within company's 30%
        hotelCommission: 500,     // 5% from within company's 30%
        platformOperations: 2000, // Remainder of company's 30%
      },
      shippingFee: 1000, // Separately collected for courier
    },
    hotelId: 'HTL-AMARVILAS',
    guideId: 'GDE-VIKRAM',
    status: 'confirmed',
    payoutStatus: 'credited',
    courierStatus: 'scheduled',
    courierPickupDate: 'Tomorrow 11:30 AM IST',
    courierInstructions: 'Deliver shock-proof crate to Khan Marble Arts, Sadar Bazaar for packing handover.',
    createdAt: new Date('2026-11-17T18:00:00Z'),
  },
];

// --------------- In-Memory Store Class ---------------
const { giRegistryData } = require('./data/giRegistryData');

class InMemoryStore {
  constructor() {
    this.artisans = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.hotels = new Map();
    this.guides = new Map();
    this.giProducts = new Map();
    this.qrScans = {
      total: 735,
      byHotel: new Map(),
      byDate: new Map(),
    };
    this._counters = { artisan: 10, product: 10, order: 10, hotel: 10, guide: 10, gi: 105 };

    artisans.forEach(a => this.artisans.set(a._id, { ...a }));
    products.forEach(p => this.products.set(p._id, { ...p }));
    orders.forEach(o => this.orders.set(o._id, { ...o }));
    hotels.forEach(h => this.hotels.set(h._id, { ...h }));
    guides.forEach(g => this.guides.set(g._id, { ...g }));

    // Import the 102 GI Registered Crafts & Products (Idempotent seed)
    giRegistryData.forEach((item, index) => {
      const id = `gi-${String(index + 1).padStart(3, '0')}`;
      this.giProducts.set(id, {
        _id: id,
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  nextId(type) {
    const id = `${type}-${String(this._counters[type]++).padStart(3, '0')}`;
    return id;
  }

  // Artisans
  getAllArtisans() { return Array.from(this.artisans.values()); }
  getArtisan(id) { return this.artisans.get(id) || null; }
  createArtisan(data) {
    const id = this.nextId('artisan');
    const artisan = { _id: id, isVerified: false, verificationStatus: 'PENDING', ...data, createdAt: new Date() };
    this.artisans.set(id, artisan);
    return artisan;
  }
  updateArtisan(id, data) {
    const existing = this.artisans.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, _id: id };
    this.artisans.set(id, updated);
    return updated;
  }

  // Products
  getAllProducts() { return Array.from(this.products.values()); }
  getProduct(id) { return this.products.get(id) || null; }
  getProductByProductId(productId) {
    return Array.from(this.products.values()).find(p => p.productId === productId) || null;
  }
  createProduct(data) {
    const id = this.nextId('product');
    const product = { _id: id, viewsCount: 0, ...data, createdAt: new Date() };
    this.products.set(id, product);
    return product;
  }
  updateProduct(id, data) {
    const existing = this.products.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, _id: id };
    this.products.set(id, updated);
    return updated;
  }

  // Orders
  getAllOrders() { return Array.from(this.orders.values()); }
  getOrder(id) { return this.orders.get(id) || null; }
  getOrderByOrderId(orderId) {
    return Array.from(this.orders.values()).find(o => o.orderId === orderId) || null;
  }
  createOrder(data) {
    const id = this.nextId('order');
    const order = { _id: id, ...data, createdAt: new Date() };
    this.orders.set(id, order);
    return order;
  }
  updateOrder(id, data) {
    const existing = this.orders.get(id) || this.getOrderByOrderId(id);
    if (!existing) return null;
    const updated = { ...existing, ...data };
    this.orders.set(existing._id, updated);
    return updated;
  }
  cancelOrder(id, reason = 'Customer requested cancellation') {
    const order = this.orders.get(id) || this.getOrderByOrderId(id);
    if (!order) return null;
    if (order.status === 'cancelled') return order;

    const updated = {
      ...order,
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date(),
      payoutStatus: 'cancelled',
      courierStatus: 'cancelled',
    };
    this.orders.set(order._id, updated);
    return updated;
  }

  // Hotels
  getAllHotels() { return Array.from(this.hotels.values()); }
  getHotel(id) {
    return this.hotels.get(id) || Array.from(this.hotels.values()).find(h => h.hotelId === id) || null;
  }
  createHotel(data) {
    const id = this.nextId('htl');
    const hotel = { _id: id, qrScansCount: 0, status: 'active', ...data, createdAt: new Date() };
    this.hotels.set(id, hotel);
    return hotel;
  }

  // Guides
  getAllGuides() { return Array.from(this.guides.values()); }
  getGuide(id) {
    return this.guides.get(id) || Array.from(this.guides.values()).find(g => g.guideId === id) || null;
  }
  createGuide(data) {
    const id = this.nextId('gde');
    const guide = { _id: id, referralsCount: 0, status: 'active', ...data, createdAt: new Date() };
    this.guides.set(id, guide);
    return guide;
  }

  // ─── GI Products Registry (gi_products) ───────────────────────
  getAllGiProducts() {
    return Array.from(this.giProducts.values());
  }

  getGiProduct(id) {
    if (!id) return null;
    return this.giProducts.get(id) ||
      Array.from(this.giProducts.values()).find(g => g.name.toLowerCase() === id.toLowerCase()) || null;
  }

  createGiProduct(data) {
    const id = this.nextId('gi');
    const record = {
      _id: id,
      status: 'Registered',
      source: 'Uploaded GI registration screenshots',
      active: true,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.giProducts.set(id, record);
    return record;
  }

  updateGiProduct(id, data) {
    const existing = this.getGiProduct(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...data,
      _id: existing._id,
      updatedAt: new Date(),
    };
    this.giProducts.set(existing._id, updated);
    return updated;
  }

  searchGiProducts({ query = '', state = '', category = '', status = '', limit = 12 } = {}) {
    let list = Array.from(this.giProducts.values());

    if (state) {
      const sLower = state.toLowerCase().trim();
      list = list.filter(r => r.state && r.state.toLowerCase().includes(sLower));
    }

    if (category) {
      const cLower = category.toLowerCase().trim();
      list = list.filter(r => r.category && r.category.toLowerCase().includes(cLower));
    }

    if (status) {
      const stLower = status.toLowerCase().trim();
      list = list.filter(r => r.status && r.status.toLowerCase() === stLower);
    }

    if (!query || !query.trim()) {
      return list.slice(0, limit);
    }

    const q = query.toLowerCase().trim();
    const qEscaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Scoring & Ranking algorithm
    const scored = [];
    for (const item of list) {
      const name = (item.name || '').toLowerCase();
      const hindi = (item.hindiName || '').toLowerCase();
      const region = (item.region || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const st = (item.state || '').toLowerCase();

      let score = 0;

      if (name === q || hindi === q) {
        score = 100; // Exact match
      } else if (name.startsWith(q) || hindi.startsWith(q)) {
        score = 85;  // Prefix match
      } else if (new RegExp('(^|\\b)' + qEscaped + '(\\b|$)', 'i').test(name) || new RegExp('(^|\\b)' + qEscaped + '(\\b|$)', 'i').test(region)) {
        score = 75;  // Whole-word match in name or region (e.g. "Agra")
      } else if (region.startsWith(q)) {
        score = 65;  // Region prefix
      } else if (name.includes(q) || hindi.includes(q)) {
        score = 25;  // Weak substring match
      } else if (region.includes(q)) {
        score = 20;
      } else if (cat.includes(q) || st.includes(q)) {
        score = 15;
      } else {
        // Multi-word partial overlap
        const words = q.split(/\s+/).filter(w => w.length > 2);
        let wordMatches = 0;
        for (const w of words) {
          if (name.includes(w) || hindi.includes(w) || region.includes(w)) {
            wordMatches++;
          }
        }
        if (wordMatches > 0) {
          score = 20 + (wordMatches * 10);
        }
      }

      if (score > 0) {
        scored.push({ item, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.item);
  }

  getGiStats() {
    const list = this.getAllGiProducts();
    const byState = { 'Jammu & Kashmir': 0, 'Uttar Pradesh': 0 };
    const byCategory = {};

    list.forEach(item => {
      if (byState[item.state] !== undefined) byState[item.state]++;
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    });

    return {
      total: list.length,
      byState,
      byCategory,
    };
  }

  // QR Scan Recording
  recordScan(hotelId = null) {
    this.qrScans.total++;
    if (hotelId) {
      const hotel = this.getHotel(hotelId);
      if (hotel) {
        hotel.qrScansCount = (hotel.qrScansCount || 0) + 1;
      }
    }
    return this.qrScans.total;
  }

  // Analytics Computation (Derived entirely from actual stored orders)
  getAnalyticsSummary() {
    const allOrders = this.getAllOrders();
    const confirmedOrders = allOrders.filter(o => o.status === 'confirmed' || o.status === 'completed');
    const cancelledOrders = allOrders.filter(o => o.status === 'cancelled');

    let totalProductRevenue = 0;
    let totalArtisanPayouts = 0;
    let totalCompanyRevenue = 0;
    let totalGuideCommissions = 0;
    let totalHotelCommissions = 0;
    let totalShippingCollected = 0;

    confirmedOrders.forEach(o => {
      const pPrice = o.productPrice || 0;
      const aShare = o.paymentSplit?.artisanShare || Math.round(pPrice * 0.70);
      const cShare = o.paymentSplit?.companyShare || Math.round(pPrice * 0.30);
      const sFee = o.shippingCharge || o.paymentSplit?.shippingFee || 0;

      totalProductRevenue += pPrice;
      totalArtisanPayouts += aShare;
      totalCompanyRevenue += cShare;
      totalShippingCollected += sFee;

      const guideComm = o.paymentSplit?.companyBreakdown?.guideCommission || Math.round(pPrice * 0.05);
      const hotelComm = o.paymentSplit?.companyBreakdown?.hotelCommission || Math.round(pPrice * 0.05);
      totalGuideCommissions += guideComm;
      totalHotelCommissions += hotelComm;
    });

    const averageOrderValue = confirmedOrders.length > 0
      ? Math.round((totalProductRevenue + totalShippingCollected) / confirmedOrders.length)
      : 0;

    const totalScans = this.qrScans.total;
    const conversionRate = totalScans > 0
      ? Number(((confirmedOrders.length / totalScans) * 100).toFixed(2))
      : 0;

    return {
      overview: {
        totalQrScans: totalScans,
        uniqueVisitorsEstimate: Math.round(totalScans * 0.72),
        totalOrders: allOrders.length,
        confirmedOrdersCount: confirmedOrders.length,
        cancelledOrdersCount: cancelledOrders.length,
        conversionRatePercent: conversionRate,
        averageOrderValue,
      },
      financials: {
        totalCustomerPayments: totalProductRevenue + totalShippingCollected,
        totalProductRevenue,
        artisanPayoutsGuaranteed70: totalArtisanPayouts,
        companyGrossRevenue30: totalCompanyRevenue,
        guideCommissionsAllocated: totalGuideCommissions,
        hotelCommissionsAllocated: totalHotelCommissions,
        platformNetOperations: Math.max(0, totalCompanyRevenue - totalGuideCommissions - totalHotelCommissions),
        shippingCollectedForLogistics: totalShippingCollected,
      },
      partners: {
        activeHotelsCount: this.getAllHotels().filter(h => h.status === 'active').length,
        activeGuidesCount: this.getAllGuides().filter(g => g.status === 'active').length,
        registeredArtisansCount: this.getAllArtisans().length,
      },
    };
  }
}

module.exports = {
  InMemoryStore,
  artisans,
  products,
  orders,
  hotels,
  guides,
};
