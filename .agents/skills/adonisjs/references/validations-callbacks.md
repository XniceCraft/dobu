<overview>
Validate all request data with VineJS. Use model hooks for persistence concerns (hashing, normalization) but avoid complex workflows in hooks.
</overview>

<request_validation>
```ts
// app/validators/create_resource.ts
import vine from "@vinejs/vine";

export const createResourceValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(120),
    status: vine.enum(["draft", "active", "archived"]),
  }),
);
```

```ts
// app/controllers/resources_controller.ts
const payload = await request.validateUsing(createResourceValidator);
```
</request_validation>

<custom_messages>
```ts
export const createResourceValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(120),
  }),
  {
    messages: {
      "name.required": "Name is required",
      "name.minLength": "Name must be at least 2 characters",
    },
  },
);
```
</custom_messages>

<generated_validators>
If you use `@adocasts.com/dto`, you can generate validators from models:

```bash
node ace generate:validators
node ace make:validators resource
```
</generated_validators>

<model_hooks>
Use hooks for persistence concerns only:

```ts
import { BaseModel, column, beforeSave } from "@adonisjs/lucid/orm";
import hash from "@adonisjs/core/services/hash";

export default class User extends BaseModel {
  @column({ serializeAs: null })
  declare password: string;

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password);
    }
  }
}
```
</model_hooks>

<validation_best_practices>
- Validate in controllers, not in services
- Keep validators close to their resource
- Use enums for bounded values
- Do not trust `request.all()` directly
</validation_best_practices>

<anti_patterns>
- Skipping validation on create/update
- Re-validating the same payload in multiple layers
- Using model hooks for side effects (emails, external APIs)
</anti_patterns>
