---
name: validation-review
description: Judge whether a validation experiment was exercised well before interpreting evidence, then recommend repeat, adjust, advance, pause, or kill.
---
<!-- AUTO-GENERATED from SKILL.md.tmpl; edit the template -->

# Validation Review

Interpret evidence only after judging whether the experiment deserved to teach
us anything.
Be the skeptical partner in the room. Protect the founder from false optimism
and from rejecting a market based on a badly exercised rep.

## Start

Read the current thesis, experiment records, evidence, contacts, decisions, and
`~/.gstack-validation-companion/references/experiment-methods.md`. Read
`~/.gstack-validation-companion/references/conversation-protocol.md` and follow
it throughout this skill.

Open with the prior bet and assignment: "We expected [success or invalidation
signal], and the assignment was [next action]. What happened that surprised
you?" **STOP.**

## Validity Gate

Classify the repetition:

- `valid`: reached the intended people, used an understandable offer and ask,
  and was exercised seriously enough to interpret.
- `partially-valid`: useful evidence exists, but execution or targeting limits
  the conclusion.
- `invalid`: wrong people, unclear offer, wrong channel, insufficient effort,
  or another flaw prevents interpretation.

Question the approach before questioning the market. Invalid experiments cannot
produce `advance` or `kill` decisions.

Ask one at a time, smart-skipping what the evidence already proves:

1. "Did we reach the intended people? Name who qualified and who did not."
2. "Did they understand the offer and ask without us rescuing the conversation?"
3. "Was this rep exercised seriously enough that you would trust the result if
   it contradicted what you hoped?"

**STOP after each question.** Do not interpret the market before resolving the
validity classification.

## Contact Credibility Gate

Judge the source before weighting the evidence. For each contact who materially
influenced the result, assess:

- ICP fit and direct experience with the workflow.
- Domain expertise and specificity of examples.
- Candor: did they challenge the premise or plainly say what was irrelevant?
- Bias or conflict, including politeness, friendship, or incentive to agree.
- Whether a meaningfully changed hypothesis should be brought back to them.

A credible contact is not somebody who agrees. It is somebody qualified and
willing to tell the founder the idea is bad. Evidence from a polite friend,
poor ICP match, or speculative commentator cannot by itself validate or reject
the market.

Ask: "Which people earned the right to influence the next iteration, and what
would you bring back to each of them?" **STOP.**

## Interpret

Separate observations from interpretations. Assess:

- Founder-market fit.
- Market potential for the founder's intended business.
- Problem importance and priority.
- Observed pull: replies, concrete pain, repeat engagement, introductions,
  pilots, payments, or behavior that would be painful to lose.

Compliments, traffic, vague enthusiasm, and broad waitlists remain weak signal.

## Decide

Recommend exactly one:

`repeat`, `change-audience`, `change-problem`, `change-offer`,
`change-channel`, `advance`, `pause`, or `kill`.

Normally run 1-3 meaningfully adjusted repetitions before `kill`. Do not repeat
unchanged activity just to reach a quota.

Present:

- The recommended validity classification and why
- The credibility assessment for contacts who materially shaped the result
- The strongest evidence supporting it
- The strongest evidence against it
- The recommended decision and what evidence would change your mind

Ask the founder to approve, revise, or stop. **STOP.** Do not record validity or
append the decision until the founder responds. Do not record contact
credibility assessments without that approval either. After approval, write
them append-only:

```bash
~/.gstack-validation-companion/bin/validation-state review <experiment-id> --json '<validity assessment>'
~/.gstack-validation-companion/bin/validation-state review-contact <contact-id> --json '<credibility assessment>'
~/.gstack-validation-companion/bin/validation-state append decision --json '<decision>'
```

Strong valid signal routes to `/distribution-loop`. Adjustments route back to
`/customer-reps`. Prefer credible returning contacts for the next changed
iteration, while adding fresh ICP contacts when testing generality. Finish with
one concrete next action.

Close by comparing this repetition with the prior one: what became sharper,
what remained ambiguous, and what the founder now knows that they did not know
before.

Only log a sanitized durable meta-learning when it would save time in future
sessions. Use `validation-state summary --sanitized`; never include raw evidence
or contacts. If gbrain is installed and the user has enabled trusted writes,
the sanitized thesis and decision summary may be saved as a validation decision
page. Never save `evidence.jsonl`, `contacts.jsonl`, transcripts, or private
conversation content.

## Completion Status

- `DONE` — founder approved the validity assessment and decision; both were
  appended with one concrete next action.
- `INVALID_REP` — the rep cannot support a market conclusion; route to an
  adjusted `/customer-reps` repetition.
- `NEEDS_EVIDENCE` — evidence is insufficient even to judge validity.
- `AWAITING_APPROVAL` — assessment is ready but the founder has not approved
  the classification or decision.
