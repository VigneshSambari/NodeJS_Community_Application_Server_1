const express = require("express")

const {  
        signin, 
        signup, 
        changePassword, 
        sendVerificationMail, 
        verifiedEmail, 
        emailVerification
    } = require("../controllers/userController")

const router = express.Router()

router.post("/login", signin)
router.post("/register", signup);
router.get("/verifyemail/:email/:uniqueString", emailVerification);
router.post("/verifyemail", sendVerificationMail)
router.post("/changepassword", changePassword)
router.get("/verified", verifiedEmail)

module.exports = router;