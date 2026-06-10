# Workflow: Debug

<required_reading>
**Read these reference files NOW before debugging:**
1. references/anti-patterns.md
2. references/performance.md (if performance-related)
3. references/models.md (if model-related)
</required_reading>

<process>
## Step 1: Reproduce the Issue

Before fixing, confirm you can reproduce:

```bash
# Run the failing test
node ace test tests/functional/resources.spec.ts

# Or use the REPL
node ace repl
```

Document:
- Expected behavior
- Actual behavior
- Steps to reproduce

## Step 2: Isolate the Problem

Use the REPL to inspect data:

```ts
// REPL
import Resource from "#models/resource";
const resource = await Resource.find(123);
resource?.serialize();
```

Check validation and request payloads:

```ts
// In controller (temporary)
import logger from "@adonisjs/core/services/logger";
logger.debug({ payload: request.all() });
```

## Step 3: Add Strategic Debugging

Use logs, not long-lived console statements:

```ts
import logger from "@adonisjs/core/services/logger";

logger.info("Processing resource", {
  resourceId: resource.id,
  status: resource.status,
});
```

## Step 4: Check Common Causes

**Validation failures:**
```ts
try {
  await request.validateUsing(createResourceValidator);
} catch (error) {
  logger.error(error.messages);
}
```

**Missing preloads (N+1):**
```ts
// Fix by preloading
await Resource.query().preload("items");
```

**Auth or tenant scoping:**
```ts
// Check tenant set by middleware
logger.debug({ tenantId: ctx.tenant?.id });
```

**Migrations out of sync:**
```bash
node ace migration:status
```

## Step 5: Fix and Test

Make the minimal fix:

```ts
// Before
const total = items.reduce((sum, item) => sum + item.price, 0);

// After
const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
```

Add a regression test for the failure path.

## Step 6: Verify Fix

```bash
node ace test tests/functional/resources.spec.ts
pnpm lint
```
</process>

<anti_patterns>
Avoid:
- Fixing without reproducing first
- Changing multiple things at once
- Leaving debug logs in production paths
- Skipping regression tests
</anti_patterns>

<success_criteria>
Bug is fixed when:
- [ ] Root cause identified and documented
- [ ] Minimal fix applied
- [ ] Regression test written
- [ ] Original issue no longer reproduces
- [ ] No new test failures
- [ ] Debug statements removed
</success_criteria>
