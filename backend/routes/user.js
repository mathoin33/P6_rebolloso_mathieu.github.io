const express = require('express');
const router = express.Router();

//on importe le ctrl user
const userCtrl = require('../controllers/user');

//on crée les routes qui seront renvoyé au controller
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;