# TODO

This repository is the Agent Skills package for `miku-readfile`.

Design references:

- `docs/miku-soft-40-agentskills-design-v20260501.md`
- `workplace/miku-grep-skills-devel`
- `workplace/miku-readfile-devel`

## Goal

Create `miku-readfile-skills` as a thin Agent Skills adapter over the upstream
`miku-readfile` CLI runtime.

The skill should help AI agents read explicitly selected local text files through
structured JSON requests and results. It should not search for files, crawl
directories, reimplement decoding, or become a generic file-reading replacement.

## Product Boundary

- Keep upstream `miku-readfile` as the semantic center.
- Use bundled runtime artifacts before broad workspace exploration.
- Treat this repository as the agent-facing workflow, packaging, test, and
  documentation layer.
- Do not duplicate upstream CLI behavior such as UTF-8 / Shift_JIS decoding,
  range extraction, root-boundary validation, binary skipping, or diagnostics.
- Keep `miku-grep` and `miku-readfile` roles separate:
  - use `miku-grep` to find candidate files
  - use `miku-readfile` to read selected files

## Repository Skeleton

- [x] Add root `README.md`.
- [x] Add root `package.json`.
- [x] Add `scripts/build-skill-bundle.mjs`.
- [x] Add `scripts/build-skill-bundle-zip.mjs`.
- [x] Add `tests/`.
- [x] Keep `workplace/` as local scratch and upstream reference space.
- [x] Keep runtime artifacts under `skills/miku-readfile/runtime/`.
- [x] Keep detailed skill references under `skills/miku-readfile/references/`.

## Skill Contract

- [x] Add `skills/miku-readfile/SKILL.md`.
- [x] Define explicit opt-in activation for `miku-readfile`.
- [x] State that generic file-reading, search, grep, scan, or code-review
  requests should not automatically activate this skill.
- [x] Document that the skill reads only explicitly selected files.
- [x] Document that repository-external roots require explicit user confirmation.
- [x] Document that absolute file paths and `..` paths are rejected by the
  runtime request contract.
- [x] Document hard boundaries:
  - no search
  - no glob expansion
  - no directory traversal
  - no MCP fallback
  - no GUI
  - no server or daemon
  - no skill-local decoding implementation

## Runtime Artifacts

Current runtime artifact examples:

- `skills/miku-readfile/runtime/miku-readfile-0.5.0.1.jar`
- `skills/miku-readfile/runtime/miku-readfile-0.5.0.1.mjs`
- `skills/miku-readfile/runtime/miku-readfile-sources-0.5.0.1.jar`
- `skills/miku-readfile/runtime/miku-readfile-sources-0.5.0.1.tgz`

Tasks:

- [x] Add `skills/miku-readfile/lib/runtime-artifacts.mjs`.
- [x] Resolve newest runtime artifacts by file-name version.
- [x] Support artifact kinds:
  - `java`
  - `node`
  - `java-sources`
  - `node-sources`
- [x] Prefer Java jar first when available.
- [x] Fall back to Node.js `.mjs` only when Java runtime is missing or unsuitable.
- [x] Use `--version` as a smoke check, not as the source of artifact selection.

## Backend Operations

- [x] Add `skills/miku-readfile/lib/backend-operations.mjs`.
- [x] Define operations:
  - `read`
  - `version`
  - `help`
- [x] Map `read` to JSON stdin / JSON stdout.
- [x] Map `version` to `--version`.
- [x] Map `help` to `--help`.
- [x] Define artifact roles:
  - `read_request_json`
  - `read_result_json`
  - `read_result_summary`
  - `operation_summary`
  - `diagnostics_log`

## CLI Runner

- [x] Add `skills/miku-readfile/lib/cli-runner.mjs`.
- [x] Run Java runtime as:

  ```bash
  java -jar skills/miku-readfile/runtime/miku-readfile-<version>.jar < request.json > result.json
  ```

- [x] Run Node.js runtime as:

  ```bash
  node skills/miku-readfile/runtime/miku-readfile-<version>.mjs < request.json > result.json
  ```

- [x] Keep runner as a thin adapter:
  - build command invocation
  - pass request JSON to stdin
  - capture stdout / stderr / exit status
  - optionally write stdout JSON to a result file
  - parse result JSON when requested
- [x] Do not implement file reading or decoding in the runner.

## Backend Policy

- [x] Add `skills/miku-readfile/lib/backend-policy.mjs`.
- [x] Support policies:
  - `cli-only`
  - `cli-preferred`
  - `handoff-only`
- [x] Default to `cli-preferred`.
- [x] Under `cli-only`, missing CLI is a hard execution-path error.
- [x] Under `cli-preferred`, missing CLI may fall back to visible handoff.
- [x] Under `handoff-only`, do not execute runtime commands.
- [x] Do not call MCP tools as fallback in this repository.

## Result Formatting

- [x] Add `skills/miku-readfile/lib/result-formatter.mjs`.
- [x] Summarize:
  - operation success or failure
  - requested file count
  - successfully read file count
  - failed file count
  - effective encoding
  - range metadata
  - diagnostics count
- [x] Keep decoded file text in JSON result artifacts, not in the default summary.
- [x] Show short diagnostics with severity, code, file path, and message.
- [x] Preserve upstream runtime diagnostics instead of rewriting them into vague
  skill-side messages.

