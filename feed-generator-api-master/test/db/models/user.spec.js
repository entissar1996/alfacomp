process.env.NODE_ENV = 'test';


const expect = require('chai').expect;
const faker = require('faker');

//connect to the files we are testing
const db = require('../../../db/index');
const UserModel = require('../../../db/models/user-schema');


describe("User Model/Schema Test suit", () => {
    const preUser = {
        "fullusername": "Miss World",
        "email": "missworld@gmail.com",
        "password": "toto",
        "phone": "+216 22 45 79 16"
    }

    before((done) => {
        db.connect()
            .then(() => {
                UserModel.remove();
                done()
            })
            .catch((error) => done(error));
    })


    beforeEach((done) => {
        UserModel.remove();
        done();
    })

    after((done) => {
        db.close()
            .then(() => {
                UserModel.remove();
                done();
            })
            .catch((error) => done(error));
    })



    afterEach((done) => {
            UserModel.remove();
            done()
        }

    )


    it('has a module', () => {
        const User = UserModel.create(preUser);
        expect(User).not.be.be.undefined;
    });

    describe('get a user',()=>{
        it('gets a user',async ()=>{
            let fuser={
                "fullusername": "Kamel BEN SALAH",
                "email": "kamel@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            }
            const user = new UserModel(fuser);
            await user.save();

            const foundOne = await UserModel.findOne({'email':'kamel@gmail.com'});
            expect(foundOne.fullusername).to.equal(fuser.fullusername);
            expect(foundOne.email).to.equal(fuser.email);
            expect(foundOne.phone).to.equal(fuser.phone);

        })

    })

    describe('save a user',()=>{
        it('saves a user',async ()=>{
            let fuser={
                "fullusername": "Sihem BEN SALAH",
                "email": "sihem@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            }
            const user = new UserModel(fuser);
            await user.save();
            expect(user.fullusername).to.equal(fuser.fullusername);
            expect(user.email).to.equal(fuser.email);
            expect(user.phone).to.equal(fuser.phone);

        })

    })
});