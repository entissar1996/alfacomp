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



describe("GET /customers/:id ", () => {
    const customer = {
        "fullname": "Erlangen Tennis Club",
        "adress": "Manhatten Street",
        "city": "erlangen",
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

    it('OK, Get a customer by ID with ADMIN credentials', async () => {
        let saved = await CustomerModel.create(customer);
        let res = await request(app).get(`${apiUri}/${saved._id}`)
            .send()
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('success to get a customer')
    });

    it('Fail, To get a customer by ID without ADMIN credentials', async () => {
        let saved = await CustomerModel.create(customer);
        let res = await request(app).get(`${apiUri}/${saved._id}`)
            .send();

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('jwt must be provided')
    })
});