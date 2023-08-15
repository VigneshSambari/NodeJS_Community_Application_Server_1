const mongoose = require("mongoose");

const CollegeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        rooms: [
            {
                name: {
                    type: String,
                    required: true,
                },
                specificRooms: [
                    {
                        _id: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "room"
                        }
                    }
                ]
            }
        ],
        domainEmail: {
            type: String,
            required: true,
        }
    }
);
module.exports = College = mongoose.Schema("College", CollegeSchema);