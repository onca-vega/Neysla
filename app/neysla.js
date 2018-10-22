// _____________________________________________________________________________
// Neysla
//
// JavaScript library and promise based HTTP RESTful API resources modeler for
// the browser under MIT license.
//
// Author: Marcos Jesús Chávez Vega (onca-vega)
//   github: https://github.com/onca-vega
//   npm: https://www.npmjs.com/~onca-vega
//   linkedin: https://linkedin.com/in/marcos-jesus-chavez-vega-onca
// _____________________________________________________________________________

class Neysla {
  constructor(){
    this.config = null;
  }
  init(config){
    this.config = this._doError(config);
    if(!this.config){
      return false;
    }
    const Service = this._doService(this.config);
    return new Promise(next => next(Service));
  }
  _doError(config){
    let valid = true;
    if(!(config instanceof Object || config instanceof Array)){
      console.error(`Neysla: You must set an Array or an Object to initializate your modelers.`);
      valid = false;
    }
    else if(config instanceof Array && !config.length){
      console.error(`Neysla: Array of initializators is empty.`);
      valid = false;
    }

    if(valid && !(config instanceof Array)){
      config = [ config ];
    }
    if(valid){
      for(let i in config){
        if(!config[i].name || typeof config[i].name !== "string" || typeof config[i].name === ""){
          console.error(`Neysla: Initializator with index ${ i } has no properly defined name.`);
          valid = false;
        }
        else if(!config[i].url || typeof config[i].url !== "string" || typeof config[i].url === ""){
          console.error(`Neysla: Initializator with index ${ i } has no properly defined url.`);
          valid = false;
        }
        else if(!config[i].token || typeof config[i].token !== "object" ||
        (typeof config[i].token === "object" && config[i].token instanceof Array) ||
        !config[i].token.name || typeof config[i].token.name !== "string" || typeof config[i].token.name === "" ||
        !config[i].token.value || typeof config[i].token.value !== "string" || typeof config[i].token.value === ""){
          console.warn(`Neysla: Initializator with index ${ i } has no properly defined token's name and/or value. Therefore no token will be added to your models`);
          config[i].token = null;
        }
      }
    }
    return valid ? config : false;
  }
  _doService(config){
    const Service = {};
    for(const o of config){
      Service[o.name] = this._setBuilder(o);
    }
    return Service;
  }
  _setBuilder(config){
    return new Builder({ url: config.url, token: config.token });
  }
}
class Builder {
  constructor(config){
    this.config = config;
  }
  getToken(){
    return this.config.token;
  }
  setModel(name){
    if(!(name instanceof Array || typeof name === "string")){
      console.error(`Neysla: The model's name is not properly defined.`);
      return false;
    }
    return new Model(this.config, name);
  }
}
class Model {
  constructor(config, name){
    this.token = config.token;
    this.name = name;
    this.url = config.url;
  }
  _setUrl(data){
    if(!(data instanceof Object)){
      console.error(`Neysla: The model's configuration must be an object.`);
      return false;
    }
    else if(data.delimiters && !(data.delimiters instanceof Array || typeof data.delimiters === "string" || typeof data.delimiters === "number")){
      console.error(`Neysla: The model's delimiters are not properly defined.`);
      return false;
    }

    if(data.delimiters && !(data.delimiters instanceof Array)){
      data.delimiters = [ data.delimiters ];
    }
    else if(!data.delimiters){
      data.delimiters = [];
    }

    if(typeof this.name === "string"){
      this.name = [ this.name ];
    }

    if(!(this.name.length === data.delimiters.length || this.name.length - 1 === data.delimiters.length)){
      console.error(`Neysla: Incorrect relation between name and delimiters.`);
      return false;
    }

    let serviceRequest = "";
    for(let i in this.name){
      serviceRequest += `${ this.name[i] }${ (data.delimiters[i] ? ('/' + data.delimiters[i]) : '') }${ (parseInt(i, 10) === this.name.length - 1 ? this.token ? (`?${ this.token.name }=${ this.token.value }`) : '' : '/') }`;
    }

    return serviceRequest;
  }
  _setParams(params){
    let paramsRequest = "";
    if(params instanceof Object){    //  Handle params
      let i = 0;
      Object.keys(params).forEach(key => {
        paramsRequest += `${ i !== 0 || (i === 0 && this.token) ? '&' : '?' }${ key }=${ params[key] }`;
        i++;
      });
    }
    return paramsRequest;
  }
  _setBody(body, requestType){
    let bodyRequest = null;
    if(body instanceof Object){
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
  _handleRequest(requestType){
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
  _executeRequest(needs){
    return new Promise((next, stop) => {
      const url = this.url + needs.paramsRequest;
      const request = new XMLHttpRequest();
      request.addEventListener("progress", needs.progress);
      request.addEventListener("abort", () => this._handleResponse(request, next, stop, url, true));
      request.addEventListener("error", () => this._handleResponse(request, next, stop, url, true));
      request.addEventListener("load", () => this._handleResponse(request, next, stop, url));     //Handle response
      request.responseType = (needs.responseType && typeof needs.responseType === "string") ? needs.responseType : "json";
      request.open(needs.method, url, true); // true for asynchronous
      if(needs.requestType){
        request.setRequestHeader("Content-Type", needs.requestType);    //Set header content type
      }
      request.send(needs.body);                       //Send request
    });
  }
  _handleResponse(request, next, stop, url, requestError = false){
    const response = {
      headers: {},
      status: request.status,
      statusText: request.statusText,
      getHeader: (t) => request.getResponseHeader(t),
      data: request.response,
      dataType: request.responseType,
      url
    };
    let headersArray = request.getAllResponseHeaders().split("\r\n");
    for(const o of headersArray){
      if(o !== ""){
        const header = o.split(":");
        response.headers[header[0]] = header[1].trim();
      }
    }
    (request.status >= 300 || request.status === 0 || requestError) ? stop(response) : next(response);
  }
  get(data = {}){
    let paramsRequest = this._setUrl(data);     // Set particular last URL
    if(paramsRequest === false){
      return paramsRequest;
    }
    if(data.params instanceof Object){    //  Handle params
      paramsRequest += this._setParams(data.params);
    }
    if(!(data.progress instanceof Function)){
      data.progress = function(){};
    }
    const requestType = this._handleRequest(data.requestType);
    return this._executeRequest({
      method: "GET",
      requestType,
      responseType: data.responseType,
      paramsRequest,
      progress: data.progress,
      body: null
    });
  }
  head(data = {}){
    let paramsRequest = this._setUrl(data);     // Set particular last URL
    if(paramsRequest === false){
      return paramsRequest;
    }
    if(data.params instanceof Object){    //  Handle params
      paramsRequest += this._setParams(data.params);
    }
    if(!(data.progress instanceof Function)){
      data.progress = function(){};
    }
    const requestType = this._handleRequest(data.requestType);
    return this._executeRequest({
      method: "HEAD",
      requestType,
      responseType: data.responseType,
      paramsRequest,
      progress: data.progress,
      body: null
    });
  }
  post(data = {}){
    let paramsRequest = this._setUrl(data);
    if(paramsRequest === false){
      return paramsRequest;
    }
    if(data.params instanceof Object){                                            // Handle params
      paramsRequest += this._setParams(data.params);
    }
    if(!(data.progress instanceof Function)){
      data.progress = function(){};
    }
    const body = this._setBody(data.body, data.requestType);                      // Handle body
    const requestType = this._handleRequest(data.requestType);
    return this._executeRequest({
      method: "POST",
      requestType,
      responseType: data.responseType,
      paramsRequest,
      progress: data.progress,
      body
    });
  }
  patch(data = {}){
    let paramsRequest = this._setUrl(data);
    if(paramsRequest === false){
      return paramsRequest;
    }
    if(data.params instanceof Object){                                            // Handle params
      paramsRequest += this._setParams(data.params);
    }
    if(!(data.progress instanceof Function)){
      data.progress = function(){};
    }
    const body = this._setBody(data.body, data.requestType);                      // Handle body
    const requestType = this._handleRequest(data.requestType);
    return this._executeRequest({
      method: "PATCH",
      requestType,
      responseType: data.responseType,
      paramsRequest,
      progress: data.progress,
      body
    });
  }
  put(data = {}){
    let paramsRequest = this._setUrl(data);
    if(paramsRequest === false){
      return paramsRequest;
    }
    if(data.params instanceof Object){                                            // Handle params
      paramsRequest += this._setParams(data.params);
    }
    if(!(data.progress instanceof Function)){
      data.progress = function(){};
    }
    const body = this._setBody(data.body, data.requestType);                      // Handle body
    const requestType = this._handleRequest(data.requestType);
    return this._executeRequest({
      method: "PUT",
      requestType,
      responseType: data.responseType,
      paramsRequest,
      progress: data.progress,
      body
    });
  }
  remove(data = {}){
    let paramsRequest = this._setUrl(data);
    if(paramsRequest === false){
      return paramsRequest;
    }
    if(data.params instanceof Object){                                            // Handle params
      paramsRequest += this._setParams(data.params);
    }
    if(!(data.progress instanceof Function)){
      data.progress = function(){};
    }
    const body = this._setBody(data.body, data.requestType);                      // Handle body
    const requestType = this._handleRequest(data.requestType);
    return this._executeRequest({
      method: "DELETE",
      requestType,
      responseType: data.responseType,
      paramsRequest,
      progress: data.progress,
      body
    });
  }
}
module.exports = Neysla;
