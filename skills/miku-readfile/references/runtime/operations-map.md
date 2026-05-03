# Operations Map

Use this reference when you need the supported operation list or the preferred
CLI runtime surface.

## Operations

- `read`: run a `miku-readfile` request JSON through stdin and receive result
  JSON through stdout
- `version`: check that a runtime artifact starts and identifies itself as
  `miku-readfile`
- `help`: read the runtime CLI contract

## Runtime Search Order

Prefer bundled runtime artifacts:

- `skills/miku-readfile/runtime/miku-readfile-<version>.jar`
- `skills/miku-readfile/runtime/miku-readfile-<version>.mjs`

Resolve the actual versioned artifact under `runtime/` before invoking the CLI.
Do not search broadly for alternate copies before checking these expected
locations.

## Preferred Runtime Surface

List Java examples before Node.js examples so agents see the Java runtime first.

```bash
java -jar skills/miku-readfile/runtime/miku-readfile-<version>.jar < request.json > result.json
node skills/miku-readfile/runtime/miku-readfile-<version>.mjs < request.json > result.json
```

Meta commands:

```bash
java -jar skills/miku-readfile/runtime/miku-readfile-<version>.jar --version
node skills/miku-readfile/runtime/miku-readfile-<version>.mjs --version
```

## CLI Operation Correspondence

| Agent Skill operation | CLI backend shape | Notes |
| --- | --- | --- |
| `read` | `< request.json > result.json` | Primary JSON-in / JSON-out operation. |
| `version` | `--version` | Smoke check only. Do not require exact file-name version match. |
| `help` | `--help` | Runtime contract reference. |

## Skill-Local Runner

The helper `skills/miku-readfile/lib/cli-runner.mjs` is a thin adapter over the
CLI runtime. It may execute the bundled Java or Node.js artifact, but it must
not implement file reading, decoding, range extraction, or root-boundary logic
itself.

The helper is optional. It requires Node.js. In a Java-only environment, skip the
helper and call the Java runtime directly:

```bash
java -jar skills/miku-readfile/runtime/miku-readfile-<version>.jar < request.json > result.json
```

Runner responsibilities:

- build the CLI invocation from the operation registry
- pass request JSON to stdin
- collect stdout / stderr / exit status
- optionally write stdout JSON to an output file

Runtime responsibilities:

- validate request JSON
- validate root-relative file paths
- read regular files
- decode UTF-8 or Shift_JIS
- apply line ranges
- emit result JSON and diagnostics

## Artifact Roles

- `read_request_json`
- `read_result_json`
- `read_result_summary`
- `operation_summary`
- `diagnostics_log`

Do not treat every JSON document as the same artifact role. A request JSON and
result JSON are different contracts. `read_result_summary` is display text
derived from the result JSON and must not replace the original result artifact.
