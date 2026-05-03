import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCliInvocation,
  operationCapabilities,
  operationRegistry
} from "../skills/miku-readfile/lib/backend-operations.mjs";

test("defines read, version, and help operations", () => {
  assert.deepEqual(Object.keys(operationRegistry), ["read", "version", "help"]);
  assert.equal(operationCapabilities.read.cli, true);
  assert.equal(operationCapabilities.read.handoff, true);
});

test("builds Java read invocation", () => {
  const invocation = buildCliInvocation({
    operation: "read",
    runtime: "java",
    inputPath: "request.json",
    outputPath: "result.json",
    javaRuntimePath: "runtime.jar"
  });

  assert.equal(invocation.command, "java");
  assert.deepEqual(invocation.args, ["-jar", "runtime.jar"]);
  assert.equal(invocation.stdinPath, "request.json");
  assert.equal(invocation.stdoutPath, "result.json");
});

test("builds Node.js read invocation", () => {
  const invocation = buildCliInvocation({
    operation: "read",
    runtime: "node",
    inputPath: "request.json",
    outputPath: "result.json",
    nodeRuntimePath: "runtime.mjs"
  });

  assert.equal(invocation.command, "node");
  assert.deepEqual(invocation.args, ["runtime.mjs"]);
});

test("builds meta invocations", () => {
  assert.deepEqual(
    buildCliInvocation({
      operation: "version",
      runtime: "java",
      javaRuntimePath: "runtime.jar"
    }).args,
    ["-jar", "runtime.jar", "--version"]
  );
  assert.deepEqual(
    buildCliInvocation({
      operation: "help",
      runtime: "node",
      nodeRuntimePath: "runtime.mjs"
    }).args,
    ["runtime.mjs", "--help"]
  );
});

test("requires input and output paths for read", () => {
  assert.throws(
    () => buildCliInvocation({ operation: "read", runtime: "java" }),
    /missing inputPath/
  );
});
