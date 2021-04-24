process.env.NODE_ENV = 'test';


const expect = require('chai').expect;
const authHelpers = require('../../helpers/auth.helpers.js');
const saltRounds = 10;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = require('../../config/credentials.json').secret_key;


describe("authHelpers Test suit",()=>{
    it("has a module", ()=>{
        expect(authHelpers).not.to.be.undefined;
        expect(authHelpers).to.contain.property('getToken');
        expect(authHelpers).to.contain.property('comparePassword');
    })

    it("Ok a authHelpers module contain getToken method", ()=>{
        expect(authHelpers).to.contain.property('getToken');
    })

    it("Ok a authHelpers module contain comparePassword method", ()=>{
        expect(authHelpers).to.contain.property('comparePassword');
    })

    describe('getToken() tests',()=>{
        it("Ok, a getToken return correct token", async ()=>{
            //arrange 
            let user = {
                id: "1",
                email: "helali@gmail.com",
                role: "GUEST",
                isGranted: true
            }
    
            //act
            let token=jwt.sign(user,secretKey,{expiresIn: '365d'});
            let result=await jwt.verify(token,secretKey);
    
    
            //assert or expect
           expect(result).to.contain.property('id');
           expect(result).to.contain.property('email');
           expect(result).to.contain.property('role');
           expect(result).to.contain.property('isGranted');
    
           let {id,email,role,isGranted} ={...result};
           expect(id).to.equal('1');
           expect(email).to.equal('helali@gmail.com');
           expect(role).to.equal('GUEST');
           expect(isGranted).to.be.true;
    
    
        })
    
        it("Fail getToken return a token when secretKey modified", async ()=>{
            //arrange 
            let user = {
                id: "1",
                email: "helali@gmail.com",
                role: "GUEST",
                isGranted: true
            }
    
            //act
            let token=jwt.sign(user,secretKey,{expiresIn: '365d'});
           try {
                let result=await jwt.verify(token,'alibaba');
           } catch (error) {
               return error;  
           }
    
        })
    })

    describe('comparePassword() tests',()=>{
        it("Ok, the two passed password are equal", async ()=>{
            let firstPassword=bcrypt.hashSync("toto", saltRounds);
            let secondPassword="toto";
            let result=authHelpers.comparePassword(secondPassword,firstPassword);
            expect(result).to.be.true;
    
        })
    
        it("Fail, the two passed password are different", async ()=>{
            let firstPassword=bcrypt.hashSync("toto", saltRounds);
            let secondPassword="TiTo";
            let result=authHelpers.comparePassword(secondPassword,firstPassword);
            expect(result).to.be.false;
    
        })
    })


})