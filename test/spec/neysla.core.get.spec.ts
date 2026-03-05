import { describe, it, expect } from "vitest";
import { Neysla } from "../../src/index";
import { createFetchMock } from "../mocks/fetch.mock";

describe("Neysla: core GET", () => {
  const server = createFetchMock();

  it("should reject with TypeError when config is not an object", async () => {
    await expect(Neysla.get(4 as any)).rejects.toThrow(
      "Neysla: The configuration must be an object."
    );
  });

  it("should reject with TypeError when url is not defined", async () => {
    await expect(Neysla.get({} as any)).rejects.toThrow(
      "Neysla: Request has no properly defined url."
    );
  });

  it("should return a Promise", () => {
    server.respondWith({ status: 200, body: {} });
    const result = Neysla.get({
      url: "http://www.my-api-url.com/service?access=sdfsdhfpod",
    });
    expect(result).toBeInstanceOf(Promise);
  });

  it("should work with request", async () => {
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

    const result = await Neysla.get({
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      requestType: "json",
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
    expect(result.url).toBe(
      "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5"
    );
  });

  it("should reject on 404 response", async () => {
    server.respondWith({ status: 404, statusText: "Not Found" });

    await expect(
      Neysla.get({
        url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
        requestType: "json",
      })
    ).rejects.toMatchObject({
      status: 404,
      statusText: "Not Found",
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
    });
  });
});
