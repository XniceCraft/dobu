# Inertia AdonisJS Setup (React)

## Installation

```bash
# AdonisJS Inertia adapter
npm i @adonisjs/inertia

# Configure the package
node ace configure @adonisjs/inertia

# React + Inertia React (if not installed)
pnpm add @inertiajs/react react react-dom
```

The configure command creates the Inertia entrypoint and registers the middleware.

## Client-side entrypoint

The entrypoint is created at `inertia/app/app.ts`.

```tsx
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { resolvePageComponent } from "@adonisjs/inertia/helpers";

const appName = import.meta.env.VITE_APP_NAME || "AdonisJS";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
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

## Root Edge template

Default root view location: `resources/views/inertia_layout.edge`.

```edge
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>AdonisJS x Inertia</title>

    @inertiaHead()
    @vite(['inertia/app/app.ts', `inertia/pages/${page.component}.tsx`])
  </head>
  <body>
    @inertia()
  </body>
</html>
```

Configure root view in `config/inertia.ts`:

```ts
import { defineConfig } from "@adonisjs/inertia";

export default defineConfig({
  rootView: "inertia_layout",
});
```

Or decide dynamically:

```ts
import { defineConfig } from "@adonisjs/inertia";
import type { HttpContext } from "@adonisjs/core/http";

export default defineConfig({
  rootView: ({ request }: HttpContext) => {
    if (request.url().startsWith("/admin")) return "admin_root";
    return "inertia_layout";
  },
});
```

## Directory Structure

```
inertia/
├── app/
│   └── app.ts
├── pages/
│   ├── users/
│   │   ├── index.tsx
│   │   └── show.tsx
│   └── dashboard/
│       └── index.tsx
└── layouts/
    └── app_layout.tsx

resources/
└── views/
    └── inertia_layout.edge
```

## Development

```bash
node ace serve --watch
pnpm dev
```

## Verify Installation

```ts
// start/routes.ts
router.get("/test", async (ctx) => {
  return ctx.inertia.render("test", { message: "Inertia works!" });
});
```

```tsx
// inertia/pages/test.tsx
export default function Test({ message }: { message: string }) {
  return <h1>{message}</h1>;
}
```
