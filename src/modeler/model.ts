import { executeRequest } from "../core/request";
import { mergeBody } from "../core/body";
import type {
  NeyslaConfig,
  NeyslaModelRequestOptions,
  NeyslaResponse,
  NeyslaResponseType,
  NeyslaRequestType,
} from "../types";

function resolveContentType(requestType?: NeyslaRequestType | null): string | null {
  switch (requestType) {
    case "json":
      return "application/json";
    case "multipart":
      return null;
    default:
      return "application/x-www-form-urlencoded";
  }
}

export class NeyslaModel {
  readonly #modelerName: string;
  readonly #baseUrl: string;
  readonly #baseParams: Record<string, string | number> | null;
  readonly #baseHeaders: Record<string, string> | null;
  readonly #baseRequestType: NeyslaRequestType | null;
  readonly #baseResponseType: NeyslaResponseType | null;
  readonly #baseBody: Record<string, unknown> | null;
  readonly #name: string[];

  constructor(config: NeyslaConfig, name: string | string[]) {
    this.#modelerName = config.name;
    this.#baseUrl = config.url;
    this.#baseParams =
      config.params && Object.keys(config.params).length ? config.params : null;
    this.#baseHeaders =
      config.headers && Object.keys(config.headers).length ? config.headers : null;
    this.#baseRequestType = config.requestType ?? null;
    this.#baseResponseType = config.responseType ?? null;
    this.#baseBody =
      config.body && Object.keys(config.body).length ? config.body : null;
    this.#name = Array.isArray(name) ? name : [name];
  }

  get<T = unknown>(data: NeyslaModelRequestOptions = {}): Promise<NeyslaResponse<T>> {
    return this.#setRequest<T>(data, "GET", false);
  }
  head<T = unknown>(data: NeyslaModelRequestOptions = {}): Promise<NeyslaResponse<T>> {
    return this.#setRequest<T>(data, "HEAD", false);
  }
  post<T = unknown>(data: NeyslaModelRequestOptions = {}): Promise<NeyslaResponse<T>> {
    return this.#setRequest<T>(data, "POST", true);
  }
  patch<T = unknown>(data: NeyslaModelRequestOptions = {}): Promise<NeyslaResponse<T>> {
    return this.#setRequest<T>(data, "PATCH", true);
  }
  put<T = unknown>(data: NeyslaModelRequestOptions = {}): Promise<NeyslaResponse<T>> {
    return this.#setRequest<T>(data, "PUT", true);
  }
  remove<T = unknown>(data: NeyslaModelRequestOptions = {}): Promise<NeyslaResponse<T>> {
    return this.#setRequest<T>(data, "DELETE", true);
  }

  #setRequest<T>(
    data: unknown,
    method: string,
    setBody: boolean
  ): Promise<NeyslaResponse<T>> {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return Promise.reject(
        new TypeError("Neysla: The model's configuration must be an object.")
      );
    }

    const options = data as NeyslaModelRequestOptions;

    if (
      options.delimiters !== undefined &&
      !(
        Array.isArray(options.delimiters) ||
        typeof options.delimiters === "string" ||
        typeof options.delimiters === "number"
      )
    ) {
      return Promise.reject(
        new TypeError("Neysla: The model's delimiters are not properly defined.")
      );
    }

    const urlResult = this.#buildUrl(options.delimiters);
    if (urlResult instanceof Error) {
      return Promise.reject(urlResult);
    }

    const params = this.#buildParams(options.params);
    const url = urlResult + params;
    const headers = this.#buildHeaders(options.headers);
    const effectiveRequestType = (options.requestType ??
      this.#baseRequestType) as NeyslaRequestType | null;
    const body = setBody
      ? mergeBody(this.#baseBody, options.body, effectiveRequestType)
      : null;
    const requestType = resolveContentType(effectiveRequestType);
    const responseType: NeyslaResponseType =
      options.responseType ?? this.#baseResponseType ?? "json";

    return executeRequest<T>({
      method,
      url,
      headers,
      body,
      requestType,
      responseType,
      progress: options.progress,
    });
  }

  #buildUrl(
    delimiters?: string | number | Array<string | number>
  ): string | Error {
    let delims: Array<string | number>;
    if (delimiters === undefined || delimiters === null) {
      delims = [];
    } else if (!Array.isArray(delimiters)) {
      delims = [delimiters];
    } else {
      delims = delimiters;
    }

    const names = this.#name;

    if (names.length !== delims.length && names.length - 1 !== delims.length) {
      return new Error(
        `Neysla: Incorrect relation between name and delimiters.`
      );
    }

    let relative = "";
    for (let i = 0; i < names.length; i++) {
      relative += names[i];
      if (delims[i] !== undefined) {
        relative += `/${delims[i]}`;
      }
      if (i < names.length - 1) {
        relative += "/";
      }
    }

    const base = this.#baseUrl.endsWith("/") ? this.#baseUrl : this.#baseUrl + "/";
    return base + relative;
  }

  #buildParams(requestParams?: Record<string, string | number>): string {
    const merged: Record<string, string | number> = {
      ...(this.#baseParams ?? {}),
      ...(requestParams ?? {}),
    };

    if (Object.keys(merged).length === 0) return "";

    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      search.append(key, String(value));
    }
    return "?" + search.toString();
  }

  #buildHeaders(requestHeaders?: Record<string, string>): Record<string, string> {
    return {
      ...(this.#baseHeaders ?? {}),
      ...(requestHeaders ?? {}),
    };
  }

  // Expuesto solo para facilitar mensajes de error en NeyslaModeler
  get modelerName(): string {
    return this.#modelerName;
  }
}
