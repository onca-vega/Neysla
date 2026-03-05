import { describe, it, expect } from "vitest";
import { Neysla } from "../../src/index";

describe("Neysla init", () => {
  describe("Neysla: base init", () => {
    it("no arguments should reject with TypeError", async () => {
      const neysla = new Neysla();
      await expect(neysla.init(undefined as any)).rejects.toThrow(
        "Neysla: You must set an Array or an Object to initializate your modelers."
      );
    });

    it("wrong argument should reject with TypeError", async () => {
      const neysla = new Neysla();
      await expect(neysla.init(5 as any)).rejects.toThrow(
        "Neysla: You must set an Array or an Object to initializate your modelers."
      );
    });

    it("empty object should reject with 'no properly defined name'", async () => {
      const neysla = new Neysla();
      await expect(neysla.init({} as any)).rejects.toThrow(
        "Neysla: Initializator with index 0 has no properly defined name."
      );
    });

    it("empty array should reject with TypeError", async () => {
      const neysla = new Neysla();
      await expect(neysla.init([])).rejects.toThrow(
        "Neysla: Array of initializators is empty."
      );
    });
  });

  describe("Neysla: name init", () => {
    it("name wrong type should reject with TypeError", async () => {
      const neysla = new Neysla();
      await expect(neysla.init({ name: 5 } as any)).rejects.toThrow(
        "Neysla: Initializator with index 0 has no properly defined name."
      );
    });

    it("name without url should reject with url TypeError", async () => {
      const neysla = new Neysla();
      await expect(neysla.init({ name: "myService" } as any)).rejects.toThrow(
        "Neysla: Initializator with name myService has no properly defined url."
      );
    });
  });

  describe("Neysla: url init", () => {
    it("url wrong type should reject with TypeError", async () => {
      const neysla = new Neysla();
      await expect(
        neysla.init({ name: "myService", url: {} } as any)
      ).rejects.toThrow(
        "Neysla: Initializator with name myService has no properly defined url."
      );
    });

    it("url and name should resolve with modeler", async () => {
      const neysla = new Neysla();
      const result = await neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
      });
      expect(result).toBeInstanceOf(Object);
      expect(result.myService).toBeInstanceOf(Object);
    });
  });

  describe("Neysla: global parameters init", () => {
    it("invalid headers should reject with TypeError", async () => {
      const neysla = new Neysla();
      await expect(
        neysla.init({ name: "myService", url: "http://www.my-api-url.com/", headers: 5 } as any)
      ).rejects.toThrow(
        "Neysla: Initializator with name myService has no properly defined headers."
      );
    });

    it("invalid body should reject with TypeError", async () => {
      const neysla = new Neysla();
      await expect(
        neysla.init({ name: "myService", url: "http://www.my-api-url.com/", body: 5 } as any)
      ).rejects.toThrow(
        "Neysla: Initializator with name myService has no properly defined body."
      );
    });

    it("invalid params (array) should reject with TypeError", async () => {
      const neysla = new Neysla();
      await expect(
        neysla.init({ name: "myService", url: "http://www.my-api-url.com/", params: [] } as any)
      ).rejects.toThrow(
        "Neysla: Initializator with name myService has no properly defined params."
      );
    });

    it("invalid requestType should reject with TypeError", async () => {
      const neysla = new Neysla();
      await expect(
        neysla.init({ name: "myService", url: "http://www.my-api-url.com/", requestType: [] } as any)
      ).rejects.toThrow(
        "Neysla: Initializator with name myService has no properly defined requestType."
      );
    });

    it("invalid responseType should reject with TypeError", async () => {
      const neysla = new Neysla();
      await expect(
        neysla.init({ name: "myService", url: "http://www.my-api-url.com/", responseType: [] } as any)
      ).rejects.toThrow(
        "Neysla: Initializator with name myService has no properly defined responseType."
      );
    });
  });

  describe("Neysla: array of initializators", () => {
    it("third config without url should reject with TypeError", async () => {
      const neysla = new Neysla();
      await expect(
        neysla.init([
          { name: "myService", url: "http://www.my-api-url.com/", params: { name: "access", value: "sdfsdhfpod" } },
          { name: "myService2", url: "http://www.my-api-url.com/" },
          { name: "myService3" } as any,
        ])
      ).rejects.toThrow(
        "Neysla: Initializator with name myService3 has no properly defined url."
      );
    });

    it("all well initialized should resolve with three modelers", async () => {
      const neysla = new Neysla();
      const result = await neysla.init([
        { name: "myService", url: "http://www.my-api-url.com/", params: { name: "access", value: "sdfsdhfpod" } },
        { name: "myService2", url: "http://www.my-api-url2.com", body: { name: "access", value: "sdfsdhfpod" } },
        { name: "myService3", url: "http://www.my-api-url3.com", requestType: "json", responseType: "blob" },
      ]);
      expect(result).toBeInstanceOf(Object);
      expect(result.myService).toBeInstanceOf(Object);
      expect(result.myService2).toBeInstanceOf(Object);
      expect(result.myService3).toBeInstanceOf(Object);
      expect(result.myService.setModel).toBeInstanceOf(Function);
    });
  });

  describe("Neysla: model initialization", () => {
    it("setModel without name should throw TypeError", async () => {
      const neysla = new Neysla();
      const result = await neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        params: { name: "access", value: "sdfsdhfpod" },
      });
      expect(() => result.myService.setModel(undefined as any)).toThrow(
        "Neysla: A model's name of myService modeler is not properly defined."
      );
      expect(() => result.myService.setModel(2 as any)).toThrow(
        "Neysla: A model's name of myService modeler is not properly defined."
      );
    });

    it("should have all methods in model", async () => {
      const neysla = new Neysla();
      const result = await neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        body: { name: "access", value: "sdfsdhfpod" },
      });
      const service = result.myService.setModel(["service", "model", "data"]);
      expect(service).toBeTruthy();
      expect(service.get).toBeInstanceOf(Function);
      expect(service.head).toBeInstanceOf(Function);
      expect(service.post).toBeInstanceOf(Function);
      expect(service.patch).toBeInstanceOf(Function);
      expect(service.put).toBeInstanceOf(Function);
      expect(service.remove).toBeInstanceOf(Function);
    });
  });
});
