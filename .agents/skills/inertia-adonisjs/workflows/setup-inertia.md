# Workflow: Set Up Inertia (AdonisJS + React)

<required_reading>
**Read these reference files NOW before setup:**
1. references/setup.md
</required_reading>

<process>
## Prerequisites Checklist

- [ ] AdonisJS 6 application
- [ ] Node.js 18+ installed
- [ ] pnpm or npm available

## Step 1: Install and Configure

```bash
npm i @adonisjs/inertia
node ace configure @adonisjs/inertia

# React + Inertia React (if not installed)
pnpm add @inertiajs/react react react-dom
```

## Step 2: Verify the Entrypoint

The configure command creates `inertia/app/app.ts`. Ensure it bootstraps React and resolves pages:

```tsx
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { resolvePageComponent } from "@adonisjs/inertia/helpers";

createInertiaApp({
  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob("../pages/**/*.tsx"),
    );
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
```

## Step 3: Root Edge Template

```edge
<!DOCTYPE html>
<html>
  <head>
    @inertiaHead()
    @vite(['inertia/app/app.ts', `inertia/pages/${page.component}.tsx`])
  </head>
  <body>
    @inertia()
  </body>
</html>
```

## Step 4: Create a Test Route

```ts
// start/routes.ts
import router from "@adonisjs/core/services/router";

router.get("/inertia-example", async (ctx) => {
  return ctx.inertia.render("inertia-example", { message: "Inertia works!" });
});
```

## Step 5: Create the Page Component

```tsx
// inertia/pages/inertia-example.tsx
export default function InertiaExample({ message }: { message: string }) {
  return <h1>{message}</h1>;
}
```

## Step 6: Run the App

```bash
node ace serve --watch
pnpm dev
```

Visit `http://localhost:3333/inertia-example`.

## Common Issues

### Component not found
- Check the page path matches the component name
- Verify the glob pattern in `inertia/app/app.ts`

### Blank page
- Ensure `@inertia()` is present in the Edge layout
- Verify Vite is running
</process>

<success_criteria>
Setup is complete when:
- [ ] Inertia page renders without full page reloads
- [ ] React component resolves correctly
- [ ] `X-Inertia` header present in response
- [ ] No console errors
</success_criteria>
