# Smriti Pass 2.0 🏛️
### *Handmade. Honest. Heritage.*
> **Tagline:** Direct from Master Artisans  
> **Initial Pilot:** Agra, Uttar Pradesh, India

---

## 🌟 Executive Overview & Business Model

Traditional Indian handicraft master artisans are often exploited by commercial middlemen who inflate retail prices while paying craftsmen less than 15–20% of the sale value. 

**Smriti Pass 2.0** is a mobile-first Progressive Web App (PWA) that connects tourists directly with India's master artisans through physical QR fridge magnets placed in luxury hotel rooms, guaranteeing an honest, transparent **70:30 Fair Trade Revenue Model** and featuring an **AI-Powered Geographical Indication (GI) Voice Search Engine**:

* 👨🏽‍🎨 **Master Artisan Share (70%):** Exactly 70% of the product price is paid directly to the artisan. This share is non-negotiable and strictly protected.
* 🏛️ **Smriti Pass Company Share (30%):** Covers ASI-licensed guide commissions (5%), boutique hotel partner commissions (5%), platform technology, artisan verification, and network operations. Partner commissions are funded **from within the company's 30%** and are never deducted from the artisan's share or added on top of the product price.
* 📦 **Shipping & Logistics (Separately Collected):** 
  * **Option 1: Carry With Me:** ₹0 (Free workshop handover with protective velvet packaging).
  * **Option 2: Insured Doorstep Shipping:** ₹1,000 (Dedicated insured art courier dispatch from workshop to doorstep).
* 🇮🇳 **Official GI-Registered Craft Database:** 102 verified Geographical Indication entries from Jammu & Kashmir (24) and Uttar Pradesh (78) with categories (Handicraft, Agricultural, Food Stuff, Manufactured, Natural) and registration dates.
* 🎙️ **Intelligent Bilingual Voice Assistant:** Hindi and English speech recognition & SpeechSynthesis returning **only** relevant records without dumping the dataset.

---

## 📱 Application Screens & Routing

The application features three tourist-and-artisan primary screens and one operations screen with hash-based routing:

```
[Screen 1: /#tourist] ──(Buy Now)──> [Screen 2: /#checkout] ──(Order Created)──> [Screen 3: /#artisan]
                                  │
                                  └──────────────> [Screen 4: /#admin] (Control Center)
```

### Screen 1: Tourist Experience (`/#tourist`)
1. **Physical QR Entry:** Tourists scan the physical fridge magnet in their hotel room to open the PWA instantly without app store friction.
2. **Agra Heritage Trail:** 3-stop curated trail:
   * *Stop 01: The Taj Mahal Inlay Gates* (Mughal origins of Parchin Kari).
   * *Stop 02: Marble Inlay Workshops* (Living master guilds in Sadar Bazaar).
   * *Stop 03: Gokulpura Artisan Quarter* (Generations preserving hereditary stonecraft).
3. **Static Master Artisan Credential Card:**
   * Features Ustad Rashid Khan's photograph, 35-year master experience, workshop coordinates, and Geographical Indication accreditation (*GI/UP/Agra/MarbleInlay/2025*).
4. **Product Catalogue Immediately Below Credential Card:**
   * Handcrafted items displaying price in INR, craft technique, Digital Product Passport, and guaranteed 70% artisan share.
5. **Intelligent GI Craft Voice Search ("Ask About Indian Crafts"):**
   * Prominent interactive voice section powered by browser `SpeechRecognition` and native `SpeechSynthesis`.
   * Supports Hindi and English queries:
     * *"Agra ka GI craft kaunsa hai?"* $\rightarrow$ returns Agra Durrie, Agra Leather Footwear, Agra Stone Inlay Work.
     * *"Tell me about Banaras Zardozi."* $\rightarrow$ returns exact official registration record.
     * *"Kashmir ke handicrafts dikhao."* $\rightarrow$ returns Jammu & Kashmir handicraft records.
     * *"Uttar Pradesh ke agricultural products batao."* $\rightarrow$ returns Uttar Pradesh agricultural records.
     * *"Agra Stone Inlay Work ke baare mein batao."* $\rightarrow$ returns official GI record and links genuine marketplace listing for Ustad Rashid Khan.
   * **Strict Relevancy:** Only displays matching records, speaks the answer aloud, and provides audio replay/stop controls.

### Screen 2: Secure Checkout & 70:30 Payment Distribution (`/#checkout`)
1. **Dynamic Product Reception:** Displays the selected product (defaulting to the ₹10,000 demonstration standard).
2. **Two Delivery Options:**
   * **Option 1: Carry With Me (₹0 Shipping):** Customer carries product. Total = ₹10,000. Handover at Agra workshop.
   * **Option 2: Insured Doorstep Shipping (+₹1,000 Shipping):** White-glove courier dispatch. Total = ₹11,000.
3. **Exact Demonstration Calculation ($P = \text{₹10,000}$):**
   * **Carry With Me:** Product ₹10,000 + Shipping ₹0 = **Total ₹10,000**.
     * Master Artisan: **₹7,000** (70%)
     * Smriti Pass Company: **₹3,000** (30%)
   * **Insured Doorstep Shipping:** Product ₹10,000 + Shipping ₹1,000 = **Total ₹11,000**.
     * Master Artisan: **₹7,000** (70% unchanged!)
     * Smriti Pass Company: **₹3,000** (30%)
     * Shipping / Courier: **₹1,000** (Separately collected)
4. **Visual Animated Breakdown:**
   * Dual progress bars for Master Artisan (70%) and Company (30%).
   * Expandable drawer showing how Guide (5%) and Hotel (5%) commissions come out of Company's 30%.
5. **Payment Confirmation:**
   * Backend order validation with `X-Idempotency-Key` and demo transaction confirmation.

