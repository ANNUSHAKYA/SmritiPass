// ============================================================
// Smriti Pass — Product Mongoose Model
// ============================================================
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId:           { type: String, required: true, unique: true }, // e.g. SP-AG-MI-2026-0042
  name:                { type: String, required: true },
  category:            { type: String, default: 'Handicrafts' },
  description:         { type: String },
  price:               { type: Number, required: true },
  artisanId:           { type: String, ref: 'Artisan' },
  artisanName:         { type: String },
  images:              [{ type: String }],
  materials:           [{ type: String }],
  dimensions:          { type: String },
  weight:              { type: String },
  isVerified:          { type: Boolean, default: true },
  status:              { type: String, enum: ['available', 'sold', 'archived'], default: 'available' },
  createdAt:           { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
