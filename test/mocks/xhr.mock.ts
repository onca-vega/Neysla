import { vi } from "vitest";

export interface XHRMockResponse {
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
  body?: string;
}

// Crea un mock de XMLHttpRequest que simula respuestas para tests de progress
export function createXHRMock(response: XHRMockResponse) {
  const headersStr = Object.entries(response.headers ?? {})
    .map(([k, v]) => `${k}: ${v}`)
    .join("\r\n");

  const xhrInstance = {
    status: response.status,
    statusText: response.statusText ?? "",
    response: response.body ?? "",
    responseType: "" as XMLHttpRequestResponseType,
    open: vi.fn(),
    send: vi.fn(),
    setRequestHeader: vi.fn(),
    addEventListener: vi.fn(),
    getAllResponseHeaders: vi.fn().mockReturnValue(headersStr),
    getResponseHeader: vi.fn((name: string) => response.headers?.[name] ?? null),
  };

  // Simula que el evento 'load' se dispara sincrónicamente al llamar send()
  xhrInstance.send.mockImplementation(() => {
    const loadCb = (xhrInstance.addEventListener.mock.calls as Array<[string, () => void]>).find(
      ([event]) => event === "load"
    )?.[1];
    if (loadCb) loadCb();
  });

  function XHRConstructor() {
    return xhrInstance;
  }
  vi.stubGlobal("XMLHttpRequest", XHRConstructor);

  return xhrInstance;
}
