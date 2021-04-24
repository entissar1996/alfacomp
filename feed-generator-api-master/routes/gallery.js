const express = require('express');
const router = express.Router();
const Gallery = require('../db/models/gallery-schema');
const helpers = require('../helpers/user-validation');
const GalleryService = require('../services/gallery.service')(Gallery);

var multer = require('multer');
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/gallery');
    },
    filename: async function (req, file, cb) {
        var path = file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, path);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).any('picture');


// @ts-check
// Upload a new Picture to Gallery
router.post('/add' ,helpers.validateUser, helpers.isGranted,async function (req, res, next) { 
    upload(req,res,async function(error){
        if(error){
            res.json({
                error:error
            })
        }    
        try {

            let uploadedPicture=req.files[0]
            let picture_url=uploadedPicture.destination.substring(2)+'/'+uploadedPicture.filename;
            
            let {...pictureInfo}=req.body;
            //add uploaded file path to body
            pictureInfo.picture_url=picture_url;

            let response = await GalleryService.addPicture(pictureInfo);
            res.json(response);
        } catch (error) {
            console.log(error);
            next(error);
        }
    });  

});


// get all pictures
router.get('/', helpers.validateUser, helpers.isGranted, async function (req, res, next) {
    try {
      let response = await GalleryService.getAllPictures();
      if (response) {
        res.json(response)
      }
    } catch (error) {
      next(error)
    }
  });

// Get Pictures By Owner
  router.get('/owner/:userId', helpers.validateUser, helpers.isGranted, async function (req, res, next) {
      let ownerId=req.params.userId;
    try {
      let response = await GalleryService.getPicturesByOwnerId(ownerId);
      if (response) {
        res.json(response)
      }
    } catch (error) {
      next(error)
    }
  });

  // remove a Picture
router.delete('/delete/:id', helpers.validateUser, helpers.isGranted, async function (req, res, next) {
  let pictureId = req.params.id;

  try {
    let response = await GalleryService.removeGallery(pictureId);
    if (response) {
      res.json(response);
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;