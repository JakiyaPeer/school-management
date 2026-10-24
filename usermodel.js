const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
      required: true
    },
    role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
}  
},
{

    timestamps: true    
}

);

module.exports = mongoose.model("Student", StudentSchema);