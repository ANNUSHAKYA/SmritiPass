// ============================================================
// Smriti Pass 2.0 — ProductEvent Mongoose Model
// ============================================================
const mongoose = require('mongoose');

const EVENT_TYPES = [
  'PRODUCT_REGISTERED',
  'EVIDENCE_ADDED',
  'ARTISAN_VERIFIED',
  'PRODUCT_VERIFIED',
  'CRAFT_DNA_ANALYZED',
  'QR_CODE_GENERATED',
  'OWNERSHIP_TRANSFERRED',
  'ORDER_CREATED',
  'PAYMENT_SPLIT',
  'SHIPPED',
  'DELIVERED',
  'STATUS_CHANGED',
];

const productEventSchema = new mongoose.Schema({
  productId:        { type: mongoose.Schema.Types.Mixed, ref: 'Product', required: true },
  eventType:        { type: String, enum: EVENT_TYPES, required: true },
  actor:            { type: String },
  actorRole:        { type: String },
  description:      { type: String },
  metadata:         { type: mongoose.Schema.Types.Mixed, default: {} },
  blockchainTxHash: { type: String },
  timestamp:        { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProductEvent', productEventSchema);
module.exports.EVENT_TYPES = EVENT_TYPES;
