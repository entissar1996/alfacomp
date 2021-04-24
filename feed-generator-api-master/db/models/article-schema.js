const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user-schema');
const Gallery = require('./gallery-schema');


const ArticleSchema = new Schema({
    title: {
        type: String,
        required: [true, 'article title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'article description is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'article content is required'],
        trim: true
    },
    isFeatured: {
        required:[true, 'article isFeatured is required'],
        type: Boolean,
        delfault: false
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:[true,'article author is required']
      
    },
    cover:{
        type:Schema.Types.ObjectId,
        ref:"Gallery"
    }

}, {
    timestamps: true
});


module.exports = mongoose.model('Article', ArticleSchema);