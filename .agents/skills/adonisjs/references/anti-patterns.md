<overview>
Avoid patterns that make AdonisJS code hard to maintain or insecure.
</overview>

<anti_pattern name="Skipping Validation">
**Problem:** Accepting raw input
```ts
// Bad
const payload = request.all();
await Resource.create(payload);
```
**Instead:** Validate with VineJS
```ts
const payload = await request.validateUsing(createResourceValidator);
await Resource.create(payload);
```
</anti_pattern>

<anti_pattern name="Fat Controller">
**Problem:** Business logic in controllers
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
const resource = await new CreateResourceService().handle(payload);
```
</anti_pattern>

<anti_pattern name="Returning Full Models">
**Problem:** Exposing internal fields
```ts
return response.ok(resource);
```
**Instead:** Use DTO
```ts
return response.ok({ data: new ResourceDto(resource) });
```
</anti_pattern>

<anti_pattern name="N+1 Queries">
**Problem:** Loading relations in a loop
```ts
const resources = await Resource.all();
for (const resource of resources) {
  await resource.related("items").query();
}
```
**Instead:** Preload
```ts
await Resource.query().preload("items");
```
</anti_pattern>

<anti_pattern name="No Tenant Scoping">
**Problem:** Missing tenant filter
```ts
const resources = await Resource.all();
```
**Instead:** Scope by tenant
```ts
const resources = await Resource.query().where("tenant_id", ctx.tenant.id);
```
</anti_pattern>
