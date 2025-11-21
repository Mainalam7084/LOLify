require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const jokeRoutes = require('./src/routes/jokeRoutes');
const pageRoutes = require('./src/routes/pageRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/jokes', jokeRoutes);
app.use('/', pageRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 LOLify Server running on http://localhost:${PORT}`);
});
