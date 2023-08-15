const BlogPost = require('../models/BlogPost.model');
const BlogComment = require('../models/BlogComment.model');
const cloudinary = require('../cloudinaryStorage/cloudinaryBlogs');
const Profile = require('../models/Profile.model');
const {returnNew} = require('../utils/basicFunctions');

const  getAllBlogs = async (req, res) => {
    try{
        const allBlogs = await BlogPost.find();
        //console.log("Fetched all blogs");
        return res.status(200).json(allBlogs);
    }
    catch(err){
        //console.log("Error in fetching all blogs");
        return res.status(400).json({
            "_message": "Internal server error in fetching all blogs!"
        });
    }
}


const getOwnBlogs = async (req, res) => {

    const userId = req.user;
    //console.log(userId)

    try{
        const getOwnBlogs = await BlogPost.find({postedBy:userId});
        //console.log("Fetched user own blogs");
        return res.json(getOwnBlogs);
    }
    catch(err){
        //console.log("Error in fetchin user own blogs");
        return res.json({
            "_message": "Internal Server error in fetching own user blogs"
        });
    }
}


const createBlog = async (req,res) => {
    
    try{
        const {
            postedBy,
            title,
            body,
            coverMedia,
        } = req.body;
    
        const newBlog = {
            postedBy,
            title,
            body,
            coverMedia,
        }
        const blogPost = new BlogPost(newBlog);
        const created = await blogPost.save();
        await Profile.findOneAndUpdate(
            {userId: postedBy},
            {
                $push: {
                    blogs: {
                        _id: created._id,
                    }
                }
            }
        )
        //console.log("Succesfully created blogpost");
        return res.status(200).json(blogPost);
    }
    catch(err){
        //console.log("Error in saving blogpost");
        //console.log(err);
        return res.status(400).json({
                "_message" :" Internal server error in creating blog post!",
            });
    }
}


const deleteBlog = async (req,res) => {

    const {blogIds, userId} = req.body._id;
    try{
        const deletedBlog = await BlogPost.findByIdAndDelete({_id: blogId});
        await Profile.findOneAndReplace(
            {userId},
            {
                $pull: {
                    _id: {
                        $in: blogIds,
                    }
                }
            }
        )
        //console.log("Successfully deleted blog");
        return res.json(deletedBlog);
    }
    catch(err){
        //console.log('Error in deleting blog');
        //console.log(err);
        return res.json({
            "_message": "Internal server error in deleting blog!"
        });
        
    }
}


const updateBlog  = async (req, res) => {

    //console.log(req.body);
    const {
        title,
        body,
        coverMedia,
    } = req.body;

    const blogId = req.body._id;

    try{
        const updatedBlog = await BlogPost.findOneAndUpdate(
            {blogId},
            {
                title,
                body,
                coverMedia
            },
            returnNew
        )

        if(title) updatedBlog.title = title;
        if(body) updatedBlog.body = body;
        if(coverMedia) updatedBlog.coverMedia = coverMedia;

        //console.log("Successfully updated blog");
        return res.json(updatedBlog);
    }
    catch(err){
        //console.log("Error in updating blog!");
        return res.json({
            "_message": "Internal server error in updating blog"
        })
    }
}



const addBlogComment = async (req, res) => {

    const commentedOn = req.body._id;
    const {
        comment, 
        commentedBy 
    } = req.body;

    try{
        const newComment = new BlogComment({
            comment,
            commentedBy,
            commentedOn,
        });

        await newComment.save();
        const addedComment = await BlogPost.findOneAndUpdate(
            {commentedOn},
            {
                $addToSet: {
                    'comments': {
                        _id: newComment._id
                    },
                }
            },
            returnNew
        );
        //console.log(addedComment)
        addedComment.comments.push({_id: newComment._id});
        //console.log("Successfully added comment!");
        return res.json(addedComment);
    }
    catch(err){ 
        //console.log("Error in adding comment!");
        //console.log(err);
        return res.json(err);
    }
}

