import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const skillText = fs.readFileSync("skills/miku-readfile/SKILL.md", "utf8");

test("skill is explicit opt-in", () => {
  assert.match(skillText, /opt-in by default/);
  assert.match(skillText, /Do not trigger it from generic words/);
  assert.match(skillText, /the user names `miku-readfile`/);
});

test("skill states readfile boundaries", () => {
  assert.match(skillText, /Do not search for files/);
  assert.match(skillText, /Do not expand globs/);
  assert.match(skillText, /Do not call MCP tools as fallback/);
  assert.match(skillText, /do not reimplement file reading/);
});
