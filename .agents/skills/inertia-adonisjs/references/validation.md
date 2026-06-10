# Validation with Inertia (AdonisJS)

## How It Works

Inertia reads validation errors from a 422 response and populates `useForm().errors` on the client.

## Server-Side Validation (VineJS)

```ts
// app/validators/user.ts
import vine from "@vinejs/vine";

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2),
    email: vine.string().email(),
  }),
);
```

```ts
// app/controllers/users_controller.ts
import type { HttpContext } from "@adonisjs/core/http";
import { createUserValidator } from "#validators/user";

export default class UsersController {
  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createUserValidator);
      // ... create user
      return response.redirect().toPath("/users");
    } catch (error) {
      if (error.code === "E_VALIDATION_ERROR") {
        return response.unprocessableEntity({ errors: error.messages });
      }
      throw error;
    }
  }
}
```

## Client-Side Display (React)

Use `useForm<T>` only when you need explicit typing (nested data, `File | null`).

```tsx
import { useForm } from "@inertiajs/react";

const { data, setData, post, errors } = useForm({ name: "", email: "" });

{errors.name && <span>{errors.name}</span>}
```

## Error Bags

For multiple forms on the same page, use error bags on the client to separate errors.
