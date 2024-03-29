import Neysla from "./../../app/neysla.js";

describe("Neysla init", () => {
  describe("Neysla: base init", () => {
    it("no arguments should return 'Neysla: You must set an Array or an Object to initializate your modelers.'", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init();
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: You must set an Array or an Object to initializate your modelers."
      );
    });

    it("wrong argument 'Neysla: You must set an Array or an Object to initializate your modelers.'", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init(5);
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: You must set an Array or an Object to initializate your modelers."
      );
    });

    it("empty object should return 'Neysla: Initializator with index 0 has no properly defined name.'", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init({});
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: Initializator with index 0 has no properly defined name."
      );
    });

    it("empty array should return 'Neysla: Array of initializators is empty.'", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init([]);
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: Array of initializators is empty."
      );
    });
  });

  describe("Neysla: name init", () => {
    it("name wrong initializated should return 'Neysla: Initializator with index 0 has no properly defined name.'", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init({
        name: 5,
      });
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: Initializator with index 0 has no properly defined name."
      );
    });

    it("name initializated should return 'Neysla: Initializator with index 0 has no properly defined url.'", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init({
        name: "myService",
      });
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: Initializator with name myService has no properly defined url."
      );
    });
  });

  describe("Neysla: url init", () => {
    it("url wrong initializated should return 'Neysla: Initializator with index 0 has no properly defined url.'", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init({
        name: "myService",
        url: {},
      });
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: Initializator with name myService has no properly defined url."
      );
    });
    it("url and name should modeler with name", (done) => {
      const neysla = new Neysla();
      spyOn(console, "warn");
      const init = neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
      });
      init.then((success) => {
        expect(init instanceof Promise).toBe(true);
        expect(success instanceof Object).toBe(true);
        expect(success.myService instanceof Object).toBe(true);
        done();
      });
    });
  });

  describe("Neysla: global parameters init", () => {
    it("invalid headers", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        headers: 5,
      });
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: Initializator with name myService has no properly defined headers."
      );
    });
    it("invalid body", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        body: 5,
      });
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: Initializator with name myService has no properly defined body."
      );
    });
    it("invalid params", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        params: [],
      });
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: Initializator with name myService has no properly defined params."
      );
    });
    it("invalid requestType", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        requestType: [],
      });
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: Initializator with name myService has no properly defined requestType."
      );
    });
    it("invalid responseType", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init({
        name: "myService",
        url: "http://www.my-api-url.com/",
        responseType: [],
      });
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: Initializator with name myService has no properly defined responseType."
      );
    });
  });

  describe("Neysla: array of initializators", () => {
    it("url wrong initializated should return 'Neysla: Initializator with index 2 has no properly defined url.'", () => {
      const neysla = new Neysla();
      spyOn(console, "error");
      const init = neysla.init([
        {
          name: "myService",
          url: "http://www.my-api-url.com/",
          params: {
            name: "access",
            value: "sdfsdhfpod",
          },
        },
        {
          name: "myService2",
          url: "http://www.my-api-url.com/",
        },
        {
          name: "myService3",
        },
      ]);
      expect(init).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "Neysla: Initializator with name myService3 has no properly defined url."
      );
    });
    it("all well initializated", (done) => {
      const neysla = new Neysla();
      const init = neysla.init([
        {
          name: "myService",
          url: "http://www.my-api-url.com/",
          params: {
            name: "access",
            value: "sdfsdhfpod",
          },
        },
        {
          name: "myService2",
          url: "http://www.my-api-url2.com",
          body: {
            name: "access",
            value: "sdfsdhfpod",
          },
        },
        {
          name: "myService3",
          url: "http://www.my-api-url3.com",
          requestType: "json",
          responseType: "blob",
        },
      ]);
      init.then((success) => {
        expect(success instanceof Object).toBe(true);
        expect(success.myService instanceof Object).toBe(true);
        expect(success.myService2 instanceof Object).toBe(true);
        expect(success.myService3 instanceof Object).toBe(true);
        expect(success.myService.setModel instanceof Function).toBe(true);
        done();
      });
    });
  });

  describe("Neysla: model initialization", () => {
    it("should throw error of model not well initializated: 'Neysla: The model's name is not properly defined.'", (done) => {
      const config = {
        name: "myService",
        url: "http://www.my-api-url.com/",
        params: {
          name: "access",
          value: "sdfsdhfpod",
        },
      };

      const neysla = new Neysla();

      spyOn(console, "error");
      const init = neysla.init(config);
      neysla.init(config).then((success) => {
        const service = success.myService.setModel();
        const service2 = success.myService.setModel(2);
        expect(console.error).toHaveBeenCalledWith(
          "Neysla: A model's name of myService modeler is not properly defined."
        );
        expect(service).toBe(false);
        expect(service2).toBe(false);
        done();
      });
    });
    it("should have all methods in model", (done) => {
      const neysla = new Neysla();
      neysla
        .init({
          name: "myService",
          url: "http://www.my-api-url.com/",
          body: {
            name: "access",
            value: "sdfsdhfpod",
          },
        })
        .then((success) => {
          const service = success.myService.setModel([
            "service",
            "model",
            "data",
          ]);
          expect(service instanceof Object).toBeTruthy();
          expect(service.get instanceof Function).toBeTruthy();
          expect(service.head instanceof Function).toBeTruthy();
          expect(service.post instanceof Function).toBeTruthy();
          expect(service.patch instanceof Function).toBeTruthy();
          expect(service.put instanceof Function).toBeTruthy();
          expect(service.remove instanceof Function).toBeTruthy();
          done();
        });
    });
  });
});
