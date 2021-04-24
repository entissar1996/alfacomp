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
const CustomerModel = require('../../../db/models/customer-schema');



describe("PUT /assign-user-customer/update/:id ", () => {

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

    it('OK, assign a given user to a given customer ', async () => {
        const user = await UserModel.create({
            "fullusername": "Omrane KHALIFA",
            "email": "omrane@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });
    
        const customer = await CustomerModel.create({
            "fullname": "Club Tennis Erlangen",
            "adress": "Road Manhaten",
            "city": "Erlangen",
            "isLicenced": true
        });
    
        const admin = await UserModel.create({
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99",
            "isGranted": true,
            "role": "ADMIN"
        })
    
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });



        let res = await request(app).put(`${apiUri}/assign-user-customer`)
            .send({
                userId:user._id,
                customerId:customer._id
            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('success');
        expect(body.message).to.equal(`User assigned to Customer`);
        expect(body.payload).to.contain.property('user');
        expect(body.payload).to.contain.property('customer');
        expect(body.payload.user).to.contain.property('customer');
        expect(body.payload.customer).to.contain.property('users');
       expect(body.payload.user.customer).to.equal(customer._id.toString());
        expect(body.payload.customer.users).to.includes(user._id.toString());

    });

    it('Fail, To assign unvalid user to a given customer ', async () => {
    
        const customer = await CustomerModel.create({
            "fullname": "Club Tennis Erlangen",
            "adress": "Road Manhaten",
            "city": "Erlangen",
            "isLicenced": true
        });
    
        const admin = await UserModel.create({
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99",
            "isGranted": true,
            "role": "ADMIN"
        })
    
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });



        let res = await request(app).put(`${apiUri}/assign-user-customer`)
            .send({
                userId:123,
                customerId:customer._id
            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`Error can\'t assign User to Customer`);

    });

    it('Fail, To assign a valid user to a unvalid customer ', async () => {
    
        const user = await UserModel.create({
            "fullusername": "Omrane KHALIFA",
            "email": "omrane@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });
        
    
        const admin = await UserModel.create({
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99",
            "isGranted": true,
            "role": "ADMIN"
        })
    
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });



        let res = await request(app).put(`${apiUri}/assign-user-customer`)
            .send({
                userId:user._id,
                customerId:123
            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`Error can\'t assign User to Customer`);

    });

    it('Fail, To assign a unvalid user to a unvalid customer ', async () => {
    
        const admin = await UserModel.create({
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99",
            "isGranted": true,
            "role": "ADMIN"
        })
    
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });



        let res = await request(app).put(`${apiUri}/assign-user-customer`)
            .send({
                userId:123,
                customerId:123
            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`Error can\'t assign User to Customer`);

    });

    it('Fail, To assign a valid user and empty customer ', async () => {
        const user = await UserModel.create({
            "fullusername": "Omrane KHALIFA",
            "email": "omrane@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });
    
        const admin = await UserModel.create({
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99",
            "isGranted": true,
            "role": "ADMIN"
        })
    
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });



        let res = await request(app).put(`${apiUri}/assign-user-customer`)
            .send({
                userId:user._id
            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`Can't assign user to customer`);

    });

    it('Fail, To assign a empty user and valid customer ', async () => {
        const customer = await CustomerModel.create({
            "fullname": "Club Tennis Erlangen",
            "adress": "Road Manhaten",
            "city": "Erlangen",
            "isLicenced": true
        });

    
        const admin = await UserModel.create({
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99",
            "isGranted": true,
            "role": "ADMIN"
        })
    
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });



        let res = await request(app).put(`${apiUri}/assign-user-customer`)
            .send({
                customerId:customer._id
            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`Can't assign user to customer`);

    });

    it('Fail, To assign a empty user and empty customer ', async () => {
      
        const admin = await UserModel.create({
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99",
            "isGranted": true,
            "role": "ADMIN"
        })
    
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });



        let res = await request(app).put(`${apiUri}/assign-user-customer`)
            .send({})
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`Can't assign user to customer`);

    });

    it('Fail, assign a given user to a given customer with out ADMIN credential ', async () => {
        const user = await UserModel.create({
            "fullusername": "Omrane KHALIFA",
            "email": "omrane@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });
    
        const customer = await CustomerModel.create({
            "fullname": "Club Tennis Erlangen",
            "adress": "Road Manhaten",
            "city": "Erlangen",
            "isLicenced": true
        });
    
        const admin = await UserModel.create({
            "fullusername": "Makki TARCHOUNE",
            "email": "makki@gmail.com",
            "password": "toto",
            "phone": "+216 62 58 68 99",
            "isGranted": false,
            "role": "USER"
        })
    
        const token = await jwt.sign(JSON.parse(JSON.stringify(admin)), secretKey, {
            expiresIn: '365d'
        });



        let res = await request(app).put(`${apiUri}/assign-user-customer`)
            .send({
                userId:user._id,
                customerId:customer._id
            })
            .set('x-access-token', token);

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('payload');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`error You are not allowed you'r access not granted yet`);
    });

    it('Fail, assign a given user to a given customer with token', async () => {
        const user = await UserModel.create({
            "fullusername": "Omrane KHALIFA",
            "email": "omrane@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        });
    
        const customer = await CustomerModel.create({
            "fullname": "Club Tennis Erlangen",
            "adress": "Road Manhaten",
            "city": "Erlangen",
            "isLicenced": true
        });
    


        let res = await request(app).put(`${apiUri}/assign-user-customer`)
            .send({
                userId:user._id,
                customerId:customer._id
            });

        const body = res.body;
        expect(res.status).to.equal(200);
        expect(body).to.contain.property('status');
        expect(body).to.contain.property('message');
        expect(body).to.contain.property('data');
        expect(body.status).to.equal('error');
        expect(body.message).to.equal(`jwt must be provided`);
    });

});