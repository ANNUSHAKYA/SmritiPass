# Smriti Pass 2.0 — Installation & Local Setup Guide
*Handmade. Honest. Heritage. — Direct from Master Artisans*
*Pilot Location: Agra, Uttar Pradesh, India*

This guide walks you through setting up and running **Smriti Pass 2.0** on your local machine for development, testing, and pilot demonstrations.

---

## 1. System Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Modern Web Browser**: Google Chrome, Microsoft Edge, Brave, or Safari with Web Speech API and PWA support
- **Git** (optional, for version control)

No external databases (MongoDB) or heavy native compilation tools are strictly required for the demo, as Smriti Pass comes pre-configured with a zero-dependency in-memory store pre-seeded with Agra pilot artisans, products, boutique hotels, and ASI guides.

---

## 2. Quickstart Installation (Under 60 Seconds)

### Step 1: Clone or Navigate to the Repository
```bash
cd /path/to/SmritiPass
```

### Step 2: Install Server Dependencies
```bash
cd server
npm install
cd ..
```
*Note: All core cryptographic primitives (PBKDF2 password hashing, custom JWT token issuance, HMAC-SHA256 signatures) use native Node.js `crypto`, ensuring rapid installation without node-gyp or binary build failures.*

### Step 3: Configure Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```
Default configuration values work out of the box for local demonstration (`PORT=3001`).

---

## 3. Running the Application

### Start the Server
From the root directory:
```bash
npm start
```
Or directly from the server folder:
```bash
cd server && npm start
```

You should see output similar to:
```
🏛️  [SmritiPass] In-Memory Store initialized (70:30 Revenue Model & Agra Pilot Partners)
====================================================
🏛️  Smriti Pass PWA & Backend running
📡 URL: http://localhost:3001
🗺️  Tourist Trail:  http://localhost:3001/#tourist
🛒  70:30 Checkout: http://localhost:3001/#checkout
🎨  Artisan Portal: http://localhost:3001/#artisan
⚙️  Admin Dashboard: http://localhost:3001/#admin
====================================================
```

Open your browser to:
👉 **`http://localhost:3001`**

---

## 4. Running the Automated Test Suite

Smriti Pass 2.0 comes with a zero-dependency automated test runner covering the non-negotiable **70:30 Fair Trade Revenue Model** and **Order Lifecycle & Security Hardening**.

Execute tests from the project root:
```bash
npm test
```

Expected result:
```
========================================================
🏛️  SMRITI PASS 2.0 — MASTER AUTOMATED TEST SUITE
Agra Pilot Production Readiness Verification
========================================================

--- [TEST SUITE 1] 70:30 Fair Trade Revenue Model Tests ---
  ✓ Standard ₹10,000 Product (Carry With Me): Artisan ₹7,000, Company ₹3,000, Shipping ₹0, Total ₹10,000
  ✓ Standard ₹10,000 Product (Insured Shipping): Artisan ₹7,000 (70% unchanged!), Company ₹3,000, Shipping ₹1,000, Total ₹11,000
  ✓ Internal Partner Commissions (5% Guide, 5% Hotel) come FROM WITHIN Company 30%
  ✓ Low-price Item: ₹600 (Carry With Me)
  ✓ Medium-price Item: ₹8,500 (Insured Shipping)
  ✓ High-value Item: ₹50,000 Inlay Tabletop
  ✓ Odd Price Decimal Rounding: ₹999 Product Price
  ✓ Odd Price Decimal Rounding: ₹1,337 Product Price
  ✓ Sanitization of string and float prices
  ✓ Zero or negative price edge case handling
Suite 1 Results: 10 passed, 0 failed

--- [TEST SUITE 2] Order Lifecycle & Security Verification ---
  ✓ PBKDF2 Password Hashing produces salted hash and verifies correctly
  ✓ JWT Token generator creates valid token and verifies claims
  ✓ Idempotency Store prevents duplicate order processing
  ✓ Sanitization helpers mitigate basic XSS and bound numbers
  ✓ Store creates order with verified 70:30 allocation
  ✓ Order Cancellation revokes payout and updates status
  ✓ Artisan payout progresses through initiated -> processing -> credited
  ✓ Courier pickup status updates for shipping orders
  ✓ Analytics computes metrics strictly from recorded database transactions
Suite 2 Results: 9 passed, 0 failed

========================================================
TOTAL TESTS RUN: 19
PASSED: 19
FAILED: 0
EXECUTION TIME: 95ms
========================================================
✅ ALL TESTS PASSED SUCCESSFULLY (100% PASS RATE)
```

---

## 5. Seed Credentials for Demo

| Role | Username / Email | Password | Access Route |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@smritipass.org` | `AgraPilot2026!` | `/#admin` |
| **Master Artisan** | `rashid@smritipass.org` | `ParchinKari123!` | `/#artisan` |
| **Tourist** | *(No login required)* | *(Public Access)* | `/#tourist`, `/#checkout` |

---

## 6. Generating Physical Fridge Magnet Print Assets

To regenerate the vector SVG and 300 DPI high-resolution PNG for Agra hotel fridge magnets:
```bash
node server/scripts/generatePrintQr.js
```
Generated assets:
- `public/assets/qr-fridge-magnet-print.svg` (Infinite resolution vector with quiet zone)
- `public/assets/qr-fridge-magnet-1200.png` (1200×1200px 300 DPI print-ready image)
