const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 2,
        maxLength: 25,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Set strong password");
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if(value < 18){
                throw new Error("You are under Age 18")
            }else if(value > 100){
                throw new Error("Not for you, take rest")
            }
        }
    },
    gender: {
        type: String,
        trim: true,
        validate(value){
            if(!["male", "female", "other"].includes(value.toLowerCase())){
                throw new Error("enter valid gender")
            }
        }
    },
    about: {
        type: String,
        default:"this is default about for the user"
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo Url")
            }
        }
    }
}, {
    timestamps: true
})


const User = mongoose.model("User", userSchema);

module.exports = User;