const express = require('express');

const {
    createSession,
    exitSession,
    updateSession,
    getAllSessions,
    fetchListedSessions,
    joinSession,
    removeSession,
    findSessionRoomId
} = require("../controllers/sessionsController")

const router = express.Router();

router.get("/getall",  getAllSessions);

router.post("/create",  createSession);
router.post("/fetchlisted",  fetchListedSessions);
router.post("/exit", exitSession);
router.post("/update", updateSession);
router.post("/add",  joinSession);
router.post("/remove",  removeSession);
router.post("/find",  findSessionRoomId);  



module.exports = router;