#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const check = process.argv.includes("--check");
const skills = ["experiment-plan", "customer-reps", "experiment-review", "distribution-loop"];
let stale = false;

for (const skill of skills) {
  const templatePath = join(root, skill, "SKILL.md.tmpl");
  const outputPath = join(root, skill, "SKILL.md");
  const template = readFileSync(templatePath, "utf8");
  const marker = "<!-- AUTO-GENERATED from SKILL.md.tmpl; edit the template -->\n";
  const end = template.indexOf("\n---", 4);
  if (end < 0) throw new Error(`${skill}: malformed frontmatter`);
  const output = `${template.slice(0, end + 5)}${marker}${template.slice(end + 5)}`;
  let current = "";
  try { current = readFileSync(outputPath, "utf8"); } catch {}
  if (current !== output) {
    stale = true;
    if (!check) writeFileSync(outputPath, output);
  }
}

if (check && stale) {
  console.error("Generated skill files are stale. Run: npm run generate");
  process.exit(1);
}
