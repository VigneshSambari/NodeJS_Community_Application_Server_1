const express = require('express');
const { 
    createChat, 
    textUser, 
    deleteChat,
    checkMember 
} = require('../controllers/personalChatController');

const router = express.Router();

router.post("", createChat);
router.post("/chat", textUser);
router.post("/delete", deleteChat);
router.post("/checkmember", checkMember);

module.exports = router;