### Screen 3: Artisan Zero-Literacy Voice Portal (`/#artisan`)
1. **Hindi-First Accessibility:** Designed specifically for artisans with limited smartphone or literacy experience.
2. **Four Large Tactile Action Buttons:**
   * **1. नया उत्पाद जोड़ें (Add New Craft):** Voice-to-catalog entry.
   * **2. नए ऑर्डर (New Orders):** Audio readout of incoming orders in Hindi.
   * **3. भुगतान सुनें (Listen to Payment):** Audio readout of the artisan's 70% share in Hindi.
   * **4. कूरियर सूचना (Courier Information):** Audio pickup schedule for shipping orders.
3. **Hindi Voice-to-Catalog:**
   * Tapping the microphone activates `SpeechRecognition` in `hi-IN`.
   * Natural spoken Hindi auto-populates product name and price.
4. **Native Browser Audio (Zero WhatsApp Dependency):**
   * Completely independent of WhatsApp or third-party SMS APIs.
   * Uses browser `SpeechSynthesis` with `hi-IN` to read orders, dynamic payouts, and courier instructions aloud.

### Screen 4: Agra Pilot Control Center (`/#admin`)
1. **Real-time Financial KPIs:** Total Magnet Scans, Gross Purchases, Guaranteed Artisan Payouts (70%), Company Share (30%), Guide/Hotel Commissions, and Average Order Value.
2. **GI Registry Manager:** Inspect and search all 102 official registered crafts with admin facility to update records (`PUT /api/gi/products/:id`).
3. **Order Fulfillment & Payout Audit:** Live table of all orders with order cancellation, refund, and payout state transitions (`initiated` $\rightarrow$ `processing` $\rightarrow$ `credited`).
4. **Boutique Hotel Registry:** 5 flagship Agra hotels (The Oberoi Amarvilas, ITC Mughal, Taj Convention, Clarks Shiraz, Courtyard Marriott).
5. **ASI Guide Registry:** 3 licensed guides with license numbers, language pairs, and referral counts.
6. **Physical Fridge Magnet Print Asset Generator:** Download print-ready vector SVG and 1200×1200px 300 DPI master assets.

---

## 🚀 Quick Start Guide

### 1. Requirements
* Node.js v18+ and npm.

### 2. Start the Server
```bash
# From project root
npm start
```
The server will start on:
👉 **`http://localhost:3001`**

Routes:
- 🗺️ **Tourist Trail & GI Voice Search:** `http://localhost:3001/#tourist`
- 🛒 **70:30 Checkout:** `http://localhost:3001/#checkout`
- 🎨 **Artisan Portal:** `http://localhost:3001/#artisan`
- ⚙️ **Pilot Admin & GI Registry:** `http://localhost:3001/#admin`

---

## 🧪 Automated Testing

Smriti Pass 2.0 includes a comprehensive, zero-dependency automated test runner:
```bash
npm test
```
**Results:** **34/34 tests passed (100% pass rate in <200ms)** covering:
- 70:30 math enforcement for ₹10,000, odd prices (₹999, ₹1,337), high value (₹50,000), and edge cases.
- Separation of logistics pass-through charges.
- Deduction of partner commissions from company share.
- PBKDF2 hashing, JWT verification, and idempotency deduplication.
- Order cancellation and payout progression.
- GI database validation (102 records, authentic J&K and UP dates and categories).
- Intelligent Voice Search query interpretation (Agra, Banaras, Kashmir, UP Agriculture, Inlay Work, No-match queries).
- Spoken Hindi and English text-to-speech generation.

---

## 📊 Feature Status Matrix

| Component | Status | Details |
|---|---|---|
| **GI Craft Database (gi_products)** | ✅ Live | 102 official records: 24 Jammu & Kashmir, 78 Uttar Pradesh. |
| **Intelligent Voice Search** | ✅ Live | Browser `SpeechRecognition`, Hindi/English NLP parsing, strict relevancy. |
| **Spoken Audio Voice Output** | ✅ Live | Browser `SpeechSynthesis` spoken answers in natural Hindi and English. |
| **Responsive Web Design** | ✅ Live | Fluid layout across 320px, 375px, 390px, 430px, 768px, 1024px, 1366px, 1920px. |
| **Tourist Trail & Credential Card** | ✅ Live | 3 stops, static GI credential card, no video buffering. |
| **Product Selection & Cart State** | ✅ Live | Dynamic selection from catalog to checkout. |
| **70:30 Payment Distribution** | ✅ Live | 70% artisan ($P \times 0.7$), 30% company ($P \times 0.3$), separate shipping. |
| **Two Delivery Methods** | ✅ Live | Carry With Me (₹0) vs Insured Doorstep Shipping (₹1,000). |
| **Artisan Voice Portal** | ✅ Live | 4 large buttons, native `SpeechRecognition` and `SpeechSynthesis` in Hindi. |
| **Admin Operations Dashboard** | ✅ Live | Real-time analytics, GI registry viewer & editor, order audit, partner registries. |
| **Digital Product Passport** | ✅ Live | Unique ID (SP-AG-MI-2026-0042), SHA-256 evidence fingerprint, Craft DNA, provenance timeline. |
| **PWA Manifest & Service Worker** | ✅ Live | Standalone installable PWA with offline caching of registry. |
| **Automated Tests** | ✅ 100% Pass | 34 automated unit & integration tests passing with 100% success rate. |
| **Blockchain / Web3** | ❌ Excluded | Excluded external Web3 wallet dependencies/gas fees as per prompt constraints. |
| **WhatsApp APIs** | ❌ Excluded | Excluded third-party messaging in favor of native browser voice synthesis. |

---
*Built with pride for India's Traditional Master Artisans.* 🏛️✨
