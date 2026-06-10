<overview>
Multi-tenancy in AdonisJS is typically implemented with a `tenant_id` column and request-scoped tenant resolution. Enforce tenant scoping at the query layer.
</overview>

<tenant_resolution>
Resolve tenant from subdomain or header in middleware:

```ts
// app/middleware/tenant_middleware.ts
import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";
import Tenant from "#models/tenant";

export default class TenantMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const slug = ctx.request.header("x-tenant") || ctx.request.subdomains()[0];
    ctx.tenant = await Tenant.findByOrFail("slug", slug);
    return next();
  }
}
```
</tenant_resolution>

<query_scoping>
Apply tenant scoping in queries:

```ts
// app/models/resource.ts
import { BaseModel, column } from "@adonisjs/lucid/orm";
import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";

export default class Resource extends BaseModel {
  @column()
  declare tenantId: number;

  static forTenant(query: ModelQueryBuilderContract<typeof Resource>, tenantId: number) {
    query.where("tenant_id", tenantId);
  }
}
```

```ts
// app/controllers/resources_controller.ts
const query = Resource.query();
Resource.forTenant(query, ctx.tenant.id);
const resources = await query;
```
</query_scoping>

<data_integrity>
- Always set `tenant_id` on create
- Add database constraints and indexes for `tenant_id`
- Ensure background jobs include tenant context
</data_integrity>

<anti_patterns>
- Forgetting tenant scope in queries
- Relying only on controller checks
- Passing tenant objects around instead of IDs
</anti_patterns>
