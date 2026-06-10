import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const cli = join(root, "bin", "validation-state");

function harness() {
  const dir = mkdtempSync(join(tmpdir(), "gstack-validation-companion-"));
  const env = { ...process.env, GSTACK_HOME: join(dir, ".gstack"), VALIDATION_PROJECT_SLUG: "test-project" };
  const run = (...args) => execFileSync("node", [cli, ...args], { cwd: dir, env, encoding: "utf8" });
  const fail = (...args) => spawnSync("node", [cli, ...args], { cwd: dir, env, encoding: "utf8" });
  return { dir, env, run, fail };
}

const experiment = (overrides = {}) => ({
  hypothesis: "Operations leads urgently need a faster weekly close",
  audience: "Operations leads at 20-100 person agencies",
  method: "founder-led interviews",
  offer: "manual weekly close service",
  channel: "warm introductions",
  success_signal: "three qualified buyers request a pilot",
  invalidation_signal: "qualified buyers consistently rank it below current priorities",
  status: "completed",
  validity: "valid",
  rep_number: 1,
  ...overrides,
});

test("initializes private project-scoped state", () => {
  const { env, run } = harness();
  const path = run("init").trim();
  assert.equal(path, join(env.GSTACK_HOME, "projects", "test-project", "validation"));
  assert.match(readFileSync(join(path, "thesis.md"), "utf8"), /Founder-Market Fit/);
  assert.match(readFileSync(join(path, "distribution.md"), "utf8"), /Automation level: 0/);
});

test("invalid experiments cannot produce market rejection", () => {
  const { run, fail } = harness();
  const created = JSON.parse(run("append", "experiment", "--json", JSON.stringify(experiment({ validity: "invalid" }))));
  const result = fail("append", "decision", "--json", JSON.stringify({
    experiment_id: created.id,
    decision: "kill",
    rationale: "Nobody replied to the first batch.",
    next_action: "Stop.",
  }));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /kill requires a valid experiment/);
});

test("review appends a merged validity assessment", () => {
  const { run } = harness();
  const created = JSON.parse(run("append", "experiment", "--json", JSON.stringify(experiment({
    status: "active",
    validity: undefined,
  }))));
  const reviewed = JSON.parse(run("review", created.id, "--json", JSON.stringify({
    validity: "partially-valid",
    validity_reason: "Right audience, but the ask was unclear.",
    result: "weak-signal",
    next_action: "Repeat with a concrete pilot offer.",
  })));
  assert.equal(reviewed.id, created.id);
  assert.equal(reviewed.audience, created.audience);
  assert.equal(reviewed.validity, "partially-valid");
  assert.equal(JSON.parse(run("list", "experiment")).length, 2);
});

test("contact review builds an append-only trusted validation circle", () => {
  const { run, fail } = harness();
  const created = JSON.parse(run("append", "contact", "--json", JSON.stringify({
    name: "Alice Example",
    relationship: "warm introduction",
    status: "spoke",
  })));
  const reviewed = JSON.parse(run("review-contact", created.id, "--json", JSON.stringify({
    credibility: "credible",
    credibility_reason: "Runs the workflow and directly challenged the offer.",
    icp_fit: "high",
    domain_expertise: "high",
    candor: "high",
    reengage: true,
    next_question: "Does the revised offer solve the priority issue?",
  })));
  assert.equal(reviewed.id, created.id);
  assert.equal(reviewed.credibility, "credible");
  assert.equal(JSON.parse(run("list", "contact")).length, 2);
  assert.match(run("summary", "--sanitized"), /"credible_contacts": 1/);

  const rejected = fail("review-contact", created.id, "--json", JSON.stringify({
    ...reviewed,
    credibility: "friendly",
  }));
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /contact\.credibility must be one of/);
});

test("kill requires an adjusted repetition", () => {
  const { run, fail } = harness();
  const first = JSON.parse(run("append", "experiment", "--json", JSON.stringify(experiment())));
  const rejected = fail("append", "decision", "--json", JSON.stringify({
    experiment_id: first.id,
    decision: "kill",
    rationale: "The valid first repetition showed weak urgency.",
    next_action: "Stop.",
  }));
  assert.notEqual(rejected.status, 0);

  const second = JSON.parse(run("append", "experiment", "--json", JSON.stringify(experiment({
    rep_number: 2,
    offer: "paid close audit",
  }))));
  const accepted = JSON.parse(run("append", "decision", "--json", JSON.stringify({
    experiment_id: second.id,
    decision: "kill",
    rationale: "Two valid adjusted repetitions showed the problem remains low priority.",
    next_action: "Archive the thesis.",
  })));
  assert.equal(accepted.decision, "kill");
});

