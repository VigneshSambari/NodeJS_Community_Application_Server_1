const mongoose=require('mongoose');

const BlogComment = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    commentedOn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogPost",
    },
    likes: {
        type: Number,
        default: 0,
    },
    replies: [
        {
            reply: {
                type: String,
            },
            repliedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        }
    ],

})

module.exports = mongoose.model("BlogComment", BlogComment);