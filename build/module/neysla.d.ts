export enum Method {
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum RequestType {
  JSON = "json",
  MULTIPART = "multipart",
  URLENCODED = "urlencoded",
}

export enum ResponseType {
  JSON = "json",
  TEXT = "text",
  ARRAYBUFFER = "arraybuffer",
  BLOB = "blob",
  DOCUMENT = "document",
  STREAM = "stream",
}

interface Config {
  name: string;
  url: string;
  headers?: { [string]: string };
  body?: { [string]: any };
  params?: { [string]: any };
  requestType?: RequestType;
  responseType?: ResponseType;
}

interface ModelBuilder {
  _modelerName: Config.name;
  _url: Config.url;
  _params: Config.params | null;
  _headers: Config.headers | null;
  _requestType: Config.requestType | null;
  _responseType: Config.responseType | null;
  _body: Config.body | null;
  _name: Array<string> | string | null;

  get(data?: { [string]: any }): Promise;
  head(data?: { [string]: any }): Promise;
  post(data?: { [string]: any }): Promise;
  patch(data?: { [string]: any }): Promise;
  put(data?: { [string]: any }): Promise;
  remove(data?: { [string]: any }): Promise;

  _setRequest(
    data: { [string]: any },
    method: Method,
    setBody: boolean
  ): Promise;
  _setUrl(delimiters: Array<string | number> | string | number): string;
  _setParams(params: Config.params): string;
  _setHeaders(headers: Config.headers): Config.headers;
  _setRequestType(requestType: Config.requestType): string | null;
  _setBody(body: FormData | Object): FormData | string;
  _executeRequest(needs: {
    method: Method;
    url: Config.url;
    headers: Config.headers;
    body: FormData | string;
    requestType: string | null;
    responseType: string;
    progress: data.progress;
  }): Promise;
  _handleResponse(
    request: XMLHttpRequest,
    resolve: Function,
    reject: Function,
    url: string,
    responseType: Config.responseType | null
  ): void;
}

interface ModelerBuilder {
  _config: null | Config;
  setModel(name: ModelBuilder._name): ModelBuilder;
}

export default interface Neysla {
  _config: null | Config | Array<Config>;
  init(params: Config): Promise;
  _validate(): boolean;
  _createModelers(): Array<{ [string]: ModelerBuilder }>;
}
