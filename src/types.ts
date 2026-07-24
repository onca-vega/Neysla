export type NeyslaMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH";

export type NeyslaRequestType = "json" | "multipart" | "urlencoded";

/**
 * Query param values. Arrays serialize as a repeated key (?k=a&k=b), the
 * shape most backends expect for multi-value params — not a comma-joined
 * string. See core/params.ts::buildQueryString.
 */
export type NeyslaParams = Record<
  string,
  string | number | boolean | Array<string | number>
>;

export type NeyslaResponseType =
  | "json"
  | "text"
  | "arraybuffer"
  | "blob"
  | "document"
  | "stream";

export interface NeyslaConfig {
  name: string;
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  params?: NeyslaParams;
  requestType?: NeyslaRequestType;
  responseType?: NeyslaResponseType;
  credentials?: RequestCredentials;
}

export interface NeyslaRequestOptions {
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | FormData;
  params?: NeyslaParams;
  requestType?: NeyslaRequestType;
  responseType?: NeyslaResponseType;
  progress?: (event: ProgressEvent) => void;
  credentials?: RequestCredentials;
}

export interface NeyslaModelRequestOptions {
  delimiters?: string | number | Array<string | number>;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | FormData;
  params?: NeyslaParams;
  requestType?: NeyslaRequestType;
  responseType?: NeyslaResponseType;
  progress?: (event: ProgressEvent) => void;
  credentials?: RequestCredentials;
}

export interface NeyslaResponse<T = unknown> {
  headers: Record<string, string>;
  status: number;
  statusText: string;
  data: T;
  dataType: NeyslaResponseType;
  url: string;
  getHeader(name: string): string | null;
}
