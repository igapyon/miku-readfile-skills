# miku-readfile-skills

`miku-readfile-skills` is an Agent Skills package for using `miku-readfile`
from agent workflows.

`miku-readfile` is a local-first structured file reader CLI for AI agents and
automation. It accepts JSON requests through stdin and returns structured JSON
results through stdout. It reads explicitly selected text files as UTF-8 or
Shift_JIS and reports diagnostics instead of silently returning mojibake.

This skill does not search for files. Use `miku-grep` to find candidate files,
then use `miku-readfile` to read the selected files.

## Access Scope

`miku-readfile` reads only files explicitly listed in request JSON. The runtime
requires a `root` directory and root-relative file paths.

The skill workflow asks for user confirmation before reading outside the current
repository or declared workspace. This is a consent gate for normal agent use,
not an OS-level access restriction. The runtime still enforces its own
root-boundary and path validation rules.

## Quick Start

1. Put runtime artifacts under `skills/miku-readfile/runtime/`.
2. Run `npm test`.
3. Run `npm run build:bundle`.
4. Install the generated `bundle/miku-readfile-skills/skills/miku-readfile`
   directory into your skill home.
5. In conversation, explicitly start with `miku-readfile`.

Typical requests:

- read one or more explicitly selected files
- read a line range from an explicitly selected file
- read Shift_JIS files through extension rules or per-file encoding overrides
- return structured diagnostics for read, decode, or validation failures

## Notes

- This repository does not provide MCP server integration.
- The skill is opt-in and should not activate for generic file-reading, search,
  grep, code investigation, or code review requests.
- The skill uses bundled CLI runtime artifacts before broad workspace
  exploration.
- Java and Node.js runtime artifact file versions may differ from the
  `--version` output.
- Decoded file text belongs in the result JSON artifact. Default summaries
  should report counts, paths, encodings, ranges, and diagnostics rather than
  printing full file contents.

## Java-Only Environments

The files under `skills/miku-readfile/lib/*.mjs` are Node.js helper scripts for
agent environments that can run Node.js. They are not required to use the Java
runtime directly.

When only Java is available, call the bundled jar with request JSON on stdin and
write result JSON from stdout:

```bash
java -jar skills/miku-readfile/runtime/miku-readfile-<version>.jar < request.json > result.json
```

In that mode, `SKILL.md` and `references/` provide the operating instructions,
and the Java jar performs request validation, file reading, decoding, range
handling, and diagnostics. Node.js-only conveniences such as helper-based runtime
selection, result formatting, and bundle tests are unavailable.

Expected runtime artifact names:

- `skills/miku-readfile/runtime/miku-readfile-<version>.jar`
- `skills/miku-readfile/runtime/miku-readfile-<version>.mjs`

Optional source artifact names:

- `skills/miku-readfile/runtime/miku-readfile-sources-<version>.jar`
- `skills/miku-readfile/runtime/miku-readfile-sources-<version>.tgz`

## Developer Documents

- [TODO.md](TODO.md)
- [skills/miku-readfile/references/INDEX.md](skills/miku-readfile/references/INDEX.md)
- [docs/miku-soft-40-agentskills-design-v20260501.md](docs/miku-soft-40-agentskills-design-v20260501.md)

## License

Apache License 2.0. See [LICENSE](LICENSE).
