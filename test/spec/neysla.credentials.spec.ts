import { describe, it, expect } from "vitest";
import { Neysla } from "../../src/index";
import { createFetchMock } from "../mocks/fetch.mock";

describe("Neysla: credentials propagation", () => {
  const server = createFetchMock();

  describe("model API", () => {
    it("should pass credentials from NeyslaConfig to fetch", async () => {
      server.respondWith({ status: 200, body: {} });

      const neysla = new Neysla();
      const modelers = await neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        credentials: "include",
      });
      const service = modelers.myService.setModel("resource");
      await service.get();

      const [, fetchOptions] = server.getMock().mock.calls[0] as [string, RequestInit];
      expect(fetchOptions.credentials).toBe("include");
    });

    it("should override base credentials with per-request credentials", async () => {
      server.respondWith({ status: 200, body: {} });

      const neysla = new Neysla();
      const modelers = await neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        credentials: "include",
      });
      const service = modelers.myService.setModel("resource");
      await service.get({ credentials: "same-origin" });

      const [, fetchOptions] = server.getMock().mock.calls[0] as [string, RequestInit];
      expect(fetchOptions.credentials).toBe("same-origin");
    });

    it("should not set credentials when not configured", async () => {
      server.respondWith({ status: 200, body: {} });

      const neysla = new Neysla();
      const modelers = await neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
      });
      const service = modelers.myService.setModel("resource");
      await service.get();

      const [, fetchOptions] = server.getMock().mock.calls[0] as [string, RequestInit];
      expect(fetchOptions.credentials).toBeUndefined();
    });
  });

  describe("core (direct) API", () => {
    it("should pass credentials to fetch", async () => {
      server.respondWith({ status: 200, body: {} });

      await Neysla.get({
        url: "http://www.my-api-url.com/resource",
        credentials: "include",
      });

      const [, fetchOptions] = server.getMock().mock.calls[0] as [string, RequestInit];
      expect(fetchOptions.credentials).toBe("include");
    });

    it("should not set credentials when not provided", async () => {
      server.respondWith({ status: 200, body: {} });

      await Neysla.get({ url: "http://www.my-api-url.com/resource" });

      const [, fetchOptions] = server.getMock().mock.calls[0] as [string, RequestInit];
      expect(fetchOptions.credentials).toBeUndefined();
    });
  });
});
