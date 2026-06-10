# Workflow: Optimize Performance

<required_reading>
**Read these reference files NOW before optimizing:**
1. references/performance.md
2. references/models.md (for query optimization)
3. references/controllers.md (for response optimization)
</required_reading>

<process>
## Step 1: Identify the Bottleneck

Do not optimize blindly. Measure first:

```ts
// config/database.ts
// Enable debug in development to inspect queries
debug: true,
```

Check logs for slow queries and repeated access patterns.

## Step 2: Fix N+1 Queries

```ts
// Bad: N+1
const resources = await Resource.all();
for (const resource of resources) {
  await resource.related("items").query();
}

// Good: preload associations
const resources = await Resource.query().preload("items");
```

## Step 3: Add Database Indexes

```ts
// database/migrations/xxxx_add_indexes_to_resources.ts
import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable("resources", (table) => {
      table.index(["status"], "resources_status_index");
      table.index(["created_at"], "resources_created_at_index");
    });
  }
}
```

## Step 4: Reduce Payload Size

```ts
// Select only needed columns
const resources = await Resource.query()
  .select(["id", "name", "status"])
  .orderBy("created_at", "desc");
```

## Step 5: Add Caching (If Needed)

```ts
// app/services/cache_service.ts
import redis from "@adonisjs/redis/services/main";
import Resource from "#models/resource";

export async function getResourceCount() {
  const key = "resources:count";
  const cached = await redis.get(key);
  if (cached) return Number(cached);

  const count = await Resource.query().count("id as total");
  const total = Number(count[0].$extras.total);
  await redis.setex(key, 300, total.toString());
  return total;
}
```

## Step 6: Move Heavy Work to Background Jobs

If a request triggers slow external calls or heavy work, enqueue a job instead.

## Step 7: Verify Improvements

Measure before and after:

```bash
# Compare response time and query count
node ace test tests/functional/resources.spec.ts
```
</process>

<anti_patterns>
Avoid:
- Premature optimization without metrics
- Over-indexing (indexes slow writes)
- Caching without invalidation strategy
- Loading associations you do not use
- Returning full models with large payloads
</anti_patterns>

<success_criteria>
Optimization is complete when:
- [ ] Bottleneck identified with data
- [ ] N+1 queries eliminated
- [ ] Appropriate indexes added
- [ ] Query count reduced
- [ ] Response time improved (measured)
- [ ] Tests still pass
</success_criteria>
