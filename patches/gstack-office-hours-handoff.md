# Optional GStack Office Hours Handoff Patch

GStack Validation Companion works without modifying gstack, but the best default
route changes Startup-mode Office Hours:

- Recommend `/experiment-plan` when installed.
- Do not route startup ideas directly into implementation planning.
- Keep the existing planning recommendations for Builder mode.

The companion installer does not rewrite another installed skill pack. Apply
`gstack-office-hours-handoff.patch` to a vendored gstack installation, submit
the change upstream, or maintain the same change locally. The canonical source
path is:

```text
office-hours/sections/design-and-handoff.md.tmpl
```

After applying the patch, run gstack's `bun run gen:skill-docs` to regenerate
the runtime section.
