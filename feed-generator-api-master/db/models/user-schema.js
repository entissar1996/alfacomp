const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Customer = require('./customer-schema');



//Define a schema
const Schema = mongoose.Schema;

/**
 * User Schema
 */
const UserSchema = new Schema({
    fullusername: {
        type: String,
        trim: true,
        required: [true, 'fullname is required'],
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'email is required'],
        unique: 'Two users cannot share the same email ({VALUE})',
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'password is required']
    },
    phone: {
        type: String,
    },
    city: {
        type: String
    },
    avatar_url: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'GUEST'
    },
    customer: { //Customer
        type: Schema.Types.ObjectId,
        ref: "Customer"
    },
    isGranted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


UserSchema.plugin(beautifyUnique);


// hash user password before saving into database
UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const user = this;
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();

});

function validateEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

UserSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}



module.exports = mongoose.model('User', UserSchema);