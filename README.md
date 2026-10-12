# Tax Filing Cockpit

Greenfield prototype for an evidence-backed Indian salaried-tax filing workspace.

The prototype is intentionally built around a deterministic domain core:

- filing workspaces are tenant-scoped;
- writes use optimistic version checks;
- audit events record material changes;
- unknown or unsupported tax facts are not silently invented.

## Development

```bash
npm install
npm test
npm run build
```

The current branch starts with the workspace foundation. Document intake,
eligibility, calculation, form synchronization, assistant proposals, and export
are added only behind typed domain boundaries.
