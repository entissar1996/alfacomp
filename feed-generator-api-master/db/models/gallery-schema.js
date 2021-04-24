const mongoose = require("mongoose");
const User=require('./user-schema');
const Schema = mongoose.Schema;


const GallerySchema = new Schema({
    picture_title: {
        type: String,
        required: [true, 'picture title is required'],
        trim: true
    },
    picture_url: {
        type: String,
        required: [true, 'picture url is required'],
        trim: true
    },
    owner:   { 
        required:[true,'Owner is required'],
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});


module.exports = mongoose.model('Gallery', GallerySchema);