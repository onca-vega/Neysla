import type { NeyslaResponse, NeyslaResponseType } from "../types";

function parseHeaders(rawHeaders: string): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const line of rawHeaders.split("\r\n")) {
    if (!line) continue;
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    headers[key] = value;
  }
  return headers;
}

export async function normalizeFetchResponse<T = unknown>(
  fetchResponse: Response,
  url: string,
  responseType: NeyslaResponseType
): Promise<NeyslaResponse<T>> {
  const headers: Record<string, string> = {};
  fetchResponse.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let data: T;
  switch (responseType) {
    case "json": {
      const text = await fetchResponse.text();
      data = (text ? JSON.parse(text) : null) as T;
      break;
    }
    case "text":
      data = (await fetchResponse.text()) as unknown as T;
      break;
    case "arraybuffer":
      data = (await fetchResponse.arrayBuffer()) as unknown as T;
      break;
    case "blob":
      data = (await fetchResponse.blob()) as unknown as T;
      break;
    default:
      data = (await fetchResponse.text()) as unknown as T;
  }

  return {
    headers,
    status: fetchResponse.status,
    statusText: fetchResponse.statusText,
    data,
    dataType: responseType,
    url,
    getHeader: (name) => fetchResponse.headers.get(name),
  };
}

export function normalizeXHRResponse<T = unknown>(
  request: XMLHttpRequest,
  url: string,
  responseType: NeyslaResponseType,
  requestError = false
): NeyslaResponse<T> {
  const headers = parseHeaders(request.getAllResponseHeaders());

  const data: T =
    !requestError &&
    responseType === "json" &&
    typeof request.response === "string"
      ? (JSON.parse(request.response) as T)
      : (request.response as T);

  return {
    headers,
    status: request.status,
    statusText: request.statusText,
    data,
    dataType: responseType,
    url,
    getHeader: (name) => request.getResponseHeader(name),
  };
}
