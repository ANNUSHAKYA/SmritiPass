# Smriti Pass 2.0 — Automated Test Verification Report
*Agra Pilot Production Readiness & Fair Trade Compliance*

- **Date:** November 18, 2026
- **Test Runner:** Custom Zero-Dependency Verification Suite (`server/tests/runAllTests.js`)
- **Total Tests:** 19
- **Passed:** 19 (100%)
- **Failed:** 0
- **Execution Time:** ~95ms

---

## 1. Executive Summary

This report provides verifiable test evidence that **Smriti Pass 2.0** strictly enforces the core business invariant:
$$\text{Artisan Guaranteed Payout} = \text{Product Price} \times 0.70$$
$$\text{Smriti Pass Company Share} = \text{Product Price} \times 0.30$$

The tests verify that:
1. Shipping charges (₹0 for Carry With Me, ₹1,000 for Insured Shipping) are collected as a separate pass-through logistics charge and **never** alter the artisan's 70% share.
2. ASI Guide and Boutique Hotel partner commissions are deducted strictly **from within the company's 30%** share and are **never** subtracted from the artisan's guaranteed 70% payout.
3. Odd prices (e.g. ₹999, ₹1,337) round predictably without lost paise or floating-point anomalies.
4. Security controls (PBKDF2 salted password hashing, HMAC-SHA256 JWT tokens, idempotency deduplication, input sanitization) prevent fraudulent manipulation.

---

## 2. Test Suite 1: 70:30 Fair Trade Revenue Model Tests

| # | Test Scenario | Inputs | Calculated Breakdown | Verification Result |
| :---: | :--- | :--- | :--- | :---: |
| **1** | Standard Product (Carry With Me) | Product: ₹10,000<br>Delivery: `carry` | Total: ₹10,000<br>• Artisan (70%): **₹7,000**<br>• Company (30%): **₹3,000**<br>• Shipping: **₹0** | **PASSED** ✅ |
| **2** | Standard Product (Insured Shipping) | Product: ₹10,000<br>Delivery: `shipping` | Total: ₹11,000<br>• Artisan (70%): **₹7,000** (Unchanged!)<br>• Company (30%): **₹3,000**<br>• Shipping: **₹1,000** | **PASSED** ✅ |
| **3** | Internal Partner Commissions | Product: ₹10,000<br>Guide: 5%, Hotel: 5% | • Artisan: **₹7,000** (Strictly 70%)<br>• Company Net: **₹2,000**<br>• Guide Comm: **₹500**<br>• Hotel Comm: **₹500** | **PASSED** ✅ |
| **4** | Low-Price Craft Item | Product: ₹600<br>Delivery: `carry` | Total: ₹600<br>• Artisan: **₹420**<br>• Company: **₹180** | **PASSED** ✅ |
| **5** | Medium-Price Inlay Plate | Product: ₹8,500<br>Delivery: `shipping` | Total: ₹9,500<br>• Artisan: **₹5,950**<br>• Company: **₹2,550**<br>• Shipping: **₹1,000** | **PASSED** ✅ |
| **6** | High-Value Heritage Tabletop | Product: ₹50,000<br>Delivery: `shipping` | Total: ₹51,000<br>• Artisan: **₹35,000**<br>• Company: **₹15,000**<br>• Shipping: **₹1,000** | **PASSED** ✅ |
| **7** | Odd Price Decimal Rounding (₹999) | Product: ₹999<br>Delivery: `carry` | Total: ₹999<br>• Artisan: **₹699** (999 * 0.70 = 699.3 -> 699)<br>• Company: **₹300** (999 - 699 = 300) | **PASSED** ✅ |
| **8** | Odd Price Decimal Rounding (₹1,337) | Product: ₹1,337<br>Delivery: `shipping` | Total: ₹2,337<br>• Artisan: **₹936** (1337 * 0.70 = 935.9 -> 936)<br>• Company: **₹401** (1337 - 936 = 401)<br>• Shipping: **₹1,000** | **PASSED** ✅ |
| **9** | String & Float Price Sanitization | Price: `"10000.50"` | Properly parsed to integer ₹10,000; returns valid 70:30 allocation without throw | **PASSED** ✅ |
| **10** | Zero or Negative Price Edge Cases | Price: `0`, `-500` | Rejected with graceful fallback: Artisan ₹0, Company ₹0, Shipping ₹0 | **PASSED** ✅ |

---

## 3. Test Suite 2: Order Lifecycle & Security Verification Tests

| # | Test Scenario | Description | Verification Result |
| :---: | :--- | :--- | :---: |
| **11** | PBKDF2 Password Hashing | Generates 10,000-iteration PBKDF2 salt + hash; verifies matching passwords return `true` and incorrect passwords return `false`. | **PASSED** ✅ |
| **12** | JWT Token Generator | Generates Base64URL HMAC-SHA256 tokens with expiry; decodes and validates signature and claims. | **PASSED** ✅ |
| **13** | Idempotency Store Deduplication | Submitting duplicate `X-Idempotency-Key` headers caches and returns original result without double-crediting or re-running logic. | **PASSED** ✅ |
| **14** | XSS Sanitization & Input Bounding | Sanitizes malicious HTML tags (`<script>alert(1)</script>`) and enforces positive integer bounds on monetary inputs. | **PASSED** ✅ |
| **15** | Order Creation with 70:30 Storage | Creates order `SP-ORD-TEST-001`, persists full calculated allocation, and sets status to `confirmed`. | **PASSED** ✅ |
| **16** | Order Cancellation & Payout Revocation | Transitions order to `cancelled`; updates `payoutStatus` to `cancelled`, preventing fraudulent payouts. | **PASSED** ✅ |
| **17** | Artisan Payout Progression | Verifies sequential payout states: `pending` $\rightarrow$ `initiated` $\rightarrow$ `processing` $\rightarrow$ `credited`. | **PASSED** ✅ |
| **18** | Courier Pickup Status Updates | Updates shipping orders from `pending` $\rightarrow$ `scheduled` $\rightarrow$ `picked_up` $\rightarrow$ `in_transit` $\rightarrow$ `delivered`. | **PASSED** ✅ |
| **19** | Analytics Integrity from Transactions | Computes gross revenue, guaranteed artisan payouts, company revenue, and commissions strictly from recorded orders in the database. | **PASSED** ✅ |

---

## 4. Verification Command

Any developer, auditor, or hackathon judge can reproduce this test report in 100 milliseconds:
```bash
npm test
```
Result: **19 passing, 0 failing**.
