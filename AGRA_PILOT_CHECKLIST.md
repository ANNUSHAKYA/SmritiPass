# Smriti Pass 2.0 — Agra Pilot Operational Readiness Checklist
*Handmade. Honest. Heritage. — Direct from Master Artisans*
*Initial Pilot Launch: Agra, Uttar Pradesh, India*

This document provides the complete operational roadmap for deploying the Smriti Pass 2.0 pilot in Agra across partner luxury hotels, ASI-licensed guides, master artisan guilds, and insured art logistics.

---

## 1. Pilot Objectives & Milestones

1. **Protect Artisans:** Guarantee that 70% of every handicraft sale flows directly to verified master artisans without middleman leakage.
2. **Eliminate Tourist Counterfeiting:** Direct tourists from luxury hotels to authentic GI-accredited workshops (Parchin Kari / Marble Inlay, Zardozi embroidery, leathercraft).
3. **Frictionless Discovery via Physical Magnets:** Place 250 branded QR fridge magnets in guest suites across 5 luxury Agra hotels.
4. **Target Pilot Volume:** 50 verified handicraft orders within the first 30 days of pilot launch.

---

## 2. Luxury Boutique Hotel Onboarding (5 Properties)

| Property Name | Location | Rooms | Concierge Contact | Magnet Quota | Status |
| :--- | :--- | :---: | :--- | :---: | :---: |
| **The Oberoi Amarvilas** | Taj East Gate Rd, Agra | 102 | Concierge Desk | 60 | Registered |
| **ITC Mughal, A Luxury Collection** | Fatehabad Rd, Agra | 233 | Guest Relations | 60 | Registered |
| **Taj Hotel & Convention Centre** | Taj East Gate Rd, Agra | 239 | Duty Manager | 50 | Registered |
| **Hotel Clarks Shiraz** | 54 Taj Rd, Agra Cantt | 237 | Front Office | 40 | Registered |
| **Courtyard by Marriott Agra** | Fatehabad Rd, Agra | 189 | Concierge Lead | 40 | Registered |

### Hotel Partner Protocols:
- [x] Unique referral codes assigned (`HOTEL-AMARVILAS`, `HOTEL-MUGHAL`, etc.).
- [ ] Concierge briefing on the 70:30 Fair Trade model and the ethical craft mission.
- [ ] Magnetic QR placement on minibar / guest room refrigerator door.
- [ ] 5% referral commission credited directly to the hotel partner from within Smriti Pass company 30% margin.

---

## 3. ASI-Licensed Heritage Guides (3 Flagship Partners)

| Guide Name | ASI License No. | Languages | Experience | Referral ID |
| :--- | :--- | :--- | :---: | :--- |
| **Manoj Saxena** | `ASI-AG-2018-092` | English, Hindi, French | 14 Years | `GUIDE-AG-01` |
| **Sunita Verma** | `ASI-AG-2015-044` | English, Hindi, German | 18 Years | `GUIDE-AG-02` |
| **Irfan Khan** | `ASI-AG-2020-118` | English, Hindi, Spanish | 9 Years | `GUIDE-AG-03` |

### Guide Partner Protocols:
- [x] Official ASI license numbers verified against the Archaeological Survey of India registry.
- [x] Briefing conducted: guides receive 5% referral attribution from company 30% margin, **never** taking commissions from artisans.
- [ ] Guide mobile cards distributed with QR links to the Tourist Heritage Trail (`/#tourist`).

---

## 4. Master Artisan Roster & Workshop Verification (10 Artisans)

