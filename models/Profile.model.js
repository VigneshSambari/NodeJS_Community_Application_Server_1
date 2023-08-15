const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name:{
      type:String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    rooms: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },
        page: {
          type: Number,
          default: 0,
        },
      }
    ],
    college: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      required: true,
    },
    profilePic: {
      secureUrl:{
        type: String,
      },
      publicId:{
        type: String,
      }
    },
    coverPic:{
      secureUrl:{
        type: String,
      },
      publicId:{
        type: String,
      }
    },
    online: {
      type: Boolean,
      default: false,
    },
    lastseen: {
      type: Date,
      default: Date(),
    },
    connections: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }
      }
    ],
    connectionRequests: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }
      }
    ],
    requestsSent: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      }
    ],
    sessions: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Session",
        },
      }
    ],
    interests:{
      type: [String],
    },
    blogs: [
      {
        _id:{
          type:  mongoose.Schema.Types.ObjectId,
          ref: "BlogPost",
        }
      }
    ],
    links: [
      {
        name:{
          type: String,
        },
        link:{
          type:String,
        }
        
      }
    ]
  },
  { timestamps: true }
);

module.exports = Profile = mongoose.model("Profile", ProfileSchema);