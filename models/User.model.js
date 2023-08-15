const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Users = mongoose.model("users", UserSchema);