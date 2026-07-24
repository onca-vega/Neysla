import { describe, it, expect } from "vitest";
import { buildQueryString } from "../../src/core/params";

describe("core/params: buildQueryString", () => {
  it("returns empty string when params is undefined", () => {
    expect(buildQueryString(undefined)).toBe("");
  });

  it("returns empty string when params is an empty object", () => {
    expect(buildQueryString({})).toBe("");
  });

  it("serializes string, number and boolean values", () => {
    expect(
      buildQueryString({ name: "access", page: 2, active: false })
    ).toBe("?name=access&page=2&active=false");
  });

  it("serializes an array value as a repeated key", () => {
    expect(buildQueryString({ notIn: ["id1", "id2"] })).toBe(
      "?notIn=id1&notIn=id2"
    );
  });

  it("serializes an empty array as no entries for that key", () => {
    expect(buildQueryString({ notIn: [], page: 1 })).toBe("?page=1");
  });

  it("mixes scalar and array values preserving key order", () => {
    expect(buildQueryString({ a: 1, notIn: ["x", "y"], b: "z" })).toBe(
      "?a=1&notIn=x&notIn=y&b=z"
    );
  });
});
