const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    // type, content, send by, sent to, timestamp , receipt
    type: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    replies: [
      {
        reply: {
          type: String,
        },
        repliedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        time: {
          type: Date,
        }
      }
    ],
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    sentTo: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {timestamps: true}
);

module.exports = Message = mongoose.model("Message", MessageSchema);
