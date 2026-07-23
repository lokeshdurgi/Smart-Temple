const express = require('express');
const router = express.Router();

const Menu = require('../models/Menu');

router.post('/add', async (req, res) => {

  const menu = new Menu(req.body);

  await menu.save();

  res.json(menu);
});

router.get('/', async (req, res) => {

  const menu = await Menu.find();

  res.json(menu);
});

module.exports = router;