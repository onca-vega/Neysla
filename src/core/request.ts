import type { NeyslaResponse, NeyslaResponseType } from "../types";
import type { SerializedBody } from "./body";
import { normalizeFetchResponse, normalizeXHRResponse } from "./response";

export interface RequestNeeds {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: SerializedBody;
  requestType: string | null;
  responseType: NeyslaResponseType;
  progress?: (event: ProgressEvent) => void;
}

const isBrowser = typeof window !== "undefined";

export function executeRequest<T = unknown>(
  needs: RequestNeeds
): Promise<NeyslaResponse<T>> {
  if (isBrowser && typeof needs.progress === "function") {
    return executeXHR<T>(needs);
  }
  return executeFetch<T>(needs);
}

function executeFetch<T>(needs: RequestNeeds): Promise<NeyslaResponse<T>> {
  const headers = new Headers(needs.headers);
  if (needs.requestType) {
    headers.set("Content-Type", needs.requestType);
  }

  return fetch(needs.url, {
    method: needs.method,
    headers,
    body: needs.body ?? undefined,
  }).then(async (response) => {
    const normalized = await normalizeFetchResponse<T>(
      response,
      needs.url,
      needs.responseType
    );
    if (response.status >= 300 || response.status === 0) {
      return Promise.reject(normalized);
    }
    return normalized;
  });
}

function executeXHR<T>(needs: RequestNeeds): Promise<NeyslaResponse<T>> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    const handleLoad = () => {
      const response = normalizeXHRResponse<T>(
        request,
        needs.url,
        needs.responseType
      );
      if (request.status >= 300 || request.status === 0) {
        reject(response);
      } else {
        resolve(response);
      }
    };

    const handleError = () => {
      const response = normalizeXHRResponse<T>(
        request,
        needs.url,
        needs.responseType,
        true
      );
      reject(response);
    };

    if (needs.progress) {
      request.addEventListener("progress", needs.progress as EventListener);
    }
    request.addEventListener("load", handleLoad);
    request.addEventListener("error", handleError);
    request.addEventListener("abort", handleError);

    request.open(needs.method, needs.url, true);

    // XHR solo soporta estos responseTypes nativamente
    const xhrResponseType = needs.responseType === "stream" ? "" : needs.responseType;
    request.responseType = xhrResponseType as XMLHttpRequestResponseType;

    if (needs.requestType) {
      request.setRequestHeader("Content-Type", needs.requestType);
    }

    for (const [header, value] of Object.entries(needs.headers)) {
      request.setRequestHeader(header, value);
    }

    request.send(needs.body);
  });
}