| # | Master Artisan | Craft Specialty | Workshop Address | National / Guild Accreditation |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Ustad Rashid Khan** | Parchin Kari (Marble Inlay) | Workshop 4, Gokulpura Quarter, Agra | UP State Award Winner 2018 |
| 2 | **Mohammad Aslam** | Pietra Dura / Floral Box | 18 Sadar Bazaar, Near Taj Inlay Gates | Taj Heritage Guild Master |
| 3 | **Shabana Begum** | Zardozi Golden Wire Embroidery | Nai ki Mandi, Agra | National Merit Certificate |
| 4 | **Rameshwar Dayal** | Agra Leathercraft & Mojaris | Hing ki Mandi, Agra Cantt | Agra Guild Certified Artisan |
| 5 | **Abdul Qadir** | Marble Lattice Jali Carving | Fatehabad Craft Cluster | Master Carver 25+ Yrs |
| 6 | **Meera Devi** | Brass Engraving & Sculpting | Kamla Nagar, Agra | GI Tag Accreditation |
| 7 | **Haji Nooruddin** | Precious Stone Inlay Medallions | Gokulpura Craft Colony | State Guild Veteran |
| 8 | **Deepak Sharma** | Soapstone Miniature Carving | Taj Ganj, South Gate | Certified Artisan ID |
| 9 | **Zarina Bano** | Silk & Metallic Zari Tapestry | Shahganj Craft Hub | Craft Council Member |
| 10| **Farooq Ahmed** | Inlaid Marble Table Tops | Fatehabad Rd Workshop 12 | Master Inlayer |

### Artisan Support Protocols:
- [x] Zero-literacy Hindi voice cataloging verified on mobile microphones (`/#artisan`).
- [x] Guaranteed 70% payout structure contracted and explained.
- [ ] Payout bank accounts / UPI VPA verified for instant settlements.

---

## 5. Physical Fridge Magnet Manufacturing Specifications

- **Dimensions:** 50mm × 50mm (2" × 2") square.
- **Corner Radius:** 3mm rounded corners for safety and durability.
- **Substrate:** 0.8mm flexible anisotropic magnet with high-gloss laminated vinyl face.
- **Color Palette:**
  - Deep Navy Blue (`#1a1a3e`) background for high visual contrast.
  - Antique Gold (`#d4af37`) accent typography and Taj Mahal floral vector framing.
  - White QR matrix block (`#ffffff`) with 4-module quiet zone border padding.
- **Resolution:** 300+ DPI (1200×1200px master asset in `public/assets/qr-fridge-magnet-1200.png`).
- **QR Error Correction:** Level H (30% redundancy) to ensure reliable scanning even with minor surface scratches.
- **Target URL:** `https://smritipass.org/#tourist` (Configurable via `PUBLIC_URL`).
- **Quantity for Pilot:** 250 units (50 units × 5 hotels).

---

## 6. Insured Art Logistics & Handover Protocols

### Option A: Carry With Me
1. Master artisan packs craft in 5-layer shockproof bubble wrap with custom wooden corner guards.
2. Artisan seals box with tamper-evident **Smriti Pass Fair Trade Seal**.
3. Handed directly to tourist at the workshop or delivered to hotel reception with recipient signature.

### Option B: Insured Doorstep Shipping (₹1,000 Flat Logistics Escrow)
1. BlueDart / DHL Art Courier receives pickup notification through `/api/admin/orders/:id/courier-status`.
2. White-glove courier picks up parcel from Gokulpura / Sadar Bazaar artisan workshop.
3. High-value marine & transit insurance covers up to ₹50,000 per craft item against loss or breakage.
4. Real-time tracking link texted/emailed to international tourist.

---

## 7. Pilot Launch Day Sequence (Day 0)

1. **08:00 AM:** Deploy production build to cloud hosting with SSL termination (`https://smritipass.org`).
2. **09:30 AM:** Distribute packaged boxes of 50 fridge magnets to concierges at Amarvilas, ITC Mughal, Taj Convention, Clarks Shiraz, and Courtyard Marriott.
3. **11:00 AM:** Conduct 15-minute briefing with ASI guides Manoj Saxena, Sunita Verma, and Irfan Khan.
4. **01:00 PM:** Verify on-ground scan test using standard iPhone and Android cameras from room 314 at Oberoi Amarvilas.
5. **02:00 PM:** Execute pilot trial purchase with Ustad Rashid Khan; verify instant 70% (₹7,000) allocation and admin notification.
6. **05:00 PM:** Review live dashboard at `https://smritipass.org/#admin`.
