process.env.NODE_ENV = 'test';


const expect = require('chai').expect;
const faker = require('faker');

//connect to the files we are testing
const db = require('../../../db/index');
const UserModel = require('../../../db/models/user-schema');
const CustomerModel = require('../../../db/models/customer-schema');
const customerService = require('../../../services/customer-service')(CustomerModel);

describe('Customer Test suite', () => {
    const mockCustomer = {
        "fullname": "Miss World",
        "adress": "Avenue Libely Hills",
        "city": "Erlangen"
    }
    before((done) => {
        db.connect()
            .then(() => {
                CustomerModel.remove();
                done()
            })
            .catch((error) => done(error));
    })

    beforeEach((done) => {
        CustomerModel.remove();
        done();
    })

    after((done) => {
        db.close()
            .then(() => {
                CustomerModel.remove();
                done();
            })
            .catch((error) => done(error));
    })

    afterEach((done) => {
            CustomerModel.remove();
            done()
        }

    )

    describe('Customer Model ', () => {
        it('Ok Customer Model is a module', async() => {
            true === true;
            //TODO: write test for CustomerSchema Test
        })
    })
})