# Inertia AdonisJS Cookbook

Extra tips and recipes for common integrations.

## Default Layout

Apply a default layout in the Inertia setup:

```tsx
// inertia/app/app.ts
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { resolvePageComponent } from "@adonisjs/inertia/helpers";
import AppLayout from "../layouts/app_layout";

createInertiaApp({
  resolve: (name) => {
    const page = resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob("../pages/**/*.tsx"),
    );

    page.default.layout = page.default.layout || ((p) => <AppLayout>{p}</AppLayout>);
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
```

## Meta Tags with Head

```tsx
import { Head } from "@inertiajs/react";

export default function Dashboard() {
  return (
    <>
      <Head title="Dashboard" />
      <h1>Dashboard</h1>
    </>
  );
}
```

## HMR and Server Restarts

If the server restarts on every frontend change, exclude `inertia/**/*` from the root `tsconfig.json`.

```json
{
  "exclude": ["inertia/**/*"]
}
```

## Avoid bundling backend code

When sharing types, always use `import type` to prevent Vite from bundling backend code.
