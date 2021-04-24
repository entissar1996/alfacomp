process.env.NODE_ENV = 'test';
const apiUri = '/api/v1/customers';

var jwt = require('jsonwebtoken');
var secretKey = require('../../../config/credentials.json').secret_key;

const expect = require('chai').expect;
const request = require('supertest');

//connect to the files we are testing
const app = require('../../../app');
const db = require('../../../db/index');
const UserModel = require('../../../db/models/user-schema');
const CustomerModel = require('../../../db/models/customer-schema');



describe("GET /customers ", () => {
    const customer_1 = {
        "fullname": "Erlangen Tennis Club",
        "adress": "Manhatten Street",
        "city": "erlangen",
    }

    const customer_2 = {
        "fullname": "Turkish Restaurant",
        "adress": "SPLIBERG Street",
        "city": "New YORK",
    }

    let admin, token;

    before(async () => {
        await db.connect();
        await UserModel.deleteMany({});
        await CustomerModel.deleteMany({});
        admin = await UserModel.create({
            "fullusername": "Administateur",
            "email": "admin@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "isGranted": true,
            "role": "ADMIN"
        });

        token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });
    })

    after(async () => {
        await db.close();
    })

    it('OK, Get All customers with ADMIN credentials', async () => {
        await CustomerModel.insertMany([customer_1,customer_2]);
        let res = await request(app).get(`${apiUri}`)
            .send()
            .set('x-access-token', token);
        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('Get All Customers');
        expect(body.payload).to.be.a('array');
        expect(body.payload.length).to.be.equal(2);


    })

    it('Fail, to get All customers without token in headers', async () => {
        user = await UserModel.create({
            "fullusername": "Salem",
            "email": "salem@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "isGranted": true,
            "role": "USER"
        });

        token = await jwt.sign(JSON.parse(JSON.stringify(user)), secretKey, {
            expiresIn: '365d'
        });

        await CustomerModel.insertMany([customer_1,customer_2]);
        
        let res = await request(app).get(`${apiUri}`)
            .send();
        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('jwt must be provided');


    });

    it('Fail, to get All customers without ADMIN role', async () => {
        await CustomerModel.insertMany([customer_1,customer_2]);
        let res = await request(app).get(`${apiUri}`)
            .send()
            .set('x-access-token', token);
        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('error You are not allowed You are not Administrator');


    })

   
});