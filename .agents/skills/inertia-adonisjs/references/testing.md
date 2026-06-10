# Testing Inertia (AdonisJS)

## Configure test helpers

```ts
// tests/bootstrap.ts
import { assert } from "@japa/assert";
import app from "@adonisjs/core/services/app";
import { pluginAdonisJS } from "@japa/plugin-adonisjs";
import { apiClient } from "@japa/api-client";
import { inertiaApiClient } from "@adonisjs/inertia/plugins/api_client";

export const plugins = [
  assert(),
  pluginAdonisJS(app),
  apiClient(),
  inertiaApiClient(app),
];
```

## Basic Inertia test

```ts
import { test } from "@japa/runner";

test("GET /home returns Inertia response", async ({ client }) => {
  const response = await client.get("/home").withInertia();

  response.assertStatus(200);
  response.assertInertiaComponent("home");
  response.assertInertiaProps({ user: { name: "julien" } });
});
```

## Partial assertions

```ts
test("props contain users", async ({ client }) => {
  const response = await client.get("/users").withInertia();

  response.assertInertiaPropsContains({ users: [] });
});
```

## Access response data

```ts
const response = await client.get("/home").withInertia();
console.log(response.inertiaComponent);
console.log(response.inertiaProps);
```
