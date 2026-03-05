import { executeRequest } from "../core/request";
import { serializeBody } from "../core/body";
import type {
  NeyslaRequestOptions,
  NeyslaResponse,
  NeyslaResponseType,
  NeyslaRequestType,
} from "../types";

function resolveContentType(requestType?: NeyslaRequestType): string | null {
  switch (requestType) {
    case "json":
      return "application/json";
    case "multipart":
      return null;
    default:
      return "application/x-www-form-urlencoded";
  }
}

function setDirectRequest<T = unknown>(
  data: unknown,
  method: string,
  setBody: boolean
): Promise<NeyslaResponse<T>> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return Promise.reject(
      new TypeError("Neysla: The configuration must be an object.")
    );
  }

  const options = data as NeyslaRequestOptions;

  if (!options.url || typeof options.url !== "string") {
    return Promise.reject(
      new TypeError("Neysla: Request has no properly defined url.")
    );
  }

  const body = setBody ? serializeBody(options.body, options.requestType) : null;
  const requestType = resolveContentType(options.requestType);
  const responseType: NeyslaResponseType =
    options.responseType && typeof options.responseType === "string"
      ? options.responseType
      : "json";

  return executeRequest<T>({
    method,
    url: options.url,
    headers: options.headers ?? {},
    body,
    requestType,
    responseType,
    progress: options.progress,
  });
}

export class NeyslaDirectAPI {
  static get<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return setDirectRequest<T>(data, "GET", false);
  }
  static head<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return setDirectRequest<T>(data, "HEAD", false);
  }
  static post<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return setDirectRequest<T>(data, "POST", true);
  }
  static patch<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return setDirectRequest<T>(data, "PATCH", true);
  }
  static put<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return setDirectRequest<T>(data, "PUT", true);
  }
  static remove<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return setDirectRequest<T>(data, "DELETE", true);
  }
}
