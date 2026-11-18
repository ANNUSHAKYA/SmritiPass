// ============================================================
// Smriti Pass — Mongoose Model: GI-Registered Craft (gi_products)
// ============================================================
const mongoose = require('mongoose');

const giProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      default: 'Registered',
      enum: ['Registered', 'Pending', 'Under Examination'],
      index: true,
    },
    registrationDate: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Agricultural', 'Food Stuff', 'Handicraft', 'Manufactured', 'Natural'],
      index: true,
    },
    state: {
      type: String,
      required: true,
      enum: ['Jammu & Kashmir', 'Uttar Pradesh'],
      index: true,
    },
    region: {
      type: String,
      default: '',
    },
    hindiName: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: 'Uploaded GI registration screenshots',
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'gi_products',
  }
);

giProductSchema.index({ name: 'text', hindiName: 'text', region: 'text' });

module.exports = mongoose.model('GiProduct', giProductSchema);
