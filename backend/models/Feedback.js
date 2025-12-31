const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  news: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: false },
  sentiment: { type: String, enum: ['positive', 'negative', 'neutral'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);