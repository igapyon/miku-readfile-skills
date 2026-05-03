import assert from "node:assert/strict";
import test from "node:test";

import { formatReadResultSummary } from "../skills/miku-readfile/lib/result-formatter.mjs";

test("formats successful read result without decoded text", () => {
  const summary = formatReadResultSummary({
    ok: true,
    files: [
      {
        file: "README.md",
        encoding: "utf-8",
        bytes: 12,
        lines: 2,
        text: "secret full text"
      }
    ],
    summary: {
      requestedFiles: 1,
      filesRead: 1,
      filesSkipped: 0,
      diagnostics: 0
    },
    diagnostics: []
  });

  assert.match(summary, /miku-readfile result:/);
  assert.match(summary, /README\.md/);
  assert.match(summary, /encoding utf-8/);
  assert.doesNotMatch(summary, /secret full text/);
});

test("formats diagnostics", () => {
  const summary = formatReadResultSummary({
    ok: false,
    files: [],
    summary: {
      requestedFiles: 1,
      filesRead: 0,
      filesSkipped: 1,
      diagnostics: 1
    },
    diagnostics: [
      {
        severity: "error",
        code: "file_not_found",
        file: "missing.txt",
        message: "File does not exist"
      }
    ]
  });

  assert.match(summary, /miku-readfile failed/);
  assert.match(summary, /Errors: 1/);
  assert.match(summary, /file_not_found missing\.txt/);
});
