import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const markdownFiles = [
  "README.md",
  "TODO.md",
  "skills/miku-readfile/SKILL.md",
  "skills/miku-readfile/references/INDEX.md",
  "skills/miku-readfile/references/runtime/operations-map.md",
  "skills/miku-readfile/references/workflow/readfile-workflow.md",
  "skills/miku-readfile/references/examples/readfile-examples.md"
];

test("relative markdown links resolve", () => {
  for (const file of markdownFiles) {
    const text = fs.readFileSync(file, "utf8");
    const links = [...text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
    for (const link of links) {
      if (/^[a-z]+:\/\//.test(link) || link.startsWith("#")) {
        continue;
      }
      const cleanLink = link.split("#")[0];
      if (!cleanLink) {
        continue;
      }
      const target = path.resolve(path.dirname(file), cleanLink);
      assert.equal(fs.existsSync(target), true, `${file} links to missing ${link}`);
    }
  }
});
