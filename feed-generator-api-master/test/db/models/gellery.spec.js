process.env.NODE_ENV = 'test';


const expect = require('chai').expect;
const mongoose = require('mongoose');

//connect to the files we are testing
const db = require('../../../db/index');
const UserModel = require('../../../db/models/user-schema');
const GalleryModel = require('../../../db/models/gallery-schema');

describe('Gallery Model/Schema Test suite', () => {
    let owner,gallery;
    before(async () => {
        await db.connect();
        await  GalleryModel.deleteMany({});
        owner=await UserModel.create({
            fullusername:"Ferid HELALI",
            email:"helaliferid@gmail.com",
            password:"toto",
        });
    
        gallery = {
            "picture_title": "Tennis Cover",
            "picture_url":"/upload/picture.png",
            "owner":owner._id
        }            
    })

    beforeEach((done) => {
        GalleryModel.deleteMany({});
        done();
    })

    after((done) => {
        db.close()
            .then(() => {
                GalleryModel.deleteMany({});
                done();
            })
            .catch((error) => done(error));
    })

    afterEach((done) => {
            GalleryModel.deleteMany({});
            done()
        }

    )


    it.only('GalleryModel has a module', () => {
        const picture = GalleryModel.create(gallery);
        expect(GalleryModel).not.be.be.undefined;
    });


    it.only('gets a picture', async () => {
        let picture = new GalleryModel(gallery);
        await picture.save();

        const foundOne = await GalleryModel.findOne({
            'picture_title': 'Tennis Cover'
        });

        expect(foundOne.picture_title).to.equal(gallery.picture_title);
        expect(foundOne.picture_url).to.equal(gallery.picture_url);
        expect(foundOne.owner).to.eql(gallery.owner);

    })


    it.only('saves a picture', async () => {
        let picture = new GalleryModel(gallery);
        await picture.save();


        expect(picture.picture_title).to.equal(gallery.picture_title);
        expect(picture.picture_url).to.equal(gallery.picture_url);
        expect(picture.owner).to.eql(gallery.owner);


    })
})