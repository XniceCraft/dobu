<overview>
Use DTOs for serialization. This repo uses `@adocasts.com/dto` to generate DTOs and validators from Lucid models.
</overview>

<setup>
```bash
node ace add @adocasts.com/dto
```

Define the DTO import path in `package.json`:

```json
{
  "imports": {
    "#dtos/*": "./app/dtos/*.js"
  }
}
```
</setup>

<generate_dtos>
```bash
# Generate DTOs for all models
node ace generate:dtos

# Generate DTOs and validators
node ace generate:dtos --validator

# Generate a single DTO (and validator)
node ace make:dto resource --validator
```
</generate_dtos>

<dto_example>
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
</dto_example>

<controller_usage>
```ts
// app/controllers/resources_controller.ts
import ResourceDto from "#dtos/resource";

const resource = await Resource.findOrFail(params.id);
return response.ok({ data: new ResourceDto(resource) });
```

```ts
const resources = await Resource.query().orderBy("created_at", "desc");
return response.ok({ data: ResourceDto.fromArray(resources) });
```
</controller_usage>

<pagination_helpers>
Use `fromPaginator` for paginated results:

```ts
const paginator = await Resource.query().paginate(1, 20);
const dto = ResourceDto.fromPaginator(paginator, { start: 1, end: 3 });
return response.ok(dto);
```
</pagination_helpers>

<anti_patterns>
- Returning full Lucid models directly
- Building ad-hoc JSON in controllers
- Skipping DTO generation and leaking sensitive fields
</anti_patterns>
