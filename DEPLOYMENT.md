# Smriti Pass 2.0 — Production Deployment Architecture & Guide
*Handmade. Honest. Heritage. — Direct from Master Artisans*
*Initial Pilot: Agra, Uttar Pradesh, India*

This document outlines the production deployment topology, security hardening, cloud hosting options, and database configuration for the Smriti Pass 2.0 Progressive Web Application and backend service.

---

## 1. Production Topology & Architecture

```
                   [ Mobile Tourist / Hotel Magnet QR ]
                                    │
                                    ▼
                ┌───────────────────────────────────────┐
                │        Cloudflare / Edge CDN          │
                │    - TLS 1.3 / SSL Termination        │
                │    - DDoS Protection & Caching        │
                │    - HTTP to HTTPS Redirect           │
                └───────────────────┬───────────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
       ┌───────────────────────────┐ ┌───────────────────────────┐
       │   Frontend PWA (Static)   │ │  Node.js API Microservice │
       │  - HTML5 / CSS3 / ES6     │ │  - Express REST Backend   │
       │  - Offline Service Worker │ │  - 70:30 Revenue Engine   │
       │  - Web Speech Engine      │ │  - Rate Limiting & Auth   │
       │  (Vercel / Cloudflare)    │ │  (Render / Railway / Fly) │
       └───────────────────────────┘ └─────────────┬─────────────┘
                                                   │
                                     ┌─────────────┴─────────────┐
                                     ▼                           ▼
                      ┌────────────────────────────┐ ┌───────────────────────────┐
                      │    MongoDB Atlas Cluster   │ │    Local Upload / S3      │
                      │  - Primary replica set     │ │  - 5MB Image Quota      │
                      │  - Automated backups       │ │  - MIME Content Filter  │
                      └────────────────────────────┘ └───────────────────────────┘
```

---

## 2. Option A: Monolithic Deployment (Recommended for Pilot)
*Run frontend and backend as a unified high-performance service on Render, Railway, or Fly.io.*

### A. Deploying to Render.com
1. Create a **New Web Service** connected to your GitHub repository.
2. Configure settings:
   - **Environment:** `Node`
   - **Build Command:** `npm --prefix server install`
   - **Start Command:** `node server/index.js`
   - **Auto-Deploy:** Yes (on push to `main`)
3. Add Environment Variables in Render Dashboard:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `PUBLIC_URL=https://smritipass.onrender.com`
   - `FRONTEND_URL=https://smritipass.onrender.com`
   - `JWT_SECRET=<64-character-random-hex-string>`
   - `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smritipass?retryWrites=true&w=majority`

### B. Deploying to Railway.app
1. Run `railway init` or select GitHub repo from the web console.
2. Add a `Procfile` (or specify start command):
   ```text
   web: node server/index.js
   ```
3. Attach environment variables via the Railway dashboard.
4. Railway will automatically provision an HTTPS certificate (`*.up.railway.app`).

---

## 3. Option B: Decoupled Deployment (Vercel Frontend + Render API)

If hosting the static PWA separately on Vercel:
1. **Frontend (Vercel):**
   - Root directory: `public`
   - In `public/js/app.js`, set `APP_CONFIG.API_BASE = 'https://api.smritipass.org/api'` or configure a `vercel.json` rewrite:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://api.smritipass.org/api/$1" }
     ]
   }
   ```
2. **Backend (Render / DigitalOcean App Platform):**
   - Set `FRONTEND_URL=https://smritipass.org` to allow secure CORS requests with credentials.

---

## 4. Production Database Configuration (MongoDB Atlas)

While local demonstration uses the built-in resilient in-memory store, production persists data to MongoDB Atlas:

1. **Sign in to MongoDB Atlas** and create an `M0 Free` or `M10 Shared` cluster in `ap-south-1` (Mumbai, India) for minimal latency to Agra users.
2. **Network Access:** Allow connections from your cloud host IP, or whitelist `0.0.0.0/0` with strong authentication.
3. **Database User:** Create a dedicated user `smriti_app` with read/write access to database `smritipass`.
4. **Connection String:**
   ```env
   MONGODB_URI=mongodb+srv://smriti_app:<password>@cluster0.abcde.mongodb.net/smritipass?retryWrites=true&w=majority
   ```
5. **Initial Seeding in Production:**
   Run the seed script once to populate Agra pilot master artisans, boutique hotels, and ASI guides:
   ```bash
   NODE_ENV=production MONGODB_URI="..." node server/seed.js
   ```

---

## 5. Security & SSL Requirements for PWA & Audio

1. **Mandatory HTTPS:**
   - Both the **Service Worker** (`sw.js`) and the **Web Speech API** (`webkitSpeechRecognition`) require an HTTPS origin. They will fail on insecure HTTP (except on `localhost`).
   - Cloudflare or Render will provide free TLS certificates.
2. **Security Headers (Configured in `server/middleware/security.js`):**
   - `X-Content-Type-Options: nosniff` (prevents MIME type confusion attacks)
   - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: microphone=(self)` (allows voice recording for artisan portal)
3. **Rate Limiting:**
   - Global: 150 requests per minute per IP.
   - Order placement: 25 requests per 10 minutes per IP.
4. **Idempotency:**
   - All `/api/orders` POST requests enforce the `X-Idempotency-Key` header to prevent network retries from double-charging tourists or generating duplicate orders.

---

## 6. Zero Downtime Health Checks

Configure your load balancer or hosting provider to ping:
- **HTTP Method:** `GET`
- **Path:** `/api/health`
- **Expected Status:** `200 OK`
- **Expected Body:**
  ```json
  {
    "status": "healthy",
    "version": "2.0.0",
    "revenueModel": "70:30 Fair Trade",
    "location": "Agra, Uttar Pradesh, India"
  }
  ```
