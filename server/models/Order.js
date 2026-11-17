// ============================================================
// Smriti Pass — Order Mongoose Model (70:30 Revenue Model)
// ============================================================
const mongoose = require('mongoose');

const companyBreakdownSchema = new mongoose.Schema({
  guideCommission:    { type: Number, default: 0 },
  hotelCommission:    { type: Number, default: 0 },
  platformOperations: { type: Number, default: 0 },
}, { _id: false });

const paymentSplitSchema = new mongoose.Schema({
  artisanShare:     { type: Number, required: true }, // Exactly 70% of product price
  companyShare:     { type: Number, required: true }, // Exactly 30% of product price
  companyBreakdown: companyBreakdownSchema,
  shippingFee:      { type: Number, default: 0 },     // Separately charged for shipping
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId:              { type: String, required: true, unique: true },
  productId:            { type: mongoose.Schema.Types.Mixed, ref: 'Product', required: true },
  productName:          { type: String, required: true },
  productPrice:         { type: Number, required: true },
  artisanId:            { type: String },
  artisanName:          { type: String },
  buyerName:            { type: String, required: true },
  buyerEmail:           { type: String },
  buyerPhone:           { type: String },
  deliveryMethod:       { type: String, enum: ['carry', 'shipping'], default: 'carry' },
  shippingAddress:      { type: String },
  shippingCharge:       { type: Number, default: 0 },
  totalAmount:          { type: Number, required: true },
  paymentSplit:         paymentSplitSchema,
  status:               { type: String, enum: ['confirmed', 'processing', 'completed', 'cancelled'], default: 'confirmed' },
  payoutStatus:         { type: String, enum: ['initiated', 'processing', 'credited'], default: 'initiated' },
  courierStatus:        { type: String, enum: ['not_required', 'scheduled', 'picked_up', 'in_transit', 'delivered'], default: 'not_required' },
  courierPickupDate:    { type: String },
  courierInstructions:  { type: String },
  createdAt:            { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
