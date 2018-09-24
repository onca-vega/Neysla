///////////////////////////////////USE EXAMPLES/////////////////////////////////
// service["form"].getToken()
// const formSection = service["form"].setModel(["form", "section"]);
// formSection.get({
//   delimiters: 32
// }).then(success => console.log("Good", success)).catch(error => console.log("BAD", error));
// formSection.post({
//   delimiters: 32,
//   params: {
//     "name": "first_section",
//     "label": "First section"
//   }
// }).then(success => console.log("Good", success)).catch(error => console.log("BAD", error));
// formSection.patch({
//   delimiters: [32, 51],
//   params: {
//     "name": "first_section"
//   }
// }).then(success => console.log("Good", success)).catch(error => console.log("BAD", error));
// formSection.remove({
//   delimiters: [32, 51],
// }).then(success => console.log("Good", success)).catch(error => console.log("BAD", error));
////////////////////////////////////////////////////////////////////

// [
//   {
//     name: "myService",
//     baseUrl: "http://my/base-url",
//     dataUrl: "/my-data-url/",
//     tokenUrl: "/oauth2/token",
//     headers: { Authorization: "Basic token-auth" },
//     params: {
//       grant_type: "password",
//       username: parsedData.user,
//       password: parsedData.pass
//     }
//   }
// ]

// [
//   {
//     name: "myService",
//     baseUrl: "http://my/base-url",
//     dataUrl: "/my-data-url/",
//     token: "access-token-auth"
//   }
// ]

