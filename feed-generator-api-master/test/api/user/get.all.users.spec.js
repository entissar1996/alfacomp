process.env.NODE_ENV = 'test';
const apiUri = '/api/v1/users';

var jwt = require('jsonwebtoken');
var secretKey = require('../../../config/credentials.json').secret_key;

const expect = require('chai').expect;
const request = require('supertest');

//connect to the files we are testing
const app = require('../../../app');
const db = require('../../../db/index');
const User = require('../../../db/models/user-schema');

const validation = require('../../../helpers/user-validation');

describe("GET /api/v1/users ", () => {
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

    it('OK, should get users with ADMIN role', async () => {
        let Supervisor = {
            "_id": "01232113333",
            "fullusername": "Ali HELALI",
            "email": "ali@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "role": "ADMIN",
            "isGanted": true
        };

        let user1 = await User.create({
            "fullusername": "Kilani KARCHOUD",
            "email": "kilani@gmail.com",
            "password": "toto",
            "phone": "+216 66 45 79 16",
        })

        let user2 = await User.create({
            "fullusername": "Ines BEN GHDAHOUM",
            "email": "ines@gmail.com",
            "password": "toto",
            "phone": "+216 66 96 79 16",
        })

        let token = await jwt.sign(Supervisor, secretKey, {
            expiresIn: '365d'
        });

        let response = await request(app).get(`${apiUri}/`).
        set('x-access-token', token);

        let body = response.body;
        expect(response.status).to.be.equal(200);
        expect(body).not.to.be.empty;
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('all users');
        expect(body.payload).to.be.a('array');
        expect(body.payload.length).to.be.gt(0);

    });

})

it('Fail, To get users without token ', (done) => {
    request(app).get(`${apiUri}/`).
    then(
            (res) => {
                let body = res.body;
                expect(res.status).to.be.equal(200);
                expect(body).not.to.be.empty;
                expect(body).to.contain.property('status');
                expect(body).to.contain.property('message');
                expect(body).to.contain.property('data');
                expect(body.status).to.equal('error');
                expect(body.message).to.equal('jwt must be provided');
                done();
            }
        )
        .catch((error) => done(error));

})

it('Fail, To get users without isGranted & ADMIN role in token ', (done) => {
    let gest = {
        "_id": "65326656455",
        "fullusername": "Karim Tomas",
        "email": "karim@gmail.com",
        "password": "toto",
        "phone": "+216 22 45 79 16",
    };

    let token = jwt.sign(gest, secretKey, {
        expiresIn: '365d'
    });
    request(app).get(`${apiUri}/`).
    set('x-access-token', token).
    then(
            (res) => {
                let body = res.body;
                expect(res.status).to.be.equal(200);
                expect(body).not.to.be.empty;
                expect(body).to.contain.property('status');
                expect(body).to.contain.property('message');
                expect(body).to.contain.property('payload');
                expect(body.status).to.equal('error');
                expect(body.message).to.equal('error You are not allowed You are not Administrator');
                done();
            }
        )
        .catch((error) => done(error));

})