<overview>
AdonisJS uses Japa for testing. Prefer unit tests for logic and functional tests for HTTP behavior. Use database transactions for isolation.
</overview>

<test_structure>
```
tests/
├── unit/
├── functional/
└── integration/
```
</test_structure>

<unit_tests>
```ts
// tests/unit/resource.spec.ts
import { test } from "@japa/runner";
import Resource from "#models/resource";

test("resource defaults to draft", async ({ assert }) => {
  const resource = await Resource.create({ name: "Doc", status: "draft" });
  assert.equal(resource.status, "draft");
});
```
</unit_tests>

<functional_tests>
```ts
// tests/functional/resources.spec.ts
import { test } from "@japa/runner";

test("GET /resources returns 200", async ({ client }) => {
  const response = await client.get("/resources");
  response.assertStatus(200);
});
```
</functional_tests>

<database_isolation>
```ts
import Database from "@adonisjs/lucid/services/db";

test.group("Resource", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });
});
```
</database_isolation>

<best_practices>
- Test behavior, not implementation details
- Keep setup minimal
- Use factories/helpers for data creation
- Cover edge cases and error paths
</best_practices>
