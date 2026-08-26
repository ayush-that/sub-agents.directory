import { describe, expect, test } from "bun:test";
import { createAuthCallbackUrl, getSafeRedirectPath } from "./auth-redirect";

describe("getSafeRedirectPath", () => {
  test("preserves a local path with query and fragment", () => {
    expect(getSafeRedirectPath("/g/example?tab=one&view=full#result")).toBe(
      "/g/example?tab=one&view=full#result",
    );
  });

  for (const value of [
    "https://attacker.example",
    "//attacker.example",
    "@attacker.example",
    ".attacker.example",
  ]) {
    test(`rejects external redirect value ${value}`, () => {
      expect(getSafeRedirectPath(value)).toBe("/");
    });
  }

  test("rejects a backslash authority redirect", () => {
    expect(getSafeRedirectPath("/\\attacker.example")).toBe("/");
  });
});

describe("createAuthCallbackUrl", () => {
  test("encodes the full local destination in one query parameter", () => {
    const callbackUrl = new URL(
      createAuthCallbackUrl("https://sub-agents.directory", "/g/example?tab=one&view=full#result"),
    );

    expect(callbackUrl.origin).toBe("https://sub-agents.directory");
    expect(callbackUrl.pathname).toBe("/auth/callback");
    expect(callbackUrl.searchParams.get("next")).toBe("/g/example?tab=one&view=full#result");
  });
});
