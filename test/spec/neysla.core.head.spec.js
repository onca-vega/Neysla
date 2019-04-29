import Neysla from "./../../app/neysla.js";
const sinon = require("sinon");

describe("Neysla: core HEAD", () => {
  let server;
  beforeEach(() => server = sinon.createFakeServer());
  afterEach(() => server.restore());

  it("should send error 'Neysla: The configuration must be an object.'", () => {
    sinon.spy();
    spyOn(console, "error");
    const result = Neysla.head(4);
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith("Neysla: The configuration must be an object.");
  });
  it("should send error 'Neysla: Request has no properly defined url.'", () => {
    sinon.spy();
    spyOn(console, "error");
    const result = Neysla.head({});
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith("Neysla: Request has no properly defined url.");
  });
  it("should return a Promise", () => {
    sinon.spy();
    const result = Neysla.head({
      url: "http://www.my-api-url.com/service?access=sdfsdhfpod"
    });
    expect(result instanceof Promise).toBe(true);
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

    const result = Neysla.head({
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      requestType: "json"
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
  it("should work with request response error", done => {
    sinon.spy();
    const response = {
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      status: 500
    }
    server.respondWith("HEAD", "", [ response.status, response.headers, ""]);

    const result = Neysla.head({
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      requestType: "json"
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
