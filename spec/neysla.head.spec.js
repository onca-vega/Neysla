import Neysla from "./../app/neysla.js";
const sinon = require("sinon");

describe("Neysla: model HEAD", () => {
  let server;
  beforeEach(() => server = sinon.createFakeServer());
  afterEach(() => server.restore());

  it("should send error of bad initialization of delimiters", done => {
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/",
      token: {
        name: "access",
        value: "sdfsdhfpod"
      }
    });
    spyOn(console, "error");
    neysla.init().then(success => {
      const service = success.myService.setModel(["service", "model", "data"]);
      const result = service.head({
        delimiters: {}
      });
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith("Neysla: The model's delimiters are not properly defined.");
      done();
    });
  });
  it("should send error of bad initialization of relation between delimiters and static names", done => {
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/",
      token: {
        name: "access",
        value: "sdfsdhfpod"
      }
    });
    spyOn(console, "error");
    neysla.init().then(success => {
      const service = success.myService.setModel(["service", "model", "data"]);
      const result = service.head({
        delimiters: 5
      });
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith("Neysla: Incorrect relation between name and delimiters.");
      done();
    });
  });
  it("should send error of bad initialization of relation between delimiters and static names 2", done => {
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/",
      token: {
        name: "access",
        value: "sdfsdhfpod"
      }
    });
    spyOn(console, "error");
    neysla.init().then(success => {
      const service = success.myService.setModel(["service", "model", "data"]);
      const result = service.head({
        delimiters: [5, 10, 2, "a"]
      });
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith("Neysla: Incorrect relation between name and delimiters.");
      done();
    });
  });
  it("should return a Promise", done => {
    sinon.spy();
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/",
      token: {
        name: "access",
        value: "sdfsdhfpod"
      }
    });
    neysla.init().then(success => {
      const service = success.myService.setModel("service");
      const result = service.head();
      expect(result instanceof Promise).toBe(true);
      done();
    });
  });
  it("should return a Promise 2", done => {
    sinon.spy();
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/",
      token: {
        name: "access",
        value: "sdfsdhfpod"
      }
    });
    neysla.init().then(success => {
      const service = success.myService.setModel("service");
      const result = service.head(5);
      expect(result instanceof Promise).toBe(true);
      done();
    });
  });
  it("should return a Promise 3", done => {
    sinon.spy();
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/",
      token: {
        name: "access",
        value: "sdfsdhfpod"
      }
    });
    neysla.init().then(success => {
      const service = success.myService.setModel("service");
      const result = service.head({});
      expect(result instanceof Promise).toBe(true);
      done();
    });
  });
  it("should return a Promise 3", done => {
    sinon.spy();
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/",
      token: {
        name: "access",
        value: "sdfsdhfpod"
      }
    });
    neysla.init().then(success => {
      const service = success.myService.setModel(["service"]);
      const result = service.head();
      expect(result instanceof Promise).toBe(true);
      done();
    });
  });
  it("should return a Promise 4", done => {
    sinon.spy();
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/",
      token: {
        name: "access",
        value: "sdfsdhfpod"
      }
    });
    neysla.init().then(success => {
      const service = success.myService.setModel(["service", "model", "data"]);
      const result = service.head({
        delimiters: ["baz", 6]
      });
      expect(result instanceof Promise).toBe(true);
      done();
    });
  });
  it("should return a Promise 5", done => {
    sinon.spy();
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/",
      token: {
        name: "access",
        value: "sdfsdhfpod"
      }
    });
    neysla.init().then(success => {
      const service = success.myService.setModel(["service", "model", "data"]);
      const result = service.head({
        delimiters: [5, "foo", 7]
      });
      expect(result instanceof Promise).toBe(true);
      done();
    });
  });
  it("should work with request", done => {
    sinon.spy();
    const response = {
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Pagination-Current-Page": 117
      },
      data: [ { "id": 12, "comment": "Hey there" } ]
    }
    server.respondWith("HEAD", "", [ response.status, response.headers, JSON.stringify(response.data)]);
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/",
      token: {
        name: "access",
        value: "sdfsdhfpod"
      }
    });
    neysla.init().then(success => {
      const service = success.myService.setModel(["service", "model", "data"]);
      const result = service.head({
        delimiters: [5, "10"],
        requestJson: true,
        params: {
          "foo": "bar",
          "barz": 5
        }
      });
      server.respond();
      result.then(success => {
        expect(success instanceof Object).toBe(true);
        expect(success.headers["X-Pagination-Current-Page"]).toBeTruthy();
        expect(success.headers["Content-Type"]).toBeTruthy();
        expect(success.dataType).toBe("json");
        expect(success.getHeader("X-Pagination-Current-Page")).toBe(response.headers["X-Pagination-Current-Page"]);
        expect(success.getHeader("Content-Type")).toBe(response.headers["Content-Type"]);
        expect(success.status).toBe(response.status);
        expect(success.statusText).toBe("OK");
        expect(success.url).toBe(response.url);
        done();
      });
    });
  });
  it("should work with request without token", done => {
    sinon.spy();
    const response = {
      url: "http://www.my-api-url.com/service/5/model/10/data?foo=bar&barz=5",
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Pagination-Current-Page": 117
      },
      data: [ { "id": 12, "comment": "Hey there" } ]
    }
    server.respondWith("HEAD", "", [ response.status, response.headers, JSON.stringify(response.data)]);
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/"
    });
    neysla.init().then(success => {
      const service = success.myService.setModel(["service", "model", "data"]);
      const result = service.head({
        delimiters: [5, "10"],
        requestJson: true,
        params: {
          "foo": "bar",
          "barz": 5
        }
      });
      server.respond();
      result.then(success => {
        expect(success instanceof Object).toBe(true);
        expect(success.headers["X-Pagination-Current-Page"]).toBeTruthy();
        expect(success.headers["Content-Type"]).toBeTruthy();
        expect(success.dataType).toBe("json");
        expect(success.getHeader("X-Pagination-Current-Page")).toBe(response.headers["X-Pagination-Current-Page"]);
        expect(success.getHeader("Content-Type")).toBe(response.headers["Content-Type"]);
        expect(success.status).toBe(response.status);
        expect(success.statusText).toBe("OK");
        expect(success.url).toBe(response.url);
        done();
      });
    });
  });
  it("should work with request response error", done => {
    sinon.spy();
    const response = {
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      status: 500
    }
    server.respondWith("HEAD", "", [ response.status, response.headers, ""]);
    const neysla = new Neysla({
      name: "myService",
      url: "http://www.my-api-url.com/",
      token: {
        name: "access",
        value: "sdfsdhfpod"
      }
    });
    neysla.init().then(success => {
      const service = success.myService.setModel(["service", "model", "data"]);
      const result = service.head({
        delimiters: [5, "10"],
        requestJson: true,
        params: {
          "foo": "bar",
          "barz": 5
        }
      });
      server.respond();
      result.catch(error => {
        expect(error instanceof Object).toBe(true);
        expect(error.status).toBe(response.status);
        expect(error.statusText).toBe("Internal Server Error");
        expect(error.url).toBe(response.url);
        done();
      });
    });
  });
});
