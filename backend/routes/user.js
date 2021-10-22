const express = require('express');
const router = express.Router();

const valid_password = require('../middleware/valid_password');
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;