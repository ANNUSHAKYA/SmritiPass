# Smriti Pass 2.0 — Environment Configuration Guide

This document describes all environment variables used by the Smriti Pass 2.0 application.

Copy the `.env.example` template to initialize your local environment:
```bash
cp .env.example .env
```

---

## Environment Variables Reference

| Variable | Default Value | Required? | Description |
| :--- | :--- | :---: | :--- |
| `PORT` | `3001` | No | Port on which the Express server listens. |
| `NODE_ENV` | `development` | No | Environment mode: `development`, `test`, or `production`. |
| `MONGODB_URI` | *(empty / in-memory)* | Optional | MongoDB connection string (e.g., `mongodb+srv://user:pass@cluster0.mongodb.net/smritipass`). If left blank, the app runs smoothly with the pre-seeded in-memory store. |
| `JWT_SECRET` | `smriti-pass-production-hmac-secret-agra-2026` | Recommended | 64-character secret key used to sign HMAC-SHA256 JWT tokens for admin and artisan authentication. |
| `JWT_EXPIRES_IN` | `7d` | No | Expiration period for issued authentication tokens. |
| `PUBLIC_URL` | `http://localhost:3001` | Recommended | Canonical base URL used when generating QR fridge magnet links and external callbacks. (In production: `https://smritipass.org`). |
| `FRONTEND_URL` | `http://localhost:3001` | No | Allowed CORS origin for cross-origin frontend setups. |
| `SHIPPING_COST_INR` | `1000` | No | Standard insured doorstep shipping fee for Option B (collected separately from product price). |
| `DEFAULT_GUIDE_COMMISSION_PCT` | `5` | No | Standard commission percentage allocated to ASI-licensed guides, paid strictly out of the company's 30% share. |
| `DEFAULT_HOTEL_COMMISSION_PCT` | `5` | No | Standard commission percentage allocated to partner boutique hotels, paid strictly out of the company's 30% share. |

---

## Production Security Notes

1. **Rotate `JWT_SECRET`**:
   In production, generate a cryptographically secure random string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. **Set `PUBLIC_URL` to HTTPS**:
   QR codes printed on physical fridge magnets must encode the canonical HTTPS URL (`https://smritipass.org/#tourist`) to guarantee seamless camera opening and browser trust.
3. **Database Credentials**:
   Never commit `.env` containing production MongoDB Atlas passwords to version control. Keep `.env` listed in `.gitignore`.
