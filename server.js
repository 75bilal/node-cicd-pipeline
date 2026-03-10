const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const noteRoutes = require('./routes/notes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

// Connect database (likely using :contentReference[oaicite:1]{index=1} with :contentReference[oaicite:2]{index=2})
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors());

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Notes API'
    });
});

// Routes
app.use('/api/notes', noteRoutes);

// 404 handler
app.use((req, res, next) => {
    const error = new Error('Page not found');
    error.statusCode = 404;
    next(error);
});

// Error handler (ALWAYS LAST)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});