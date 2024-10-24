const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const teamRoutes = require('./routes/teamRoutes');
const transactionRoutes = require('../server/routes/transactionRoutes')
const reportLogsRoutes = require('./routes/reportLogsRoutes')
const adminTransactionRoutes = require('./routes/adminTransactionRoutes');
const cors = require('cors');
const path = require('path')
dotenv.config();

const app = express();

app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use(express.json());
app.use(cors({
    origin: '*',
}));

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/reports', reportLogsRoutes)
app.use('/api/admin/transaction', adminTransactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://192.168.103.183:${PORT}`);
});