## References

- [x] Add `skills/miku-readfile/references/INDEX.md`.
- [x] Add `skills/miku-readfile/references/runtime/operations-map.md`.
- [x] Add `skills/miku-readfile/references/workflow/readfile-workflow.md`.
- [x] Add `skills/miku-readfile/references/examples/readfile-examples.md`.
- [x] Include examples for:
  - minimal UTF-8 read
  - Shift_JIS extension rule
  - per-file encoding override
  - line range read
  - using `miku-grep` first, then `miku-readfile`
  - handoff-only request JSON

## Tests

- [x] Add `tests/runtime-artifacts.test.mjs`.
- [x] Add `tests/backend-operations.test.mjs`.
- [x] Add `tests/backend-policy.test.mjs`.
- [x] Add `tests/cli-runner.test.mjs`.
- [x] Add `tests/result-formatter.test.mjs`.
- [x] Add `tests/runtime-smoke.test.mjs`.
- [x] Add `tests/skill-workflow.test.mjs`.
- [x] Add `tests/docs-contract.test.mjs`.
- [x] Add `tests/docs-links.test.mjs`.
- [x] Add `tests/bundle-smoke.test.mjs`.
- [x] Add `tests/release-bundle-contents.test.mjs`.

Test expectations:

- [x] Runtime artifact resolution finds the current bundled artifacts.
- [x] `read` operation builds the correct Java and Node.js invocations.
- [x] `--version` works for available runtimes.
- [x] `read` smoke test can read a UTF-8 fixture.
- [x] Shift_JIS fixture behavior is covered if a stable fixture is added.
- [x] Missing runtime produces a hard error under `cli-only`.
- [x] Missing runtime produces handoff material under `cli-preferred`.
- [x] `handoff-only` performs no command execution.
- [x] Bundle output includes only skill runtime, instructions, references, and
  required helper files.
- [x] Bundle output excludes `workplace/`, development scratch files, and
  unrelated upstream source trees.

## Bundle And Distribution

- [x] Build directory bundle under `bundle/miku-readfile-skills/`.
- [x] Build zip bundle for local skill installation.
- [x] Include:
  - `skills/miku-readfile/SKILL.md`
  - `skills/miku-readfile/references/`
  - `skills/miku-readfile/lib/`
  - `skills/miku-readfile/runtime/`
  - license and minimal package metadata as needed
- [x] Exclude:
  - `workplace/`
  - `.git/`
  - `.DS_Store`
  - temporary outputs
  - test-only files unless intentionally included

## Documentation

- [x] Root `README.md` should explain:
  - what `miku-readfile-skills` is
  - relationship to upstream `miku-readfile`
  - relationship to sister `miku-grep-skills`
  - runtime artifact placement
  - quick start
  - test and bundle commands
  - activation boundary
- [x] `SKILL.md` should remain concise and agent-facing.
- [x] Detailed examples should live under `references/`.
- [x] Do not put broad design explanation into `SKILL.md` if it belongs in
  `docs/` or `references/`.

## Java-Only Environment Notes

- [x] Clarify that `skills/miku-readfile/lib/*.mjs` are Node.js helper scripts,
  not Java runtime files.
- [x] Clarify that Java-only environments can skip `lib/*.mjs` and call the
  bundled jar directly.
- [x] Document the direct Java command shape in README, `SKILL.md`,
  `operations-map.md`, and `readfile-workflow.md`.
- [x] State that Java direct mode still uses the Java runtime for request
  validation, root-boundary checks, file reading, UTF-8 / Shift_JIS decoding,
  range extraction, and diagnostics.
- [x] Document the operating assumption that, when Node.js helpers are
  unavailable, the agent reads `SKILL.md` / references and manually prepares
  `request.json` for direct Java execution.
- [ ] Keep future documentation changes from implying that Node.js helpers are
  required for Java runtime use.

## Repo-Local Config

- [x] Document `.mikusoft/miku-readfile.json` as the repo-local config file in
  `docs/miku-readfile-skills-config.md`.
- [x] Define encoding precedence:
  - request `encoding`
  - repo root `.mikusoft/miku-readfile.json`
  - runtime default
- [x] Document Java-only behavior where config values are copied into
  `request.json` manually.
- [x] Document that, in Java-only mode, the agent must apply
  `.mikusoft/miku-readfile.json` guidance manually when preparing
  `request.json`.
- [ ] Implement Node.js helper support for reading `.mikusoft/miku-readfile.json`
  and merging it into request JSON.
- [ ] Consider upstream Java runtime support for loading
  `.mikusoft/miku-readfile.json` directly.

## Verification Commands

Target commands after implementation:

```bash
npm test
npm run build:bundle
npm run build:bundle:zip
```

Runtime smoke commands:

```bash
java -jar skills/miku-readfile/runtime/miku-readfile-<version>.jar --version
node skills/miku-readfile/runtime/miku-readfile-<version>.mjs --version
```

Read smoke shape:

```bash
java -jar skills/miku-readfile/runtime/miku-readfile-<version>.jar < request.json > result.json
node skills/miku-readfile/runtime/miku-readfile-<version>.mjs < request.json > result.json
```
