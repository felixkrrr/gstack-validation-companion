# GStack Validation Companion

Most AI development workflows are very good at helping you build quickly.
Unfortunately, that makes it easy to spend weeks efficiently solving a problem
nobody urgently needs solved.

GStack Validation Companion is a companion skill pack for
[gstack](https://github.com/garrytan/gstack). It adds an opinionated workflow
for solo technical founders who need to learn which business is worth building
before they commit to building it.

It does not replace gstack. It changes the default path after Startup-mode
`/office-hours`:

```text
/office-hours
    ↓
/experiment-plan
    ↓
/customer-reps
    ↓
/experiment-review
    ↙ repeat or adjust       ↘ strong signal
/customer-reps               /distribution-loop
                                  ↓
                         build and automate carefully
```

The core rule is simple:

> Before there is signal, the founder builds relationships. After there is
> signal, the agent may help make the proven behavior repeatable.

## What It Helps You Decide

The workflow is designed to answer whether an idea could become a good business,
not merely whether somebody likes it.

Every experiment cycle examines four things:

- **Founder-market fit:** Do you genuinely care about, understand, and have
  access to this customer group?
- **Market potential:** Is the reachable segment large or valuable enough for
  the kind of business you want to build?
- **Problem importance:** Is this an urgent problem, or a priority-nine problem
  that will always lose to something else?
- **Observed pull:** Did the right people take meaningful action, such as
  requesting a follow-up, introducing somebody, trying a manual pilot, or
  paying?

Compliments, generic enthusiasm, traffic, and broad waitlists are treated as
weak evidence.

## How The Skill Chain Works

### 1. `/office-hours` sharpens the idea

Start with gstack's existing Startup-mode Office Hours. It challenges vague
customers, hypothetical demand, platform-sized solutions, and weak evidence.

The output is an approved design doc containing the problem, target user,
narrowest wedge, current demand evidence, and a real-world assignment.

With the optional Office Hours handoff patch applied, startup ideas route to
`/experiment-plan` instead of immediately entering engineering planning.

### 2. `/experiment-plan` creates a falsifiable campaign

`/experiment-plan` reads the latest Office Hours design and turns it into:

- a current business thesis
- the riskiest unresolved assumption
- the cheapest credible experiment
- a specific audience, offer, channel, and success signal
- one founder-led assignment to begin the first repetition

It deliberately prefers conversations when the buyer, workflow, or pain is
still unclear.

A landing page is not the default experiment. The skill invokes `/buyable`
only when:

- the intended buyer and painful problem are already specific
- the founder has a credible way to put the page in front of those buyers
- a concrete action on the page would resolve the current uncertainty

### 3. `/customer-reps` helps the founder do real customer work

`/customer-reps` prepares one serious experiment repetition at a time.

It starts with the founder's existing network before moving outward:

- phone contacts and people already known
- warm introductions and referral asks
- LinkedIn first- and second-degree connections
- local businesses, meetups, classes, and trade events
- relevant communities
- targeted direct outreach

The skill helps select named people, draft natural messages, prepare interview
questions, and define what evidence matters.

Early repetitions remain founder-led. The agent may research and prepare, but
the founder sends messages, conducts conversations, and begins the
relationships personally.

After each repetition, observations are recorded separately from
interpretations. This prevents the founder or agent from turning one awkward
conversation into a sweeping market conclusion.

The workflow also builds a **trusted circle**: a small set of ICP
contacts who know the workflow deeply and are candid enough to say when an idea
is bad, irrelevant, or low priority. After each rep, the founder assesses the
contact's ICP fit, domain expertise, candor, and whether a changed hypothesis
should be brought back to them. Credible returning contacts speed up iteration;
fresh contacts are still included when testing whether the signal generalizes.

### 4. `/experiment-review` judges the experiment before the idea

Before interpreting feedback, `/experiment-review` asks whether the experiment
was exercised well enough to deserve an interpretation.

Each repetition is classified as:

- **Valid:** The right people were reached, the offer and ask were clear, and
  the repetition was performed seriously enough to interpret.
- **Partially valid:** Useful evidence exists, but targeting or execution limits
  the conclusion.
- **Invalid:** The wrong people, unclear offer, weak channel, insufficient
  effort, or another flaw prevents a market conclusion.

Invalid experiments cannot produce an "advance" or "kill" decision.

The review then recommends one explicit next move:

- repeat with a meaningfully adjusted approach
- change audience
- change problem framing
- change offer
- change channel
- advance toward repeatable distribution
- pause
- kill

Normally, the workflow expects one to three meaningfully adjusted repetitions
before recommending shutdown. It does not repeat unchanged activity just to hit
a quota.

### 5. `/distribution-loop` systematizes proven behavior

Once founder-led work produces credible signal, `/distribution-loop` identifies
what actually worked:

- which audience responded
- which message or offer created pull
- which channel reached the right people
- which cadence the founder can sustain
- which feedback should be reviewed after every cycle

Automation unlocks gradually:

| Level | What the agent may do |
|---|---|
| **0: Founder performs** | Founder identifies, contacts, and speaks with people. |
| **1: Agent prepares** | Agent researches and drafts; founder sends and handles replies. |
| **2: Approval-gated operations** | Agent manages lists and follow-ups; founder approves sends. |
| **3: Proven campaigns** | Agent operates bounded campaigns with explicit caps, stops, and reviews. |

The included state CLI enforces minimum evidence before increasing automation.
Installed lead-pipeline, outreach-pipeline, CRM, or social-growth skills may be
reused at later levels, but their availability does not justify unlocking them.

Recurring public posts about the problem are supported as an opt-in
distribution tactic. Posts should come from real observations, changed beliefs,
and useful questions. Qualified conversations and introductions matter; reach
alone does not.

## Example Journey

Suppose you want to build an AI tool that writes weekly operations reports.

1. `/office-hours` pushes "operations teams" into a specific first customer:
   operations leads at 20–100 person agencies who manually compile client
   delivery reports every Friday.
2. `/experiment-plan` decides the biggest uncertainty is whether the weekly
   report is painful and important enough to change behavior. It chooses five
   founder-led conversations, not a product build.
3. `/customer-reps` helps identify two people you already know, three warm
   introduction paths, a short message, and questions about their current
   Friday workflow.
4. `/experiment-review` finds that only two conversations reached the intended
   role and the proposed offer was vague. The repetition is partially valid,
   so it recommends repeating with a concrete manual report service.
5. The next repetition produces two pilot requests. The valid strong signal
   unlocks `/distribution-loop`, which creates a sustainable founder outreach
   cadence and permits the agent to prepare prospect research and drafts.
6. Only now does the workflow recommend building the smallest product surface
   needed to support the proven workflow.

## Persistence And Privacy

Experiment state follows gstack's project-scoped storage convention:

```text
~/.gstack/projects/<slug>/experiments/
  thesis.md
  experiments.jsonl
  evidence.jsonl
  decisions.jsonl
  distribution.md
  contacts.jsonl
```

The files serve different purposes:

- `thesis.md` stores the current audience, problem, offer, market, and
  founder-fit thesis.
- `experiments.jsonl` stores append-only experiment definitions and validity
  assessments.
- `evidence.jsonl` stores raw observations and source references.
- `decisions.jsonl` stores explicit repeat, adjust, advance, pause, or kill
  decisions.
- `distribution.md` stores proven channels, cadence, automation level, and
  problem-posting choice.
- `contacts.jsonl` stores minimal relationship, credibility, re-engagement, and
  follow-up state.

Raw evidence, contacts, transcripts, and private conversation content remain
local-only by default. They must not be written to generic gstack learnings,
gbrain, or cross-machine sync.

Sanitized business-level conclusions can be exported explicitly:

```bash
~/.gstack-validation-companion/bin/experiment-state summary --sanitized
```

## Deterministic State CLI

The skills use `experiment-state` so important workflow rules are executable
rather than relying only on prompt instructions.

```bash
# Initialize state for the current project
~/.gstack-validation-companion/bin/experiment-state init

# Inspect current records
~/.gstack-validation-companion/bin/experiment-state list experiment
~/.gstack-validation-companion/bin/experiment-state summary

# Review an experiment append-only
~/.gstack-validation-companion/bin/experiment-state review <experiment-id> \
  --json '{"validity":"valid","validity_reason":"...","result":"strong-signal","next_action":"..."}'

# Review whether a contact belongs in the trusted circle
~/.gstack-validation-companion/bin/experiment-state review-contact <contact-id> \
  --json '{"credibility":"credible","credibility_reason":"Direct operator who challenged the premise","icp_fit":"high","domain_expertise":"high","candor":"high","reengage":true,"next_question":"Does the revised manual offer solve the priority issue?"}'

# Increase automation after sufficient evidence
~/.gstack-validation-companion/bin/experiment-state set-level 1 \
  --rationale "One valid founder-led repetition supports agent preparation."
```

The CLI prevents:

- invalid experiments from advancing or rejecting the market
- killing a thesis after one unadjusted repetition without an explicit override
- jumping automation levels before repeated strong signal
- storing obvious private fields in experiments or decisions
- leaking raw evidence or contacts through sanitized summaries

## Install

Prerequisites:

- [gstack](https://github.com/garrytan/gstack)
- [`buyable`](https://github.com/felixkrrr/buyable) for experiments where a
  minimal landing page is the cheapest credible test
- Node.js

Install the companion pack:

```bash
git clone https://github.com/felixkrrr/gstack-validation-companion.git
cd gstack-validation-companion
./install
```

The installer:

- generates the four runtime skill files from their templates
- creates `~/.gstack-validation-companion` as the stable runtime path
- links the skills into `~/.claude/skills` and `~/.codex/skills`, honoring
  `CLAUDE_CONFIG_DIR` and `CODEX_HOME` when set
- detects gstack from `GSTACK_ROOT`, gstack's managed repository, Claude/Codex
  skill roots, or a vendored project installation
- validates the installation using gstack's root skill manifest, `VERSION`,
  executable `bin/gstack-config`, and `/office-hours`
- stops and asks you to install
  [garrytan/gstack](https://github.com/garrytan/gstack) when gstack is missing
- warns when buyable is not found

Restart your coding agent after installation, then start with:

```text
/office-hours
```

After Startup-mode Office Hours approves the design, run:

```text
/experiment-plan
```

To remove the companion pack:

```bash
./install --uninstall
```

Uninstalling removes only symlinks created by this installer. Experiment state
under `~/.gstack/projects/*/experiments/` is kept; delete it manually if you
want it gone.

## GStack Office Hours Integration

The companion works without modifying gstack, but the strongest default
experience changes the Startup-mode Office Hours handoff.

The optional patch makes Office Hours recommend `/experiment-plan` for startup
ideas while retaining the existing planning recommendations for Builder mode.

See:

```text
patches/gstack-office-hours-handoff.md
patches/gstack-office-hours-handoff.patch
```

The installer intentionally does not rewrite another installed skill pack.

## Development

Skills are authored in `SKILL.md.tmpl` files and generated into runtime
`SKILL.md` files:

```bash
npm run generate
npm run check
npm test
```

The tests cover experiment gates, append-only experiment review, automation
unlocking, privacy-safe summaries, and the skill-chain routing contract.
