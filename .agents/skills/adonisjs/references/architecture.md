<overview>
AdonisJS favors a modular, TypeScript-first architecture. Controllers handle HTTP concerns, services encapsulate business logic, and Lucid models manage persistence. Keep layers explicit and avoid mixing HTTP concerns with domain logic.
</overview>

<directory_structure>
```
app/
├── controllers/           # HTTP handlers
├── middleware/            # Cross-cutting concerns
├── models/                # Lucid models
├── services/              # Business logic
├── validators/            # VineJS validators
├── dtos/                  # DTOs for responses
├── policies/              # Authorization rules
├── commands/              # Ace commands
└── listeners/             # Event listeners
config/                    # App configuration
database/
├── migrations/
├── seeders/
└── factories/
start/
├── routes.ts              # Route definitions
└── kernel.ts              # Middleware registration
tests/                     # Japa test suites
```
</directory_structure>

<adonisjs_philosophy>
**Clear boundaries** keep the codebase predictable:

1. **Controllers orchestrate** - parse input, call services, return responses
2. **Services own workflows** - multi-step domain logic
3. **Models own persistence** - Lucid queries and relationships
4. **Validators guard entry points** - VineJS on every request
5. **Middleware handles cross-cutting concerns** - auth, rate limits, tenants

<what_not_to_do>
- Do not put raw SQL in controllers
- Do not skip request validation
- Do not return full model objects without serialization
- Do not embed HTTP-specific logic inside services
</what_not_to_do>
</adonisjs_philosophy>

<layered_architecture>
```
┌────────────────────────────────────┐
│ Controllers                         │  <- HTTP concerns
├────────────────────────────────────┤
│ Services                            │  <- Business workflows
├────────────────────────────────────┤
│ Models (Lucid)                       │  <- Persistence and relations
├────────────────────────────────────┤
│ Database                             │  <- Storage
└────────────────────────────────────┘
```

**Layer responsibilities:**
- **Controllers**: request parsing, validation, response shaping
- **Services**: orchestration and domain decisions
- **Models**: data access and associations
</layered_architecture>

<request_context>
Use `HttpContext` as the request context, not global state:

```ts
// app/controllers/resources_controller.ts
import type { HttpContext } from "@adonisjs/core/http";

export default class ResourcesController {
  async index({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail();
    const status = request.input("status");
    // use user and status
  }
}
```
</request_context>

<service_pattern>
For multi-step workflows, use a service class:

```ts
// app/services/resources/publish_resource_service.ts
import Resource from "#models/resource";

export default class PublishResourceService {
  async handle(resourceId: number) {
    const resource = await Resource.findOrFail(resourceId);
    resource.status = "active";
    await resource.save();
    return resource;
  }
}
```
</service_pattern>

<decision_tree>
**When to use each pattern:**

| Situation | Pattern |
|-----------|---------|
| Simple CRUD | Controller + Model |
| Multi-step workflow | Service |
| Shared behavior | Utility module or service |
| Request context | HttpContext |
| Authorization | Policies + middleware |
| Heavy work | Background job |
</decision_tree>
