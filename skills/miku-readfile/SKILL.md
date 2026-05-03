---
name: miku-readfile
description: Use only when the user explicitly says `miku-readfile` for miku-readfile-specific structured local file read workflows. This skill runs the bundled miku-readfile CLI runtime and returns concise structured read summaries; do not auto-activate it for generic file reading, search, code investigation, or code review requests.
---

# Miku Readfile

Use this skill for `miku-readfile`-specific structured local file read workflows.
Keep the focus on local JSON-in / JSON-out reading of explicitly selected text
files for agents and automation.

For this skill, `miku-readfile` is opt-in by default.
Do not trigger it from generic words such as read, open, file, search, grep,
find, scan, code reading, file investigation, or review.

Start `miku-readfile` mode when at least one of these explicit triggers is
present:

- the user names `miku-readfile`
- the recent conversation is already in an active `miku-readfile` workflow from
  an earlier explicit trigger

Without one of these triggers, answer normally or ask a brief clarifying question
if using `miku-readfile` would materially change the result.

## Access Scope

`miku-readfile` reads only explicitly listed regular files under the request
`root`. It is comparable in access scope to running a local file-reading command
from the same agent process. It does not create an additional sandbox boundary.

The workflow confirmation before reading outside the current repository or
declared workspace is a consent gate for normal agent use, not an OS-level access
restriction.

Absolute file paths and file paths containing `..` are invalid request paths.
The runtime validates those paths and keeps reads inside the declared `root`.

## Core Rules

- prefer the bundled runtime artifacts in `runtime/`
- keep request and result data as structured JSON files or internal JSON objects
- read only files explicitly selected by the user or by a prior explicit tool
  result
- use `miku-grep` when candidate files must be searched first
- keep `root`, `files`, ranges, encodings, and limits narrow enough for the
  user's actual question
- before reading outside the current repository or declared workspace, ask for
  explicit user confirmation and include the requested `root`, file paths,
  ranges, encodings, and practical limits
- inspect `ok`, `summary`, and `diagnostics` before reporting the result
- keep diagnostics visible when the runtime reports warnings or expected
  failures
- do not reimplement file reading, range extraction, or encoding logic in the
  skill layer
- do not print full decoded file text in the default summary

## Operations

Primary operation:

- `read`: run a `miku-readfile` JSON request and return structured result JSON

Meta operations:

- `version`: check that a runtime artifact starts and identifies itself
- `help`: read the runtime CLI contract

Common request shapes:

- whole-file read
- line-range read
- UTF-8 default encoding
- Shift_JIS extension rule
- per-file encoding override

## Runtime Discipline

For explicit `miku-readfile` requests, first check the bundled runtime artifacts
before broad workspace exploration or generic tool discovery.

Unless the user or environment states another execution policy, use
`cli-preferred`.

Policy values:

- `cli-only`: use only the bundled CLI backend; do not fall back to visible
  handoff
- `cli-preferred`: use the bundled CLI backend first; if CLI is unavailable,
  return visible handoff material
- `handoff-only`: do not execute backend operations; return visible JSON request
  guidance or handoff steps

For `cli-only` and `cli-preferred`, use this runtime order:

1. read this `SKILL.md`
2. check versioned runtime artifacts matching
   `skills/miku-readfile/runtime/miku-readfile-*.jar` and
   `skills/miku-readfile/runtime/miku-readfile-*.mjs`
3. prefer the newest Java jar for operations it supports
4. use the newest Node.js `.mjs` when the Java runtime is missing or unsuitable
5. only if the declared path is missing or unusable, report the runtime-path
   problem

Runtime artifact file versions may differ from the text returned by
`--version`. Use file-name versions for artifact selection, and use `--version`
only as a smoke check that the runtime starts.

## Java-Only Operation

The helper files under `lib/*.mjs` require Node.js. They are convenience helpers
for runtime lookup, CLI invocation, result formatting, and tests. They are not
part of the Java runtime.

If the active environment has Java but does not have Node.js, use the Java jar
directly:

```bash
java -jar skills/miku-readfile/runtime/miku-readfile-<version>.jar < request.json > result.json
```

In Java-only mode, follow this `SKILL.md` and the references manually. The Java
runtime remains responsible for request validation, root-boundary checks, file
reading, UTF-8 / Shift_JIS decoding, range extraction, and diagnostics.

When Node.js helpers are unavailable, the agent must do the helper work
explicitly:

1. read [references/workflow/readfile-workflow.md](references/workflow/readfile-workflow.md)
2. check whether the target repository has `.mikusoft/miku-readfile.json`
3. prepare `request.json` with explicit `version`, `root`, `files`, and any
   required `encoding`
4. copy repo-local config values into `request.json` when needed
5. run the Java jar directly
6. inspect `result.json` and report diagnostics without hiding runtime messages

## Error Handling

Treat missing runtime artifacts, invalid JSON request shape, inaccessible root
paths, invalid file paths, unsupported encodings, decode failures, and
unsupported policy values as hard errors.

Treat runtime diagnostics such as partial file failures, skipped binary files,
range truncation at EOF, and other warnings as visible diagnostics. If the
runtime returns `ok: false`, report the failure and preserve the diagnostics.

## Boundaries

- Do not add MCP server behavior in this repository.
- Do not call MCP tools as fallback.
- Do not present this as a generic file-reading skill that captures ordinary
  read requests.
- Do not search for files in this skill.
- Do not expand globs or traverse directories in this skill.
- Do not replace the upstream `miku-readfile` runtime implementation with
  skill-local reading or decoding logic.
- Do not hide diagnostics from the runtime result.

## References

Read these only when needed:

- [references/INDEX.md](references/INDEX.md) for detailed workflow, runtime, and examples
