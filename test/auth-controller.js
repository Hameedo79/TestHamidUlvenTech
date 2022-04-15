const request = require("supertest");
const expect = require("chai").expect;
const sequelize = require("../util/database");

const app = require("../app");

let authToken = "";

describe("Auth", function () {
  describe("Auth - Login", function () {
    it("should return http code 200, success message and jwt if succeed", function (done) {
      request(app)
        .post("/login")
        .send({ username: "admin", password: "admin" })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body)
            .to.be.an("object")
            .to.have.all.keys("status", "token");
          expect(res.body.status).to.be.equal("success");
          authToken = `Bearer ${res.body.token}`;
          done();
        });
    });
  });

  describe("Auth - Get All Users", function () {
    it("should return http code 200, data and success status if succeed", function (done) {
      request(app)
        .get("/getUsers")
        .set({ Authorization: authToken })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.status).to.be.equal("success");
          expect(res.body.data).to.be.an("array");
          done();
        });
    });
  });

  describe("Auth - Get a User", function () {
    it("should return http code 200, data and success status if succeed", function (done) {
      request(app)
        .get("/getUser/1")
        .set({ Authorization: authToken })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.status).to.be.equal("success");
          expect(res.body.data)
            .to.be.an("object")
            .to.have.all.keys(
              "id",
              "name",
              "username",
              "password",
              "createdAt",
              "updatedAt",
              "roleId"
            );
          done();
        });
    });
  });

  describe("Auth - Create a User", function () {
    it("should return http code 201, message and success status if succeed", function (done) {
      request(app)
        .post("/createUser")
        .send({
          name: "test12",
          username: "test12",
          password: "test12",
          role: 2,
        })
        .set({ Authorization: authToken })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(201);
          expect(res.body)
            .to.be.an("object")
            .to.have.all.keys("status", "message");

          expect(res.body.status).to.be.equal("success");
          done();
        });
    });
  });

  describe("Auth - Update a User", function () {
    it("should return http code 201, message and success status if succeed", function (done) {
      request(app)
        .put("/updateUser")
        .set({ Authorization: authToken })
        .send({
          id: 2,
          name: "test12",
          username: "test12",
          password: "test12",
          role: 2,
        })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(201);
          expect(res.body)
            .to.be.an("object")
            .to.have.all.keys("status", "message");

          expect(res.body.status).to.be.equal("success");
          done();
        });
    });
  });

  describe("Auth - Delete a User", function () {
    it("should return http code 201, message and success status if succeed", function (done) {
      request(app)
        .delete("/deleteUser/2")
        .set({ Authorization: authToken })
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(201);
          expect(res.body)
            .to.be.an("object")
            .to.have.all.keys("status", "message");

          expect(res.body.status).to.be.equal("success");
          done();
        });
    });
  });
});
