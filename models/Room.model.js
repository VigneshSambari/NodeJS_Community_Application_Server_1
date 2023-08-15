const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    // privatee , name, desc, admin[] , users[],msgs[],created at,created by ,link, tags[]
    name: {
      type: String,
      required: true,
    },
    userName: {
      type:String, 
      required: true,
    },
    coverPic:{
      secureUrl:{
        type: String,
      },
      publicId:{
        type: String,
      }
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    users: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        admin:{
          type: Boolean,
          default: false,
        }
      }
    ],
    requests: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        }
      }
    ],
    messageListId:  {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MessageList",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: [String],
    }
  },
  { timestamps: true }
);

module.exports = Room = mongoose.model("Room", RoomSchema);

