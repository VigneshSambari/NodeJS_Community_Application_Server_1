const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: true,
    },
    payAmount:{
        type: Number,
        default:0,
    },
    paidUsers:[
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
          }
        }
    ],
    roomId:  {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room ",
          required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate:{
      type:Date,
    },
    endDate:{
      type: Date,
    },
    startTime:{
        type: Date,
    },
    endTime: {
        type: Date,
    },
    repeat:{
        type: String,
    },
    likes:{
        type: Number,
        default: 0,
    }
  },
  { timestamps: true }
);

module.exports = Session = mongoose.model("Session", SessionSchema);

