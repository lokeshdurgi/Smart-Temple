const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  emoji: String
});

module.exports = mongoose.model('Menu', MenuSchema);