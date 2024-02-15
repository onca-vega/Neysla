/* _____________________________________________________________________________
 * Neysla
 *
 * JavaScript library and promise based HTTP RESTful API resources modeler for
 * the browser under MIT license.
 *
 * Author: Marcos Jesús Chávez Vega (onca-vega)
 *   website: https://yo.onca-vega.com
 * _____________________________________________________________________________
 */

export default class Neysla {
  _config = null;

  constructor() {
    this._config = null;
  }

  init(config) {
    this._config = config;

    if (!this._validate()) {
      return false;
    }

    const modelers = this._createModelers();

    return new Promise((resolve) => resolve(modelers));
  }
  _validate() {
    let valid = true;

    if (!(this._config instanceof Object || this._config instanceof Array)) {
      console.error(
        `Neysla: You must set an Array or an Object to initializate your modelers.`
      );
      valid = false;
    } else if (this._config instanceof Array && !this._config.length) {
      console.error(`Neysla: Array of initializators is empty.`);
      valid = false;
    }

    if (valid && !(this._config instanceof Array)) {
      this._config = [this._config];
    }

    if (valid) {
      for (let i in this._config) {
        if (this._config.hasOwnProperty(i)) {
          if (
            !this._config[i].name ||
            typeof this._config[i].name !== "string"
          ) {
            console.error(
              `Neysla: Initializator with index ${i} has no properly defined name.`
            );
            valid = false;
          } else if (typeof this._config[i].url !== "string") {
            console.error(
              `Neysla: Initializator with name ${this._config[i].name} has no properly defined url.`
            );
            valid = false;
          } else if (
            this._config[i].headers &&
            (typeof this._config[i].headers !== "object" ||
              this._config[i].headers instanceof Array)
          ) {
            console.error(
              `Neysla: Initializator with name ${this._config[i].name} has no properly defined headers.`
            );
            valid = false;
          } else if (
            this._config[i].params &&
            (typeof this._config[i].params !== "object" ||
              this._config[i].params instanceof Array)
          ) {
            console.error(
              `Neysla: Initializator with name ${this._config[i].name} has no properly defined params.`
            );
            valid = false;
          } else if (
            this._config[i].requestType &&
            typeof this._config[i].requestType !== "string"
          ) {
            console.error(
              `Neysla: Initializator with name ${this._config[i].name} has no properly defined requestType.`
            );
            valid = false;
          } else if (
            this._config[i].responseType &&
            typeof this._config[i].responseType !== "string"
          ) {
            console.error(
              `Neysla: Initializator with name ${this._config[i].name} has no properly defined responseType.`
            );
            valid = false;
          } else if (
            this._config[i].body &&
            (typeof this._config[i].body !== "object" ||
              this._config[i].body instanceof Array)
          ) {
            console.error(
              `Neysla: Initializator with name ${this._config[i].name} has no properly defined body.`
            );
            valid = false;
          }
        }
      }
    }

    return valid;
  }
  _createModelers() {
    const modelers = {};

    for (const o of this._config) {
      modelers[o.name] = new ModelerBuilder(o);
    }

    return modelers;
  }

