const express = require('express');
const upload = require('../utils/multer');
const {
    createProfile,
    fetchProfile,
    updateProfile,
    deleteProfile,
    checkIfFriend,
    fetchOtherProfile,
    fetchPublicProfile,
    sendConnectionRequest,
    acceptConnectionRequest,
    disconnectUser,
    setsOfflineLastseen,
    setStatusOnline,
    userPageUpdate
} = require('../controllers/profileController');

const {
    uploadProfileMedia,
    deleteProfileMedia

} = require('../middlewares/profileMiddleware');

const router = express.Router();

router.get("/:userId", fetchProfile);
router.get("/delete/:userId", deleteProfile);
router.get("/setonline/:userId", setStatusOnline);
router.get("/setoffline/:userId", setsOfflineLastseen);

router.post("/uploadprofile", upload.array('files'),uploadProfileMedia);
router.post("/create", createProfile);
router.post("/update", updateProfile);
router.post("checkfriend", checkIfFriend);
router.post("/otherprofile", fetchOtherProfile)
router.post("/sendrequest", sendConnectionRequest);
router.post("/acceptrequest", acceptConnectionRequest);
router.post("/disconnect", disconnectUser);
router.post("/updatepage", userPageUpdate);
router.post("/publicprofiles", fetchPublicProfile);

module.exports = router;