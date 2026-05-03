# miku-readfile-skills Config Specification

This document defines the repo-local configuration policy for
`miku-readfile-skills`.

## Purpose

`miku-readfile` reads explicitly selected files through request JSON. In many
repositories, encoding rules are stable repository properties. For example, a
repository may use UTF-8 by default while keeping `.java` files in Shift_JIS.

`miku-readfile-skills` may use a repo-local config file to help agents build
request JSON consistently without repeating the same encoding rules in every
conversation.

## Config Directory

Use `.mikusoft/` at the repository root as the shared miku-series configuration
directory.

Recommended shape:

```text
<repo root>/
  .mikusoft/
    miku-readfile.json
    miku-grep.json
    mikuproject.json
```

Each miku-series tool should use its own file under `.mikusoft/`.

For `miku-readfile-skills`, the config file is:

```text
.mikusoft/miku-readfile.json
```

## miku-readfile Config Shape

Example:

```json
{
  "version": 1,
  "encoding": {
    "default": "utf-8",
    "extensions": {
      ".java": "shift_jis"
    }
  }
}
```

Fields:

- `version`: config schema version. The current version is `1`.
- `encoding`: optional default encoding policy to apply when building
  `miku-readfile` request JSON.
- `encoding.default`: default file encoding.
- `encoding.extensions`: extension-specific encoding map.

The config is not a replacement for request JSON. It is a repo-local default
used when preparing request JSON.

## Precedence

Encoding policy precedence is:

1. `encoding` explicitly written in request JSON
2. repo-local `.mikusoft/miku-readfile.json`
3. runtime default

Request JSON is always the strongest source. A user or agent can override the
repo-local config by writing `encoding` directly in the request.

## Node.js Helper Behavior

When Node.js helpers are available, `miku-readfile-skills` may read
`.mikusoft/miku-readfile.json` from the selected repository root and merge the
config into request JSON before invoking the runtime.

The helper must not change the runtime semantics. It should only make the
effective request explicit before calling the bundled Java or Node.js runtime.

## Java-Only Behavior

The bundled Java runtime does not automatically load
`.mikusoft/miku-readfile.json` unless the upstream `miku-readfile` CLI later adds
that feature.

In Java-only direct execution, use this document and the workflow references to
copy the needed config values into `request.json` manually.

Agent behavior in Java-only mode:

1. Check whether `.mikusoft/miku-readfile.json` exists under the selected
   request root.
2. If request JSON already has `encoding`, keep the request value.
3. If request JSON does not have `encoding` and the config has `encoding`, copy
   the config `encoding` object into request JSON.
4. If neither request nor config has `encoding`, use no explicit encoding and let
   the runtime default apply.
5. Run the Java jar with the prepared request JSON.

Example Java-only request derived from `.mikusoft/miku-readfile.json`:

```json
{
  "version": 1,
  "root": ".",
  "files": ["src/Example.java"],
  "encoding": {
    "default": "utf-8",
    "extensions": {
      ".java": "shift_jis"
    }
  }
}
```

Then run:

```bash
java -jar skills/miku-readfile/runtime/miku-readfile-<version>.jar < request.json > result.json
```

## Git Tracking Policy

Whether `.mikusoft/miku-readfile.json` should be tracked by Git depends on the
repository.

Track it when the encoding policy is a repository-level fact shared by the team.
Do not track it when the setting is a local, personal, or temporary workflow
preference.

## Current Scope

This specification only defines the config location, shape, and precedence.

Implementation status:

- Documented config policy: yes
- Node.js helper auto-merge: not yet implemented
- Java runtime auto-load: not yet implemented
