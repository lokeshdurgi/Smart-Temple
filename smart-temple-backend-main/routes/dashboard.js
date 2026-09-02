const express = require('express');

const router = express.Router();

const Order = require('../models/Order');


// DASHBOARD STATS

router.get('/stats', async (req, res) => {

  try {

    const totalOrders =
        await Order.countDocuments();

    const pendingOrders =
        await Order.countDocuments({
      status: 'pending',
    });

    const completedOrders =
        await Order.countDocuments({
      status: 'completed',
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

      pendingOrders,

      completedOrders,

      totalRevenue,
    });

  } catch (err) {

    res.status(500).json({

      message:
          'Dashboard Error',
    });
  }
});


// RECENT ORDERS

router.get('/recent-orders', async (req, res) => {

  try {

    const orders =
        await Order.find()
            .sort({
              createdAt: -1,
            })
            .limit(10);

    res.json(orders);

  } catch (err) {

    res.status(500).json({

      message:
          'Failed to fetch recent orders',
    });
  }
});

module.exports = router;