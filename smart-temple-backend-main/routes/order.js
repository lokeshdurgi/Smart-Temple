const express = require('express');

const router = express.Router();

const Order = require('../models/Order');


// CREATE ORDER

router.post('/add', async (req, res) => {

  try {

    const {
      items,
      total,
      queueType,
    } = req.body;

    let prefix = 'D';

    if (queueType === 'prasadam') {
      prefix = 'P';
    }

    if (queueType === 'donation') {
      prefix = 'DN';
    }

    const token = `${prefix}-${Date.now()}`;

    const order = new Order({
      token,
      items,
      total,
      queueType,
      status: 'pending',
    });

    await order.save();

    res.json(order);

  } catch (err) {

    res.status(500).json({
      message: 'Order creation failed',
    });
  }
});


// GET ALL ORDERS

router.get('/', async (req, res) => {

  try {

    const orders = await Order.find()
        .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {

    res.status(500).json({
      message: 'Failed to fetch orders',
    });
  }
});


// FIND ORDER BY TOKEN

router.get('/token/:token', async (req, res) => {

  try {

    const order = await Order.findOne({
      token: req.params.token,
    });

    if (!order) {

      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    res.json(order);

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
    });
  }
});


// COMPLETE ORDER

router.put('/complete/:id', async (req, res) => {

  try {

    const order =
        await Order.findById(
          req.params.id,
        );

    if (!order) {

      return res.status(404).json({
        message: 'Order not found',
      });
    }

    order.status = 'completed';

    await order.save();

    res.json({

      message:
          'Booking completed',

      order,
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
    });
  }
});


// WAITING TIME API

router.get('/waiting-time', async (req, res) => {

  try {

    const pendingOrders =
        await Order.countDocuments({

      status: 'pending',
    });

    res.json({

      pendingOrders,

      waitingTime:
          pendingOrders * 2,
    });

  } catch (err) {

    res.status(500).json({

      message:
          'Failed to calculate waiting time',
    });
  }
});


// ADMIN DASHBOARD STATS

router.get('/dashboard/stats', async (req, res) => {

  try {

    const totalOrders =
        await Order.countDocuments();

    const completedOrders =
        await Order.countDocuments({

      status: 'completed',
    });

    const pendingOrders =
        await Order.countDocuments({

      status: 'pending',
    });

    const darshanOrders =
        await Order.countDocuments({

      queueType: 'darshan',
    });

    const prasadamOrders =
        await Order.countDocuments({

      queueType: 'prasadam',
    });

    const donationOrders =
        await Order.countDocuments({

      queueType: 'donation',
    });

    const revenueData =
        await Order.aggregate([

      {
        $group: {

          _id: null,

          totalRevenue: {
            $sum: '$total',
          },
        },
      },
    ]);

    const totalRevenue =
        revenueData.length > 0
            ? revenueData[0].totalRevenue
            : 0;

    res.json({

      totalOrders,

      completedOrders,

      pendingOrders,

      darshanOrders,

      prasadamOrders,

      donationOrders,

      totalRevenue,
    });

  } catch (err) {

    res.status(500).json({

      message:
          'Dashboard Error',
    });
  }
});

module.exports = router;