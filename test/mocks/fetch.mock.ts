import { vi, beforeEach, afterEach } from "vitest";

export interface MockResponseOptions {
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export function createFetchMock() {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  return {
    respondWith(options: MockResponseOptions) {
      const { status, statusText = "", headers = {}, body } = options;
      const bodyStr =
        body !== undefined
          ? typeof body === "string"
            ? body
            : JSON.stringify(body)
          : "";

      fetchMock.mockResolvedValueOnce(
        new Response(bodyStr, { status, statusText, headers })
      );
    },
    respondWithNetworkError() {
      fetchMock.mockRejectedValueOnce(new TypeError("Network error"));
    },
  };
}