  static get(data = {}) {
    return this._setRequest(data, "GET");
  }
  static head(data = {}) {
    return this._setRequest(data, "HEAD");
  }
  static post(data = {}) {
    return this._setRequest(data, "POST", true);
  }
  static patch(data = {}) {
    return this._setRequest(data, "PATCH", true);
  }
  static put(data = {}) {
    return this._setRequest(data, "PUT", true);
  }
  static remove(data = {}) {
    return this._setRequest(data, "DELETE", true);
  }
  static _setRequest(data, method, setBody = false) {
    if (!(data instanceof Object)) {
      console.error(`Neysla: The configuration must be an object.`);
      return false;
    }

    const body = setBody ? this._setBody(data.body, data.requestType) : null; // Handle body
    const requestType = this._setRequestType(data.requestType); // Handle requestType
    const responseType =
      data.responseType && typeof data.responseType === "string"
        ? data.responseType
        : "json"; // Handle responseType

    if (!(data.headers instanceof Object)) {
      // Handle headers
      data.headers = {};
    }

    if (!(data.progress instanceof Function)) {
      // Handle progress event
      data.progress = function () {};
    }

    return this._executeRequest({
      method,
      body,
      requestType,
      responseType,
      headers: data.headers,
      progress: data.progress,
      url: data.url,
    });
  }
  static _setBody(body, requestType) {
    let bodyRequest = null;

    if (body instanceof FormData && requestType === "multipart") {
      bodyRequest = body;
    } else if (body instanceof Object) {
      switch (requestType) {
        case "json": //Definition of body for JSON
          bodyRequest = JSON.stringify(body);
          break;
        case "multipart": //Definition of body for multipart
          bodyRequest = new FormData();
          Object.keys(body).forEach((key) =>
            bodyRequest.append(key, body[key])
          );
          break;
        default:
          //Definition of body for x-www-form-urlencoded
          bodyRequest = "";
          Object.keys(body).forEach(
            (key) =>
              (bodyRequest += `${bodyRequest !== "" ? "&" : ""}${key}=${
                body[key]
              }`)
          );
      }
    }

    return bodyRequest;
  }
  static _setRequestType(requestType) {
    let finalType;

    switch (requestType) {
      case "json":
        finalType = "application/json";
        break;
      case "multipart":
        finalType = null;
        break;
      default:
        finalType = "application/x-www-form-urlencoded";
    }

    return finalType;
  }
  static _executeRequest(needs) {
    if (!needs.url || typeof needs.url !== "string") {
      console.error(`Neysla: Request has no properly defined url.`);
      return false;
    }

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.addEventListener("progress", needs.progress);
      request.addEventListener("abort", () =>
        this._handleResponse(
          request,
          resolve,
          reject,
          needs.url,
          needs.responseType,
          true
        )
      );
      request.addEventListener("error", () =>
        this._handleResponse(
          request,
          resolve,
          reject,
          needs.url,
          needs.responseType,
          true
        )
      );
      request.addEventListener("load", () =>
        this._handleResponse(
          request,
          resolve,
          reject,
          needs.url,
          needs.responseType
        )
      ); //Handle response
      request.open(needs.method, needs.url, true); // true for asynchronous
      request.responseType = needs.responseType;

      if (needs.requestType) {
        request.setRequestHeader("Content-Type", needs.requestType); //Set header content type
      }

      Object.keys(needs.headers).forEach((header) => {
        request.setRequestHeader(header, needs.headers[header]); //Set custom headers
      });

      request.send(needs.body); //Send request
    });
  }
  static _handleResponse(
    request,
    resolve,
    reject,
    url,
    responseType,
    requestError = false
  ) {
    const response = {
      headers: {},
      status: request.status,
      statusText: request.statusText,
      getHeader: (t) => request.getResponseHeader(t),
      data:
        !requestError &&
        responseType === "json" &&
        typeof request.response === "string"
          ? JSON.parse(request.response)
          : request.response, // handle IE lack of json responseType
      dataType: request.responseType,
      url,
    };

    const headersArray = request.getAllResponseHeaders().split("\r\n");

    for (const o of headersArray) {
      if (o !== "") {
        const header = o.split(":");
        response.headers[header[0]] = header[1].trim();
      }
    }
    request.status >= 300 || request.status === 0 || requestError
      ? reject(response)
      : resolve(response);
  }
}

class ModelerBuilder {
  _config = null;

  constructor(config) {
    this.config = config;
  }

  setModel(name) {
    if (!(name instanceof Array || typeof name === "string")) {
      console.error(
        `Neysla: A model's name of ${this.config.name} modeler is not properly defined.`
      );
      return false;
    }

    return new ModelBuilder(this.config, name);
  }
}

