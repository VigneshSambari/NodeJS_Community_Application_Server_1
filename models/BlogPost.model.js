const mongoose=require('mongoose');

const BlogPost = new mongoose.Schema({
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    title:{
        type: String,
        required: true,
    },
    body:{
        type: String,
        required: true,
    },
    coverMedia:[
        {
            type: {
                type: String,
            },
            secureUrl: {
                type: String,
                default: "",
            },
            publicId: {
                type: String,
                default: ""
            }
        }
    ],
    likes:{
        type:Number,
        default:0,
    },
    comments: [ 
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BlogComment",
                required: true,
            }
        }
     ],
    shares:{
        type:Number,
        default:0,
    },
})

module.exports = mongoose.model("BlogPost", BlogPost);
