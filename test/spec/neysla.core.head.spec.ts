import { describe, it, expect } from "vitest";
import { Neysla } from "../../src/index";
import { createFetchMock } from "../mocks/fetch.mock";

describe("Neysla: core HEAD", () => {
  const server = createFetchMock();

  it("should reject with TypeError when config is not an object", async () => {
    await expect(Neysla.head(4 as any)).rejects.toThrow(
      "Neysla: The configuration must be an object."
    );
  });

  it("should reject with TypeError when url is not defined", async () => {
    await expect(Neysla.head({} as any)).rejects.toThrow(
      "Neysla: Request has no properly defined url."
    );
  });

  it("should return a Promise", () => {
    server.respondWith({ status: 200 });
    const result = Neysla.head({
      url: "http://www.my-api-url.com/service?access=sdfsdhfpod",
    });
    expect(result).toBeInstanceOf(Promise);
  });

  it("should work with request", async () => {
    server.respondWith({
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "application/json",
        "x-pagination-current-page": "117",
      },
    });

    const result = await Neysla.head({
      url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
      requestType: "json",
    });

    expect(result).toBeInstanceOf(Object);
    expect(result.headers["x-pagination-current-page"]).toBeTruthy();
    expect(result.headers["content-type"]).toBeTruthy();
    expect(result.status).toBe(200);
    expect(result.statusText).toBe("OK");
    expect(result.url).toBe(
      "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5"
    );
  });

  it("should reject on error response", async () => {
    server.respondWith({ status: 404, statusText: "Not Found" });

    await expect(
      Neysla.head({
        url: "http://www.my-api-url.com/service/5/model/10/data?access=sdfsdhfpod&foo=bar&barz=5",
        requestType: "json",
      })
    ).rejects.toMatchObject({
      status: 404,
      statusText: "Not Found",
    });
  });
});
