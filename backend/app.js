require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const CartRoutes = require('./routes/CartRoutes');
const contactRoutes = require('./routes/contactRoutes');
// const predictDownRoutes = require('./routes/predictDown');
const predictPrice = require('./routes/predictRoutes');

const connectDB = require('./config/database');
const { connectPostgres } = require('./config/postgres');

const app = express();

connectDB();
/* connectPostgres().catch((err) => {
  console.error('Failed to connect to Postgres:', err.message);
  // Don't exit - allow app to run without Postgres for other features
}); */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5174", "http://localhost:5173" , 'http://localhost:5175'],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],

}));

// app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/contact', contactRoutes);
//app.use('/api/predict-down', predictDownRoutes);
app.use('/api/v1' , predictPrice)
// Health endpoint at root level
//app.get('/health', getHealth);
//app.get('/metrics', getMetrics);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server Error'
    });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;