export const Veza = config => {
  config = Handler.doError(config);
  if(!config){
    return;
  }
  const Service = Handler.doService(config);
  return new Promise((next, stop) => Service ? next(Service) : stop(Service));
};
const Handler = {
  doError(config){
    let valid = true;
    if(!(config instanceof Object || config instanceof Array)){
      console.error(`Veza: You must set an Array of initializators, in order to use a generated Oauth2 accessToken.`);
      valid = false;
    }
    else if(config instanceof Array && !config.length){
      console.error(`Veza: Array of initializators is empty.`);
      valid = false;
    }

    if(valid && !(config instanceof Array)){
      config = [ config ];
    }
    if(valid){
      for(let i in config){
        if(!config[i].name || typeof config[i].name !== "string" || typeof config[i].name === ""){
          console.error(`Veza: Initializator with index ${ i } has no properly defined name.`);
          valid = false;
        }
        else if(!config[i].url || typeof config[i].url !== "string" || typeof config[i].url === ""){
          console.error(`Veza: Initializator with index ${ i } has no properly defined url.`);
          valid = false;
        }
        else if(!config[i].token || typeof config[i].token !== "object" ||
        (typeof config[i].token === "object" && config[i].token instanceof Array) ||
        !config[i].token.name || typeof config[i].token.name !== "string" || typeof config[i].token.name === "" ||
        !config[i].token.value || typeof config[i].token.value !== "string" || typeof config[i].token.value === ""){
          console.warn(`Veza: Initializator with index ${ i } has no properly defined token's name and/or value.
          Therefore no token will be added to your models`);
          config[i].token = null;
        }
      }
    }
    return valid ? config : false;
  },
  doService(config){
    const Service = {};
    for(const o of config){
      Service[o.name] = this.setBuilder(o);
    }
    return Service;
  },
  setBuilder(config){
    return new Builder({ url: config.url, token: config.token });
  }
};
class Builder {
  constructor(config){
    this.config = config;
  }
  getToken(){
    return this.config.token;
  }
  setModel(name){
    return new Model(this.config, name);
  }
}
class Model {
  constructor(config, name){
    if(!(name instanceof Array || typeof name === "string")){
      console.error(`Veza: The model's name is not properly defined.`);
      return;
    }
    this.token = config.token;
    this.name = name;
    this.url = config.url;
  }
  _setUrl(data){
    if(!(data instanceof Object)){
      console.error(`Veza: The model's data is not properly defined.`);
      return;
    }
    if(data.delimiters && !(data.delimiters instanceof Array || typeof data.delimiters === "string" || typeof data.delimiters === "number")){
      console.error(`Veza: The model's delimiters are not properly defined.`);
      return;
    }
    if(typeof this.name === "string"){
      this.name = [ this.name ];
    }
    if(data.delimiters && !(data.delimiters instanceof Array)){
      data.delimiters = [ data.delimiters ];
    }
    else if(!data.delimiters){
      data.delimiters = [];
    }
    if((!data.delimiters && this.name.length > 1) || !(this.name.length === data.delimiters.length || this.name.length - 1 === data.delimiters.length)){
      console.error(`Veza: Incorrect relation between name and delimiters.`);
      return;
    }
    let lastUrl = "";
    for(let i in this.name){
      lastUrl += `${ this.name[i] }${ (data.delimiters[i] ? ('/' + data.delimiters[i]) : '') }${ (parseInt(i, 10) === this.name.length - 1 ? this.token ? (`?${ this.token.name }=${ this.token.value }`) : '' : '/') }`;
    }
    return lastUrl;
  }
  _handleResponse(request, next, stop){
    const response = {
      headers: {},
      status: request.status,
      statusText: request.statusText,
      getHeader: (t) => request.getResponseHeader(t),
      data: request.response,
      dataType: request.responseType,
      url: request.responseURL
    };
    let headersArray = request.getAllResponseHeaders().split("\r\n");
    for(const o of headersArray){
      if(o !== ""){
        const header = o.split(":");
        response.headers[header[0]] = header[1].trim();
      }
    }
    (request.status >= 300 || request.status === 0) ? stop(response) : next(response);
  }
  get(data){
    let lastUrl = this._setUrl(data);     // Set particular last URL
    if(data.params instanceof Object){    //  Handle params
      let i = 0;
      Object.keys(data.params).forEach(key => {
        lastUrl += `${ i !== 0 || (i === 0 && this.token) ? '&' : '?' }${ key }=${ data.params[key] }`;
        i++;
      });
    }
    const Get = new Promise((next, stop) => {
      const request = new XMLHttpRequest();
      request.addEventListener("loadend", () => this._handleResponse(request, next, stop));     //Handle response
      request.responseType = (data.responseType && typeof data.responseType === "string") ? data.responseType : "json";
      request.open("GET", this.url + lastUrl, true); // true for asynchronous
      request.send(null);                       //Send request
    });
    return Get;
  }
  post(data){
    let params = null;
    if(data.params instanceof Object && data.requestJson){                         //Definition of params for JSON
      params = JSON.stringify(data.params);
    }
    else if(data.params instanceof Object){                                        //Definition of params for x-www-form-urlencoded
      params = "";
      Object.keys(data.params).forEach(key => params += `${ params !== "" ? "&": "" }${ key }=${ data.params[key] }`);
    }
    const lastUrl = this._setUrl(data);
    const Post = new Promise((next, stop) => {
      const request = new XMLHttpRequest();
      request.addEventListener("loadend", () => this._handleResponse(request, next, stop));     //Handle response
      request.responseType = (data.responseType && typeof data.responseType === "string") ? data.responseType : "json";   //Handle response type
      request.open("POST", this.url + lastUrl, true); // true for asynchronous
      request.setRequestHeader("Content-Type", data.requestJson ? "application/json" : "application/x-www-form-urlencoded");    //Set header content type
      request.send(params);                       //Send request
    });
    return Post;
  }
  patch(data){
    let params = null;
    if(data.params instanceof Object && data.requestJson){                         //Definition of params for JSON
      params = JSON.stringify(data.params);
    }
    else if(data.params instanceof Object){                                        //Definition of params for x-www-form-urlencoded
      params = "";
      Object.keys(data.params).forEach(key => params += `${ params !== "" ? "&": "" }${ key }=${ data.params[key] }`);
    }
    const lastUrl = this._setUrl(data);
    const Patch = new Promise((next, stop) => {
      const request = new XMLHttpRequest();
      request.addEventListener("loadend", () => this._handleResponse(request, next, stop));     //Handle response
      request.responseType = (data.responseType && typeof data.responseType === "string") ? data.responseType : "json";   //Handle response type
      request.open("PATCH", this.url + lastUrl, true); // true for asynchronous
      request.setRequestHeader("Content-Type", data.requestJson ? "application/json" : "application/x-www-form-urlencoded");    //Set header content type
      request.send(params);                       //Send request
    });
    return Patch;
  }
  remove(data){
    let params = null;
    if(data.params instanceof Object && data.requestJson){                         //Definition of params for JSON
      params = JSON.stringify(data.params);
    }
    else if(data.params instanceof Object){                                        //Definition of params for x-www-form-urlencoded
      params = "";
      Object.keys(data.params).forEach(key => params += `${ params !== "" ? "&": "" }${ key }=${ data.params[key] }`);
    }
    const lastUrl = this._setUrl(data);
    const Delete = new Promise((next, stop) => {
      const request = new XMLHttpRequest();
      request.addEventListener("loadend", () => this._handleResponse(request, next, stop));     //Handle response
      request.responseType = (data.responseType && typeof data.responseType === "string") ? data.responseType : "json";   //Handle response type
      request.open("DELETE", this.url + lastUrl, true); // true for asynchronous
      request.setRequestHeader("Content-Type", data.requestJson ? "application/json" : "application/x-www-form-urlencoded");    //Set header content type
      request.send(params);                       //Send request
    });
    return Delete;
  }
}
