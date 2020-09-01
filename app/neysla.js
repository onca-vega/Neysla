/* _____________________________________________________________________________
 * Neysla
 *
 * JavaScript library and promise based HTTP RESTful API resources modeler for
 * the browser under MIT license.
 *
 * Author: Marcos Jesús Chávez Vega (onca-vega)
 *   website: https://onca-vega.com
 * _____________________________________________________________________________
 */

const ModelerBuilder = require('./components/modelerBuilder.js');

class Neysla {
  constructor() {
    this._config = null;
  }
  init(config) {
    this._config = config;

    if (!this._validate()) {
      return false;
    }

    const modelers = this._createModelers();

    return new Promise(resolve => resolve(modelers));
  }
  _validate() {
    let valid = true;

    if (!(this._config instanceof Object || this._config instanceof Array)) {
      console.error(`Neysla: You must set an Array or an Object to initializate your modelers.`);
      valid = false;
    } else if (this._config instanceof Array && !this._config.length) {
      console.error(`Neysla: Array of initializators is empty.`);
      valid = false;
    }

    if (valid && !(this._config instanceof Array)) {
      this._config = [ this._config ];
    }

    if (valid) {
      for (let i in this._config) {
        if (this._config.hasOwnProperty(i)) {
          if (!this._config[i].name || typeof this._config[i].name !== "string") {
            console.error(`Neysla: Initializator with index ${ i } has no properly defined name.`);
            valid = false;
          } else if (typeof this._config[i].url !== "string") {
            console.error(`Neysla: Initializator with name ${ this._config[i].name } has no properly defined url.`);
            valid = false;
          } else if (this._config[i].headers && (typeof this._config[i].headers !== "object" || this._config[i].headers instanceof Array)) {
            console.error(`Neysla: Initializator with name ${ this._config[i].name } has no properly defined headers.`);
            valid = false;
          } else if (this._config[i].params && (typeof this._config[i].params !== "object" || this._config[i].params instanceof Array)) {
            console.error(`Neysla: Initializator with name ${ this._config[i].name } has no properly defined params.`);
            valid = false;
          } else if (this._config[i].requestType && typeof this._config[i].requestType !== "string") {
            console.error(`Neysla: Initializator with name ${ this._config[i].name } has no properly defined requestType.`);
            valid = false;
          } else if (this._config[i].responseType && typeof this._config[i].responseType !== "string") {
            console.error(`Neysla: Initializator with name ${ this._config[i].name } has no properly defined responseType.`);
            valid = false;
          } else if (this._config[i].body && (typeof this._config[i].body !== "object" || this._config[i].body instanceof Array)) {
            console.error(`Neysla: Initializator with name ${ this._config[i].name } has no properly defined body.`);
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
    const responseType = data.responseType && typeof data.responseType === "string" ? data.responseType : "json"; // Handle responseType

    if (!(data.headers instanceof Object)) { // Handle headers
      data.headers = {};
    }

    if (!(data.progress instanceof Function)) { // Handle progress event
      data.progress = function(){};
    }

    return this._executeRequest({
      method,
      body,
      requestType,
      responseType,
      headers: data.headers,
      progress: data.progress,
      url: data.url
    });
  }
  static _setBody(body, requestType) {
    let bodyRequest = null;

    if (body instanceof Object) {
      switch (requestType) {
        case "json":                                    //Definition of body for JSON
          bodyRequest = JSON.stringify(body);
          break;
        case "multipart":                               //Definition of body for multipart
          bodyRequest = new FormData();
          Object.keys(body).forEach(key => bodyRequest.append(key, body[key]));
          break;
        default:                                        //Definition of body for x-www-form-urlencoded
          bodyRequest = "";
          Object.keys(body).forEach(key => bodyRequest += `${ bodyRequest !== "" ? "&": "" }${ key }=${ body[key] }`);
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
      request.addEventListener("abort", () => this._handleResponse(request, resolve, reject, needs.url, needs.responseType, true));
      request.addEventListener("error", () => this._handleResponse(request, resolve, reject, needs.url, needs.responseType, true));
      request.addEventListener("load", () => this._handleResponse(request, resolve, reject, needs.url, needs.responseType));     //Handle response
      request.open(needs.method, needs.url, true); // true for asynchronous
      request.responseType = needs.responseType;

      if (needs.requestType) {
        request.setRequestHeader("Content-Type", needs.requestType);    //Set header content type
      }

      Object.keys(needs.headers).forEach(header => {
        request.setRequestHeader(header, needs.headers[header]);    //Set custom headers
      });

      request.send(needs.body);                       //Send request
    });
  }
  static _handleResponse(request, resolve, reject, url, responseType, requestError = false) {
    const response = {
      headers: {},
      status: request.status,
      statusText: request.statusText,
      getHeader: t => request.getResponseHeader(t),
      data: !requestError && responseType === "json" && typeof request.response === "string" ? JSON.parse(request.response) : request.response, // handle IE lack of json responseType
      dataType: request.responseType,
      url
    };

    const headersArray = request.getAllResponseHeaders().split("\r\n");

    for(const o of headersArray){
      if(o !== ""){
        const header = o.split(":");
        response.headers[header[0]] = header[1].trim();
      }
    }
    (request.status >= 300 || request.status === 0 || requestError) ? reject(response) : resolve(response);
  }
}

module.exports = Neysla;
