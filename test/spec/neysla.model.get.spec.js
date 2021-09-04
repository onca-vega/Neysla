import Neysla from "./../../app/neysla.js";
const sinon = require("sinon");

describe("Neysla: model GET", () => {
  let server;
  beforeEach(() => (server = sinon.createFakeServer()));
  afterEach(() => server.restore());

  it("should send error of bad initialization of arguments", (done) => {
    const neysla = new Neysla();
    spyOn(console, "error");
    neysla
      .init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        params: {
          name: "access",
          value: "sdfsdhfpod",
        },
      })
      .then((success) => {
        const service = success.myService.setModel([
          "service",
          "model",
          "data",
        ]);
        const result = service.get(10);
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalledWith(
          "Neysla: The model's configuration must be an object."
        );
        done();
      });
  });
  it("should send error of bad initialization of delimiters", (done) => {
    const neysla = new Neysla();
    spyOn(console, "error");
    neysla
      .init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        params: {
          name: "access",
          value: "sdfsdhfpod",
        },
      })
      .then((success) => {
        const service = success.myService.setModel([
          "service",
          "model",
          "data",
        ]);
        const result = service.get({
          delimiters: {},
        });
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalledWith(
          "Neysla: The model's delimiters are not properly defined."
        );
        done();
      });
  });
  it("should send error of bad initialization of relation between delimiters and static names", (done) => {
    const neysla = new Neysla();
    spyOn(console, "error");
    neysla
      .init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        params: {
          name: "access",
          value: "sdfsdhfpod",
        },
      })
      .then((success) => {
        const service = success.myService.setModel([
          "service",
          "model",
          "data",
        ]);
        const result = service.get({
          delimiters: 5,
        });
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalledWith(
          "Neysla: Incorrect relation between name and delimiters."
        );
        done();
      });
  });
  it("should send error of bad initialization of relation between delimiters and static names 2", (done) => {
    const neysla = new Neysla();
    spyOn(console, "error");
    neysla
      .init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        body: {
          name: "access",
          value: "sdfsdhfpod",
        },
      })
      .then((success) => {
        const service = success.myService.setModel([
          "service",
          "model",
          "data",
        ]);
        const result = service.get({
          delimiters: [5, 10, 2, "a"],
        });
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalledWith(
          "Neysla: Incorrect relation between name and delimiters."
        );
        done();
      });
  });
  it("should return a Promise", (done) => {
    sinon.spy();
    const neysla = new Neysla();
    neysla
      .init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        params: {
          name: "access",
          value: "sdfsdhfpod",
        },
      })
      .then((success) => {
        const service = success.myService.setModel("service");
        const result = service.get();
        expect(result instanceof Promise).toBe(true);
        done();
      });
  });
  it("should return a Promise 2", (done) => {
    sinon.spy();
    const neysla = new Neysla();
    neysla
      .init({
        name: "myService",
        url: "http://www.my-api-url.com/",
      })
      .then((success) => {
        const service = success.myService.setModel(["service"]);
        const result = service.get();
        expect(result instanceof Promise).toBe(true);
        done();
      });
  });
  it("should return a Promise 3", (done) => {
    sinon.spy();
    const neysla = new Neysla();
    neysla
      .init({
        name: "myService",
        url: "http://www.my-api-url.com/",
      })
      .then((success) => {
        const service = success.myService.setModel([
          "service",
          "model",
          "data",
        ]);
        const result = service.get({
          delimiters: ["baz", 6],
        });
        expect(result instanceof Promise).toBe(true);
        done();
      });
  });
  it("should return a Promise 4", (done) => {
    sinon.spy();
    const neysla = new Neysla();
    neysla
      .init({
        name: "myService",
        url: "http://www.my-api-url.com/",
      })
      .then((success) => {
        const service = success.myService.setModel([
          "service",
          "model",
          "data",
        ]);
        const result = service.get({
          delimiters: [5, "foo", 7],
        });
        expect(result instanceof Promise).toBe(true);
        done();
      });
  });
  it("should work with request", (done) => {
    sinon.spy();
    const response = {
      url: "http://www.my-api-url.com/service/5/model/10/data?foo=bar&barz=5&access=sdfsdhfpod",
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Pagination-Current-Page": 117,
      },
      data: [{ id: 12, comment: "Hey there" }],
    };
    server.respondWith("GET", "", [
      response.status,
      response.headers,
      JSON.stringify(response.data),
    ]);
    const neysla = new Neysla();
    neysla
      .init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        params: {
          foo: "bar",
          barz: "another",
        },
      })
      .then((success) => {
        const service = success.myService.setModel([
          "service",
          "model",
          "data",
        ]);
        const result = service.get({
          delimiters: [5, "10"],
          requestType: "json",
          params: {
            access: "sdfsdhfpod",
            barz: 5,
          },
        });
        server.respond();
        result.then((success) => {
          expect(success instanceof Object).toBe(true);
          expect(success.headers["X-Pagination-Current-Page"]).toBeTruthy();
          expect(success.headers["Content-Type"]).toBeTruthy();
          expect(success.dataType).toBe("json");
          expect(success.getHeader("X-Pagination-Current-Page")).toBe(
            response.headers["X-Pagination-Current-Page"]
          );
          expect(success.getHeader("Content-Type")).toBe(
            response.headers["Content-Type"]
          );
          expect(success.data[0].id).toBe(response.data[0].id);
          expect(success.data[0].comment).toBe(response.data[0].comment);
          expect(success.status).toBe(response.status);
          expect(success.statusText).toBe("OK");
          expect(success.url).toBe(response.url);
          done();
        });
      });
  });
  it("should work with request response error", (done) => {
    sinon.spy();
    const response = {
      url: "http://www.my-api-url.com/service/5/model/10/data?name=access&value=sdfsdhfpod&foo=bar&barz=5",
      status: 404,
    };
    server.respondWith("GET", "", [response.status, response.headers, ""]);
    const neysla = new Neysla();
    neysla
      .init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        params: {
          name: "access",
          value: "sdfsdhfpod",
        },
      })
      .then((success) => {
        const service = success.myService.setModel([
          "service",
          "model",
          "data",
        ]);
        const result = service.get({
          delimiters: [5, "10"],
          requestType: "json",
          params: {
            foo: "bar",
            barz: 5,
          },
        });
        server.respond();
        result.catch((error) => {
          expect(error instanceof Object).toBe(true);
          expect(error.status).toBe(response.status);
          expect(error.statusText).toBe("Not Found");
          expect(error.url).toBe(response.url);
          done();
        });
      });
  });
});
