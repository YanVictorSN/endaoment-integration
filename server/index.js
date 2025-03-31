const express = require('express');
const path = require('path');
require('dotenv').config();
const multer = require('multer');
const app = express();
const authRoutes = require('./routes/authRoutes');
const dafRoutes = require('./routes/dafRoutes');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
const cors = require('cors');
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/daf', dafRoutes);
app.get('/', (req, res) => {
    if (req.query.code && req.query.state) {
      res.redirect(`/auth/verify-login?code=${req.query.code}&state=${req.query.state}&iss=${req.query.iss}`);
    } else {
      res.send('Página inicial');
    }
});

// Start server
const PORT = process.env.PORT || 5454;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});