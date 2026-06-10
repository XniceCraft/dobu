<overview>
Lucid models represent your data and relationships. Keep persistence logic here and avoid leaking database details into controllers.
</overview>

<model_structure>
```ts
// app/models/resource.ts
import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import Item from "#models/item";

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare status: "draft" | "active" | "archived";

  @hasMany(() => Item)
  declare items: HasMany<typeof Item>;
}
```
</model_structure>

<relationships>
```ts
import { belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import Organization from "#models/organization";

@belongsTo(() => Organization)
declare organization: BelongsTo<typeof Organization>;
```
</relationships>

<scopes_and_queries>
Use query scopes for reusable filters:

```ts
import { BaseModel, column, scope } from "@adonisjs/lucid/orm";
import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";

export default class Resource extends BaseModel {
  @column()
  declare status: string;

  static active = scope((query: ModelQueryBuilderContract<typeof Resource>) => {
    query.where("status", "active");
  });
}

// Usage
await Resource.query().apply((scopes) => scopes.active());
```
</scopes_and_queries>

<transactions>
Wrap multi-step persistence in transactions:

```ts
import Database from "@adonisjs/lucid/services/db";

await Database.transaction(async (trx) => {
  const resource = await Resource.create({ name: "Doc" }, { client: trx });
  await Item.create({ resourceId: resource.id, name: "Item" }, { client: trx });
});
```
</transactions>

<hooks>
Use hooks for persistence concerns, not business workflows:

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
</hooks>

<serialization>
Hide sensitive fields with `serializeAs: null` and prefer DTOs:

```ts
@column({ serializeAs: null })
declare password: string;
```
</serialization>

<anti_patterns>
- Writing raw SQL in controllers
- Loading large datasets without pagination
- Using hooks for side-effect heavy workflows
</anti_patterns>
