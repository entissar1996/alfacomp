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



describe("PUT /update/role/:id ", () => {
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
    });

    afterEach(async () => {
        await UserModel.deleteMany();
    })


    it('OK, assign user with new Role 1- USER', async () => {
        // Arrange

        let user = await UserModel.create({
            "fullusername": "Samah BALTI",
            "email": "samah@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });

        let id = user._id.toString();

        let admin = await UserModel.create({
            "fullusername": "Administateur",
            "email": "admin@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "isGranted": true,
            "role": "ADMIN"
        });



        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/role/${id}`)
            .send({
                "new_role": "USER"
            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('User Role updated successfully');;
        expect(body.payload.role).to.equal('USER');   

    })

    it('OK, assign user with new Role 2- ADMIN', async () => {
        // Arrange

        let user = await UserModel.create({
            "fullusername": "Samah BALTI",
            "email": "samah@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });

        let id = user._id.toString();

        let admin = await UserModel.create({
            "fullusername": "Administateur",
            "email": "admin@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "isGranted": true,
            "role": "ADMIN"
        });



        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/role/${id}`)
            .send({
                "new_role": "ADMIN"
            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('User Role updated successfully');;
        expect(body.payload.role).to.equal('ADMIN');   

    })

    it('OK, assign user with new Role 3- GUEST', async () => {
        // Arrange

        let user = await UserModel.create({
            "fullusername": "Samah BALTI",
            "email": "samah@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });

        let id = user._id.toString();

        let admin = await UserModel.create({
            "fullusername": "Administateur",
            "email": "admin@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "isGranted": true,
            "role": "ADMIN"
        });



        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/role/${id}`)
            .send({
                "new_role": "GUEST"
            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('User Role updated successfully');;
        expect(body.payload.role).to.equal('GUEST');   

    })

    it('OK, Update user with new Role 4- SUPERVISOR', async () => {
        // Arrange

        let user = await UserModel.create({
            "fullusername": "Samah BALTI",
            "email": "samah@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });

        let id = user._id.toString();

        let admin = await UserModel.create({
            "fullusername": "Administateur",
            "email": "admin@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "isGranted": true,
            "role": "ADMIN"
        });



        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/role/${id}`)
            .send({
                "new_role": "SUPERVISOR"
            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('User Role updated successfully');;
        expect(body.payload.role).to.equal('SUPERVISOR');   

    })

    it('Fail, To assign unvalid user with new Role', async () => {
        // Arrange
       let admin = await UserModel.create({
            "fullusername": "Administateur",
            "email": "admin@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "isGranted": true,
            "role": "ADMIN"
        });



        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/role/${123456}`)
            .send({
                "new_role": "USER"
            })
            .set('x-access-token', token);

        const body = res.body;

        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('Update user role is failed');;
        expect(body.payload).not.to.be.undefined;
    })

    it('Fail, To assign a valid  user with unvalid Role', async () => {
        // Arrange
       let admin = await UserModel.create({
            "fullusername": "Administateur",
            "email": "admin@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "isGranted": true,
            "role": "ADMIN"
        });



        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/role/${123456}`)
            .send({
                "new_role": "UNVALID ROLE NOT in GUEST|ADMIN|USER|SUPERVIOR"
            })
            .set('x-access-token', token);

        const body = res.body;

        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('wrong Role');;
        expect(body.payload).not.to.be.undefined;
    })

    it('Fail, To assign a valid  user with Role with out ADMIN credentials', async () => {
       

        let user = await UserModel.create({
            "fullusername": "Samah BALTI",
            "email": "samah@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });

        let id = user._id.toString();
       
        let res = await request(app).put(`${apiUri}/update/role/${id}`)
            .send({
                "new_role": "UNVALID ROLE NOT in GUEST|ADMIN|USER|SUPERVIOR"
            });
          

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('jwt must be provided');
    })


    it('Fail, To assign user empty role', async () => {
        // Arrange

        let user = await UserModel.create({
            "fullusername": "Samah BALTI",
            "email": "samah@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });

        let id = user._id.toString();

        let admin = await UserModel.create({
            "fullusername": "Administateur",
            "email": "admin@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "isGranted": true,
            "role": "ADMIN"
        });



        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let res = await request(app).put(`${apiUri}/update/role/${id}`)
            .send()
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(422);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('You Should send new_role');;
        expect(body.payload).not.to.be.undefined;   

    })

});