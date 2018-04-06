const
    mongoose = require("mongoose"),
    bcrypt = require('bcrypt'),
    userSchema = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, "no username provided"]},
        password: {
            type: String
        },
        email: {
            type:String,
            unique: true,
            required: [true, "no email address provided"]
        },
        coins: {
            type: Number,
            min: 0,
            max: Number.MAX_SAFE_INTEGER,
            default: 0
        },
        for_chalenge: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ["regular","admin"],
            default: "regular"
        }
    })
;
module.exports =  mongoose.model("user",userSchema);