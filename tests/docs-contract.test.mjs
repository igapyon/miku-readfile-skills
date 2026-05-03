import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("README documents runtime and activation boundaries", () => {
  const text = fs.readFileSync("README.md", "utf8");
  assert.match(text, /miku-readfile-skills/);
  assert.match(text, /does not search for files/);
  assert.match(text, /explicitly start with `miku-readfile`/);
  assert.match(text, /miku-readfile-<version>\.jar/);
  assert.match(text, /miku-readfile-<version>\.mjs/);
});

test("operations map documents read operation and artifact roles", () => {
  const text = fs.readFileSync(
    "skills/miku-readfile/references/runtime/operations-map.md",
    "utf8"
  );
  assert.match(text, /`read`/);
  assert.match(text, /read_request_json/);
  assert.match(text, /read_result_json/);
  assert.match(text, /not implement file reading/);
});
