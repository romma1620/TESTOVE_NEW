const express = require('express');
const router = express.Router();
const {authController} = require('../../controllers')
const {checkUserExist} = require('../../middleware')


router.post('/login', authController.login);

router.post('/register', checkUserExist, authController.register);

module.exports = router;
