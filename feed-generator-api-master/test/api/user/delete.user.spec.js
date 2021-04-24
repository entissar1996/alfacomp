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


describe("DELETE /users/:id ", () => {
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


    it('OK, Delete a user with a given id and right credentials', async () => {

        let admin = await UserModel.create(user);
        let adminId = admin._id;
        const Admin = await UserModel.findById(adminId);
        Admin.isGranted = true;
        Admin.role = "ADMIN"; // Grant Access To User
        await Admin.save();

        const token = await jwt.sign(JSON.parse(JSON.stringify(Admin)), secretKey, {
            expiresIn: '365d'
        });

        let userToRemove = await UserModel.create({
            "fullusername": "Adisson FORD",
            "email": "adisson@gmail.com",
            "password": "toto",
            "phone": "+65 23 00 00 16"
        });

        let id=userToRemove._id;

        let res = await request(app).delete(`${apiUri}/delete/${id}`)
            .send()
            .set('x-access-token', token);

        let body=res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal(`User with _id=${id} has deleted`);
    })

    it('Fail, To delete a user with wrong id', async () => {

        let admin = await UserModel.create(user);
        let adminId = admin._id;
        const Admin = await UserModel.findById(adminId);
        Admin.isGranted = true;
        Admin.role = "ADMIN"; // Grant Access To User
        await Admin.save();

        const token = await jwt.sign(JSON.parse(JSON.stringify(Admin)), secretKey, {
            expiresIn: '365d'
        });

        let id="326565";

        let res = await request(app).delete(`${apiUri}/delete/${id}`)
            .send()
            .set('x-access-token', token);
        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`Error to delete user with _id=${id}`);
    })

    it('Fail, To get a user without id', async () => {

        let admin = await UserModel.create(user);
        let adminId = admin._id;
        const Admin = await UserModel.findById(adminId);
        Admin.isGranted = true;
        Admin.role = "ADMIN"; // Grant Access To User
        await Admin.save();

        const token = await jwt.sign(JSON.parse(JSON.stringify(Admin)), secretKey, {
            expiresIn: '365d'
        });


        let res = await request(app).delete(`${apiUri}/delete/`)
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
        let res = await request(app).delete(`${apiUri}/delete/${id}`)
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