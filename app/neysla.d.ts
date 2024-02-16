export enum NeyslaMethod {
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum NeyslaRequestType {
  JSON = "json",
  MULTIPART = "multipart",
  URLENCODED = "urlencoded",
}

export enum NeyslaResponseType {
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
  headers?: { [key: string]: string };
  body?: { [key: string]: any };
  params?: { [key: string]: any };
  requestType?: NeyslaRequestType;
  responseType?: NeyslaResponseType;
}

export class NeyslaResponse {
  headers: Config.headers;
  status: number | string;
  statusText: string;
  data: { [key: string]: any } | any;
  dataType: Config.responseType;
  url: Config.url;
  getHeader(t: any): XMLHttpRequest.getHeader;
}

export class NeyslaModel {
  _modelerName: Config.name;
  _url: Config.url;
  _params: Config.params | null;
  _headers: Config.headers | null;
  _requestType: Config.requestType | null;
  _responseType: Config.responseType | null;
  _body: Config.body | null;
  _name: Array<string> | string | null;

  get(data?: { [key: string]: any }): Promise<NeyslaResponse>;
  head(data?: { [key: string]: any }): Promise<NeyslaResponse>;
  post(data?: { [key: string]: any }): Promise<NeyslaResponse>;
  patch(data?: { [key: string]: any }): Promise<NeyslaResponse>;
  put(data?: { [key: string]: any }): Promise<NeyslaResponse>;
  remove(data?: { [key: string]: any }): Promise<NeyslaResponse>;

  _setRequest(
    data: { [key: string]: any },
    method: NeyslaMethod,
    setBody: boolean
  ): Promise<NeyslaResponse>;
  _setUrl(delimiters: Array<string | number> | string | number): string;
  _setParams(params: Config.params): string;
  _setHeaders(headers: Config.headers): Config.headers;
  _setRequestType(requestType: Config.requestType): string | null;
  _setBody(body: FormData | Object): FormData | string;
  _executeRequest(needs: {
    method: NeyslaMethod;
    url: Config.url;
    headers: Config.headers;
    body: FormData | string;
    requestType: string | null;
    responseType: string;
    progress: data.progress;
  }): Promise<NeyslaResponse>;
  _handleResponse(
    request: XMLHttpRequest,
    resolve: Function,
    reject: Function,
    url: string,
    responseType: Config.responseType | null
  ): void;
}

export class NeyslaModeler {
  _config: null | Config;
  setModel(name: NeyslaModel._name): NeyslaModel;
}

export default class Neysla {
  _config: null | Config | Array<Config>;
  init(params: Config): Promise<{ [key: string]: NeyslaModeler }>;
  _validate(): boolean;
  _createModelers(): { [key: string]: NeyslaModeler };
}
