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



describe("POST /customers/add ", () => {
    const customer = {
        "fullname": "Erlangen Tennis Club",
        "adress": "Manhatten Street",
        "city": "erlangen",
    }

    let admin, token;

    before(async () => {
        await db.connect();
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

    it('OK, Add a new customer works', async () => {
        let res = await request(app).post(`${apiUri}/add`)
            .send(customer)
            .set('x-access-token', token);
        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('Customer added successfully');
        expect(body.payload).to.contain.property('fullname');
        expect(body.payload).to.contain.property('adress');
        expect(body.payload).to.contain.property('city');


    })

    it('Fail, Customer requires fullname', async () => {
        let res = await request(app).post(`${apiUri}/add`)
            .send({
                "adress": "Manhaten Street",
                "city": "Erlangen",

            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('Unable to add new Customer');



    });

    it('Fail, Customer requires adress', async () => {
        let res = await request(app).post(`${apiUri}/add`)
            .send({
                "fullname":"Erlangen Tennis Club",
                "city": "Erlangen",

            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('Unable to add new Customer');

    });

    it('Fail, Customer requires city', async () => {
        let res = await request(app).post(`${apiUri}/add`)
        .send({
            "fullname":"Erlangen Tennis Club",
            "adress": "Manhaten Street",
        })
        .set('x-access-token', token);

    const body = res.body;
    expect(res.status).to.equal(200);
    expect(body).to.contain.property('status');
    expect(body).to.contain.property('message');
    expect(body).to.contain.property('payload');
    expect(body.status).to.equal('error');
    expect(body.message).to.equal('Unable to add new Customer');

    });
});