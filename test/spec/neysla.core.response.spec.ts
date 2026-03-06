import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Neysla } from "../../src/index";
import { createFetchMock } from "../mocks/fetch.mock";
import { createXHRMock } from "../mocks/xhr.mock";

describe("Neysla: normalizeFetchResponse — response type branches", () => {
  const server = createFetchMock();

  it("should handle responseType 'text'", async () => {
    server.respondWith({ status: 200, body: "hello world" });
    const result = await Neysla.get({
      url: "http://www.my-api-url.com/text",
      responseType: "text",
    });
    expect(result.data).toBe("hello world");
    expect(result.dataType).toBe("text");
  });

  it("should handle responseType 'arraybuffer'", async () => {
    server.respondWith({ status: 200, body: "binary" });
    const result = await Neysla.get({
      url: "http://www.my-api-url.com/arraybuffer",
      responseType: "arraybuffer",
    });
    expect(result.data).toBeInstanceOf(ArrayBuffer);
    expect(result.dataType).toBe("arraybuffer");
  });

  it("should handle responseType 'blob'", async () => {
    server.respondWith({ status: 200, body: "blobdata" });
    const result = await Neysla.get({
      url: "http://www.my-api-url.com/blob",
      responseType: "blob",
    });
    expect(result.data).toBeInstanceOf(Blob);
    expect(result.dataType).toBe("blob");
  });

  it("should handle responseType 'document' (default branch) as text", async () => {
    server.respondWith({ status: 200, body: "<html></html>" });
    const result = await Neysla.get({
      url: "http://www.my-api-url.com/document",
      responseType: "document",
    });
    expect(typeof result.data).toBe("string");
    expect(result.dataType).toBe("document");
  });

  it("should handle responseType 'stream' (default branch) as text", async () => {
    server.respondWith({ status: 200, body: "stream data" });
    const result = await Neysla.get({
      url: "http://www.my-api-url.com/stream",
      responseType: "stream",
    });
    expect(typeof result.data).toBe("string");
    expect(result.dataType).toBe("stream");
  });
});

describe("Neysla: getHeader — case-insensitive lookup", () => {
  const server = createFetchMock();

  it("should perform case-insensitive lookup", async () => {
    server.respondWith({
      status: 200,
      body: {},
      headers: { "x-custom-header": "myvalue" },
    });
    const result = await Neysla.get({ url: "http://www.my-api-url.com/headers" });
    expect(result.getHeader("X-Custom-Header")).toBe("myvalue");
    expect(result.getHeader("x-custom-header")).toBe("myvalue");
    expect(result.getHeader("X-CUSTOM-HEADER")).toBe("myvalue");
  });

  it("should return null for non-existent header", async () => {
    server.respondWith({ status: 200, body: {} });
    const result = await Neysla.get({ url: "http://www.my-api-url.com/headers" });
    expect(result.getHeader("x-does-not-exist")).toBeNull();
  });
});

describe("Neysla: executeXHR — progress path and parseHeaders", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let model: any;

  // Create model BEFORE any XHR stub is applied — init() must not be intercepted
  beforeEach(async () => {
    const neysla = new Neysla();
    const modelers = await neysla.init({ name: "api", url: "http://www.my-api-url.com/" });
    model = modelers.api.setModel("resource");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should use XHR path and return a successful response when progress is provided", async () => {
    createXHRMock({
      status: 200,
      statusText: "OK",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: 1 }),
    });

    const result = await model.get({ progress: vi.fn() });
    expect(result.status).toBe(200);
    expect(result.statusText).toBe("OK");
    expect(result.headers["content-type"]).toBe("application/json");
    expect(result.url).toContain("http://www.my-api-url.com/resource");
  });

  it("should reject via XHR path on error status", async () => {
    createXHRMock({ status: 500, statusText: "Internal Server Error", body: "error" });

    await expect(model.get({ progress: vi.fn(), responseType: "text" })).rejects.toMatchObject({
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it("parseHeaders: should preserve header values that contain colons", async () => {
    createXHRMock({
      status: 200,
      headers: { date: "Wed, 05 Mar 2026 12:00:00 GMT" },
      body: "ok",
    });

    const result = await model.get({ progress: vi.fn(), responseType: "text" });
    expect(result.headers["date"]).toBe("Wed, 05 Mar 2026 12:00:00 GMT");
  });

  it("parseHeaders: should only include valid key:value lines", async () => {
    createXHRMock({
      status: 200,
      headers: { "content-type": "application/json" },
      body: "ok",
    });

    const result = await model.get({ progress: vi.fn(), responseType: "text" });
    expect(result.headers["content-type"]).toBe("application/json");
    expect(Object.keys(result.headers).length).toBe(1);
  });
});
