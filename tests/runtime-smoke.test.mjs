import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { runReadJson } from "../skills/miku-readfile/lib/cli-runner.mjs";
import { resolveRuntimeArtifactPath } from "../skills/miku-readfile/lib/runtime-artifacts.mjs";

test("Java and Node.js runtimes report version", () => {
  const javaVersion = execFileSync("java", [
    "-jar",
    resolveRuntimeArtifactPath({ kind: "java" }),
    "--version"
  ], { encoding: "utf8" });
  const nodeVersion = execFileSync("node", [
    resolveRuntimeArtifactPath({ kind: "node" }),
    "--version"
  ], { encoding: "utf8" });

  assert.match(javaVersion, /^miku-readfile\s+\d+\.\d+\.\d+/);
  assert.match(nodeVersion, /^miku-readfile\s+\d+\.\d+\.\d+/);
});

test("Java runtime reads a UTF-8 file", () => {
  const result = runReadJson({
    request: {
      version: 1,
      root: ".",
      files: ["README.md"]
    },
    runtime: "java"
  });

  assert.equal(result.status, 0);
  assert.equal(result.json.ok, true);
  assert.equal(result.json.files[0].file, "README.md");
});

test("Java and Node.js runtimes read a Shift_JIS fixture", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "miku-readfile-sjis-test-"));
  try {
    const hex = fs.readFileSync("tests/fixtures/shift-jis-sample.hex", "utf8").trim();
    fs.writeFileSync(path.join(tempRoot, "sample-sjis.txt"), Buffer.from(hex, "hex"));

    for (const runtime of ["java", "node"]) {
      const result = runReadJson({
        request: {
          version: 1,
          root: tempRoot,
          files: [
            {
              path: "sample-sjis.txt",
              encoding: "shift_jis"
            }
          ]
        },
        runtime
      });

      assert.equal(result.status, 0);
      assert.equal(result.json.ok, true);
      assert.equal(result.json.files[0].encoding, "shift_jis");
      assert.equal(result.json.files[0].text, "こんにちは\n日本語\n");
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
