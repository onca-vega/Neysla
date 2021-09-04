import Neysla from "./../../app/neysla.js";
const sinon = require("sinon");

describe("Neysla: core GET", () => {
  let server;
  beforeEach(() => (server = sinon.createFakeServer()));
  afterEach(() => server.restore());

  it("should send error 'Neysla: The configuration must be an object.'", () => {
    sinon.spy();
    spyOn(console, "error");
    const result = Neysla.get(4);
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      "Neysla: The configuration must be an object."
    );
  });
  it("should send error 'Neysla: Request has no properly defined url.'", () => {
    sinon.spy();
    spyOn(console, "error");
    const result = Neysla.get({});
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      "Neysla: Request has no properly defined url."
    );
  });
  it("should return a Promise", () => {
    sinon.spy();
    const result = Neysla.get({
      url: "http://www.my-api-url.com/service?access=sdfsdhfpod",
    });
    expect(result instanceof Promise).toBe(true);
  });
  it("should work with request", (done) => {
    sinon.spy();
    const response = {
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
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

    const get = Neysla.get({
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      requestType: "json",
    });
    server.respond();
    get.then((success) => {
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
  it("should work with request response error", (done) => {
    sinon.spy();
    const response = {
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      status: 404,
    };
    server.respondWith("GET", "", [response.status, response.headers, ""]);

    const get = Neysla.get({
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      requestType: "json",
    });
    server.respond();
    get.catch((error) => {
      expect(error instanceof Object).toBe(true);
      expect(error.status).toBe(response.status);
      expect(error.statusText).toBe("Not Found");
      expect(error.url).toBe(response.url);
      done();
    });
  });
});
