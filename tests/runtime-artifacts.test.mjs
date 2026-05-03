import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  resolveRuntimeArtifact,
  resolveRuntimeArtifactPath
} from "../skills/miku-readfile/lib/runtime-artifacts.mjs";

test("resolves newest runtime artifacts by file-name version", () => {
  const java = resolveRuntimeArtifact({ kind: "java" });
  const node = resolveRuntimeArtifact({ kind: "node" });
  const javaSources = resolveRuntimeArtifact({ kind: "java-sources" });
  const nodeSources = resolveRuntimeArtifact({ kind: "node-sources" });

  assert.equal(java.name, "miku-readfile-0.5.0.1.jar");
  assert.equal(node.name, "miku-readfile-0.5.0.1.mjs");
  assert.equal(javaSources.name, "miku-readfile-sources-0.5.0.1.jar");
  assert.equal(nodeSources.name, "miku-readfile-sources-0.5.0.1.tgz");
  assert.equal(resolveRuntimeArtifactPath({ kind: "java" }), java.path);
});

test("throws when an artifact kind is missing", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "miku-readfile-runtime-test-"));
  try {
    assert.throws(
      () => resolveRuntimeArtifact({ kind: "java", runtimeRoot: tempRoot }),
      /missing Java runtime artifact/
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
