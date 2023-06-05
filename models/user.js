const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
