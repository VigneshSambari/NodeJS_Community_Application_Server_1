const mongoose = require("mongoose");

const MessageListSchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        messages: {
            type: [
                {
                    _id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Message",
                        required: true
                    }
                }
            ],
            default: [],
        },
        
    },
    {timestamps: true}
);
module.exports = MessageList = mongoose.model("MessageList", MessageListSchema);
