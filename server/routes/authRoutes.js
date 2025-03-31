const express = require('express');
const router = express.Router();
const { initLogin, verifyLogin } = require('./../controllers/authRoutes.js');

router.get('/init-login', initLogin);
router.get('/verify-login', verifyLogin);

module.exports = router;