# Workflow: Build Feature

<required_reading>
**Read these reference files NOW before building:**
1. references/architecture.md
2. references/controllers.md
3. references/models.md
4. references/serialization.md
</required_reading>

<process>
## Step 1: Understand the Feature

Before writing code:
- What resource/domain concept does this feature operate on?
- Does a model already exist, or do we need a new one?
- What is the API contract (endpoints, request/response shapes)?
- Does it touch existing models that need modification?

## Step 2: Generate Model or Migration

```bash
# New model with migration
node ace make:model Resource -m

# Or only a migration
node ace make:migration add_status_to_resources
```

Run migration:
```bash
node ace migration:run
```

## Step 3: Write Model Logic

Use Lucid models for persistence and relationships:

```ts
// app/models/resource.ts
import { BaseModel, column } from "@adonisjs/lucid/orm";

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare status: "draft" | "active" | "archived";
}
```

If there is business logic, prefer a service:

```ts
// app/services/resources/create_resource_service.ts
import Resource from "#models/resource";
import type { CreateResourcePayload } from "#types/resources";

export default class CreateResourceService {
  async handle(payload: CreateResourcePayload) {
    return Resource.create(payload);
  }
}
```

## Step 4: Add Validation (VineJS)

```ts
// app/validators/resource.ts
import vine from "@vinejs/vine";

export const createResourceValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(120),
    status: vine.enum(["draft", "active", "archived"]),
  }),
);
```

## Step 5: Write Controller

Controllers orchestrate validation and responses:

```ts
// app/controllers/resources_controller.ts
import type { HttpContext } from "@adonisjs/core/http";
import Resource from "#models/resource";
import ResourceDto from "#dtos/resource";
import { createResourceValidator } from "#validators/resource";

export default class ResourcesController {
  async index({ response }: HttpContext) {
    const resources = await Resource.query().orderBy("created_at", "desc");
    return response.ok({ data: ResourceDto.fromArray(resources) });
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createResourceValidator);
    const resource = await Resource.create(payload);
    return response.created({ data: new ResourceDto(resource) });
  }
}
```

## Step 6: Add DTO

Use DTOs to control response shape:

```ts
// app/dtos/resource.ts
import { BaseModelDto } from "@adocasts.com/dto/base";
import Resource from "#models/resource";

export default class ResourceDto extends BaseModelDto {
  declare id: number;
  declare name: string;
  declare status: "draft" | "active" | "archived";
  declare createdAt: string;

  constructor(resource?: Resource) {
    super();
    if (!resource) return;
    this.id = resource.id;
    this.name = resource.name;
    this.status = resource.status;
    this.createdAt = resource.createdAt?.toISO() || "";
  }
}
```

## Step 7: Add Routes

```ts
// start/routes.ts
import router from "@adonisjs/core/services/router";

router.resource("resources", "#controllers/resources_controller").apiOnly();
```

## Step 8: Write Tests

```ts
// tests/functional/resources.spec.ts
import { test } from "@japa/runner";

test.group("Resources", () => {
  test("GET /resources returns 200", async ({ client }) => {
    const response = await client.get("/resources");
    response.assertStatus(200);
  });

  test("POST /resources creates resource", async ({ client }) => {
    const response = await client.post("/resources").json({
      name: "New Resource",
      status: "draft",
    });

    response.assertStatus(201);
  });
});
```

## Step 9: Verify

```bash
node ace test tests/functional/resources.spec.ts
pnpm typecheck
pnpm lint
```
</process>

<anti_patterns>
Avoid:
- Skipping validation and trusting request input
- Putting raw SQL or complex logic in controllers
- Returning full Lucid models without serialization
- Creating routes without tests
- Changing multiple models without a migration
</anti_patterns>

<success_criteria>
Feature is complete when:
- [ ] Model validates correctly
- [ ] Controller is thin and readable
- [ ] Serializer returns safe data
- [ ] Routes are RESTful
- [ ] Tests pass
- [ ] Lint and typecheck are clean
</success_criteria>
