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



describe("PUT /users/update/:id ", () => {
    const preUser = {
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

    it('OK, Update a user works with a given id in the path and a given body', async () => {
        // Arrange
        let newValues = {
            "fullusername": "HELALI Ali",
            "phone": "+44 56 89 66 22",
            "city": "Mahdia"
        };

        const user = await UserModel.create(preUser);
        const grantedUser = await UserModel.findById(user.id);
        grantedUser.isGranted = true; // Grant Access To User
        await grantedUser.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(grantedUser)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/${user._id}`)
            .send(newValues)
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('User updated successfully');
        expect(body.payload).to.contain.property('fullusername');
        expect(body.payload).to.contain.property('role');
        expect(body.payload).to.contain.property('email');
        expect(body.payload).to.contain.property('phone');
        expect(body.payload).to.contain.property('city');
        expect(body.payload.fullusername).to.equal(newValues.fullusername);
        expect(body.payload.phone).to.equal(newValues.phone);
        expect(body.payload.city).to.equal(newValues.city);


    })

    it('Fail, Fail to update user with empty body', async () => {
        // Arrange

        const user = await UserModel.create(preUser);
        const grantedUser = await UserModel.findById(user.id);
        grantedUser.isGranted = true; // Grant Access To User
        await grantedUser.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(grantedUser)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/${user._id}`)
            .send()
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(422);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('You Should send fullusername and/or phone and/or city');
    })

    it('Ok, Should user be updated with only fullusername', async () => {
        // Arrange

        const user = await UserModel.create(preUser);
        const grantedUser = await UserModel.findById(user.id);
        grantedUser.isGranted = true; // Grant Access To User
        await grantedUser.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(grantedUser)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/${user._id}`)
            .send({"fullusername":"Ali Ben Sassi Helali"})
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('User updated successfully');
        expect(body.payload).to.contain.property('fullusername');
        expect(body.payload).to.contain.property('role');
        expect(body.payload).to.contain.property('email');
        expect(body.payload).to.contain.property('phone');
        expect(body.payload.fullusername).to.equal('Ali Ben Sassi Helali');
    })

    it('Ok, Should user be updated with only phone', async () => {
        // Arrange

        const user = await UserModel.create(preUser);
        const grantedUser = await UserModel.findById(user.id);
        grantedUser.isGranted = true; // Grant Access To User
        await grantedUser.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(grantedUser)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/${user._id}`)
            .send({"phone":"+99 66 77 44 00"})
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('User updated successfully');
        expect(body.payload).to.contain.property('fullusername');
        expect(body.payload).to.contain.property('role');
        expect(body.payload).to.contain.property('email');
        expect(body.payload).to.contain.property('phone');
        expect(body.payload.phone).to.equal('+99 66 77 44 00');
    })

    it('Ok, Should user be updated with only city ', async () => {
        // Arrange

        const user = await UserModel.create(preUser);
        const grantedUser = await UserModel.findById(user.id);
        grantedUser.isGranted = true; // Grant Access To User
        await grantedUser.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(grantedUser)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/${user._id}`)
            .send({"city":"Karakas"})
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('User updated successfully');
        expect(body.payload).to.contain.property('fullusername');
        expect(body.payload).to.contain.property('role');
        expect(body.payload).to.contain.property('email');
        expect(body.payload).to.contain.property('phone');
        expect(body.payload).to.contain.property('city');

        expect(body.payload.city).to.equal('Karakas');
    })

    it('Fail, Should fail updating user without id', async () => {
        // Arrange
        let newValues = {
            "fullusername": "HELALI Ali",
            "phone": "+44 56 89 66 22",
            "city": "Mahdia"
        };

        const user = await UserModel.create(preUser);
        const grantedUser = await UserModel.findById(user.id);
        grantedUser.isGranted = true; // Grant Access To User
        await grantedUser.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(grantedUser)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/`)
            .send(newValues)
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(404);
        expect(body).to.contain.property('error');
        expect(body.error).to.equal('error server code:500');
       
    })

    it('Fail, Should fail updating user without non existing user._id ', async () => {
        // Arrange
        let newValues = {
            "fullusername": "HELALI Ali",
            "phone": "+44 56 89 66 22",
            "city": "Mahdia"
        };

        const user = await UserModel.create(preUser);
        const grantedUser = await UserModel.findById(user.id);
        grantedUser.isGranted = true; // Grant Access To User
        await grantedUser.save();
        const token = await jwt.sign(JSON.parse(JSON.stringify(grantedUser)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/1111`)
            .send(newValues)
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('update user is failed');
        
    })


});