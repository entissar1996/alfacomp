process.env.NODE_ENV = 'test';
const apiUri = '/api/v1/customers';

var jwt = require('jsonwebtoken');
var secretKey = require('../../../config/credentials.json').secret_key;

const expect = require('chai').expect;
const request = require('supertest');

//connect to the files we are testing
const app = require('../../../app');
const db = require('../../../db/index');
const CustomerModel = require('../../../db/models/customer-schema');
const UserModel = require('../../../db/models/user-schema');



describe("PUT /customers/update/:id ", () => {
    const customer = {
        "fullname": "Erlangen Tennis Club",
        "adress": "Manhatten Street",
        "city": "erlangen",
    }


    before(async () => {
        await db.connect();
        await CustomerModel.deleteMany();
        await UserModel.deleteMany();
    })

    after(async () => {
        await db.close();
    })

    beforeEach(async()=>{
        await CustomerModel.deleteMany();
        await UserModel.deleteMany();
    })

    afterEach(async()=>{
        await CustomerModel.deleteMany();
        await UserModel.deleteMany();
    })

    it('OK, Update customer works', async () => {
        let admin = await UserModel.create({
            "fullusername": "Administateur",
            "email": "admin@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "isGranted": true,
            "role": "ADMIN"
        });

        let token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });

        let newValues={
            "fullname":"Tennis Club of Erlangen",
            "adress":"New City Street",
            "city":"Berlin"
        }

        let oldValues=await CustomerModel.create(customer);

        let res = await request(app).put(`${apiUri}/update/${oldValues._id}`)
            .send(newValues)
            .set('x-access-token', token);
        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('Customer updated successfully');
        expect(body.payload).to.contain.property('fullname');
        expect(body.payload).to.contain.property('adress');
        expect(body.payload).to.contain.property('city');
        expect(body.payload.fullname).to.equal(newValues.fullname);
        expect(body.payload.adress).to.equal(newValues.adress);
        expect(body.payload.city).to.equal(newValues.city);
    })

    it('Fail, To update customer with empty body in request', async () => {
        let admin = await UserModel.create({
            "fullusername": "Administateur",
            "email": "admin@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16",
            "isGranted": true,
            "role": "ADMIN"
        });

        let token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });


        let oldValues=await CustomerModel.create(customer);

        let res = await request(app).put(`${apiUri}/update/${oldValues._id}`)
            .send()
            .set('x-access-token', token);
        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('Customer updated successfully');
        expect(body.payload).to.contain.property('fullname');
        expect(body.payload).to.contain.property('adress');
        expect(body.payload).to.contain.property('city');
    })

   
});