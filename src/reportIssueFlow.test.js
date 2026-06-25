import test from "node:test";
import assert from "node:assert/strict";
import { createIssueReport, validateIssueReport } from "./reportIssueFlow.js";

const VALID_REPORTER = {
  fullName: "Taylor Nguyen",
  email: "taylor@example.com",
};

test("requires a selected project", () => {
  assert.deepEqual(
    validateIssueReport({
      projectId: "",
      description: "Cannot sign in",
      ...VALID_REPORTER,
    }),
    { projectId: "Select a project to report." },
  );
});

test("requires reporter name and email", () => {
  assert.deepEqual(
    validateIssueReport({
      projectId: "incident-report",
      description: "Cannot sign in",
      fullName: "",
      email: "",
    }),
    {
      fullName: "Enter your full name.",
      email: "Enter your email address.",
    },
  );
});

test("requires a valid reporter email", () => {
  assert.deepEqual(
    validateIssueReport({
      projectId: "incident-report",
      description: "Cannot sign in",
      ...VALID_REPORTER,
      email: "not-an-email",
    }),
    { email: "Enter a valid email address." },
  );
});

test("requires a meaningful issue description", () => {
  assert.deepEqual(
    validateIssueReport({
      projectId: "incident-report",
      description: "   ",
      ...VALID_REPORTER,
    }),
    { description: "Describe the issue before confirming." },
  );
});

test("creates a normalized frontend-only report", () => {
  assert.deepEqual(
    createIssueReport({
      projectId: "incident-report",
      description: "  Dashboard does not load.  ",
      fullName: "  Taylor Nguyen  ",
      email: "  taylor@example.com  ",
    }),
    {
      projectId: "incident-report",
      description: "Dashboard does not load.",
      reporter: {
        fullName: "Taylor Nguyen",
        email: "taylor@example.com",
      },
      delivery: "preview",
    },
  );
});
