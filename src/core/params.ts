import type { NeyslaParams } from "../types";

/**
 * Serializes a params record into a "?"-prefixed query string, or "" when
 * empty. Array values append the same key once per element (search.append),
 * matching the shape most backends (Express/NestJS qs, etc.) expect for
 * repeated-key multi-value params — not a single comma-joined string.
 */
export function buildQueryString(params?: NeyslaParams): string {
  if (!params || Object.keys(params).length === 0) return "";

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        search.append(key, String(item));
      }
    } else {
      search.append(key, String(value));
    }
  }

  const query = search.toString();
  return query ? "?" + query : "";
}
