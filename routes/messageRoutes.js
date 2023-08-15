const express = require('express');
const {
    replyMessage,
    deleteReply,
    fetchListedMessages
} = require('../controllers/messageController');




const router = express.Router();

router.post("/reply", replyMessage);
router.post("/deletereply", deleteReply);
router.post("/fetchlistedmessages", fetchListedMessages);

module.exports = router;