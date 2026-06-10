# Workflow: Build Forms with Validation

<required_reading>
**Read these reference files NOW before building forms:**
1. references/forms.md
2. references/validation.md
</required_reading>

<process>
## Gather Requirements

1. **What resource?** (User, Post, Comment)
2. **Create or Edit?** (new record vs existing)
3. **What fields?** (name, email, file upload)
4. **What validations?** (required, format, length)

## Step 1: Add Routes

```ts
// start/routes.ts
import router from "@adonisjs/core/services/router";

router.get("/users/new", "#controllers/users_controller.new");
router.post("/users", "#controllers/users_controller.store");
```

## Step 2: Create Validator

```ts
// app/validators/user.ts
import vine from "@vinejs/vine";

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(120),
    email: vine.string().email(),
    password: vine.string().minLength(8),
  }),
);
```

## Step 3: Create Controller Actions

```ts
// app/controllers/users_controller.ts
import type { HttpContext } from "@adonisjs/core/http";

import User from "#models/user";

import { createUserValidator } from "#validators/user";

export default class UsersController {
  async new({ inertia }: HttpContext) {
    return inertia.render("users/new");
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator);
    
    await User.create(payload);

    return response.redirect().toPath("/users");
  }
}
```

## Step 4: Create Form Component (React)

```tsx
// inertia/pages/users/create.tsx
import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

export default function CreateUserPage() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    post("/users");
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={processing}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {processing ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```
</process>

<anti_patterns>
Avoid:
- Skipping server-side validation
- Hiding validation errors from the UI
- Posting to the wrong route
</anti_patterns>

<success_criteria>
Form is complete when:
- [ ] Form renders without errors
- [ ] Validation errors display under fields
- [ ] Form preserves data on failure
- [ ] Submit button disabled while processing
</success_criteria>
