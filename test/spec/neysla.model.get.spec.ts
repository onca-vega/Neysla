import { describe, it, expect } from "vitest";
import { Neysla } from "../../src/index";
import { createFetchMock } from "../mocks/fetch.mock";

describe("Neysla: model GET", () => {
  const server = createFetchMock();

  it("should reject with TypeError when arguments are not an object", async () => {
    const neysla = new Neysla();
    const result = await neysla.init({
      name: "myService",
      url: "http://www.my-api-url.com/",
      params: { name: "access", value: "sdfsdhfpod" },
    });
    const service = result.myService.setModel(["service", "model", "data"]);
    await expect(service.get(10 as any)).rejects.toThrow(
      "Neysla: The model's configuration must be an object."
    );
  });

  it("should reject with TypeError when delimiters are not valid", async () => {
    const neysla = new Neysla();
    const result = await neysla.init({
      name: "myService",
      url: "http://www.my-api-url.com/",
      params: { name: "access", value: "sdfsdhfpod" },
    });
    const service = result.myService.setModel(["service", "model", "data"]);
    await expect(service.get({ delimiters: {} as any })).rejects.toThrow(
      "Neysla: The model's delimiters are not properly defined."
    );
  });

  it("should reject with Error when delimiter count doesn't match name count (too few)", async () => {
    const neysla = new Neysla();
    const result = await neysla.init({
      name: "myService",
      url: "http://www.my-api-url.com/",
      params: { name: "access", value: "sdfsdhfpod" },
    });
    const service = result.myService.setModel(["service", "model", "data"]);
    await expect(service.get({ delimiters: 5 })).rejects.toThrow(
      "Neysla: Incorrect relation between name and delimiters."
    );
  });

  it("should reject with Error when delimiter count doesn't match name count (too many)", async () => {
    const neysla = new Neysla();
    const result = await neysla.init({
      name: "myService",
      url: "http://www.my-api-url.com/",
      body: { name: "access", value: "sdfsdhfpod" },
    });
    const service = result.myService.setModel(["service", "model", "data"]);
    await expect(service.get({ delimiters: [5, 10, 2, "a"] })).rejects.toThrow(
      "Neysla: Incorrect relation between name and delimiters."
    );
  });

  it("should return a Promise with single string model", async () => {
    server.respondWith({ status: 200, body: {} });
    const neysla = new Neysla();
    const result = await neysla.init({
      name: "myService",
      url: "http://www.my-api-url.com/",
      params: { name: "access", value: "sdfsdhfpod" },
    });
    const service = result.myService.setModel("service");
    expect(service.get()).toBeInstanceOf(Promise);
  });

  it("should return a Promise with single-item array model", async () => {
    server.respondWith({ status: 200, body: {} });
    const neysla = new Neysla();
    const result = await neysla.init({
      name: "myService",
      url: "http://www.my-api-url.com/",
    });
    const service = result.myService.setModel(["service"]);
    expect(service.get()).toBeInstanceOf(Promise);
  });

  it("should return a Promise with n-1 delimiters", async () => {
    server.respondWith({ status: 200, body: {} });
    const neysla = new Neysla();
    const result = await neysla.init({
      name: "myService",
      url: "http://www.my-api-url.com/",
    });
    const service = result.myService.setModel(["service", "model", "data"]);
    expect(service.get({ delimiters: ["baz", 6] })).toBeInstanceOf(Promise);
  });

  it("should return a Promise with n delimiters", async () => {
    server.respondWith({ status: 200, body: {} });
    const neysla = new Neysla();
    const result = await neysla.init({
      name: "myService",
      url: "http://www.my-api-url.com/",
    });
    const service = result.myService.setModel(["service", "model", "data"]);
    expect(service.get({ delimiters: [5, "foo", 7] })).toBeInstanceOf(Promise);
  });

  it("should work with full request", async () => {
    const responseData = [{ id: 12, comment: "Hey there" }];
    server.respondWith({
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "application/json",
        "x-pagination-current-page": "117",
      },
      body: responseData,
    });

    const neysla = new Neysla();
    const modelers = await neysla.init({
      name: "myService",
      url: "http://www.my-api-url.com/",
      params: { foo: "bar", barz: "another" },
    });
    const service = modelers.myService.setModel(["service", "model", "data"]);
    const result = await service.get({
      delimiters: [5, "10"],
      requestType: "json",
      params: { access: "sdfsdhfpod", barz: 5 },
    });

    expect(result).toBeInstanceOf(Object);
    expect(result.headers["x-pagination-current-page"]).toBeTruthy();
    expect(result.headers["content-type"]).toBeTruthy();
    expect(result.dataType).toBe("json");
    expect(result.getHeader("x-pagination-current-page")).toBe("117");
    expect(result.getHeader("content-type")).toBe("application/json");
    expect((result.data as typeof responseData)[0].id).toBe(12);
    expect((result.data as typeof responseData)[0].comment).toBe("Hey there");
    expect(result.status).toBe(200);
    expect(result.statusText).toBe("OK");
  });

  it("should reject on error response", async () => {
    server.respondWith({ status: 404, statusText: "Not Found" });

    const neysla = new Neysla();
    const modelers = await neysla.init({
      name: "myService",
      url: "http://www.my-api-url.com/",
      params: { name: "access", value: "sdfsdhfpod" },
    });
    const service = modelers.myService.setModel(["service", "model", "data"]);

    await expect(
      service.get({ delimiters: [5, "10"], requestType: "json", params: { foo: "bar", barz: 5 } })
    ).rejects.toMatchObject({ status: 404, statusText: "Not Found" });
  });
});
