var express = require('express');
var multer = require('multer');
var router = express.Router();
var User = require('../db/models/user-schema');
var Customer = require('../db/models/customer-schema');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: async function (req, file, cb) {
        var id = req.body.id;
        var entity = req.body.entity;

        var path = file.fieldname + '-' + Date.now() + '-' + id + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, path);

        switch (entity) {
            case 'user':
                await updateUser(id,path);
                break;
            case 'customer':
                await updateCustomer(id,path);
                break;
            default:
                break;
        }


    }
});

var upload = multer({ //multer settings
    storage: storage
}).any('picture');


async function updateUser(id,path) {
    await User.findByIdAndUpdate({
        _id: id
    }, {
        $set: {
            avatar_url: 'uploads/' + path
        }
    }).catch(error => error);
}

async function updateCustomer(id,path) {
    await Customer.findByIdAndUpdate({
        _id: id
    }, {
        $set: {
            logo_url: 'uploads/' + path
        }
    }).catch(error => error);
}


router.post('/', upload, function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            res.json({
                status: "error",
                message: "Sorry an error occured while upload the Image",
                payload: null
            });
        } else {
            res.json({
                status: "success",
                message: "Image uploaded and updated succssufully",
                payload: null
            });
        }
    });
});


module.exports = router;