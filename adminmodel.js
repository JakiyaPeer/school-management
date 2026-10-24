const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  image: String
});

module.exports = mongoose.model(
  "Admin",
  AdminSchema,
  "admin"
);