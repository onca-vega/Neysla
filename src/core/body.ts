import type { NeyslaRequestType } from "../types";

export type SerializedBody = string | FormData | null;

export function serializeBody(
  body: Record<string, unknown> | FormData | undefined,
  requestType: NeyslaRequestType | null | undefined
): SerializedBody {
  if (!body) return null;

  if (body instanceof FormData) {
    return requestType === "multipart" ? body : null;
  }

  switch (requestType) {
    case "json":
      return JSON.stringify(body);
    case "multipart": {
      const form = new FormData();
      for (const [key, value] of Object.entries(body)) {
        form.append(key, String(value));
      }
      return form;
    }
    default: {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(body)) {
        params.append(key, String(value));
      }
      return params.toString();
    }
  }
}

export function mergeBody(
  baseBody: Record<string, unknown> | null,
  requestBody: Record<string, unknown> | FormData | undefined,
  requestType: NeyslaRequestType | null | undefined
): SerializedBody {
  if (requestBody instanceof FormData) {
    if (requestType === "multipart" && baseBody) {
      for (const [key, value] of Object.entries(baseBody)) {
        requestBody.append(key, String(value));
      }
    }
    return requestBody;
  }

  const merged: Record<string, unknown> = {
    ...(baseBody ?? {}),
    ...(requestBody ?? {}),
  };

  if (Object.keys(merged).length === 0) return null;
  return serializeBody(merged, requestType);
}
