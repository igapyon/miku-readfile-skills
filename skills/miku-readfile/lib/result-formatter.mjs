import fs from "node:fs";
import path from "node:path";

export function formatReadResultSummary(result, {
  cwd,
  includeRoot = true,
  maxFiles = 8
} = {}) {
  if (!result || typeof result !== "object") {
    throw new Error("result object is required");
  }

  const lines = [];
  const summary = result.summary ?? {};

  if (result.ok === false) {
    lines.push(`miku-readfile failed: ${summary.failedFiles ?? 0} file failures`);
    if (includeRoot) {
      appendRootResolution(lines, result, { cwd });
    }
    appendFileSummaries(lines, result.files, { maxFiles });
    appendDiagnostics(lines, result.diagnostics);
    return lines.join("\n");
  }

  lines.push(
    [
      "miku-readfile result:",
      `${summary.requestedFiles ?? countRequestedFiles(result)} files requested`,
      `${summary.filesRead ?? summary.readFiles ?? countReadFiles(result)} files read`,
      `${summary.filesSkipped ?? summary.failedFiles ?? 0} failures`
    ].join(" ")
  );

  if (includeRoot) {
    appendRootResolution(lines, result, { cwd });
  }

  appendFileSummaries(lines, result.files, { maxFiles });
  appendDiagnostics(lines, result.diagnostics);
  return lines.join("\n");
}

function appendFileSummaries(lines, files, { maxFiles }) {
  const entries = Array.isArray(files) ? files : [];
  for (const file of entries.slice(0, maxFiles)) {
    lines.push(formatFileSummary(file));
  }

  if (entries.length > maxFiles) {
    lines.push(`... ${entries.length - maxFiles} more files omitted from summary.`);
  }
}

function formatFileSummary(file) {
  const filePath = file?.path ?? file?.file ?? "(unknown file)";
  const parts = [`- ${filePath}`];

  const encoding = file?.encoding?.effective ?? file?.effectiveEncoding ?? file?.encoding;
  if (typeof encoding === "string") {
    parts.push(`encoding ${encoding}`);
  }

  const lineCount = file?.logicalLineCount ?? file?.lines?.logicalLineCount;
  const simpleLineCount = lineCount ?? file?.lines;
  if (typeof simpleLineCount === "number") {
    parts.push(`${simpleLineCount} logical lines`);
  }

  const byteSize = file?.byteSize ?? file?.bytes ?? file?.size?.bytes;
  if (typeof byteSize === "number") {
    parts.push(`${byteSize} bytes`);
  }

  const range = file?.range;
  if (range && typeof range === "object") {
    const start = range.startLine ?? "?";
    const count = range.lineCount ?? range.requestedLineCount ?? "?";
    const reachedEof = range.reachedEof === true ? ", reached EOF" : "";
    parts.push(`range ${start}+${count}${reachedEof}`);
  }

  return parts.join(" - ");
}

function appendDiagnostics(lines, diagnostics) {
  if (!Array.isArray(diagnostics) || diagnostics.length === 0) {
    return;
  }

  const warnings = diagnostics.filter((diagnostic) => diagnostic?.severity !== "error");
  const errors = diagnostics.filter((diagnostic) => diagnostic?.severity === "error");
  if (errors.length > 0) {
    lines.push(`Errors: ${errors.length}`);
  }
  if (warnings.length > 0) {
    lines.push(`Warnings: ${warnings.length}`);
  }

  for (const diagnostic of diagnostics.slice(0, 5)) {
    const severity = diagnostic?.severity ?? "info";
    const code = diagnostic?.code ?? "diagnostic";
    const location = diagnostic?.path ?? diagnostic?.file ?? diagnostic?.filePath;
    const locationText = location ? ` ${location}` : "";
    const message = diagnostic?.message ? `: ${diagnostic.message}` : "";
    lines.push(`- ${severity} ${code}${locationText}${message}`);
  }

  if (diagnostics.length > 5) {
    lines.push(`... ${diagnostics.length - 5} more diagnostics omitted from summary.`);
  }
}

function appendRootResolution(lines, result, { cwd }) {
  const root = result?.effectiveRequest?.root ?? result?.request?.root;
  if (typeof root !== "string" || root.length === 0) {
    return;
  }

  if (!path.isAbsolute(root) && !cwd) {
    lines.push(`Root: ${root}`);
    return;
  }

  const resolvedRoot = path.resolve(cwd ?? process.cwd(), root);
  const realRoot = safeRealpath(resolvedRoot);
  if (!realRoot || realRoot === resolvedRoot) {
    lines.push(`Root: ${root}`);
    return;
  }

  lines.push(`Root: ${root} (real path: ${realRoot})`);
}

function safeRealpath(value) {
  try {
    return fs.realpathSync(value);
  } catch {
    return null;
  }
}

function countRequestedFiles(result) {
  const files = result?.effectiveRequest?.files ?? result?.request?.files;
  return Array.isArray(files) ? files.length : 0;
}

function countReadFiles(result) {
  const files = Array.isArray(result?.files) ? result.files : [];
  return files.length;
}
