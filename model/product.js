const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
 title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Product = mongoose.model('product', productSchema);
module.exports = Product;
