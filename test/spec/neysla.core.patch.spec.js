import Neysla from "./../../app/neysla.js";
const sinon = require("sinon");

describe("Neysla: core PATCH", () => {
  let server;
  beforeEach(() => (server = sinon.createFakeServer()));
  afterEach(() => server.restore());

  it("should send error 'Neysla: The configuration must be an object.'", () => {
    sinon.spy();
    spyOn(console, "error");
    const result = Neysla.patch(4);
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      "Neysla: The configuration must be an object."
    );
  });
  it("should send error 'Neysla: Request has no properly defined url.'", () => {
    sinon.spy();
    spyOn(console, "error");
    const result = Neysla.patch({});
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      "Neysla: Request has no properly defined url."
    );
  });
  it("should return a Promise", () => {
    sinon.spy();
    const result = Neysla.patch({
      url: "http://www.my-api-url.com/service?access=sdfsdhfpod",
    });
    expect(result instanceof Promise).toBe(true);
  });
  it("should work with request and response to be JSON", (done) => {
    sinon.spy();
    const response = {
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      status: 204,
      headers: {
        "Content-Type": "application/json",
        "X-Pagination-Current-Page": 117,
      },
      data: [{ id: 12, comment: "Hey there" }],
    };
    server.respondWith("PATCH", "", [
      response.status,
      response.headers,
      JSON.stringify(response.data),
    ]);

    const result = Neysla.patch({
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      requestType: "json",
      body: {
        name: "My name",
        age: 25,
        country: "MX",
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
      expect(success.status).toBe(response.status);
      expect(success.statusText).toBe("No Content");
      expect(success.url).toBe(response.url);
      done();
    });
  });
  it("should work with request response is URLENCODED", (done) => {
    sinon.spy();
    const response = {
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      status: 204,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Pagination-Current-Page": 117,
      },
      data: [{ id: 12, comment: "Hey there" }],
    };
    server.respondWith("PATCH", "", [
      response.status,
      response.headers,
      JSON.stringify(response.data),
    ]);

    const result = Neysla.patch({
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      requestType: "multipart",
      body: {
        name: "My name",
        age: 25,
        country: "MX",
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
      expect(success.status).toBe(response.status);
      expect(success.statusText).toBe("No Content");
      expect(success.url).toBe(response.url);
      done();
    });
  });
  it("should work with request response error", (done) => {
    sinon.spy();
    const response = {
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      status: 401,
    };
    server.respondWith("PATCH", "", [response.status, response.headers, ""]);

    const result = Neysla.patch({
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      requestType: "json",
    });
    server.respond();
    result.catch((error) => {
      expect(error instanceof Object).toBe(true);
      expect(error.status).toBe(response.status);
      expect(error.statusText).toBe("Unauthorized");
      expect(error.url).toBe(response.url);
      done();
    });
  });
});
