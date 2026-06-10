<overview>
Performance in AdonisJS is mostly about efficient queries, small responses, and avoiding unnecessary work in the request lifecycle.
</overview>

<query_optimization>
```ts
// Avoid N+1
const resources = await Resource.query().preload("items");

// Select only needed columns
const list = await Resource.query().select(["id", "name", "status"]);

// Paginate large datasets
const page = request.input("page", 1);
const results = await Resource.query().paginate(page, 20);
```
</query_optimization>

<indexes>
Add indexes for common filters and ordering:

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
</indexes>

<caching>
Use Redis for expensive computations:

```ts
import redis from "@adonisjs/redis/services/main";
import Resource from "#models/resource";

export async function getPopularResources() {
  const key = "resources:popular";
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const resources = await Resource.query().orderBy("views", "desc").limit(10);
  await redis.setex(key, 300, JSON.stringify(resources.map((r) => r.serialize())));
  return resources.map((r) => r.serialize());
}
```
</caching>

<response_optimization>
Serialize only what the client needs and avoid deep nesting.
</response_optimization>

<background_work>
Move slow tasks to background jobs and respond quickly.
</background_work>

<anti_patterns>
- N+1 queries
- Loading full records when only a subset is needed
- Returning large nested payloads by default
- Doing heavy work inside HTTP requests
</anti_patterns>
