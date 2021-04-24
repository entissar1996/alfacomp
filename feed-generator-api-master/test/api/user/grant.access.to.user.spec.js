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



describe("PUT /users/grant-access/:id ", () => {
    const _user = {
        "fullusername": "Issam MATHLOUTHI",
        "email": "issam@gmail.com",
        "password": "toto",
        "phone": "+216 26 26 24 24"
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
    

    it('OK, Grant access to a guest to become allowed user', async () => {
        const _admin = {
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99"
        }
        const user = await UserModel.create(_user);
        const admin = await UserModel.create(_admin);
        admin.isGranted = true;
        admin.role='ADMIN'; 
        await admin.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/grant-access/${user._id}`)
            .send()
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('User is now granted to access');
        expect(body.payload).to.contain.property('fullusername');
        expect(body.payload).to.contain.property('role');
        expect(body.payload).to.contain.property('email');
        expect(body.payload).to.contain.property('phone');
        expect(body.payload).to.contain.property('isGranted');
        expect(body.payload.role).to.equal('USER');
        expect(body.payload.isGranted).to.equal(true);
        


    })

    it('Fail, To grant access to a guest with unvalid id', async () => {
        const _admin = {
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99"
        }

        const admin = await UserModel.create(_admin);
        admin.isGranted = true;
        admin.role='ADMIN'; 
        await admin.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/grant-access/${000000}`)
            .send()
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`Error can't grant access to user`);
        expect(body.payload).not.to.be.undefined;
        


    })

    it('Fail, To grant access to a guest without id', async () => {
        const _admin = {
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99"
        }

        const admin = await UserModel.create(_admin);
        admin.isGranted = true;
        admin.role='ADMIN'; 
        await admin.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/grant-access/`)
            .send()
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(404);
        expect(body).to.contain.property('error');
        expect(body.error).to.equal(`error server code:500`);
      
        


    })

    it('Fail, To grant access without ADMIN role', async () => {
        const _admin = {
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99"
        }
        
        const user = await UserModel.create(_user);
        const admin = await UserModel.create(_admin);
        admin.isGranted = true;
        admin.role='USER'; 
        await admin.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/grant-access/${user._id}`)
            .send()
            .set('x-access-token', token);
        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`error You are not allowed You are not Administrator`);
    })

    it('Fail, To grant access without isGranted', async () => {
        const _admin = {
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99"
        }
        
        const user = await UserModel.create(_user);
        const admin2 = await UserModel.create(_admin);
        admin2.isGranted = false;
        admin2.role='ADMIN'; 
        await admin2.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin2)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/grant-access/${user._id}`)
            .send()
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`error You are not allowed you'r access not granted yet`);
    })


});