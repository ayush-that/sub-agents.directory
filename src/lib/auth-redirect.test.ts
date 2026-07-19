import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createAuthCallbackUrl, getSafeRedirectPath } from "./auth-redirect";

describe("getSafeRedirectPath", () => {
  test("preserves a local path with query and fragment", () => {
    assert.equal(
      getSafeRedirectPath("/g/example?tab=one&view=full#result"),
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
      assert.equal(getSafeRedirectPath(value), "/");
    });
  }

  test("rejects a backslash authority redirect", () => {
    assert.equal(getSafeRedirectPath("/\\attacker.example"), "/");
  });
});

describe("createAuthCallbackUrl", () => {
  test("encodes the full local destination in one query parameter", () => {
    const callbackUrl = new URL(
      createAuthCallbackUrl("https://sub-agents.directory", "/g/example?tab=one&view=full#result"),
    );

    assert.equal(callbackUrl.origin, "https://sub-agents.directory");
    assert.equal(callbackUrl.pathname, "/auth/callback");
    assert.equal(callbackUrl.searchParams.get("next"), "/g/example?tab=one&view=full#result");
  });
});
