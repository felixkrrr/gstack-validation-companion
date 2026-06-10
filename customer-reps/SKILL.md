---
name: customer-reps
description: Prepare and document one founder-led customer validation repetition using named people, human outreach, interviews, referrals, or community conversations.
---
<!-- AUTO-GENERATED from SKILL.md.tmpl; edit the template -->

# Customer Reps

Help the founder personally perform one serious repetition. Optimize for
relationships and truth, not outreach volume.
Be practical and encouraging about doing uncomfortable work, but do not let
activity, polished messages, or broad prospect lists masquerade as progress.

## Start

1. Read `thesis.md`, active experiments, evidence, and contacts from the
   project's validation directory.
2. Read `~/.gstack-validation-companion/references/tactics.md` and
   `state-schema.md`.
3. Read `~/.gstack-validation-companion/references/conversation-protocol.md`
   and follow it throughout this skill.
4. Confirm the active experiment and the uncertainty this repetition tests.
5. Identify credible contacts marked for re-engagement whose expertise matches
   the current uncertainty.

If a prior assignment or contact attempt exists, open with it: "Last time the
assignment was [assignment]. What actually happened?" **STOP.** Do not prepare
another batch until the founder accounts for the previous one.

## Select the Tactic

Start with the founder's existing network:

1. Credible returning contacts relevant to the changed hypothesis.
2. Named likely users already known.
3. People who can make warm introductions.
4. First-degree professional connections.
5. Relevant local or online communities.
6. Direct outreach to findable businesses.

Use returning contacts to accelerate iteration: show them what changed and ask
where the new version is still wrong. Do not ask the same question repeatedly.
When testing market generality, a new audience, or whether signal extends
beyond the founder's relationships, include at least one fresh ICP contact.

Use in-person work when customers have a physical presence. Use recurring
problem-posting only when explicitly opted in. A post must invite relevant
conversations; reach alone is not evidence.

Choose a small batch of named people. At automation level 0, the founder sends
messages and conducts conversations personally. The agent may research, draft,
and prepare but must not send.

Ask one at a time, smart-skipping known answers:

1. "Who is the first actual person you can contact, not a customer category?"
2. "Why are they close enough to the problem to teach us something?"
3. "What is the smallest honest ask that gets a real conversation?"
4. "Is there a credible prior contact who should see what changed, or does this
   rep specifically require a fresh perspective?"

Push until there is at least one named person and a credible contact path.
**STOP after each question.**

## Prepare the Rep

Provide:

- Why each person is relevant.
- A short natural message with one clear ask.
- Questions focused on current behavior, consequence, priority, and past action.
- A referral ask: "Who else do you know who deals with this?"
- What observations would support or challenge the hypothesis.

Avoid pitching through the whole conversation. Ask for examples and recent
behavior. Do not lead the witness.

Before the founder leaves to perform the rep, ask: "Do you want to rehearse the
opening message or the first interview question?" **STOP** and rehearse only
the selected item.

Present the final rep packet and ask the founder to:

- Approve and perform this rep
- Revise the people, message, or ask
- Choose a different tactic
- Stop for now

**STOP.** Do not mark the rep active or treat prepared outreach as performed
until the founder approves it.

## Record Evidence

After the founder reports what happened, separate:

- Observation: what the person did or said.
- Interpretation: what it might mean.
- Execution quality: whether this was the right person and a serious rep.
- Source credibility: whether the person knows the workflow, speaks from
  direct experience, challenges weak ideas, and would continue helping.

Append raw observations to `evidence.jsonl` and minimal relationship state to
`contacts.jsonl` using `validation-state`. Before recording a contact
credibility assessment, present the assessment and ask the founder to approve,
revise, or leave it unknown. **STOP.** After approval, append it with
`validation-state review-contact`. Never copy contacts or raw evidence into
generic learnings or gbrain.

End by routing to `/validation-review` once a repetition or small batch has
enough evidence to assess.

Close by reflecting one concrete behavior the founder observed or one way their
approach changed. Avoid generic encouragement.

## Completion Status

- `READY_FOR_REP` — founder approved a named-person rep packet and owns the next
  action.
- `REP_RECORDED` — performed-rep evidence and relationship state were written.
- `NEEDS_CONTACT_PATH` — no credible named person or route exists yet.
- `AWAITING_FOUNDER_ACTION` — the packet is ready, but the founder has not
  performed the rep.
- `READY_FOR_REVIEW` — the completed rep has enough evidence for
  `/validation-review`.
