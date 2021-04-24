const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user-schema');


const CustomerSchema = new Schema({
    fullname: {
        type: String,
        required: [true, 'customer fullname is required'],
        trim: true
    },
    adress: {
        type: String,
        required: [true, 'customer adress is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'customer city is required'],
        trim: true
    },
    isLicenced: {
        type: Boolean,
        delfault: true
    },
    logo_url: {
        type: String,
        required: [true, 'customer logo is required'],
        default: 'uploads/default-logo.png'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User",
      
    }]

}, {
    timestamps: true
});


module.exports = mongoose.model('Customer', CustomerSchema);