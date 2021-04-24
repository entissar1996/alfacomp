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

describe("DELETE /customers/delete/:id ", () => {
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

    beforeEach(async () => {
        await CustomerModel.deleteMany();
        await UserModel.deleteMany();
    })

    afterEach(async () => {
        await CustomerModel.deleteMany();
        await UserModel.deleteMany();
    })

    it('OK, Delete a Customer with valid id and admin credentials', async () => {
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


        let oldValues = await CustomerModel.create(customer);

        let res = await request(app).delete(`${apiUri}/delete/${oldValues._id}`)
            .send()
            .set('x-access-token', token);
        let body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal('Customer removed successfully');
    });

    it('Fail, To delete Customer with unvalid id   (admin credentials)', async () => {
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


        let oldValues = await CustomerModel.create(customer);

        let res = await request(app).delete(`${apiUri}/delete/${123456}`)
            .send()
            .set('x-access-token', token);
        let body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal('Removing Customer is failed');
    });

    it('Fail, To delete Customer without id   (admin credentials)', async () => {
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


        let oldValues = await CustomerModel.create(customer);

        let res = await request(app).delete(`${apiUri}/delete/`)
            .send()
            .set('x-access-token', token);
        let body = res.body;
        expect(res.status).to.equal(404);
        expect(body).to.contain.property('error');
        expect(body.error).to.equal('error server code:500');
    });

    it('Fail, To delete a Customer with valid id and without admin credentials', async () => {
    
        let oldValues = await CustomerModel.create(customer);

        let res = await request(app).delete(`${apiUri}/delete/${oldValues._id}`)
            .send();
           
        let body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body.message).to.be.equal('jwt must be provided');
   
    });

});