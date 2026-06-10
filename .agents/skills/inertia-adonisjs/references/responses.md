# Inertia Responses (AdonisJS)

## Basic Response

```ts
// app/controllers/users_controller.ts
import type { HttpContext } from "@adonisjs/core/http";
import User from "#models/user";
import UserDto from "#dtos/user";

export default class UsersController {
  async index({ inertia, params }: HttpContext) {
    const user = await User.findOrFail(params.id);
    return inertia.render("users/index", { users: UserDto.fromArray(users) });
  }
}
```

The page name is resolved relative to `inertia/pages`.

## Serialization Warning

All props are JSON-serialized. Do not pass model instances or Date objects unless you transform them (DTOs or plain objects).

## Lazy and Optional Props

```ts
export default class ReportsController {
  async index({ inertia }: HttpContext) {
    return inertia.render("reports/index", {
      users: await User.all(),
      stats: () => computeStats(),
      audit: inertia.optional(() => loadAuditLog()),
    });
  }
}
```

## Partial Reloads (Client)

```tsx
import { Link } from "@inertiajs/react";

<Link href="/users" only={["users"]}>Refresh Users</Link>;
```

## Root Template Data

Pass a 3rd argument for root Edge template data:

```ts
import Post from "#models/post";

const post = await Post.findOrFail(params.id);
return inertia.render("posts/details", { post: post.serialize() }, {
  title: post.title,
  description: post.description,
});
```

## Redirects

```ts
return response.redirect().toRoute("users.index");
```

```ts
return inertia.location("https://adonisjs.com");
```

## Type Sharing

Use `InferPageProps` to type your page props from the controller:

```tsx
// inertia/pages/users/index.tsx
import type { InferPageProps } from "@adonisjs/inertia/types";
import type UsersController from "#controllers/users_controller";

export default function UsersIndexPage(
  props: InferPageProps<UsersController, "index">
) {
  return <div>{props.users.length}</div>;
}
```

When using DTOs, keep imports type-only:

```tsx
import type UserDto from "#dtos/user";

type Props = {
  user: UserDto;
};

export default function UsersShowPage({ user }: Props) {
  return <div>{user.name}</div>;
}
```

### Reference directives

In `inertia/app/app.ts`, add reference directives for module augmentation:

```ts
/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/auth.ts" />
/// <reference path="../../config/inertia.ts" />
```

### Type-level serialization

`InferPageProps` will serialize types (Date -> string):

```ts
props.users[0].createdAt; // string
```

### Model serialization caveat

Passing models results in a `ModelObject` type. Prefer DTOs or cast to a plain object.

```ts
const user = (await User.findOrFail(params.id)).serialize() as {
  id: number;
  name: string;
};

return inertia.render("users/edit", { user });
```

### Shared props typing

```ts
// config/inertia.ts
import { defineConfig } from "@adonisjs/inertia";
import type { InferSharedProps } from "@adonisjs/inertia/types";

const inertiaConfig = defineConfig({
  sharedData: {
    appName: "My App",
  },
});

export default inertiaConfig;

declare module "@adonisjs/inertia/types" {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {
    propsSharedFromMiddleware: number;
  }
}
```

```ts
import type { SharedProps } from "@adonisjs/inertia/types";
import { usePage } from "@inertiajs/react";

const page = usePage<SharedProps>();
page.props.appName;
```

Always use `import type` for backend-only types to avoid bundling server code in Vite.
