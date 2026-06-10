# Workflow: Debug Inertia Issues

<required_reading>
**Read these reference files NOW before debugging:**
1. references/setup.md
2. references/responses.md
3. references/links.md
</required_reading>

<process>
## Common Symptoms

1. Full page reload instead of SPA navigation
2. Component not found
3. Props undefined or missing
4. Validation errors not showing
5. Blank page
6. Console errors

## Step 1: Confirm Inertia Request

Check Network tab for `X-Inertia` response header and JSON payload with `component` and `props`.

## Step 2: Verify Vite + Server

```bash
# AdonisJS server
node ace serve --watch

# Vite dev server
pnpm dev
```

## Step 3: Check Component Resolution

```ts
// inertia/app/app.ts
const pages = import.meta.glob("../pages/**/*.tsx");
```

Ensure the controller uses the same name as the file path:

```ts
return ctx.inertia.render("users/index", { users });
// Must exist at inertia/pages/users/index.tsx
```

## Step 4: Inspect Props

```tsx
import { usePage } from "@inertiajs/react";

export default function DebugPage() {
  const { props } = usePage();
  console.log(props);
  return null;
}
```

## Step 5: Validation Errors

Ensure the server returns 422 with errors:

```ts
return response.unprocessableEntity({ errors: error.messages });
```

## Step 6: Fix and Verify

- Re-run the failing flow
- Remove debug logs
- Confirm no full page reloads
</process>

<success_criteria>
Issue is resolved when:
- [ ] Inertia response returns expected component and props
- [ ] No full page reloads on navigation
- [ ] Validation errors display correctly
- [ ] No console errors
</success_criteria>