class ModelBuilder {
  _modelerName = null;
  _url = null;
  _params = null;
  _headers = null;
  _requestType = null;
  _responseType = null;
  _body = null;
  _name = null;

  constructor(config, name) {
    this._modelerName = config.name;
    this._url = config.url;
    this._params =
      config.params instanceof Object && Object.keys(config.params).length
        ? config.params
        : null;
    this._headers =
      config.headers instanceof Object && Object.keys(config.headers).length
        ? config.headers
        : null;
    this._requestType =
      !!config.requestType && typeof config.requestType === "string"
        ? config.requestType
        : null;
    this._responseType =
      !!config.responseType && typeof config.responseType === "string"
        ? config.responseType
        : null;
    this._body =
      config.body instanceof Object && Object.keys(config.body).length
        ? config.body
        : null;

    this._name = name;
  }
  get(data = {}) {
    return this._setRequest(data, "GET");
  }
  head(data = {}) {
    return this._setRequest(data, "HEAD");
  }
  post(data = {}) {
    return this._setRequest(data, "POST", true);
  }
  patch(data = {}) {
    return this._setRequest(data, "PATCH", true);
  }
  put(data = {}) {
    return this._setRequest(data, "PUT", true);
  }
  remove(data = {}) {
    return this._setRequest(data, "DELETE", true);
  }
  _setRequest(data, method, setBody = false) {
    if (!(data instanceof Object)) {
      console.error(`Neysla: The model's configuration must be an object.`);
      return false;
    } else if (
      data.delimiters &&
      !(
        data.delimiters instanceof Array ||
        typeof data.delimiters === "string" ||
        typeof data.delimiters === "number"
      )
    ) {
      console.error(`Neysla: The model's delimiters are not properly defined.`);
      return false;
    }

    let url = this._setUrl(data.delimiters); // Set relative URL with delimiters
    if (url === false) {
      return url;
    }

    url += this._setParams(data.params); // Handle params

    const headers = this._setHeaders(data.headers); // Handle headers
    const body = setBody
      ? this._setBody(data.body, data.requestType || this._requestType)
      : null; // Handle body
    const requestType = this._setRequestType(data.requestType); // Handle request type
    const responseType =
      typeof data.responseType === "string"
        ? data.responseType
        : typeof this._responseType === "string"
        ? this._responseType
        : "json"; // Handle response type

    if (!(data.progress instanceof Function)) {
      data.progress = function () {};
    }

    return this._executeRequest({
      method,
      url,
      headers,
      body,
      requestType,
      responseType,
      progress: data.progress,
    });
  }
  _setUrl(delimiters) {
    if (delimiters && !(delimiters instanceof Array)) {
      delimiters = [delimiters];
    } else if (!delimiters) {
      delimiters = [];
    }

    if (typeof this._name === "string") {
      this._name = [this._name];
    }

    if (
      !(
        this._name.length === delimiters.length ||
        this._name.length - 1 === delimiters.length
      )
    ) {
      console.error(`Neysla: Incorrect relation between name and delimiters.`);
      return false;
    }

    let relativeUrl = "";
    for (let i in this._name) {
      relativeUrl += `${this._name[i]}${
        delimiters[i] ? "/" + delimiters[i] : ""
      }${parseInt(i, 10) === this._name.length - 1 ? "" : "/"}`;
    }

    return this._url + relativeUrl;
  }
  _setParams(params) {
    let paramsRequest = "";
    let paramsComplete = null;

    if (this._params instanceof Object) {
      paramsComplete = { ...this._params };
    }

    if (params instanceof Object) {
      // Handle predefined params
      paramsComplete = { ...paramsComplete, ...params };
    }

    if (paramsComplete instanceof Object) {
      // Handle params
      Object.keys(paramsComplete).forEach((key, i) => {
        paramsRequest += `${i !== 0 ? "&" : "?"}${key}=${paramsComplete[key]}`;
      });
    }

    return paramsRequest;
  }
  _setHeaders(headers) {
    let headersComplete = {};

    if (this._headers instanceof Object) {
      // Handle predefined headers
      headersComplete = { ...this._headers };
    }

    if (headers instanceof Object) {
      // Handle headers
      headersComplete = { ...headersComplete, ...headers };
    }

    return headersComplete;
  }
  _setRequestType(requestType = this._requestType) {
    let finalType;

    switch (requestType) {
      case "json":
        finalType = "application/json";
        break;
      case "multipart":
        finalType = null;
        break;
      default:
        finalType = "application/x-www-form-urlencoded";
    }
    return finalType;
  }
  _setBody(body, requestType) {
    let bodyRequest = null;

    if (body instanceof FormData && requestType === "multipart") {
      bodyRequest = body;

      if (this._body instanceof Object) {
        // Handle predefined body
        for (const key in this._body) {
          bodyRequest.append(key, this._body[key]);
        }
      }
    } else {
      let bodyComplete = null;

      if (this._body instanceof Object && body instanceof Object) {
        // Handle predefined and custom body
        bodyComplete = { ...this._body, ...body };
      } else if (body instanceof Object) {
        // Handle custom body
        bodyComplete = { ...body };
      } else if (this._body instanceof Object) {
        // Handle predefined body
        bodyComplete = { ...this._body };
      }

      if (bodyComplete instanceof Object) {
        switch (requestType) {
          case "json": //Definition of body for JSON
            bodyRequest = JSON.stringify(bodyComplete);
            break;
          case "multipart": //Definition of body for multipart
            bodyRequest = new FormData();
            Object.keys(bodyComplete).forEach((key) =>
              bodyRequest.append(key, bodyComplete[key])
            );
            break;
          default:
            //Definition of body for x-www-form-urlencoded
            bodyRequest = "";
            Object.keys(bodyComplete).forEach(
              (key) =>
                (bodyRequest += `${bodyRequest !== "" ? "&" : ""}${key}=${
                  bodyComplete[key]
                }`)
            );
        }
      }
    }

    return bodyRequest;
  }
  _executeRequest(needs) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.addEventListener("progress", needs.progress);
      request.addEventListener("abort", () =>
        this._handleResponse(
          request,
          resolve,
          reject,
          needs.url,
          needs.responseType,
          true
        )
      );
      request.addEventListener("error", () =>
        this._handleResponse(
          request,
          resolve,
          reject,
          needs.url,
          needs.responseType,
          true
        )
      );
      request.addEventListener("load", () =>
        this._handleResponse(
          request,
          resolve,
          reject,
          needs.url,
          needs.responseType
        )
      ); //Handle response
      request.open(needs.method, needs.url, true); // true for asynchronous
      request.responseType = needs.responseType;

      if (needs.requestType) {
        request.setRequestHeader("Content-Type", needs.requestType); //Set header content type
      }

      for (let header in needs.headers) {
        if (needs.headers.hasOwnProperty(header)) {
          request.setRequestHeader(header, needs.headers[header]); //Set custom headers
        }
      }

      request.send(needs.body); //Send request
    });
  }
  _handleResponse(
    request,
    resolve,
    reject,
    url,
    responseType,
    requestError = false
  ) {
    const response = {
      headers: {},
      status: request.status,
      statusText: request.statusText,
      getHeader: (t) => request.getResponseHeader(t),
      data:
        !requestError &&
        responseType === "json" &&
        typeof request.response === "string"
          ? JSON.parse(request.response)
          : request.response, // handle IE lack of json responseType
      dataType: request.responseType,
      url,
    };

    let headersArray = request.getAllResponseHeaders().split("\r\n");

    for (const o of headersArray) {
      if (o !== "") {
        const header = o.split(":");
        response.headers[header[0]] = header[1].trim();
      }
    }

    request.status >= 300 || request.status === 0 || requestError
      ? reject(response)
      : resolve(response);
  }
}
