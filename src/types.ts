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
  params?: Record<string, string | number>;
  requestType?: NeyslaRequestType;
  responseType?: NeyslaResponseType;
}

export interface NeyslaRequestOptions {
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | FormData;
  params?: Record<string, string | number>;
  requestType?: NeyslaRequestType;
  responseType?: NeyslaResponseType;
  progress?: (event: ProgressEvent) => void;
}

export interface NeyslaModelRequestOptions {
  delimiters?: string | number | Array<string | number>;
  headers?: Record<string, string>;
  body?: Record<string, unknown> | FormData;
  params?: Record<string, string | number>;
  requestType?: NeyslaRequestType;
  responseType?: NeyslaResponseType;
  progress?: (event: ProgressEvent) => void;
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
