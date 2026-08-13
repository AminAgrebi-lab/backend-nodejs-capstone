/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');

const app = express();

// 1️⃣ إعداد CORS بشكل شامل يسمح لجميع المصادر والـ Headers
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const port = process.env.PORT || 3060;

// Connect to MongoDB
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
.catch((e) => console.error('Failed to connect to DB', e));

app.use(express.json());

// 2️⃣ تفعيل خدمة الملفات والصور الاستاتيكية
app.use(express.static('public'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Route files
const authRoutes = require('./routes/authRoutes');
const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes');
const searchRoutes = require('./routes/searchRoutes');

const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
app.use('/api/auth', authRoutes);

// ربط مسار المنتجات بالمسارين الممكنين لضمان عدم حدوث 404
app.use('/api/secondchance/items', secondChanceItemsRoutes);
app.use('/api/gifts', secondChanceItemsRoutes); 

app.use('/api/secondchance/search', searchRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler caught:", err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.get("/", (req, res) => {
    res.send("Inside the server");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});