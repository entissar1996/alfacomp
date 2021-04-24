process.env.NODE_ENV = 'test';


const expect = require('chai').expect;
const ObjectId = require('mongoose').Types.ObjectId;


//connect to the files we are testing
const db = require('../../db/index');
const UserModel = require('../../db/models/user-schema');
const CustomerModel = require('../../db/models/customer-schema');
const UserService = require('../../services/user-service')(UserModel);
const ROLES = require('../../helpers/user-validation').roles;

describe("userService Test suite", () => {
    before((done) => {
        db.connect()
            .then(() => {
                UserModel.remove();
                done()
            })
            .catch((error) => done(error));
    })

    beforeEach((done) => {
        UserModel.remove();
        done();
    })

    after((done) => {
        db.close()
            .then(() => {
                UserModel.remove();
                done();
            })
            .catch((error) => done(error));
    })

    afterEach((done) => {
            UserModel.remove();
            done()
        }

    )

    it('has a module', () => {
        expect(UserService).not.to.be.undefined;
    })

    // Test suite UserService.register()
    describe('userService.register()', () => {
        it('Ok it register a new user', async () => {
            let _user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            }
            let result = await UserService.register(_user);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('user registred succssfully!!!');

        })

        it('Fail to register a new user without fullusername', async () => {
            let _user = {
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            }
            let result = await UserService.register(_user);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('failed');
            expect(result.message).to.equal('User failed to register!!!');
            expect(result.payload.message).to.equal('User validation failed: fullusername: fullname is required');


        })

        it('Fail to register a new user without email', async () => {
            let _user = {
                "fullusername": "Issam JOOMAA",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            }
            let result = await UserService.register(_user);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('failed');
            expect(result.message).to.equal('User failed to register!!!');
            expect(result.payload.message).to.equal('User validation failed: email: email is required');


        })

        it('Fail to register a new user without password', async () => {
            let _user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "phone": "+216 22 45 79 16"
            }
            let result = await UserService.register(_user);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('failed');
            expect(result.message).to.equal('User failed to register!!!');
            expect(result.payload.message).to.equal('User validation failed: password: password is required');


        })
        it('Fail to register a new user without same email', async () => {
            let _user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto"
            }
            let first = await UserService.register(_user);
            let second = await UserService.register(_user);
            expect(second).to.contain.property('status');
            expect(second).to.contain.property('message');
            expect(second).to.contain.property('payload');
            expect(second.status).to.equal('failed');
            expect(second.message).to.equal('User failed to register!!!');
            expect(second.payload.name).to.equal(`ValidationError`);


        })
    })


    // Test suit for authenticate
    describe('userService.authenticate()', () => {
        beforeEach((done) => {
            UserModel.remove();
            done();
        })

        afterEach((done) => {
            UserModel.remove();
            done()
        })

        it('Ok it authenticate for a registred user', async () => {
            let user = new UserModel({
                "fullusername": "Papa KAMARA",
                "email": "papakamara@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            });

            await user.save();
            let login = {
                email: 'papakamara@gmail.com',
                password: 'toto'
            };
            let result = await UserService.authenticate(login.email, login.password);
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.payload).to.contain.property('user');
            expect(result.payload).to.contain.property('token');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('user authenticated succssfully!!!');

        })


        it('Fail to authenticate user without credential', async () => {
            await UserModel.deleteMany({});
            let user = new UserModel({
                "fullusername": "Papa KAMARA",
                "email": "papakamara@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            });
            await user.save();
            let result = await UserService.authenticate();
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('fail');
            expect(result.message).to.equal('can\'t authenticate without credential');
        })

        it('Fail to authenticate user without email', async () => {
            await UserModel.deleteMany({});
            let user = new UserModel({
                "fullusername": "Papa KAMARA",
                "email": "papakamara@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            });
            await user.save();
            let result = await UserService.authenticate('toto');
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal("user can't authenticate");
        })

        it('Fail to authenticate user without password', async () => {
            await UserModel.deleteMany({});
            let user = new UserModel({
                "fullusername": "Papa KAMARA",
                "email": "papakamara@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            });
            await user.save();
            let result = await UserService.authenticate('papakamara@gmail.com');
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal("user can't authenticate");
        })

        it('Fail to authenticate user without wrong password', async () => {
            await UserModel.deleteMany({});
            let user = new UserModel({
                "fullusername": "Papa KAMARA",
                "email": "papakamara@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            });
            await user.save();
            let result = await UserService.authenticate('papakamara@gmail.com', 'kiki');
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal("Invalid email or password!!!");
        })
    })

    // Test suit for getAllUsers
    describe('userService.getAllUsers()', () => {
        beforeEach((done) => {
            UserModel.remove();
            done();
        })

        afterEach((done) => {
            UserModel.remove();
            done()
        })

        it('Ok it get all users', async () => {
            await UserModel.deleteMany({});
            let users = [
                new UserModel({
                    "fullusername": "Papa KAMARA",
                    "email": "papakamara@gmail.com",
                    "password": "toto",
                    "phone": "+216 22 45 79 16"
                }), new UserModel({
                    "fullusername": "Kavin ABRAMOV",
                    "email": "kavinabramov@gmail.com",
                    "password": "toto",
                    "phone": "+216 22 45 79 16"
                })
            ]


            await UserModel.insertMany(users);
            let result = await UserService.getAllUsers();
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.payload).to.be.an("array");
            expect(result.payload.length).to.equal(2);
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('all users');
        });

        it('Fail to get all users', async () => {
            db.close();
            let result = await UserService.getAllUsers();
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('error to get users');
        })
    })

    // Test suit for updateUser
    describe('userService.updateUser()', () => {
        let oldUser = {
            "fullusername": "Issam JOOMAA",
            "email": "issam@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        }

        before((done) => {
            db.connect()
                .then(() => {
                    UserModel.remove();
                    done()
                })
                .catch((error) => done(error));
        })

        beforeEach(async () => {
            await UserModel.deleteMany();
        })

        afterEach(async () => {
            await UserModel.deleteMany();
        })

        it('Ok Should update user with a given new values fullusername,phone and city', async () => {

            let old = await UserModel.create(oldUser);
            let modifiedUser = {
                "fullusername": "Issam Ben Amor Ben Jomaa",
                "phone": "+41 66 55 66",
                "city": "Erlangen"
            }

            result = await UserService.updateUser(old._id, modifiedUser);
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('User updated successfully');
            expect(result.payload).not.to.be.undefined;
        })

        it('Fail Should fail to update user with a wrong _id', async () => {

            let old = await UserModel.create(oldUser);
            let modifiedUser = {
                "fullusername": "Issam Ben Amor Ben Jomaa",
                "phone": "+41 66 55 66",
                "city": "Erlangen"
            }

            result = await UserService.updateUser(1, modifiedUser);
            expect(result).not.to.be.undefined;

            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('update user is failed');

        })

        it('Fail Should fail to update user without values ie empty body', async () => {

            let old = await UserModel.create(oldUser);
            let modifiedUser = {}

            result = await UserService.updateUser(old._id, modifiedUser);
            expect(result).not.to.be.undefined;

            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('You should send fullusername,phone and city');

        })
    })

    //Test Suite UserService.getUserById()
    describe('userService.getUserById()', () => {
        let user = {
            "fullusername": "Issam JOOMAA",
            "email": "issam@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        }

        before((done) => {
            db.connect()
                .then(() => {
                    UserModel.remove();
                    done()
                })
                .catch((error) => done(error));
        })

        beforeEach(async () => {
            await UserModel.deleteMany();
        })

        afterEach(async () => {
            await UserModel.deleteMany();
        })

        it('Ok Should get a user with a given id', async () => {

            let before = await UserModel.create(user);
            let id = before._id;

            result = await UserService.getUserById(id);

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal(`Get User with _id=${id}`);
            expect(result.payload).not.to.be.undefined;
        })

        it('Fail Should fail to get user with a wrong _id', async () => {

            result = await UserService.getUserById('3256');

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Error to get user with _id=3256`);
            expect(result.payload).not.to.be.undefined;

        })

        it('Fail Should fail to get user with a no given _id', async () => {

            result = await UserService.getUserById();

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Can't get user without a given id`);
            expect(result.payload).not.to.be.undefined;

        })

    })

    // Test suit for updateUserRole
    describe('userService.updateUserRole()', () => {
        beforeEach(async () => {
            await UserModel.deleteMany();

        })

        afterEach(async () => {
            await UserModel.deleteMany();

        })

        it('Ok , Should update user with a given valide role 1- ADMIN', async () => {
            let user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            };

            let theUser = await UserModel.create(user);
            let result = await UserService.updateUserRole(theUser._id, 'ADMIN');
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('User Role updated successfully');
            expect(result.payload).not.to.be.undefined;
            expect(result.payload.role).to.be.equal('ADMIN');

        })

        it('Ok , Should update user with a given valide role 2- USER', async () => {
            let user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            };

            let theUser = await UserModel.create(user);
            let result = await UserService.updateUserRole(theUser._id, 'USER');
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('User Role updated successfully');
            expect(result.payload).not.to.be.undefined;
            expect(result.payload.role).to.be.equal('USER');

        })

        it('Ok , Should update user with a given valide role 3- SUPERVISOR', async () => {
            let user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            };

            let theUser = await UserModel.create(user);
            let result = await UserService.updateUserRole(theUser._id, 'SUPERVISOR');
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('User Role updated successfully');
            expect(result.payload).not.to.be.undefined;
            expect(result.payload.role).to.be.equal('SUPERVISOR');

        })

        it('Ok , Should update user with a given valide role 4- GUEST', async () => {
            let user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            };

            let theUser = await UserModel.create(user);
            let result = await UserService.updateUserRole(theUser._id, 'GUEST');
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal('User Role updated successfully');
            expect(result.payload).not.to.be.undefined;
            expect(result.payload.role).to.be.equal('GUEST');

        })

        it('Fail , Should fail to update user with wrong Role ie not in GUEST|SUPERVISOR|USER|ADMIN', async () => {
            let user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            };

            let theUser = await UserModel.create(user);
            let result = await UserService.updateUserRole(theUser._id, 'NO_VALID_ROLE');
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('wrong Role');
            expect(result.payload).not.to.be.undefined;


        })

        it('Fail , Should fail to update user with wrong id', async () => {
            let user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            };

            let result = await UserService.updateUserRole('3265124', 'ADMIN');
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('Update user role is failed');
            expect(result.payload).not.to.be.undefined;


        })

        it('Fail , Should fail to update user without id', async () => {
            let user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            };

            let theUser = await UserModel.create(user);
            let result = await UserService.updateUserRole(null, 'ADMIN');
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('user not found, update role is failed');
            expect(result.payload).not.to.be.undefined;


        })
        it('Fail , Should fail to update user with empty role', async () => {
            let user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            };

            let theUser = await UserModel.create(user);
            let result = await UserService.updateUserRole(theUser._id);
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal('wrong Role');
            expect(result.payload).not.to.be.undefined;


        })

    })

    // Test suite for deleteUser
    describe('userService.deleteUser()', () => {
        let user = {
            "fullusername": "Issam JOOMAA",
            "email": "issam@gmail.com",
            "password": "toto",
            "phone": "+216 22 45 79 16"
        }

        beforeEach(async () => {
            await UserModel.deleteMany();
        })

        afterEach(async () => {
            await UserModel.deleteMany();
        })



        it('Ok, Delete a user with a given id', async () => {

            let before = await UserModel.create(user);
            let id = before._id;

            result = await UserService.deleteUser(id);

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal(`User with _id=${id} has deleted`);
            expect(result.payload).not.to.be.undefined;
        })


        it('Fail, To delete a user with a wrong id', async () => {

            let before = await UserModel.create(user);
            let id = "3256452";

            result = await UserService.deleteUser(id);

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Error to delete user with _id=${id}`);
            expect(result.payload).not.to.be.undefined;
        })

        it('Fail, To delete a user without an id', async () => {

            let before = await UserModel.create(user);


            result = await UserService.deleteUser();

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Can\'t delete user without a given id`);
            expect(result.payload).not.to.be.undefined;
        })
    })

    // Test suit for grantAccessToUser
    describe('userService.grantAccessToUser()', () => {
        beforeEach(async () => {
            await UserModel.deleteMany();

        })

        afterEach(async () => {
            await UserModel.deleteMany();
        })

        it('Ok, Grant access to user with valid id', async () => {
            let user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            };

            let before = await UserModel.create(user);
            let id = before._id;


            result = await UserService.grantAccessToUser(id);

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal(`User is now granted to access`);
            expect(result.payload).not.to.be.undefined;
            let grantedUser = result.payload;
            expect(grantedUser).to.contain.property('isGranted');
            expect(grantedUser).to.contain.property('role');
            expect(grantedUser.isGranted).to.equal(true);
            expect(grantedUser.role).to.equal('USER')

        })

        it('Fail, To Grant access to user with unvalid id', async () => {
            let user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            };

            let before = await UserModel.create(user);
            let id = "00000";


            result = await UserService.grantAccessToUser(id);

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Error can't grant access to user`);
            expect(result.payload).not.to.be.undefined;

        })

        it('Fail, To Grant access to user without id', async () => {
            let user = {
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            };

            let before = await UserModel.create(user);
            result = await UserService.grantAccessToUser();

            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Can't grant access to user without a given id`);
            expect(result.payload).not.to.be.undefined;

        })
    })

    // Test suit for assingUserToCustomer
    describe('userService.assignUserToCustomer()', () => {
        before(async () => {
            await UserModel.deleteMany();
            
        })

        beforeEach(async () => {
            await UserModel.deleteMany();
            
        })

        afterEach(async () => {
            await UserModel.deleteMany();
            
        })

        
        after(async () => {
            await UserModel.deleteMany();
            
        })

        it('Ok, Assign User To customer', async () => {
            let user = await UserModel.create({
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            });
            let customer = await CustomerModel.create({
                "fullname": "Club Tennis Erlangen",
                "adress": "Road Manhaten",
                "city": "Erlangen",
                "isLicenced": true
            });

            let result = await UserService.assignUserToCustomer(CustomerModel)(user._id, customer._id);
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('success');
            expect(result.message).to.equal(`User assigned to Customer`);
            expect(result.payload).not.to.be.undefined;
            expect(result.payload).to.contain.property('user');
            expect(result.payload).to.contain.property('customer');

            let _u = result.payload.user;
            let _c = result.payload.customer;

            expect(_u.customer).to.equal(customer._id);
            expect(_c.users).includes(user._id);

        })

        it('Fail, to Assign unvalid User To unvalid  customer', async () => {

            let result = await UserService.assignUserToCustomer(CustomerModel)(ObjectId(1), ObjectId(2));
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Error can't assign User to Customer`);
            expect(result.payload).not.to.be.undefined;
            console.log(result.payload);

        })

        it('Fail, To assign a valid User To unvalid customer', async () => {
            let user = await UserModel.create({
                "fullusername": "Issam JOOMAA",
                "email": "issam@gmail.com",
                "password": "toto",
                "phone": "+216 22 45 79 16"
            });


            let result = await UserService.assignUserToCustomer(CustomerModel)(user._id, ObjectId(1));
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Error can't assign User to Customer`);
            expect(result.payload).not.to.be.undefined;

        })


        it('Fail, To assign a unvalid User To valid customer', async () => {

            let customer = await CustomerModel.create({
                "fullname": "Club Tennis Erlangen",
                adress: "Road Manhaten",
                city: "Erlangen",
                isLicenced: true
            });


            let result = await UserService.assignUserToCustomer(CustomerModel)(ObjectId(1), customer._id);
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Error can't assign User to Customer`);
            expect(result.payload).not.to.be.undefined;

        })

        it('Fail, To assign without user._id or customer._id', async () => {

            let result = await UserService.assignUserToCustomer(CustomerModel)();
            expect(result).not.to.be.undefined;
            expect(result).to.contain.property('status');
            expect(result).to.contain.property('message');
            expect(result).to.contain.property('payload');  
            expect(result.status).to.equal('error');
            expect(result.message).to.equal(`Can't assign user to customer`);
            expect(result.payload).not.to.be.undefined;

        })
    })

})