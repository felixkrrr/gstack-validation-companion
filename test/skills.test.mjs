import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");

test("skill chain preserves validation-first routing", () => {
  const plan = read("validation-plan/SKILL.md");
  const reps = read("customer-reps/SKILL.md");
  const review = read("validation-review/SKILL.md");
  const distribution = read("distribution-loop/SKILL.md");

  assert.match(plan, /Prefer conversations when the buyer, workflow, or pain is unclear/);
  assert.match(plan, /Invoke\s+`\/buyable` only when all are true/);
  assert.match(reps, /founder sends\s+messages and conducts conversations personally/);
  assert.match(review, /Invalid experiments cannot\s+produce `advance` or `kill` decisions/);
  assert.match(review, /1-3 meaningfully adjusted repetitions/);
  assert.match(distribution, /Automation is earned by valid signal/);
  assert.match(distribution, /Problem-posting is opt-in/);
});

test("privacy contract keeps raw relationship data local", () => {
  const schema = read("references/state-schema.md");
  const review = read("validation-review/SKILL.md");
  assert.match(schema, /Contacts are local-only/);
  assert.match(review, /never include raw evidence\s+or contacts/);
});

test("generated skills match templates", () => {
  for (const skill of ["validation-plan", "customer-reps", "validation-review", "distribution-loop"]) {
    assert.match(read(`${skill}/SKILL.md`), /AUTO-GENERATED from SKILL.md.tmpl/);
  }
});

test("all skills follow the shared gstack-style interaction protocol", () => {
  const protocol = read("references/conversation-protocol.md");
  assert.match(protocol, /ONE AT A TIME/);
  assert.match(protocol, /STOP after each question/);
  assert.match(protocol, /Take a position on every important answer/);
  assert.match(protocol, /Last time the decision was/);
  assert.match(protocol, /exactly one explicit completion status/);

  for (const skill of ["validation-plan", "customer-reps", "validation-review", "distribution-loop"]) {
    const content = read(`${skill}/SKILL.md`);
    assert.match(content, /conversation-protocol\.md/);
    assert.match(content, /\*\*STOP/);
    assert.match(content, /## Completion Status/);
  }
});

test("consequential writes require founder approval", () => {
  const plan = read("validation-plan/SKILL.md");
  const review = read("validation-review/SKILL.md");
  const distribution = read("distribution-loop/SKILL.md");

  assert.match(plan, /Do not update `thesis\.md`.*until the founder explicitly approves/s);
  assert.match(review, /Do not record validity or\s+append the decision until the founder responds/);
  assert.match(distribution, /Do not update `distribution\.md`.*until the founder explicitly approves/s);
});

test("skills preserve relationship continuity", () => {
  const plan = read("validation-plan/SKILL.md");
  const reps = read("customer-reps/SKILL.md");
  const review = read("validation-review/SKILL.md");
  const distribution = read("distribution-loop/SKILL.md");

  assert.match(plan, /Last time the decision was/);
  assert.match(reps, /Last time the\s+assignment was/);
  assert.match(review, /What happened that surprised\s+you/);
  assert.match(distribution, /The strongest\s+signal so far was/);
});

test("skills build a credible validation circle without creating an echo chamber", () => {
  const reps = read("customer-reps/SKILL.md");
  const review = read("validation-review/SKILL.md");
  const tactics = read("references/tactics.md");

  assert.match(reps, /Credible returning contacts relevant to the changed hypothesis/);
  assert.match(reps, /include at least one fresh ICP contact/);
  assert.match(review, /A credible contact is not somebody who agrees/);
  assert.match(review, /Prefer credible returning contacts/);
  assert.match(tactics, /trusted circle speeds learning; it must not become an echo chamber/i);
});

test("installer validates gstack roots and provides the official install path", () => {
  const installer = read("install");

  assert.match(installer, /is_gstack_root/);
  assert.match(installer, /office-hours\/SKILL\.md/);
  assert.match(installer, /bin\/gstack-config/);
  assert.match(installer, /VERSION/);
  assert.match(installer, /\^name:\[\[:space:\]\]\+gstack/);
  assert.match(installer, /Please install it from https:\/\/github\.com\/garrytan\/gstack/);
  assert.match(installer, /then rerun \.\/install/);
});
