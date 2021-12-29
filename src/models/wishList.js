const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types
const WishListSchema = new Schema({
    item: {
        type: String,
        required: true
    },

    created_by: {
        type: ObjectId,
        ref: "User"
    }

}, { timestamps: true })


module.exports = mongoose.model('Wish', WishListSchema)