//function to delete comment or reply from blog
const deleteCommentReply = async (req, res) => {

    //if we want to delte comment then commentOrReply = "comment
    //else "reply"
    //If we select comment then give commentOrBlogId the blogId of blog on which we are
    //deleting comment and replyOrCommentId the commentId
    //similarly for reply
    const {commentOrReply, commentOrBlogId, replyOrCommentId} = req.body;
    
    //console.log(commentOrReply, "  " ,commentOrBlogId, "  ", replyOrCommentId);
    try{
        if(commentOrReply === "comment"){
            await BlogComment.findByIdAndDelete(replyOrCommentId);
            //console.log("deleted blog comment")
        }
        const deletedCommentOrReply = commentOrReply === "comment" ? 
            await BlogPost.findByIdAndUpdate(
                {_id: commentOrBlogId},
                {
                    $pull: {
                        comments: {
                            _id: replyOrCommentId
                        }
                    }
                },
                returnNew
            ):
            await BlogComment.findByIdAndUpdate(
                {_id: commentOrBlogId},
                {
                    $pull: {
                        replies: {
                            _id: replyOrCommentId
                        }
                    }
                },
                returnNew
            );
        //console.log("deleted comment or reply from blogpost");
        return res.json(deletedCommentOrReply);
    }   
    catch(err){
        //console.log(err)
        //console.log("Error deleting comment or reply");
        return res.json(err);
    }
}

const replyCommentBlog = async (req, res) => {
    const {reply, repliedBy, repliedOn} = req.body;
    //console.log(reply, repliedBy, repliedOn);

    try{
        const addedReply = await BlogComment.findByIdAndUpdate(
            {_id: repliedOn},
            {
                $push: {
                    replies: {
                        reply,
                        repliedBy
                    }
                }
            },
            returnNew
        )

        addedReply.replies.push({reply, repliedBy});
        //console.log(addedReply);
        //console.log("Successfully added comment");
        return res.json(addedReply);
    }
    catch(err){
        //console.log("Error in adding reply to comment");
        //console.log(err);
        return res.json(err);
    }
}

const likeOrUnlike = async (req, res) => {

    const {_id, choice, commentorpost} = req.params;

    try{
        const comment = (commentorpost === "post") ? 
                await BlogPost.findById(_id) : 
                await BlogComment.findById(_id);

        if(choice === "like"){
            comment.likes = comment.likes + 1;
        }
        else if (choice === "dislike"){
            if(comment.likes === 0){
                return res.json({
                    "_message": "Cannot unlike as likes are 0!"
                })
            }
            comment.likes = comment.likes - 1;
        }
        else{
            return res.json({
                "_message": "Invalid get request!"
            });
        }

        await comment.save();
        //console.log("Successfully liked or unliked comment");
        //console.log(comment);
        return res.json(comment);
    }
    catch(err){
        //console.log("Error in liking or unliking comment");
        //console.log(err);
        return res.json(err);
    }

}

const fetchPaginatedBlogs = async (req, res) => {
    try {
      const { page = 1, limit} = req.body;
      const limitNum =  parseInt(limit);
      var startIndex = (page - 1) * 20;
      if(limitNum != 20){
        startIndex = startIndex + 20 - limitNum ;
      }
      
     // console.log(startIndex, " ", limitNum);
      const blogs = await BlogPost.find().limit(limit).skip(startIndex).exec();
      console.log(blogs);
      return res.status(200).json(blogs);
    } catch (err) {
      //console.log(err);
      return res.status(400).json({
        _message: "Error fetching blogs!"
      });
    }
  };
  
  

const fetchListedBlogs = async (req, res) => {
    try{
        const {ids} = req.body;
        console.log(ids);
        console.log(ids);
        const blogs = await BlogPost.find(
            {
                _id: {
                    $in: ids
                }
            }
        ).sort({ createdAt: 1 }) // sort by createdAt in ascending order
        .exec();
        console.log(blogs);
        return res.status(200).json(blogs);
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            "_message": "Error fetching listed blogs!",
        })
    }
  }



module.exports = {
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
}