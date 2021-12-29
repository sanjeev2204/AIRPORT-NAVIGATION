const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types
const { Schema } = mongoose;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    phonenumber: {
        type: Number,
        required: true,
        unique: true,

    },

    countryCode:{
        type:String,
        required:true
    },

    birthday:{
        type: String, 
        required: true, 
    },

    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },

    wishLists: {
        type: ObjectId,
        ref: "Wish"
    }
})


module.exports = mongoose.model('User', UserSchema)