process.env.NODE_ENV = 'test';
const apiUri = '/api/v1/users';

const expect = require('chai').expect;
const request = require('supertest');

//connect to the files we are testing
const app = require('../../../app');
const db = require('../../../db/index');

let token;

describe("POST /users/authenticate ", () => {
    const preUser = {
        "fullusername": "Sana Ep. HELALI",
        "email": "sana@gmail.com",
        "password": "toto",
        "phone": "+216 22 45 79 16"
    }

    before((done) => {
        db.connect()
            .then(() => {
                done();
            })
            .catch((error) => done(error));

    })

    after((done) => {
        db.close()
            .then(() => done())
            .catch((error) => done(error));
    })

    it("Ok, authenticate a user", (done) => {
        request(app).post(`${apiUri}/register`).send(preUser).then(
                (res) => {
                    request(app).post(`${apiUri}/authenticate`)
                        .send({
                            "email": "sana@gmail.com",
                            "password": "toto"
                        })
                        .then(
                            (res) => {
                                let result = res.body;
                                //console.log(result);
                                expect(res.status).to.be.equal(200);
                                expect(result).not.to.be.empty;
                                expect(result).to.have.property('status');
                                expect(result).to.have.property('message');
                                expect(result).to.have.property('payload');
                                expect(result.payload).to.have.property('user');
                                expect(result.payload).to.have.property('token');
                                expect(result.message).to.be.equal('user authenticated succssfully!!!');
                                done();
                            })
                        .catch((err) => done(err))
                }
            )
            .catch((err) => done(err));

    })

    it("Fail, it should fail authenticate a user without email", (done) => {
        request(app).post(`${apiUri}/register`).send(preUser).then(
                (res) => {
                    request(app).post(`${apiUri}/authenticate`)
                        .send({
                            "password": "toto"
                        })
                        .then(
                            (res) => {
                                let result = res.body;
                                //console.log(result);
                                expect(res.status).to.be.equal(422);
                                expect(result).not.to.be.empty;
                                expect(result).to.contain.property('status');
                                expect(result).to.contain.property('message');
                                expect(result).to.contain.property('payload');
                                expect(result.status).to.equal('fail');
                                expect(result.message[0].msg).to.equal('Invalid value');
                                expect(result.message[0].param).to.equal('email');
                                expect(result.message[0].location).to.equal('body');

                                done();
                            })
                        .catch((err) => done(err))
                }
            )
            .catch((err) => done(err));

    })

    it("Fail, it should fail authenticate a user without password", (done) => {
        request(app).post(`${apiUri}/register`).send(preUser).then(
                (res) => {
                    request(app).post(`${apiUri}/authenticate`)
                        .send({
                            "email": "sana@gmail.com",
                        })
                        .then(
                            (res) => {
                                let result = res.body;
                                expect(res.status).to.be.equal(200);
                                expect(result).not.to.be.empty;
                                expect(result).to.contain.property('status');
                                expect(result).to.contain.property('message');
                                expect(result).to.contain.property('payload');
                                expect(result.status).to.equal('error');
                                expect(result.message).to.equal('user can\'t authenticate');
                                done();
                            })
                        .catch((err) => done(err))
                }
            )
            .catch((err) => done(err));

    })


    it("Fail, it should fail authenticate a user with wrong password", (done) => {
        request(app).post(`${apiUri}/register`).send(preUser).then(
                (res) => {
                    request(app).post(`${apiUri}/authenticate`)
                        .send({
                            "email": "sana@gmail.com",
                            "password": "002233"
                        })
                        .then(
                            (res) => {
                                let result = res.body;
                                expect(res.status).to.be.equal(200);
                                expect(result).not.to.be.empty;
                                expect(result).to.contain.property('status');
                                expect(result).to.contain.property('message');
                                expect(result).to.contain.property('payload');
                                expect(result.status).to.equal('error');
                                expect(result.message).to.equal('Invalid email or password!!!');
                                done();
                            })
                        .catch((err) => done(err))
                }
            )
            .catch((err) => done(err));

    })

    it("Fail, it should fail authenticate a user with empty body", (done) => {
        request(app).post(`${apiUri}/authenticate`)
            .then(
                (res) => {
                    let result = res.body;
                    expect(res.status).to.be.equal(422);
                    expect(result).not.to.be.empty;
                    expect(result).to.contain.property('status');
                    expect(result).to.contain.property('message');
                    expect(result).to.contain.property('payload');
                    expect(result.status).to.equal('fail');
                    expect(result.message[0].msg).to.equal('Invalid value');
                    expect(result.message[0].param).to.equal('email');
                    expect(result.message[0].location).to.equal('body');

                    done();
                })
            .catch((err) => done(err))


    })
});