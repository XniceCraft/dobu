# Workflow: Create a New Page

<required_reading>
**Read these reference files NOW before creating pages:**
1. references/responses.md
2. references/links.md
</required_reading>

<process>
## Gather Requirements

1. **What is the page for?** (list, detail, dashboard)
2. **What data does it need?** (models, relationships)
3. **What actions can users take?** (links, buttons, forms)

## Step 1: Add Route

```ts
// start/routes.ts
import router from "@adonisjs/core/services/router";

router.get("/users", "#controllers/users_controller.index");
router.get("/users/:id", "#controllers/users_controller.show");
```

## Step 2: Create Controller

```ts
// app/controllers/users_controller.ts
import type { HttpContext } from "@adonisjs/core/http";
import User from "#models/user";
import UserDto from "#dtos/user";

export default class UsersController {
  async index({ inertia }: HttpContext) {
    const users = await User.query().orderBy("created_at", "desc");
    return inertia.render("users/index", {
      users: UserDto.fromArray(users),
      total: users.length,
    });
  }

  async show({ params, inertia }: HttpContext) {
    const user = await User.findOrFail(params.id);
    return inertia.render("users/show", {
      user: new UserDto(user),
    });
  }
}
```

## Step 3: Create Page Components

### List Page (React)

```tsx
// inertia/pages/users/index.tsx
import { Head, Link } from "@inertiajs/react";
import type { InferPageProps } from "@adonisjs/inertia/types";
import type UsersController from "#controllers/users_controller";

export default function Index(
  { users, total }: InferPageProps<UsersController, "index">
) {
  return (
    <>
      <Head title="Users" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users ({total})</h1>
        <Link href="/users/new" className="px-4 py-2 bg-blue-600 text-white rounded">
          New User
        </Link>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-500">No users yet.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <article key={user.id} className="bg-white p-4 rounded shadow">
              <Link href={`/users/${user.id}`}>
                <h2 className="text-xl font-semibold hover:text-blue-600">{user.name}</h2>
              </Link>
              <p className="text-gray-600 mt-2">{user.email}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
```

### Detail Page (React)

```tsx
// inertia/pages/users/show.tsx
import { Head, Link } from "@inertiajs/react";
import type { InferPageProps } from "@adonisjs/inertia/types";
import type UsersController from "#controllers/users_controller";

export default function Show(
  { user }: InferPageProps<UsersController, "show">
) {
  return (
    <>
      <Head title={user.name} />

      <div className="max-w-3xl mx-auto">
        <Link href="/users" className="text-blue-600 hover:underline">
          Back to Users
        </Link>

        <article className="mt-6">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <div className="mt-2 text-gray-500">{user.email}</div>
        </article>
      </div>
    </>
  );
}
```

## Step 4: Add Layout (Optional)

```tsx
// inertia/layouts/app_layout.tsx
import { Link } from "@inertiajs/react";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4">
        <Link href="/" className="font-bold">My App</Link>
      </nav>
      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
}
```
</process>

<anti_patterns>
Avoid:
- Mismatched page names vs file paths
- Returning model instances instead of DTOs/plain objects
- Using `<a>` tags for internal navigation
</anti_patterns>

<success_criteria>
Page is complete when:
- [ ] Route resolves and returns Inertia response
- [ ] Page component renders without errors
- [ ] Props are received correctly
- [ ] Navigation uses SPA-style transitions
</success_criteria>
