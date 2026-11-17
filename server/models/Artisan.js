// ============================================================
// Smriti Pass — Artisan Mongoose Model
// ============================================================
const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema({
  name:              { type: String, required: true },
  craft:             { type: String, required: true },
  location:          { type: String },
  experience:        { type: Number, default: 0 }, // years
  bio:               { type: String },
  photoUrl:          { type: String },
  isVerified:        { type: Boolean, default: true },
  verificationDate:  { type: Date },
  credentialIssuer:  { type: String },
  language:          { type: String, default: 'Hindi, English' },
  rating:            { type: Number, default: 4.9 },
  workshopName:      { type: String },
  workshopLocation:  { type: String },
  giTag:             { type: String },
  createdAt:         { type: Date, default: Date.now },
});

module.exports = mongoose.model('Artisan', artisanSchema);
