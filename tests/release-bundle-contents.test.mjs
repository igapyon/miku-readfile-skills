import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const ROOT = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.resolve(ROOT, "package.json"), "utf8"));
const zipPath = path.resolve(ROOT, `bundle/igapyon-miku-readfile-skills-${packageJson.version}.zip`);

test("release zip contains skill files and excludes development-only files", () => {
  execFileSync("npm", ["run", "build:bundle:zip"], {
    cwd: ROOT,
    encoding: "utf8"
  });

  assert.equal(fs.existsSync(zipPath), true);

  const entries = execFileSync("unzip", ["-Z1", zipPath], {
    cwd: ROOT,
    encoding: "utf8"
  }).trim().split(/\n/).filter(Boolean);

  assertIncludes(entries, "skills/miku-readfile/SKILL.md");
  assertIncludes(entries, "skills/miku-readfile/references/INDEX.md");
  assertIncludes(entries, "skills/miku-readfile/references/runtime/operations-map.md");
  assertIncludes(entries, "skills/miku-readfile/lib/runtime-artifacts.mjs");
  assertIncludes(entries, "skills/miku-readfile/lib/backend-policy.mjs");
  assertIncludes(entries, "skills/miku-readfile/lib/backend-operations.mjs");
  assertIncludes(entries, "skills/miku-readfile/lib/cli-runner.mjs");
  assertIncludes(entries, "skills/miku-readfile/lib/result-formatter.mjs");
  assertIncludes(entries, "skills/miku-readfile/runtime/miku-readfile-0.5.0.1.jar");
  assertIncludes(entries, "skills/miku-readfile/runtime/miku-readfile-0.5.0.1.mjs");

  assert.equal(entries.some((entry) => entry.includes(".DS_Store")), false);
  assert.equal(entries.some((entry) => entry.startsWith("tests/")), false);
  assert.equal(entries.some((entry) => entry.startsWith("docs/")), false);
  assert.equal(entries.some((entry) => entry.startsWith("bundle/")), false);
  assert.equal(entries.some((entry) => entry.includes("node_modules/")), false);
});

function assertIncludes(entries, expected) {
  assert.ok(entries.includes(expected), `missing zip entry: ${expected}`);
}
