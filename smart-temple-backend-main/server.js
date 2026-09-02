const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

const dotenv = require('dotenv');

const menuRoutes = require('./routes/menu');

const orderRoutes = require('./routes/order');

const authRoutes = require('./routes/auth');
dotenv.config();
const dashboardRoutes =
    require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

app.use('/api/menu', menuRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/dashboard',dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Smart Canteen Backend Running');
});

app.use('/api/dashboard', dashboardRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});