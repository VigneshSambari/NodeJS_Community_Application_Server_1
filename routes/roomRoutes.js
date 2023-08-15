const express = require("express");
const {
  getRooms,
  getRoomOfType,
  createRoom,
  joinOrLeaveRoom,
  joinViaLink,
  checkIfMember,
  addMessage,
  deleteMessageFromList,
  fetchPaginatedMessages,
  fetchListedRooms,
  getQueryRooms,
  addUserToGroup,
  removeUserFromGroup,
  getQuerySessionRoom
} = require("../controllers/roomController");

const {authMiddleware} = require("../middlewares/authMiddleware");

const {roomMiddleware} = require("../middlewares/roomMiddleware");

const {
  createMessage,
  deleteMessage
} = require("../middlewares/messageMiddleware");

const router = express.Router();

router.get("", getRooms);
router.get("/joinvialink/:roomId", authMiddleware, joinViaLink);
router.get("/getroomstype/:type", getRoomOfType);

router.post("/create", createRoom);
router.post("/query", getQueryRooms);
router.post("/join", roomMiddleware, joinOrLeaveRoom);
router.post("/leave", joinOrLeaveRoom);
router.post("/checkmember", checkIfMember);
router.post("/sendmessage", createMessage, addMessage);
router.post("/deletemessage", deleteMessage, deleteMessageFromList);
router.post("/fetchmessages", fetchPaginatedMessages);
router.post("/fetchlisted", fetchListedRooms);
router.post("/addtogroup", addUserToGroup);
router.post("/removeusergroup", removeUserFromGroup);
router.post("/getsessions", getQuerySessionRoom);

module.exports = router;