const express = require('express');
const router = express.Router();
const {chatController} = require('../../controllers')
const {checkChatroomExist} = require('../../middleware')

router.get(
    '/',
    chatController.getAllChatrooms
)
router.post(
    '/',
    checkChatroomExist,
    chatController.createChatroom
);

module.exports = router;
