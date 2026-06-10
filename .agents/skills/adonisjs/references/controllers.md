<overview>
Controllers are thin coordinators. They handle HTTP concerns (params, auth, response format) and delegate to services or models. Avoid business logic inside controllers.
</overview>

<controller_structure>
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

  async show({ params, response }: HttpContext) {
    const resource = await Resource.findOrFail(params.id);
    return response.ok({ data: new ResourceDto(resource) });
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createResourceValidator);
    const resource = await Resource.create(payload);
    return response.created({ data: new ResourceDto(resource) });
  }

  async update({ params, request, response }: HttpContext) {
    const resource = await Resource.findOrFail(params.id);
    const payload = await request.validateUsing(createResourceValidator);
    await resource.merge(payload).save();
    return response.ok({ data: new ResourceDto(resource) });
  }

  async destroy({ params, response }: HttpContext) {
    const resource = await Resource.findOrFail(params.id);
    await resource.delete();
    return response.noContent();
  }
}
```
</controller_structure>

<filter_chaining>
Use small helpers to keep controllers readable:

```ts
function applyStatusFilter(query: any, status?: string) {
  if (status) query.where("status", status);
}

export default class ResourcesController {
  async index({ request, response }: HttpContext) {
    const query = Resource.query().orderBy("created_at", "desc");
    applyStatusFilter(query, request.input("status"));
    const resources = await query;
    return response.ok({ data: ResourceDto.fromArray(resources) });
  }
}
```
</filter_chaining>

<base_controller>
If you need shared behavior, create a base controller:

```ts
// app/controllers/api_controller.ts
import type { HttpContext } from "@adonisjs/core/http";

export default class ApiController {
  protected ok(ctx: HttpContext, data: unknown) {
    return ctx.response.ok({ data });
  }
}

// app/controllers/resources_controller.ts
import ApiController from "#controllers/api_controller";

export default class ResourcesController extends ApiController {}
```
</base_controller>

<nested_routes>
Organize controllers by route hierarchy:

```ts
// start/routes.ts
import router from "@adonisjs/core/services/router";

router.group(() => {
  router.resource("organizations", "#controllers/organizations_controller").apiOnly();
  router.resource("organizations.resources", "#controllers/org/resources_controller").apiOnly();
}).prefix("/api/v1");
```

Controller layout:
```
app/controllers/
├── organizations_controller.ts
└── org/
    └── resources_controller.ts
```
</nested_routes>

<routing_preferences>
Prefer REST actions over custom routes. Add custom actions only for distinct workflows:

```ts
router.resource("resources", "#controllers/resources_controller").apiOnly();
router.post("resources/:id/publish", "#controllers/resources_controller.publish");
```
</routing_preferences>

<crud_patterns>
**Create:**
```ts
const payload = await request.validateUsing(createResourceValidator);
const resource = await Resource.create(payload);
return response.created({ data: new ResourceDto(resource) });
```

**Update:**
```ts
const resource = await Resource.findOrFail(params.id);
const payload = await request.validateUsing(updateResourceValidator);
await resource.merge(payload).save();
return response.ok({ data: new ResourceDto(resource) });
```

**Destroy:**
```ts
const resource = await Resource.findOrFail(params.id);
await resource.delete();
return response.noContent();
```
</crud_patterns>

<response_codes>
```ts
response.ok(data);                 // 200
response.created(data);            // 201
response.noContent();              // 204
response.badRequest(error);        // 400
response.unauthorized(error);      // 401
response.forbidden(error);         // 403
response.notFound(error);          // 404
response.unprocessableEntity(error); // 422
```
</response_codes>

<anti_patterns>
<anti_pattern name="Fat Controller">
**Problem:** Business logic in controller
```ts
// Bad
async store({ request, response }: HttpContext) {
  const data = request.all();
  const resource = await Resource.create(data);
  await notify(resource);
  return response.created(resource);
}
```
**Instead:** Move to service
```ts
async store({ request, response }: HttpContext) {
  const data = await request.validateUsing(createResourceValidator);
  const resource = await new CreateResourceService().handle(data);
  return response.created({ data: new ResourceDto(resource) });
}
```
</anti_pattern>

<anti_pattern name="Custom JSON in Controller">
**Problem:** Building JSON directly in controller
```ts
return response.ok({
  id: resource.id,
  name: resource.name,
  items: resource.items.map((i) => ({ id: i.id, name: i.name })),
});
```
**Instead:** Use DTO
```ts
return response.ok({ data: new ResourceDto(resource) });
```
</anti_pattern>
</anti_patterns>
