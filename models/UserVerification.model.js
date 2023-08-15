const mongoose = require("mongoose")

const userVerificationSchema = mongoose.Schema({
    email: {
        type: String
    },
    uniqueString: {
        type: String
    },
    createdAt: {
        type: Date 
    },
    expiresAt: {
        type: Date
    }
})

module.exports = mongoose.model("UserVerification", userVerificationSchema);