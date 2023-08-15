const mongoose = require("mongoose");

const PersonalChatSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
            unique: true,
        },
        users: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                    unique: true,
                },
                fetchAfter: {
                    type: Date,
                },
                messages: [
                    {
                        _id: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Message",
                        },
                    }
                ]
            }
        ],
    }
);

module.exports = Message = mongoose.model("PersonalChat", PersonalChatSchema);
