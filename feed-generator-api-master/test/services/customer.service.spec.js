process.env.NODE_ENV = 'test';


const expect = require('chai').expect;
const faker = require('faker');

//connect to the files we are testing
const db = require('../../db/index');
const UserModel = require('../../db/models/user-schema');
const CustomerModel = require('../../db/models/customer-schema');
const CustomerService = require('../../services/customer-service')(CustomerModel);

describe('CustomerService Test suite', () => {

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
    })

    it('CustomerService is a module', () => {
        expect(CustomerService).not.to.be.undefined;
    })

    describe('CustomerService.addCustomer()', () => {

        beforeEach((done) => {
            CustomerModel.remove();
            done();
        })


        afterEach((done) => {
            CustomerModel.remove();
            done()
        });

        it('Ok Add Customer Successfully', async () => {
            let mockCustomer = {
                "fullname": "Erlangen Tennis Club",
                "adress": "Avenue Libely Hills",
                "city": "Erlangen"
            }
            let result = await CustomerService.addCustomer(mockCustomer);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('Customer added successfully');
        });

        it('Fail to add a new customer without fullname', async () => {
            let mockCustomer = {
                "adress": "Avenue Libely Hills",
                "city": "Erlangen"
            }
            let result = await CustomerService.addCustomer(mockCustomer);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to add new Customer');
            expect(result.payload.message).to.equal('Customer validation failed: fullname: customer fullname is required');


        });

        it('Fail to add a new customer without adress', async () => {
            let mockCustomer = {
                "fullname": "Erlangen Tennis Club",
                "city": "Erlangen"
            }
            let result = await CustomerService.addCustomer(mockCustomer);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to add new Customer');
            expect(result.payload.message).to.equal('Customer validation failed: adress: customer adress is required');


        });

        it('Fail to add a new customer without city', async () => {
            let mockCustomer = {
                "fullname": "Erlangen Tennis Club",
                "adress": "Manhatten Streent"
            }
            let result = await CustomerService.addCustomer(mockCustomer);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to add new Customer');
            expect(result.payload.message).to.equal('Customer validation failed: city: customer city is required');


        });

        it('Fail to add a new customer with empty args', async () => {

            let result = await CustomerService.addCustomer();
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to add new Customer');
            expect(result.payload.message).to.equal('Customer validation failed: city: customer city is required, adress: customer adress is required, fullname: customer fullname is required');


        })
    })

    describe('CustomerService.getAllCustomer()', () => {
        it('Ok get All Customers Successfully', async () => {
            await CustomerModel.deleteMany();
            let customers = [
                new CustomerModel({
                    "fullname": "Erlangen Tennis Club",
                    "adress": "Erlangen Street",
                    "city": "Erlangen"
                }), new CustomerModel({
                    "fullname": "Turkish Restaurant",
                    "adress": "Beau Street",
                    "city": "Erlangen"
                })
            ];
            await CustomerModel.insertMany(customers);

            let result = await CustomerService.getAllCustomers();
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.payload).to.be.an("array");
            expect(result.payload.length).to.equal(2);
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('Get All Customers');
        });

        it('Fail to get all Customers', async () => {
            db.close();
            let result = await CustomerService.getAllCustomers();
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to get all Customers');
        });


    });

    describe('CustomerService.getCustomerById(id)', () => {
        before(async () => {
            await db.connect();
            await CustomerModel.deleteMany({});
        })
        beforeEach(async () => {
            await CustomerModel.deleteMany({});
        })
        afterEach(async () => {
            await CustomerModel.deleteMany({});
        });

        it('Ok get a Customer by id Successfully', async () => {
            let customer = new CustomerModel({
                "fullname": "Tennis Erlangen Club",
                "adress": "Av. Liberty Street",
                "city": "Erlangen"
            });

            await customer.save();
            let result = await CustomerService.getCustomerById(customer._id);

            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('success to get a customer');
            expect(result.payload).to.contain.property('fullname');
            expect(result.payload).to.contain.property('adress');
            expect(result.payload).to.contain.property('city');
            expect(result.payload.fullname).to.be.equal(customer.fullname);
            expect(result.payload.adress).to.be.equal(customer.adress);
            expect(result.payload.city).to.be.equal(customer.city);

        });

        it('Fail to get a Customer by unvalid id ', async () => {

            let result = await CustomerService.getCustomerById(1);

            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to get the customer');

        });

        it('Fail to  get a Customer with out a given id', async () => {
            let result = await CustomerService.getCustomerById();

            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Cant't get a customer without id`);

        });

    });


    describe('CustomerService.updateCustomer(id,customer)', () => {
        let oldCustomer = {
            fullname: "Erlangen Tennis Club",
            adress: "Manhatten street",
            city: "Erlangen",
            isLicenced: false
        }

        before((done) => {
            db.connect()
                .then(() => {
                    CustomerModel.remove();
                    done()
                })
                .catch((error) => done(error));
        })

        beforeEach(async () => {
            await CustomerModel.deleteMany();
        })

        afterEach(async () => {
            await CustomerModel.deleteMany();
        })

        it('Ok Should update customer with a given new values fullname,adress,city and isLicenced', async () => {

            let old = await CustomerModel.create(oldCustomer);
            let newValues = {
                fullname: "Turkish Restaurant",
                adress: "New York street",
                city: "New York",
                isLicenced: true
            }

            result = await CustomerService.updateCustomer(old._id, newValues);
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('Customer updated successfully');
            expect(result.payload).to.contain.property('fullname');
            expect(result.payload).to.contain.property('adress');
            expect(result.payload).to.contain.property('city');
            expect(result.payload).to.contain.property('isLicenced');
            expect(result.payload.fullname).to.be.equal(newValues.fullname);
            expect(result.payload.adress).to.be.equal(newValues.adress);
            expect(result.payload.city).to.be.equal(newValues.city);
            expect(result.payload.isLicenced).to.be.equal(newValues.isLicenced);

            
        })

        it('Fail Should fail to update Customer with a wrong _id', async () => {

            let old = await CustomerModel.create(oldCustomer);
            let newValues = {
                fullname: "Turkish Restaurant",
                adress: "New York street",
                city: "New York",
                isLicenced: true
            }

            result = await CustomerService.updateCustomer(1, newValues);
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Update Customer is failed');

        })

        it('Fail Should fail to update Customer without values ie empty body', async () => {

            let old = await CustomerModel.create(oldCustomer);

            result = await CustomerService.updateCustomer(old._id, {});
            expect(result).not.to.be.undefined;

            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Unable to update customer');

        })
    })

    describe('CustomerService.removeCustomer(id)', () => {
        let customer = {
            "fullname": "Erlangen Tennis Club",
            "adress": "Manhaten Street",
            "city": "Erlangen",
        }

        beforeEach(async () => {
            await CustomerModel.deleteMany();
        })

        afterEach(async () => {
            await CustomerModel.deleteMany();
        })



        it('Ok, Delete a customer with a given id', async () => {

            let before = await CustomerModel.create(customer);
            let id = before._id;

            result = await CustomerService.removeCustomer(id);

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal(`Customer removed successfully`);
            expect(result.payload).not.to.be.undefined;
        })


        it('Fail, To delete a customret with a wrong id', async () => {

            let before = await CustomerModel.create(customer);
            let id = "3256452";

            result = await CustomerService.removeCustomer(id);

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Removing Customer is failed`);
            expect(result.payload).not.to.be.undefined;
        })

        it('Fail, To delete a user without an id', async () => {

            let before = await CustomerModel.create(customer);


            result = await CustomerService.removeCustomer();

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Unable to remove customer`);
            expect(result.payload).not.to.be.undefined;
        })
    })

})