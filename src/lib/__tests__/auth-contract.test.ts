import test from "node:test";
import assert from "node:assert/strict";
import { toSignInErrorMessage } from "@/lib/auth-client";
import { roleToAppRole, roleToRedirect } from "@/lib/auth";

test("role redirects are deterministic", () => {
  assert.equal(roleToRedirect("ADMIN"), "/admin/dashboard");
  assert.equal(roleToRedirect("CUSTOMER"), "/listings");
  assert.equal(roleToAppRole("ADMIN"), "admin");
  assert.equal(roleToAppRole("CUSTOMER"), "customer");
});

test("signin error mapping is specific", () => {
  assert.equal(
    toSignInErrorMessage({ success: false, code: "INVALID_CREDENTIALS", message: "x" }),
    "Invalid email or password"
  );
  assert.equal(
    toSignInErrorMessage({ success: false, code: "AUTH_UNAVAILABLE", message: "x" }),
    "Authentication service is temporarily unavailable. Please try again."
  );
  assert.equal(
    toSignInErrorMessage({ success: false, code: "ACCOUNT_DISABLED", message: "Disabled" }),
    "Disabled"
  );
});
