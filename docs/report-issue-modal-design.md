# Report Issue Modal

## Understanding summary

- Show project ownership consistently at the bottom of every portal card and in the dedicated issue-report flow.
- Add a `Report an issue` action beside the Maintenance summary chip in the home header.
- Let employees select a project from a dropdown, identify themselves, review its owner and sub-owner, describe the problem, and confirm the report.
- Build frontend behavior only in this phase; no email or backend integration is included.
- Preserve the existing project links, status behavior, admin editor, and owner/sub-owner data model.
- Support desktop, mobile, keyboard navigation, Escape-to-close, and backdrop dismissal.

## Assumptions

- A report requires a selected project, valid reporter email, company name, priority, and non-empty description.
- The confirmation state is a local success preview and does not persist or transmit data.
- Owner and sub-owner email addresses are displayed as the future recipients.
- Closing the modal clears the draft and confirmation state.

## Decision log

- Use a centered modal instead of a side drawer or inline panel because the reporting flow is a focused, temporary task.
- Use a two-column desktop layout and stacked mobile layout: report context on the left and issue details on the right.
- Use a native project select instead of a custom searchable combobox because the current nine-project scale does not justify custom interaction complexity.
- Place reporter email and company beside the project dropdown so the first column remains useful and balanced.
- Put priority selection in Step 2 with the issue description, using Low, Medium, High, and Critical levels.
- Restore ownership details below each card action footer and anchor the combined footer area to the card bottom so variable description lengths cannot misalign metadata.
- Reuse the existing light operational visual language and blue accent rather than introducing a new theme.

## Final design

The home header contains a distinct `Report an issue` button immediately after the Maintenance summary chip. It opens an accessible modal with a native project dropdown, reporter email, and company field on the left, then recipient details, priority, issue description, and confirmation on the right. Selecting a project exposes its owner and sub-owner as intended recipients. The confirmation action requires a project, valid email, company name, priority, and description. Confirmation shows a frontend-only success state with a clear acknowledgement that no email has been sent yet. The modal can be closed with its close button, Escape, or the backdrop. Every portal card displays owner and sub-owner information beneath its action footer in a bottom-anchored block.
