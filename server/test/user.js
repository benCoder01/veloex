process.env.NODE_ENV = "test";

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require("../src/index");
let should = chai.should();

const db = require("../src/db")
const connection = db.connection;

chai.use(chaiHttp)


describe("User", () => {
    before((done) => {
        connection.query("TRUNCATE TABLE user", (err, _) => {
            if (err) {
                console.error(err);
                return;
            }
            connection.query("TRUNCATE TABLE packet", (err, _) => {
                if (err) {
                    console.error(err);
                    return;
                }
                done();
            })
        })
    })

    describe("POST /register", () => {
        it("it should insert a user", (done) => {
            const registerData = {
                "username": "mustermann",
                "name": "Max Mustermann",
                "email": "example@example.de",
                "password": "1234",
                "driver": true,
                "address": {
                    "nomen": "Max Mustermann",
                    "street": "Musterstraße",
                    "number": "18",
                    "zip": "11111",
                    "city": "Musterstadt"

                }
            }

            chai.request(server).post("/register").send(registerData).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("username")

                done();
            })
        })


        it("it should not be able to insert user with same name", (done) => {
            const registerData = {
                "username": "mustermann",
                "name": "Max Mustermann",
                "email": "example@example.de",
                "password": "1234",
                "driver": true,
                "address": {
                    "nomen": "Max Mustermann",
                    "street": "Musterstraße",
                    "number": "18",
                    "zip": "11111",
                    "city": "Musterstadt"

                }
            }

            chai.request(server).post("/register").send(registerData).end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("ERROR: Username is not unique!")
            
                done();
            })
        })

        it("it should not insert a new user where fields are missing", (done) => {
            const registerData = {
                "username": "mustermann"
            }

            chai.request(server).post("/register").send(registerData).end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("ERROR: Properties are missing!")
            
                done();
            })
        })

        // TODO: Wrong JSON
    })
})