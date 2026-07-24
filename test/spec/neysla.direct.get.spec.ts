import { describe, it, expect } from "vitest";
import { Neysla } from "../../src/index";
import { createFetchMock } from "../mocks/fetch.mock";

describe("Neysla: direct GET params serialization", () => {
  const server = createFetchMock();

  it("appends no query string when params is omitted", async () => {
    server.respondWith({ status: 200, body: {} });
    await Neysla.get({ url: "http://www.my-api-url.com/" });

    const [calledUrl] = server.getMock().mock.calls[0];
    expect(calledUrl).toBe("http://www.my-api-url.com/");
  });

  it("serializes primitive params into a query string", async () => {
    server.respondWith({ status: 200, body: {} });
    await Neysla.get({
      url: "http://www.my-api-url.com/",
      params: { page: 1, limit: 50, active: true },
    });

    const [calledUrl] = server.getMock().mock.calls[0];
    expect(calledUrl).toBe(
      "http://www.my-api-url.com/?page=1&limit=50&active=true"
    );
  });

  it("serializes array params as a repeated key, not a comma-joined string", async () => {
    server.respondWith({ status: 200, body: {} });
    await Neysla.get({
      url: "http://www.my-api-url.com/",
      params: { notIn: ["a", "b", "c"] },
    });

    const [calledUrl] = server.getMock().mock.calls[0];
    expect(calledUrl).toBe(
      "http://www.my-api-url.com/?notIn=a&notIn=b&notIn=c"
    );
  });

  it("mixes scalar and array params in the same request", async () => {
    server.respondWith({ status: 200, body: {} });
    await Neysla.get({
      url: "http://www.my-api-url.com/",
      params: { page: 1, notIn: ["x", "y"] },
    });

    const [calledUrl] = server.getMock().mock.calls[0];
    expect(calledUrl).toBe("http://www.my-api-url.com/?page=1&notIn=x&notIn=y");
  });

  it("appends params on POST as well (direct API shares the same param builder)", async () => {
    server.respondWith({ status: 200, body: {} });
    await Neysla.post({
      url: "http://www.my-api-url.com/",
      requestType: "json",
      body: {},
      params: { source: "test" },
    });

    const [calledUrl] = server.getMock().mock.calls[0];
    expect(calledUrl).toBe("http://www.my-api-url.com/?source=test");
  });
});
