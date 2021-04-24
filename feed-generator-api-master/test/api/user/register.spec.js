process.env.NODE_ENV = 'test';
const apiUri = '/api/v1/users';

const expect = require('chai').expect;
const request = require('supertest');

//connect to the files we are testing
const app = require('../../../app');
const db = require('../../../db/index');
const UserModel = require('../../../db/models/user-schema');



describe("POST /users/register ", () => {
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

    it('OK, registering a new user works', (done) => {
        request(app).post(`${apiUri}/register`)
            .send(preUser)
            .then(
                (res) => {
                    const body = res.body;
                    expect(res.status).to.equal(200);
                    expect(body).to.contain.property('status');
                    expect(body).to.contain.property('message');
                    expect(body).to.contain.property('payload');
                    expect(body.status).to.equal('success');
                    expect(body.message).to.equal('user registred succssfully!!!');
                    expect(body.payload).to.contain.property('fullusername');
                    expect(body.payload).to.contain.property('role');
                    expect(body.payload).to.contain.property('email');
                    expect(body.payload).to.contain.property('phone');
                    done();
                })
            .catch((err) => done(err));

    })

    it('Fail, User requires fullusername', (done) => {
        request(app).post(`${apiUri}/register`)
            .send({
                "email": "sana@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            })
            .then((res) => {
                const body = res.body;
                expect(res.status).to.equal(200);
                expect(body).to.contain.property('status');
                expect(body).to.contain.property('message');
                expect(body).to.contain.property('payload');
                expect(body.status).to.equal('failed');
                expect(body.message).to.equal('User failed to register!!!');
                done();
            })
            .catch((err) => done(err));

    });

    it('Fail, User requires email', (done) => {
        request(app).post(`${apiUri}/register`)
            .send({
                "fullusername": "Sana Ep. HELALI",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            })
            .then((res) => {
                const body = res.body;
                expect(res.status).to.equal(422);
                expect(body).to.contain.property('status');
                expect(body).to.contain.property('message');
                expect(body).to.contain.property('payload');
                expect(body.status).to.equal('fail');
                expect(body.message[0].msg).to.equal('Invalid value');
                done();
            })
            .catch((err) => done(err));
    });

    it('Fail, User requires password', (done) => {
        request(app).post(`${apiUri}/register`)
            .send({
                "fullusername": "Sana Ep. HELALI",
                "email": "sana@gmail.com",
                "phone": "+216 22 45 79 16"
            })
            .then((res) => {
                const body = res.body;
                expect(res.status).to.equal(200);
                expect(body).to.contain.property('status');
                expect(body).to.contain.property('message');
                expect(body).to.contain.property('payload');
                expect(body.status).to.equal('failed');
                expect(body.message).to.equal('User failed to register!!!');
                done();
            })
            .catch((err) => done(err));
    });


    it('Fail, User yet registred with the same email', async () => {
        const user = await UserModel.create({
            "fullusername": "Siwar KAROUI",
            "email": "siwar@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });

        let res = await request(app).post(`${apiUri}/register`)
            .send(user);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('failed');
        expect(body.message).to.equal('User failed to register!!!');

    });

});