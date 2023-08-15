const {uploadMedia, deleteMedia} = require('../middlewares/globalMiddleware');
const express = require('express');
const upload = require('../utils/multer');
const router = express.Router();

router.post("/upload",upload.array("files"), uploadMedia);
router.post("/delete", deleteMedia);

module.exports = router;