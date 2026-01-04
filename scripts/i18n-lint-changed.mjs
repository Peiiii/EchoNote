import { spawnSync } from "node:child_process";
import fs from "node:fs";

function gitLines(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) return [];
  return (result.stdout ?? "")
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);
}

function uniq(items) {
  return [...new Set(items)];
}

function isUiFile(filePath) {
  return filePath.endsWith(".tsx") || filePath.endsWith(".jsx");
}

const cliTargets = process.argv.slice(2);
const targets =
  cliTargets.length > 0
    ? cliTargets
    : uniq([
        ...gitLines(["diff", "--name-only", "--diff-filter=ACMRTUXB"]),
        ...gitLines(["diff", "--cached", "--name-only", "--diff-filter=ACMRTUXB"]),
        ...gitLines(["ls-files", "--others", "--exclude-standard"]),
      ]);

const changed = targets.filter(isUiFile).filter(p => fs.existsSync(p));

if (changed.length === 0) {
  console.log("[i18n:lint] OK (no target UI files)");
  process.exit(0);
}

const eslintArgs = [
  "exec",
  "eslint",
  "--quiet",
  "--rule",
  "local/no-hardcoded-ui-text:error",
  ...changed,
];

const result = spawnSync("pnpm", eslintArgs, { stdio: "inherit" });
process.exit(result.status ?? 1);
