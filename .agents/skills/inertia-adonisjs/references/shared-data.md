# Shared Data in Inertia (AdonisJS)

## Overview

Shared data is available to all pages without explicitly passing it in each response. Use it for auth, flash messages, and global config.

## Shared data in config

```ts
// config/inertia.ts
import { defineConfig } from "@adonisjs/inertia";

export default defineConfig({
  sharedData: {
    appName: "My App",
    user: (ctx) => ctx.auth?.user,
  },
});
```

## Share from middleware

```ts
// app/middleware/inertia_shared_props_middleware.ts
import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

export default class InertiaSharedPropsMiddleware {
  async handle({ inertia, auth, session }: HttpContext, next: NextFn) {
    inertia.share({
      auth: auth.user ? { id: auth.user.id, email: auth.user.email } : null,
      flash: {
        success: session.flashMessages.get("success"),
        error: session.flashMessages.get("error"),
      },
    });

    return next();
  }
}
```

Register the middleware in `start/kernel.ts` for web routes.

## Client-side access (React)

```tsx
import { usePage } from "@inertiajs/react";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { auth, flash } = usePage().props as any;

  return (
    <div>
      {flash?.success && <div className="alert success">{flash.success}</div>}
      {children}
    </div>
  );
}
```

## Performance warning

Shared props are included in every response. Keep them small.
