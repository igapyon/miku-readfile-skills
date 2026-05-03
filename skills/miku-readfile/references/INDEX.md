# miku-readfile References

Use these references only when the active workflow needs more detail than
`SKILL.md`.

- [runtime/operations-map.md](runtime/operations-map.md)
- [workflow/readfile-workflow.md](workflow/readfile-workflow.md)
- [examples/readfile-examples.md](examples/readfile-examples.md)

`miku-readfile` reads explicitly selected files. It does not search for files.
Use `miku-grep` first when candidate file paths are not known.

When Node.js helpers are unavailable, use the Java-only flow in
[workflow/readfile-workflow.md](workflow/readfile-workflow.md). In that mode,
the agent prepares `request.json` explicitly from these Markdown instructions
and then runs the Java jar directly.
