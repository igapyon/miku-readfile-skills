# Readfile Examples

## Minimal UTF-8 Read

```json
{
  "version": 1,
  "root": ".",
  "files": ["README.md"]
}
```

## Shift_JIS Extension Rule

```json
{
  "version": 1,
  "root": ".",
  "files": ["README.md", "src/Legacy.java"],
  "encoding": {
    "default": "utf-8",
    "extensions": {
      ".java": "shift_jis"
    }
  }
}
```

## Per-File Encoding Override

```json
{
  "version": 1,
  "root": ".",
  "files": [
    {
      "path": "notes/old-memo.md",
      "encoding": "shift_jis"
    }
  ]
}
```

## Line Range Read

```json
{
  "version": 1,
  "root": ".",
  "files": [
    {
      "path": "src/Legacy.java",
      "range": {
        "startLine": 120,
        "lineCount": 40
      }
    }
  ],
  "encoding": {
    "default": "utf-8",
    "extensions": {
      ".java": "shift_jis"
    }
  }
}
```

## miku-grep Then miku-readfile

1. Use `miku-grep` to find candidate file paths.
2. Select root-relative paths from the grep result.
3. Pass those paths to `miku-readfile`.

```json
{
  "version": 1,
  "root": ".",
  "files": [
    "README.md",
    {
      "path": "docs/miku-readfile-cli-spec.md",
      "range": {
        "startLine": 1,
        "lineCount": 80
      }
    }
  ]
}
```

## Handoff-Only Shape

When execution is not allowed, provide visible request JSON and explain the
runtime command shape:

```bash
java -jar skills/miku-readfile/runtime/miku-readfile-<version>.jar < request.json > result.json
```
