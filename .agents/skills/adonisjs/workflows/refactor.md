# Workflow: Refactor

<required_reading>
**Read these reference files NOW before refactoring:**
1. references/architecture.md
2. references/models.md
3. references/anti-patterns.md
</required_reading>

<process>
## Step 1: Ensure Test Coverage

Never refactor without tests:

```bash
node ace test tests/unit/resource.spec.ts
```

If no tests exist, write them first (see workflows/write-tests.md).

## Step 2: Identify the Smell

Common smells and fixes:

| Smell | Sign | Fix |
|-------|------|-----|
| Fat Controller | Logic in controller | Move to service |
| God Model | Too many responsibilities | Extract modules |
| Primitive Obsession | Hashes passed around | Create types |
| Long Method | Large multi-step method | Extract helpers |

## Step 3: Apply the Appropriate Pattern

### Fat Controller -> Thin Controller

```ts
// Before
async store({ request, response }: HttpContext) {
  const data = request.all();
  const resource = await Resource.create(data);
  await notify(resource);
  return response.created(resource);
}

// After
async store({ request, response }: HttpContext) {
  const data = await request.validateUsing(createResourceValidator);
  const resource = await new CreateResourceService().handle(data);
  return response.created({ data: new ResourceDto(resource) });
}
```

### Long Method -> Extract Methods

```ts
// Before
async process(resource: Resource) {
  if (!resource.name) return false;
  const normalized = resource.name.trim().toLowerCase();
  await resource.merge({ name: normalized }).save();
  await notify(resource);
  return true;
}

// After
async process(resource: Resource) {
  if (!this.isValid(resource)) return false;
  await this.normalize(resource);
  await this.afterProcess(resource);
  return true;
}
```

## Step 4: Refactor in Small Steps

1. Make one small change
2. Run tests
3. Repeat

```bash
node ace test tests/unit/resource.spec.ts
```

## Step 5: Clean Up

- Remove dead code
- Remove unused imports
- Ensure types are accurate

## Step 6: Verify

```bash
node ace test
pnpm lint
pnpm typecheck
```
</process>

<anti_patterns>
Avoid:
- Refactoring without tests
- Big-bang rewrites
- Changing behavior while refactoring
- Creating unnecessary abstractions
- Mixing refactor and feature work
</anti_patterns>

<success_criteria>
Refactor is complete when:
- [ ] All tests pass (same behavior)
- [ ] Code is more readable
- [ ] Controllers are thinner
- [ ] Business logic is in services/models
- [ ] Types are correct
- [ ] Lint clean
</success_criteria>
