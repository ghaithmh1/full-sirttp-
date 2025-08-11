const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true }
  }
);

module.exports = mongoose.model('Article', articleSchema);
