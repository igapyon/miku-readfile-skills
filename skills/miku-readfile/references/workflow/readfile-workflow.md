# Readfile Workflow

Use this workflow only after `miku-readfile` has been explicitly activated.

## Normal Flow

1. Confirm the user has selected files or has asked for a `miku-readfile`
   operation.
2. If candidate files must be discovered first, use `miku-grep` or another
   ordinary search workflow before calling `miku-readfile`.
3. Build a request JSON with explicit `version`, `root`, and `files`.
4. Keep paths root-relative and use `/` separators.
5. Add `encoding` rules only when needed.
6. Add `range` only when a focused line range is needed.
7. Run the bundled CLI runtime according to backend policy.
8. Inspect `ok`, `summary`, `files`, and `diagnostics`.
9. Report a concise summary and keep decoded text in the result JSON artifact.

## Java-Only Flow

If Node.js is unavailable, do not use the `lib/*.mjs` helpers. Prepare
`request.json` and invoke the Java runtime directly:

```bash
java -jar skills/miku-readfile/runtime/miku-readfile-<version>.jar < request.json > result.json
```

Then inspect `result.json`. The runtime result is the authoritative artifact.
The helper-generated summary is a convenience, not a required product artifact.

## Repository-External Roots

Before reading outside the current repository or declared workspace, ask for
explicit confirmation. Include:

- requested root
- file paths
- ranges when used
- encoding rules when used
- practical limits

This confirmation is a workflow consent gate. It is not an OS-level sandbox.

## Encoding

Use UTF-8 by default. Use Shift_JIS through an extension rule or per-file
override when the user, file type, or upstream context indicates that Shift_JIS
is expected.

Do not guess encodings in the skill layer. Let the runtime validate and report
diagnostics.

## Summary Discipline

The runtime result may contain decoded file text. Default agent-facing summaries
should not print full text. Summaries should focus on:

- success or failure
- file path
- effective encoding
- line count
- byte count
- range metadata
- diagnostics
