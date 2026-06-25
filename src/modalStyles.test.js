import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("step 2 keeps all report fields visible without its own scroll area", () => {
  const app = readFileSync(new URL("./App.jsx", import.meta.url), "utf8");

  assert.match(
    app,
    /confirmedReport[\s\S]*p-5 sm:p-6 lg:overflow-hidden lg:p-5 xl:p-6/,
  );
  assert.match(app, /id="issue-description"[\s\S]*resize-none[\s\S]*h-28/);
});
