process.env.NODE_ENV = 'test';
const apiUri = '/api/v1/users';

var jwt = require('jsonwebtoken');
var secretKey = require('../../../config/credentials.json').secret_key;

const expect = require('chai').expect;
const request = require('supertest');

//connect to the files we are testing
const app = require('../../../app');
const db = require('../../../db/index');
const UserModel = require('../../../db/models/user-schema');


describe("GET /users/user/:id ", () => {
    const user = {
        "fullusername": "Ali HELALI",
        "email": "ali@gmail.com",
        "password": "toto",
        "phone": "+216 22 45 79 16"
    }

    before((done) => {
        db.connect()
            .then(() => done())
            .catch((error) => done(error));
    })

    after((done) => {
        db.close()
            .then(() => done())
            .catch((error) => done(error));
    })

    beforeEach(async () => {
        await UserModel.deleteMany();
    })

    afterEach(async () => {
        await UserModel.deleteMany();
    })


    it('OK, Get a user with a given id', async () => {

        let saved = await UserModel.create(user);
        let id = saved._id;
        const grantedUser = await UserModel.findById(id);
        grantedUser.isGranted = true; // Grant Access To User
        await grantedUser.save();

        const token = await jwt.sign(JSON.parse(JSON.stringify(grantedUser)), secretKey, {
            expiresIn: '365d'
        });
        
        let res = await request(app).get(`${apiUri}/user/${id}`)
            .send()
            .set('x-access-token', token);


        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal(`Get User with _id=${id}`);
    })

    it('Fail, To get a user with wrong id', async () => {

        let saved = await UserModel.create(user);
        let id = saved._id;
        const grantedUser = await UserModel.findById(id);
        grantedUser.isGranted = true; // Grant Access To User
        await grantedUser.save();

        const token = await jwt.sign(JSON.parse(JSON.stringify(grantedUser)), secretKey, {
            expiresIn: '365d'
        });
        
        let res = await request(app).get(`${apiUri}/user/1`)
            .send()
            .set('x-access-token', token);


        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`Error to get user with _id=1`);
    })

    it('Fail, To get a user without id', async () => {

        let saved = await UserModel.create(user);
        let id = saved._id;
        const grantedUser = await UserModel.findById(id);
        grantedUser.isGranted = true; // Grant Access To User
        await grantedUser.save();

        const token = await jwt.sign(JSON.parse(JSON.stringify(grantedUser)), secretKey, {
            expiresIn: '365d'
        });
        
        let res = await request(app).get(`${apiUri}/user/`)
            .send()
            .set('x-access-token', token);


        const body = res.body;
        expect(res.status).to.equal(404);
        expect(body).to.contain.property('error');
        expect(body.error).to.equal('error server code:500');
    })

    it('Fail, To get a user without valid credentials', async () => {  
        let saved = await UserModel.create(user);
        let id = saved._id;
        let res = await request(app).get(`${apiUri}/user/${id}`)
            .send();


        const body = res.body;

        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('data');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('jwt must be provided');
       
    })
});