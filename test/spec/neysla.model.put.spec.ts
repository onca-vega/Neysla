import { describe, it, expect } from "vitest";
import { Neysla } from "../../src/index";
import { createFetchMock } from "../mocks/fetch.mock";

describe("Neysla: model PUT", () => {
  const server = createFetchMock();

  it("should reject when arguments are not an object", async () => {
    const neysla = new Neysla();
    const result = await neysla.init({ name: "myService", url: "http://www.my-api-url.com/" });
    const service = result.myService.setModel(["service", "model", "data"]);
    await expect(service.put(10 as any)).rejects.toThrow(
      "Neysla: The model's configuration must be an object."
    );
  });

  it("should reject when delimiters are not valid", async () => {
    const neysla = new Neysla();
    const result = await neysla.init({ name: "myService", url: "http://www.my-api-url.com/" });
    const service = result.myService.setModel(["service", "model", "data"]);
    await expect(service.put({ delimiters: {} as any })).rejects.toThrow(
      "Neysla: The model's delimiters are not properly defined."
    );
  });

  it("should reject when delimiter count doesn't match", async () => {
    const neysla = new Neysla();
    const result = await neysla.init({ name: "myService", url: "http://www.my-api-url.com/" });
    const service = result.myService.setModel(["service", "model", "data"]);
    await expect(service.put({ delimiters: 5 })).rejects.toThrow(
      "Neysla: Incorrect relation between name and delimiters."
    );
  });

  it("should reject when too many delimiters", async () => {
    const neysla = new Neysla();
    const result = await neysla.init({ name: "myService", url: "http://www.my-api-url.com/" });
    const service = result.myService.setModel(["service", "model", "data"]);
    await expect(service.put({ delimiters: [5, 10, 2, "a"] })).rejects.toThrow(
      "Neysla: Incorrect relation between name and delimiters."
    );
  });

  it("should return a Promise", async () => {
    server.respondWith({ status: 200, body: {} });
    const neysla = new Neysla();
    const result = await neysla.init({ name: "myService", url: "http://www.my-api-url.com/" });
    const service = result.myService.setModel("service");
    expect(service.put()).toBeInstanceOf(Promise);
  });

  it("should return a Promise with n-1 delimiters", async () => {
    server.respondWith({ status: 200, body: {} });
    const neysla = new Neysla();
    const result = await neysla.init({ name: "myService", url: "http://www.my-api-url.com/" });
    const service = result.myService.setModel(["service", "model", "data"]);
    expect(service.put({ delimiters: ["baz", 6] })).toBeInstanceOf(Promise);
  });

  it("should return a Promise with n delimiters", async () => {
    server.respondWith({ status: 200, body: {} });
    const neysla = new Neysla();
    const result = await neysla.init({ name: "myService", url: "http://www.my-api-url.com/" });
    const service = result.myService.setModel(["service", "model", "data"]);
    expect(service.put({ delimiters: [5, "foo", 7] })).toBeInstanceOf(Promise);
  });

  it("should work with full request", async () => {
    const responseData = [{ id: 12, comment: "Hey there" }];
    server.respondWith({
      status: 200,
      statusText: "OK",
      headers: { "content-type": "application/json", "x-pagination-current-page": "117" },
      body: responseData,
    });

    const neysla = new Neysla();
    const modelers = await neysla.init({
      name: "myService",
      url: "http://www.my-api-url.com/",
      params: { foo: "bar", barz: "another" },
    });
    const service = modelers.myService.setModel(["service", "model", "data"]);
    const result = await service.put({
      delimiters: [5, "10"],
      requestType: "json",
      params: { access: "sdfsdhfpod", barz: 5 },
      body: { name: "Full replace" },
    });

    expect(result.status).toBe(200);
    expect(result.statusText).toBe("OK");
    expect(result.dataType).toBe("json");
    expect((result.data as typeof responseData)[0].id).toBe(12);
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
      service.put({ delimiters: [5, "10"], requestType: "json", params: { foo: "bar", barz: 5 } })
    ).rejects.toMatchObject({ status: 404, statusText: "Not Found" });
  });
});
