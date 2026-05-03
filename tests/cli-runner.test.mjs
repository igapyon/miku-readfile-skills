import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { runCliOperation, runReadJson } from "../skills/miku-readfile/lib/cli-runner.mjs";
import { resolveRuntimeArtifactPath } from "../skills/miku-readfile/lib/runtime-artifacts.mjs";

test("runs Java read operation with request and output paths", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "miku-readfile-cli-test-"));
  try {
    fs.writeFileSync(path.join(tempRoot, "sample.txt"), "hello\n", "utf8");
    const requestPath = path.join(tempRoot, "request.json");
    const resultPath = path.join(tempRoot, "result.json");
    fs.writeFileSync(requestPath, JSON.stringify({
      version: 1,
      root: tempRoot,
      files: ["sample.txt"]
    }), "utf8");

    const result = runCliOperation({
      operation: "read",
      runtime: "java",
      inputPath: requestPath,
      outputPath: resultPath,
      javaRuntimePath: path.resolve(resolveRuntimeArtifactPath({ kind: "java" }))
    });

    assert.equal(result.status, 0);
    const json = JSON.parse(fs.readFileSync(resultPath, "utf8"));
    assert.equal(json.ok, true);
    assert.equal(json.files[0].text, "hello\n");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("runs read JSON through Node.js runtime", () => {
  const result = runReadJson({
    request: {
      version: 1,
      root: ".",
      files: ["README.md"]
    },
    runtime: "node"
  });

  assert.equal(result.status, 0);
  assert.equal(result.json.ok, true);
  assert.equal(result.json.files[0].file, "README.md");
});
