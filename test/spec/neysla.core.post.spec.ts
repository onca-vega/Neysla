import { describe, it, expect } from "vitest";
import { Neysla } from "../../src/index";
import { createFetchMock } from "../mocks/fetch.mock";

describe("Neysla: core POST", () => {
  const server = createFetchMock();

  it("should reject with TypeError when config is not an object", async () => {
    await expect(Neysla.post(4 as any)).rejects.toThrow(
      "Neysla: The configuration must be an object."
    );
  });

  it("should reject with TypeError when url is not defined", async () => {
    await expect(Neysla.post({} as any)).rejects.toThrow(
      "Neysla: Request has no properly defined url."
    );
  });

  it("should return a Promise", () => {
    server.respondWith({ status: 201, body: {} });
    const result = Neysla.post({
      url: "http://www.my-api-url.com/service?access=sdfsdhfpod",
    });
    expect(result).toBeInstanceOf(Promise);
  });

  it("should work with request and JSON body", async () => {
    const responseData = [{ id: 12, comment: "Hey there" }];
    server.respondWith({
      status: 201,
      statusText: "Created",
      headers: {
        "content-type": "application/json",
        "x-pagination-current-page": "117",
      },
      body: responseData,
    });

    const result = await Neysla.post({
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      requestType: "json",
      body: { name: "My name", age: 25, country: "MX" },
    });

    expect(result).toBeInstanceOf(Object);
    expect(result.headers["x-pagination-current-page"]).toBeTruthy();
    expect(result.headers["content-type"]).toBeTruthy();
    expect(result.dataType).toBe("json");
    expect((result.data as typeof responseData)[0].id).toBe(12);
    expect((result.data as typeof responseData)[0].comment).toBe("Hey there");
    expect(result.status).toBe(201);
    expect(result.statusText).toBe("Created");
    expect(result.url).toBe(
      "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5"
    );
  });

  it("should work with multipart body", async () => {
    const responseData = [{ id: 12, comment: "Hey there" }];
    server.respondWith({
      status: 201,
      statusText: "Created",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-pagination-current-page": "117",
      },
      body: responseData,
    });

    const result = await Neysla.post({
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      requestType: "multipart",
      body: { name: "My name", age: 25, country: "MX" },
    });

    expect(result).toBeInstanceOf(Object);
    expect(result.status).toBe(201);
    expect(result.statusText).toBe("Created");
    expect(result.dataType).toBe("json");
  });

  it("should reject on error response", async () => {
    server.respondWith({ status: 401, statusText: "Unauthorized" });

    await expect(
      Neysla.post({
        url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
        requestType: "json",
      })
    ).rejects.toMatchObject({
      status: 401,
      statusText: "Unauthorized",
    });
  });
});
