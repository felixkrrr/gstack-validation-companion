# Validation State Schema

All JSONL records are append-only and receive `id`, `ts`, and `project_slug`
from `validation-state`.

## Experiments

Required: `hypothesis`, `audience`, `method`, `offer`, `channel`,
`success_signal`, `invalidation_signal`, `status`.

Status: `planned`, `active`, `completed`, `abandoned`.

Optional review fields: `validity`, `validity_reason`, `result`,
`next_action`, `rep_number`.

Use `validation-state review <experiment-id> --json '<assessment>'` to append a
reviewed version without reconstructing the full experiment record.

## Evidence

Required: `experiment_id`, `observation`, `source_type`.

Store observations, not conclusions. Raw quotes and source references are
allowed here because this file is local-only by default.

## Contacts

Required: `name`, `relationship`, `status`.

Contacts are local-only by default. Keep only the minimum needed to preserve
the relationship and next action. Do not add contacts to gbrain or generic
learnings.

After a real repetition, assess whether the contact belongs in the founder's
trusted validation circle. Use `validation-state review-contact <contact-id>
--json '<assessment>'` to append a reviewed version of the contact.

Required review fields:

- `credibility`: `unknown`, `credible`, `mixed`, or `not-credible`
- `credibility_reason`: why their evidence should or should not carry weight
- `icp_fit`: `high`, `medium`, or `low`
- `domain_expertise`: `high`, `medium`, or `low`
- `candor`: `high`, `medium`, `low`, or `unknown`
- `reengage`: whether a changed hypothesis should be brought back to them
- `next_question`: the unresolved question worth asking next

Credibility is not agreement. A credible contact understands the workflow,
speaks from direct experience, and is willing to say the idea is irrelevant or
wrong. Repeatedly engaging credible contacts accelerates iteration, but fresh
ICP contacts are still required when testing whether a conclusion generalizes.

## Decisions

Required: `experiment_id`, `decision`, `rationale`, `next_action`.

Optional: `sanitized_summary`, containing a PII-free business-level conclusion
safe for an explicit meta-learning or trusted gbrain write.

Decision: `repeat`, `change-audience`, `change-problem`, `change-offer`,
`change-channel`, `advance`, `pause`, `kill`.

`kill` is rejected unless the referenced experiment is valid and at least one
prior meaningfully adjusted repetition exists. Override only with
`--force-with-rationale`.
