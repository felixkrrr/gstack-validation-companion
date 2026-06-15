import test from "node:test";
import assert from "node:assert/strict";
import { chmodSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readlinkSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const installer = join(root, "install");

function harness() {
  const home = mkdtempSync(join(tmpdir(), "gstack-validation-install-"));
  const run = (extraEnv = {}, args = []) => spawnSync("bash", [installer, ...args], {
    cwd: home,
    env: { ...process.env, HOME: home, CODEX_HOME: join(home, ".codex"), GSTACK_HOME: join(home, ".gstack"), ...extraEnv },
    encoding: "utf8",
  });
  return { home, run };
}

function createGstack(rootPath) {
  mkdirSync(join(rootPath, "bin"), { recursive: true });
  mkdirSync(join(rootPath, "office-hours"), { recursive: true });
  writeFileSync(join(rootPath, "VERSION"), "1.0.0\n");
  writeFileSync(join(rootPath, "SKILL.md"), "---\nname: gstack\n---\n");
  writeFileSync(join(rootPath, "bin", "gstack-config"), "#!/usr/bin/env bash\n");
  chmodSync(join(rootPath, "bin", "gstack-config"), 0o755);
  writeFileSync(join(rootPath, "office-hours", "SKILL.md"), "---\nname: office-hours\n---\n(gstack)\n");
}

test("installer rejects a missing or broken gstack installation before installing", () => {
  const { home, run } = harness();
  mkdirSync(join(home, ".claude", "skills"), { recursive: true });
  symlinkSync(join(home, "missing-gstack"), join(home, ".claude", "skills", "gstack"));

  const result = run();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /no valid installation was found/);
  assert.match(result.stderr, /https:\/\/github\.com\/garrytan\/gstack/);
});

test("installer rejects an unrelated office-hours skill", () => {
  const { home, run } = harness();
  mkdirSync(join(home, ".claude", "skills", "office-hours"), { recursive: true });
  writeFileSync(join(home, ".claude", "skills", "office-hours", "SKILL.md"), "name: office-hours\n");

  const result = run();

  assert.equal(result.status, 1);
  assert.match(result.stderr, /no valid installation was found/);
});

test("installer accepts gstack's managed repository layout", () => {
  const { home, run } = harness();
  const gstack = join(home, ".gstack", "repos", "gstack");
  createGstack(gstack);

  const result = run();

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(`Using gstack: ${gstack.replaceAll(".", "\\.")}`));
});

test("installer accepts and validates an explicit GSTACK_ROOT", () => {
  const { home, run } = harness();
  const gstack = join(home, "custom-gstack");
  createGstack(gstack);

  const result = run({ GSTACK_ROOT: gstack });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Using gstack: .*custom-gstack/);
});

test("installer honors CLAUDE_CONFIG_DIR and CODEX_HOME and uninstall reverses it", () => {
  const { home, run } = harness();
  createGstack(join(home, ".gstack", "repos", "gstack"));
  const claudeDir = join(home, "custom-claude");
  const codexDir = join(home, "custom-codex");
  const env = { CLAUDE_CONFIG_DIR: claudeDir, CODEX_HOME: codexDir };

  // A pre-existing real skill directory must survive install and uninstall.
  const userOwned = join(codexDir, "skills", "experiment-plan");
  mkdirSync(userOwned, { recursive: true });
  writeFileSync(join(userOwned, "SKILL.md"), "name: experiment-plan\n");

  const installed = run(env);
  assert.equal(installed.status, 0, installed.stderr);
  assert.equal(readlinkSync(join(claudeDir, "skills", "customer-reps")), join(root, "customer-reps"));
  assert.ok(!existsSync(join(home, ".claude", "skills", "customer-reps")));
  assert.ok(!lstatSync(userOwned).isSymbolicLink());

  const removed = run(env, ["--uninstall"]);
  assert.equal(removed.status, 0, removed.stderr);
  assert.match(removed.stdout, /uninstalled/);
  assert.match(removed.stdout, /Experiment state was kept/);
  for (const skill of ["experiment-plan", "customer-reps", "experiment-review", "distribution-loop"]) {
    assert.ok(!existsSync(join(claudeDir, "skills", skill)), `${skill} still linked`);
  }
  assert.ok(!existsSync(join(home, ".gstack-validation-companion")));
  assert.match(removed.stderr, /not a symlink/);
  assert.ok(existsSync(join(userOwned, "SKILL.md")));
});

test("installer rejects unknown arguments", () => {
  const { run } = harness();
  const result = run({}, ["--frobnicate"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage: \.\/install \[--uninstall\]/);
});

test("installer explains when an explicit GSTACK_ROOT is invalid", () => {
  const { home, run } = harness();
  const invalid = join(home, "not-gstack");
  mkdirSync(invalid);

  const result = run({ GSTACK_ROOT: invalid });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /GSTACK_ROOT was checked but is not a valid gstack root/);
});
