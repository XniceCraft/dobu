# Workflow: Write Tests

<required_reading>
**Read these reference files NOW before writing tests:**
1. references/testing.md
2. references/models.md (for model tests)
3. references/controllers.md (for controller tests)
</required_reading>

<process>
## Step 1: Identify What to Test

**Unit tests** - Business logic, helpers, services:
```
tests/unit/resource.spec.ts
```

**Functional tests** - HTTP behavior:
```
tests/functional/resources.spec.ts
```

**Integration tests** - Multi-step workflows:
```
tests/integration/resource_workflow.spec.ts
```

## Step 2: Use Transactions for Isolation

```ts
// tests/unit/resource.spec.ts
import { test } from "@japa/runner";
import Database from "@adonisjs/lucid/services/db";

test.group("Resource", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("creates resource", async ({ assert }) => {
    const resource = await Resource.create({ name: "Test", status: "draft" });
    assert.exists(resource.id);
  });
});
```

## Step 3: Write Unit Tests

```ts
// tests/unit/services/create_resource.spec.ts
import { test } from "@japa/runner";
import CreateResourceService from "#services/resources/create_resource_service";

test("creates resource with valid payload", async ({ assert }) => {
  const service = new CreateResourceService();
  const resource = await service.handle({ name: "Doc", status: "draft" });
  assert.equal(resource.name, "Doc");
});
```

## Step 4: Write Functional Tests

```ts
// tests/functional/resources.spec.ts
import { test } from "@japa/runner";

test.group("Resources", () => {
  test("GET /resources returns 200", async ({ client }) => {
    const response = await client.get("/resources");
    response.assertStatus(200);
  });

  test("POST /resources validates input", async ({ client }) => {
    const response = await client.post("/resources").json({ name: "" });
    response.assertStatus(422);
  });
});
```

## Step 5: Run and Verify

```bash
# Run specific test file
node ace test tests/unit/resource.spec.ts

# Run all tests
node ace test
```
</process>

<anti_patterns>
Avoid:
- Testing implementation details
- Mocking everything (prefer real models)
- Long setup blocks (use factories/helpers)
- Testing private methods directly
- Leaving database state dirty
</anti_patterns>

<success_criteria>
Tests are complete when:
- [ ] All public methods have tests
- [ ] Edge cases covered (nil, empty, boundaries)
- [ ] Happy path and error paths tested
- [ ] Tests run fast and deterministic
- [ ] `node ace test` passes
</success_criteria>
