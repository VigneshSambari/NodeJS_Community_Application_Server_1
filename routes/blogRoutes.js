const express = require('express');
const upload = require('../utils/multer');
const {uploadMedia, deleteMedia} = require('../middlewares/globalMiddleware');

const {
    updateBlog, 
    deleteBlog, 
    getOwnBlogs, 
    getAllBlogs, 
    createBlog,
    addBlogComment,
    likeOrUnlike,
    deleteCommentReply,
    replyCommentBlog,
    fetchPaginatedBlogs,
    fetchListedBlogs,
} = require("../controllers/blogController")

const router = express.Router();


router.get("/all", getAllBlogs);
router.get("/own", getOwnBlogs);
router.get("/:commentorpost/:id/:choice", likeOrUnlike);
router.post("/uploadmedia",upload.array("files"), uploadMedia);
router.post("/deletemedia", deleteMedia);
router.post("/create",  createBlog);
router.post("/delete", deleteBlog);
router.post("/update",  updateBlog);
router.post("/comment", addBlogComment);
router.post("/deletecommentorreply", deleteCommentReply);
router.post("/addreply", replyCommentBlog);   
router.post("/pagedblogs", fetchPaginatedBlogs); 
router.post("/listedblogs", fetchListedBlogs); 


module.exports = router;