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

## Supabase deployment

The prototype is linked to the Supabase project `xhdgijwkiqhtyclomvgn` and
deploys the `tax-cockpit` Edge Function:

`https://xhdgijwkiqhtyclomvgn.supabase.co/functions/v1/tax-cockpit`

The function currently exposes a health check and creates tenant-scoped filing
returns with an audit event. Apply future schema changes with:

```bash
npx supabase db push
npx supabase functions deploy tax-cockpit --no-verify-jwt
```

## Browser app

The static cockpit lives in `app/` and is published through GitHub Pages:

`https://davidvibecodes.github.io/tax-filing-cockpit/`

It is a prototype surface backed by the deployed Edge Function. The current
function accepts demo tenant and actor identifiers and is not ready for real
taxpayer data until Supabase Auth and tenant authorization are enabled.
