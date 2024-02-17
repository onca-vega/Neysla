type NeyslaMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH";

type NeyslaRequestType = "json" | "multipart" | "urlencoded";

type NeyslaResponseType =
  | "json"
  | "text"
  | "arraybuffer"
  | "blob"
  | "document"
  | "stream";

type NeyslaConfig = {
  name: string;
  url: string;
  headers?: { [key: string]: string };
  body?: { [key: string]: any };
  params?: { [key: string]: any };
  requestType?: NeyslaRequestType;
  responseType?: NeyslaResponseType;
};

export class NeyslaResponse {
  headers: NeyslaConfig["headers"];
  status: number | string;
  statusText: string;
  data: { [key: string]: any } | any;
  dataType: NeyslaConfig["responseType"];
  url: NeyslaConfig["url"];
  getHeader(t: any): XMLHttpRequest["getResponseHeader"];
}

export class NeyslaModel {
  _modelerName: NeyslaConfig["name"];
  _url: NeyslaConfig["url"];
  _params: NeyslaConfig["params"] | null;
  _headers: NeyslaConfig["headers"] | null;
  _requestType: NeyslaConfig["requestType"] | null;
  _responseType: NeyslaConfig["responseType"] | null;
  _body: NeyslaConfig["body"] | null;
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
  _setParams(params: NeyslaConfig["params"]): string;
  _setHeaders(headers: NeyslaConfig["headers"]): NeyslaConfig["headers"];
  _setRequestType(requestType: NeyslaConfig["requestType"]): string | null;
  _setBody(body: FormData | Object): FormData | string;
  _executeRequest(needs: {
    method: NeyslaMethod;
    url: NeyslaConfig["url"];
    headers: NeyslaConfig["headers"];
    body: FormData | string;
    requestType: string | null;
    responseType: string;
    progress: any;
  }): Promise<NeyslaResponse>;
  _handleResponse(
    request: XMLHttpRequest,
    resolve: Function,
    reject: Function,
    url: string,
    responseType: NeyslaConfig["responseType"] | null
  ): void;
}

export class NeyslaModeler {
  _config: null | NeyslaConfig;
  setModel(name: NeyslaModel["_name"]): NeyslaModel;
}

export default class Neysla {
  _config: null | NeyslaConfig | Array<NeyslaConfig>;
  init(params: NeyslaConfig): Promise<{ [key: string]: NeyslaModeler }>;
  _validate(): boolean;
  _createModelers(): { [key: string]: NeyslaModeler };
}
