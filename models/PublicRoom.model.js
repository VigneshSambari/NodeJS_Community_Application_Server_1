const mongoose = require('mongoose');

const PublicRoom = mongoose.Schema(
    {
        rooms: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Room",
                }
            }
        ]
    }
);

module.exports = mongoose.model("PublicRoom", PublicRoom);