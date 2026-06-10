# Inertia Forms (React)

## useForm Hook

Use `useForm<T>` only when it adds clarity (nested data or `File | null`). For simple forms, skip the generic.

```tsx
import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

export default function CreateUser() {
const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    post("/users", { onSuccess: () => reset("password") });
  }

  return (
    <form onSubmit={submit}>
      <input value={data.name} onChange={(e) => setData("name", e.target.value)} />
      {errors.name && <span>{errors.name}</span>}

      <input value={data.email} onChange={(e) => setData("email", e.target.value)} />
      {errors.email && <span>{errors.email}</span>}

      <button type="submit" disabled={processing}>Create</button>
    </form>
  );
}
```

## File Uploads (Typed Example)

```tsx
const { data, setData, post, progress } = useForm<{
  avatar: File | null;
  company: { name: string };
}>({
  avatar: null,
  company: { name: "" },
});

<input type="file" onChange={(e) => setData("avatar", e.target.files?.[0] || null)} />;
{progress && <progress value={progress.percentage} max={100} />}
```

## Error Handling

`useForm` reads validation errors from a 422 response:

```ts
return response.unprocessableEntity({ errors: error.messages });
```