test("a reviewed experiment is one experiment, not an adjusted repetition", () => {
  const { run, fail } = harness();
  const created = JSON.parse(run("append", "experiment", "--json", JSON.stringify(experiment({
    status: "active",
    validity: undefined,
  }))));
  run("review", created.id, "--json", JSON.stringify({
    validity: "valid",
    validity_reason: "Right audience and a concrete ask.",
    result: "strong-signal",
    next_action: "Repeat with an adjusted offer.",
  }));
  const rejected = fail("append", "decision", "--json", JSON.stringify({
    experiment_id: created.id,
    decision: "kill",
    rationale: "One valid repetition is not enough to kill.",
    next_action: "Stop.",
  }));
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /at least one adjusted repetition/);
});

test("repeated reviews of one experiment do not unlock automation levels", () => {
  const { run, fail } = harness();
  const created = JSON.parse(run("append", "experiment", "--json", JSON.stringify(experiment({
    status: "active",
    validity: undefined,
  }))));
  const review = {
    validity: "valid",
    validity_reason: "Right audience and a concrete ask.",
    result: "strong-signal",
    next_action: "Repeat with an adjusted offer.",
  };
  run("review", created.id, "--json", JSON.stringify(review));
  run("review", created.id, "--json", JSON.stringify(review));
  const rejected = fail("set-level", "2", "--rationale", "Two reviews of one experiment should not count twice.");
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /level 2 requires repeated strong signal/);
});

test("automation levels require repeated strong signal", () => {
  const { run, fail } = harness();
  const noSignal = fail("set-level", "1", "--rationale", "There is enough evidence to prepare outreach.");
  assert.notEqual(noSignal.status, 0);

  run("append", "experiment", "--json", JSON.stringify(experiment({ result: "strong-signal" })));
  assert.match(run("set-level", "1", "--rationale", "One valid founder-led repetition supports agent preparation."), /level set to 1/);
  assert.notEqual(fail("set-level", "2", "--rationale", "Automate the list and follow-up preparation now.").status, 0);

  run("append", "experiment", "--json", JSON.stringify(experiment({ rep_number: 2, result: "strong-signal", channel: "direct email" })));
  assert.match(run("set-level", "2", "--rationale", "Two valid strong-signal repetitions support approval-gated operations."), /level set to 2/);
});

test("sanitized summary never emits contacts or raw evidence", () => {
  const { run } = harness();
  const created = JSON.parse(run("append", "experiment", "--json", JSON.stringify(experiment())));
  run("append", "evidence", "--json", JSON.stringify({
    experiment_id: created.id,
    observation: "alice@example.com said the close blocks payroll",
    source_type: "call",
  }));
  run("append", "contact", "--json", JSON.stringify({
    name: "Alice Example",
    relationship: "warm introduction",
    status: "spoke",
    email: "alice@example.com",
  }));
  run("append", "decision", "--json", JSON.stringify({
    experiment_id: created.id,
    decision: "repeat",
    rationale: "Alice Example asked us to call alice@example.com after payroll.",
    next_action: "Call Alice Example.",
    sanitized_summary: "A qualified buyer requested a follow-up after a concrete workflow discussion.",
  }));
  const summary = run("summary", "--sanitized");
  assert.doesNotMatch(summary, /Alice|alice@example.com|payroll/);
  assert.match(summary, /"evidence_records": 1/);
  assert.match(summary, /qualified buyer requested a follow-up/);
  assert.doesNotMatch(summary, /state_dir/);
});

test("slug stays stable across subdirectories of a remote-less repository", () => {
  const { dir, env } = harness();
  const repo = join(dir, "acme-project");
  const nested = join(repo, "src", "deep");
  mkdirSync(nested, { recursive: true });
  execFileSync("git", ["init", "--quiet", repo]);
  const slugEnv = { ...env };
  delete slugEnv.VALIDATION_PROJECT_SLUG;
  const initAt = (cwd) => execFileSync("node", [cli, "init"], { cwd, env: slugEnv, encoding: "utf8" }).trim();
  const fromRoot = initAt(repo);
  const fromNested = initAt(nested);
  assert.equal(fromRoot, fromNested);
  assert.match(fromRoot, /acme-project/);
});

test("a corrupted state line fails with the file and line number", () => {
  const { run, fail } = harness();
  const path = run("init").trim();
  run("append", "experiment", "--json", JSON.stringify(experiment()));
  appendFileSync(join(path, "experiments.jsonl"), "{not json\n");
  const result = fail("list", "experiment");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /corrupted record at experiments\.jsonl:2/);
});

test("public experiment and decision records reject private fields", () => {
  const { fail } = harness();
  const result = fail("append", "experiment", "--json", JSON.stringify(experiment({ email: "private@example.com" })));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /cannot contain private field/);
});
