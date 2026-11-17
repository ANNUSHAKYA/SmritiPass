# Smriti Pass 2.0 — REST API Specification
*Handmade. Honest. Heritage. — Direct from Master Artisans*

Base URL: `http://localhost:3001/api` (Production: `https://smritipass.org/api`)

---

## 1. System Health

### `GET /health`
Returns system status, version, and the enforced revenue model.

- **Request:** None
- **Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "revenueModel": "70:30 Fair Trade",
  "location": "Agra, Uttar Pradesh, India",
  "timestamp": "2026-11-18T04:30:00.000Z"
}
```

---

## 2. Authentication

### `POST /auth/login`
Authenticates an administrator or master artisan using PBKDF2 password verification and returns an HMAC-SHA256 JWT token.

- **Request Body:**
```json
{
  "email": "admin@smritipass.org",
  "password": "AgraPilot2026!"
}
```
- **Response (200 OK):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "admin-agra-01",
    "name": "Agra Pilot Operations Admin",
    "email": "admin@smritipass.org",
    "role": "admin"
  }
}
```

### `GET /auth/me`
Fetches the currently authenticated user profile.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Returns user profile object.

---

## 3. Products & Artisans

### `GET /products`
Retrieves all published authentic craft items.

- **Response (200 OK):**
```json
{
  "status": "success",
  "count": 4,
  "data": [
    {
      "productId": "SP-AG-MI-2026-0042",
      "name": "Agra Floral Marble Inlay Box",
      "price": 10000,
      "artisanId": "artisan-rashid-01",
      "craft": "Parchin Kari (Marble Inlay)",
      "material": "Makrana White Marble, Lapis Lazuli, Malachite, Carnelian",
      "dimensions": "15cm × 15cm × 8cm, 1.2kg",
      "completionDays": 18,
      "imageUrl": "/assets/marble-box.png"
    }
  ]
}
```

### `GET /products/:id`
Retrieves a single product by ID or SKU.

### `GET /artisans`
Lists all master artisans with guild accreditation and workshop coordinates.

### `POST /artisans/:id/voice-product`
Enables artisans to create catalog items using speech recognition transcripts and optional photographic proof.
- **Form Data:**
  - `name`: string
  - `price`: number (default: 10000)
  - `craft`: string
  - `transcript`: string (Hindi/English spoken voice description)
  - `image`: binary file (max 5MB, JPEG/PNG/WebP)

---

## 4. Orders & 70:30 Fair Trade Checkout

### `POST /orders`
Creates a verified order, automatically calculates the non-negotiable 70:30 allocation, attaches partner referrals, and initiates escrow.

- **Headers:**
  - `Content-Type: application/json`
  - `X-Idempotency-Key: <unique-uuid>` *(Mandatory to prevent double-charging)*
- **Request Body (Example: Option B Insured Shipping):**
```json
{
  "productId": "SP-AG-MI-2026-0042",
  "productName": "Agra Floral Marble Inlay Box",
  "productPrice": 10000,
  "deliveryOption": "shipping",
  "buyerName": "Elena Rostova",
  "buyerEmail": "elena.rostova@example.com",
  "buyerPhone": "+91 98765 43210",
  "shippingAddress": {
    "street": "142 Kurfürstendamm",
    "city": "Berlin",
    "country": "Germany",
    "postalCode": "10707"
  },
  "hotelReferralCode": "HOTEL-AMARVILAS",
  "guideReferralCode": "GUIDE-AG-01"
}
```

- **Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "orderId": "SP-ORD-2026-9812",
    "status": "confirmed",
    "productPrice": 10000,
    "shippingCost": 1000,
    "totalPaid": 11000,
    "paymentSplit": {
      "productPrice": 10000,
      "deliveryOption": "shipping",
      "shippingCost": 1000,
      "totalAmount": 11000,
      "artisanShare": 7000,
      "companyShare": 3000,
      "effectiveArtisanPercentage": "70.0%",
      "effectiveCompanyPercentage": "30.0%",
      "internalAllocations": {
        "guideCommission": 500,
        "hotelCommission": 500,
        "platformOperations": 2000
      }
    },
    "payoutStatus": "initiated",
    "courierStatus": "pending"
  }
}
```

### `GET /orders/:id/track`
Public tracking endpoint for tourists to monitor their order fulfillment and courier tracking.

---

## 5. Pilot Administration & Operations

All `/api/admin/*` endpoints require header: `Authorization: Bearer <admin-token>`.

### `GET /admin/analytics`
Computes real-time financial KPIs derived strictly from recorded database transactions:
- `overview`: totalOrders, totalQrScans, averageOrderValue
- `financials`: totalCustomerPayments, artisanPayoutsGuaranteed70, companyGrossRevenue30, logisticsEscrowCollected, guideCommissionsAllocated, hotelCommissionsAllocated

### `GET /admin/orders`
Lists all orders with detailed 70:30 splits and fulfillment states.

### `POST /admin/orders/:id/cancel`
Cancels an order and automatically revokes pending artisan payouts.
- **Body:** `{ "reason": "Customer cancellation request" }`

### `POST /admin/orders/:id/refund`
Processes a refund and updates order status to `refunded`.

### `PUT /admin/orders/:id/payout-status`
Updates artisan payout lifecycle: `initiated` $\rightarrow$ `processing` $\rightarrow$ `credited`.
- **Body:** `{ "payoutStatus": "credited" }`

### `PUT /admin/orders/:id/courier-status`
Updates white-glove courier status: `pending` $\rightarrow$ `scheduled` $\rightarrow$ `picked_up` $\rightarrow$ `in_transit` $\rightarrow$ `delivered`.
- **Body:** `{ "courierStatus": "picked_up", "trackingNumber": "DHL-AGRA-99120" }`

### `GET /admin/hotels` & `POST /admin/hotels`
Manage Agra partner hotels (The Oberoi Amarvilas, ITC Mughal, etc.).

### `GET /admin/guides` & `POST /admin/guides`
Manage ASI-licensed heritage guides with license numbers and referral attribution.

---

## 6. Physical QR Fridge Magnet Generation

### `GET /qr/fridge-magnet`
Generates print-ready QR magnet assets dynamically.

- **Query Parameters:**
  - `format`: `svg` (default) or `png`
  - `size`: width in pixels (e.g. `1200` for 300 DPI print)
  - `url`: target URL (defaults to `PUBLIC_URL + '/#tourist'`)

- **Examples:**
  - Vector: `GET /api/qr/fridge-magnet?format=svg`
  - 300 DPI Print: `GET /api/qr/fridge-magnet?format=png&size=1200`
