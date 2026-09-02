const mongoose = require('mongoose');

const orderSchema =
    new mongoose.Schema({

  token: {

    type: String,
  },

  queueType: {

    type: String,
  },

  items: [

    {
      name: String,
      price: Number,
    },
  ],

  total: {

    type: Number,
  },

  status: {

    type: String,

    default: 'Pending',
  },

  createdAt: {

    type: Date,

    default: Date.now,
  },
});

module.exports =
    mongoose.model(
      'Order',
      orderSchema,
    );