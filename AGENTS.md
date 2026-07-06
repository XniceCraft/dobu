# AGENTS.md

## 1. Project Overview

### 1.1 About This Project

Drink tracking app by connecting via bluetooth

### 1.2 Tech Stack

- **Backend** :
  - **Framework**   : AdonisJS V7
  - **ORM**         : Lucid ORM
  - **Validator**   : VineJS
- **Frontend** :
  - **Framework**   : Inertia.js + React 19
  - **Styling**     : TailwindCSS V4 (no tailwind.config.{ts,js})
  - **UI Library**  : Shadcn UI
  - **Form**        : React-hook-form
  - **Validator**   : Zod
- **Package Manager** : pnpm

## 2. Folder Structure

```text
app/
  controllers/           # HTTP controllers — thin, delegate to services
  exceptions/            # AdonisJS exception handler
  middleware/            # Built-in middleware and custom middleware
  models/                # Lucid models (extended from database/schema.ts)
  services/              # Business logic lives here, NOT in controllers or models
  transformers/          # Serialization for backend data to inertia frontend (AdonisJS v7)
  validators/            # VineJS validators (one file per model/context. eg. in user.ts consists of createUserValidator, updateUserValidator)
bin/                     # AdonisJS binary
build/                   # AdonisJS build output
config/                  # Application configuration
database/                # Database-related files
  migrations/            # Database migrations
  seeders/               # Database seeders
  schema.ts              # AdonisJS generated schema (use node ace schema:generate)
inertia/                 # Inertia frontend
  app/
    css/                 # Tailwind v4 CSS
    pages/               # Inertia page components (React). Following Next.JS App Router structure
    components/          # Shared/reusable React components
        ui/              # Shadcn only components
        {group}/         # User defined components based on group (e.g. dialog, layout, button, form, field, etc)
    hooks/               # Custom hooks
    lib/                 # Library code
      validators/        # Zod Validators for React-hook-form
    providers/           # React Providers
    types/               # Shared TS types/interfaces
  app.tsx                # Client entry
  ssr.tsx                # SSR entry
providers/               # AdonisJS App Providers
public/                  # Public assets
resources/
    views/               # HTML templates (Edge.JS)
start/
  env.ts                 # env parser for AdonisJS App. Accessed by `import env from '#start/env'`
  routes.ts              # Routes
  kernel.ts              # Kernel
```

## 3. Import Alias

Do not use relative imports (`../../..`) when an alias exists for that path. Always check `package.json` "imports" and `tsconfig.json` "paths" before writing an import.

### 3.1. Backend

Backend import aliases are defined in `package.json` "imports" section.

```json
"imports": {
    "#controllers/*": "./app/controllers/*.js",
    "#exceptions/*": "./app/exceptions/*.js",
    "#models/*": "./app/models/*.js",
    "#mails/*": "./app/mails/*.js",
    "#services/*": "./app/services/*.js",
    "#listeners/*": "./app/listeners/*.js",
    "#events/*": "./app/events/*.js",
    "#generated/*": "./.adonisjs/server/*.js",
    "#middleware/*": "./app/middleware/*.js",
    "#transformers/*": "./app/transformers/*.js",
    "#validators/*": "./app/validators/*.js",
    "#providers/*": "./providers/*.js",
    "#policies/*": "./app/policies/*.js",
    "#abilities/*": "./app/abilities/*.js",
    "#database/*": "./database/*.js",
    "#tests/*": "./tests/*.js",
    "#start/*": "./start/*.js",
    "#config/*": "./config/*.js"
  },
```

### 3.2. Frontend (React)

### Frontend (Vite/TS aliases, from `tsconfig.json` + `vite.config.ts`)

```json
"paths": {
  "@/*": ["./inertia/*"]
}
```

Usage: `import { Button } from '@/components/button'` — not `import { Button } from '../../components/button'`.

If components is local (per page component), use relative import.
Example: in pages/home/index.tsx `import { HeroSection } from './_components/hero-section'`.

## 4. Code Convention

### 4.1. Backend

### A. Controllers

- Controllers only: parse input → call validator → call service → return Inertia response / response with code (e.g. response.forbidden(), response.notFound()).
- No raw business logic, no direct multi-step DB orchestration in controllers.
- Use resource-style (based on Laravel) naming convention: `index`, `store`, `show`, `update`, `destroy`.

```ts
// app/controllers/posts_controller.ts
export default class PostsController {
  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)
    const post = await PostService.create(auth.user!, payload)

    return response.redirect().toRoute('posts.show', { id: post.id })
  }
}
```

### B. Transformers

Transformers give you explicit control over API responses. This approach offers several benefits:

- You can keep sensitive information out of responses
- Apply consistent formatting rules across your application
- Shape responses around your frontend's needs rather than your database structure
- Generate TypeScript types that your frontend can reference directly

**Basic Example:**

```ts
// app/transformers/user_transformer.ts
import { BaseTransformer } from '@adonisjs/core/transformers'

import type User from '#models/user'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'email',
      'createdAt',
      'updatedAt',
    ])
  }
}
```

**Advanced Example (Using Variants):**

```ts
// app/transformers/posts_transformer.ts
import { BaseTransformer } from '@adonisjs/core/transformers'
import UserTransformer from '#transformers/user_transformer'

import type Post from '#models/post'

export default class PostTransformer extends BaseTransformer<Post> {
  /**
   * Default variant for listing posts
   */
  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'title', 'createdAt', 'updatedAt']),
      author: UserTransformer.transform(this.resource.author)
    }
  }

  /**
   * Detailed variant for showing a single post
   * Includes the full content with markdown converted to HTML
   */
  async forDetailedView() {
    return {
      ...this.toObject(),
      content: await markdownToHtml(this.resource.content)
    }
  }
}
```

**Usage in Controller:**

```ts
// app/controllers/posts_controller.ts
import PostTransformer from '#transformers/posts_transformer'

export default class PostsController {
  async index({ inertia }) {
    const posts = await Post.query().preload('author')

    return inertia.render('posts/index', {
      posts: PostTransformer.transform(posts)
    })
  }

  // With Pagination
  async index({ inertia, request }) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const posts = await Post.query().preload('author').paginate(page, Math.min(limit, 25))

    return inertia.render('posts/index', {
      posts: PostTransformer.transform(posts.all(), posts.getMeta())
    })
  }

  async show({ params, inertia }) {
    const post = await Post.query().preload('author').where('id', params.id).first()

    return inertia.render('posts/show', {
      post: PostTransformer.transform(post).useVariant('forDetailedView')
    })
  }

}
```

### C. Services

- One class or set of functions per domain concern (e.g. `PostService`).
- Services own transactions, cross-model orchestration, external API calls.
- Services should be independently testable without an HTTP context.

### D. Models (Lucid ORM)

- All models in `#models/{models}` extended from `#database/schema.ts`
- Use `@beforeSave`/`prepare`, `consume`, and `serialize` hooks deliberately:
  - `prepare`: transform before writing to DB (e.g. hashing, normalizing).
  - `consume`: transform when reading from DB into the model instance.

### E. Validators (VineJS)

- One validator file per domain: `#validators/{domain}.ts`, e.g. `#validators/user.ts`, `#validators/post.ts`.
- Never inline in controllers.

**Source**: <https://vinejs.dev/docs/schema_101>

Example reusing VineJS Schema

```ts
const userSchema = vine.object({
  username: vine.string()
})

const postSchema = vine.object({
  title: vine.string(),
  author: userSchema.clone().nullable()
})
```

Example of using existing object properties

```ts
const userSchema = vine.object({
  username: vine.string()
})

const postSchema = vine.object({
  title: vine.string(),
  author: vine.object({
    ...userSchema.getProperties(),
    id: vine.number(),
  })
})
```

Example using pick and omit properties

```ts
const userSchema = vine.object({
  id: vine.number(),
  username: vine.string(),
  email: vine.string().email(),
  password: vine.string(),
  role: vine.string()
})

const publicUserSchema = vine.object({
  ...userSchema.pick(['id', 'username', 'email']),
})
```

Example using omit properties

```ts
const userSchema = vine.object({
  id: vine.number(),
  username: vine.string(),
  email: vine.string().email(),
  password: vine.string(),
  role: vine.string()
})

const publicUserSchema = vine.object({
  ...userSchema.omit(['password', 'role'])
})
```

Example of using partial properties

```ts
export const createUserValidator = vine.create({
  id: vine.number(),
  username: vine.string(),
  email: vine.string().email(),
  password: vine.string(),
  role: vine.string()
})

export const updateUserValidator = vine.create(
  createUserValidator.schema.partial()
)
```

Example using partial properties with array

```ts
export const createUserValidator = vine.create({
  id: vine.number(),
  username: vine.string(),
  email: vine.string().email(),
  password: vine.string(),
  role: vine.string()
})

export const updateUserValidator = vine.create(
  createUserValidator.schema.partial(['email', 'username'])
)
```

Example using partial and omit properties

```ts
export const createUserValidator = vine.create({
  id: vine.number(),
  username: vine.string(),
  email: vine.string().email(),
  password: vine.string(),
  role: vine.string()
})

export const updateUserValidator = vine.create(
  createUserValidator
    .schema
    .partial(['email', 'username'])
    .omit(['password'])
)
```

### 4.2. Frontend

### A. TypeScript

- No `any`. If a shape is genuinely unknown, use `unknown` and narrow.
- Use `import type { X } from '...'` for type-only imports
- Shared types live in `inertia/types/`
- Prefer use function components instead of const

### B. Tailwind CSS

- This project uses **Tailwind v4**. Theme is configured via CSS using `@import "tailwindcss"` and `@theme` blocks in the main CSS file (e.g. `inertia/css/app.css`).
- Do not create a `tailwind.config.js`/`.ts` from muscle memory; check whether one exists before adding tokens there.
- Design tokens (colors, spacing, radius, fonts) are defined as CSS custom properties inside `@theme { ... }`, not in a JS config object. Example:

```css
  @theme {
    --color-brand: oklch(0.6 0.2 250);
    --radius-card: 0.75rem;
  }
```

- Utility classes only in JSX; no ad-hoc inline styles unless the value is genuinely dynamic/computed (e.g. runtime transforms, drag positions).
- Don't hardcode hex/px values in components — reference the `@theme` token (e.g. `bg-brand`, `rounded-card`) so theme changes stay centralized.

**Note**: Always use `import { cn } from '@/lib/utils'` for combining tailwind classes. This utils came from Shadcn UI

### C. Shadcn UI

- Components come from `pnpm dlx shadcn@latest add <component>` and land in `inertia/components/ui/`. Treat these as **generated, owned code**, not a locked dependency. It's expected to edit them directly for project-specific needs; don't wrap them in another abstraction layer to avoid touching the generated file.
- Never hand-write a component that duplicates an existing shadcn primitive (e.g. don't build a custom `Modal` if `Dialog` from shadcn is already installed) — check `components/ui/` first.
- shadcn components must stay consistent with the Tailwind v4 `@theme` tokens above — when shadcn's default generated styles reference CSS variables (`--background`, `--foreground`, etc.), keep them defined in the same `@theme`/`:root` block rather than introducing a second, parallel token system.
- Compose app-specific components on top of `ui/` primitives in `inertia/components/` (non-`ui` folder) — don't modify business logic into files under `components/ui/`, keep those purely presentational/generated.

### D. SSR

- Any component that touches `window`, `document`, or browser-only APIs (e.g. Web Bluetooth, `localStorage`) must guard for SSR (`typeof window !== 'undefined'`)

### E. Pages and Local Components

- `inertia/pages/**.tsx`: one file per route, matches controller's `inertia.render()` exactly. For per page components use this convention (NextJS App Router):

```text
inertia/pages/
    home/
        // If only one domain of components, use this:
        _components/
            hero-section.tsx
            contact-section.tsx
        // If more than one, use this:
        _components/
            button/
                cta-button.tsx
            section/
                hero-section.tsx
                contact-section.tsx
        index.tsx
```

### F. Backend Props

Always import these (in this order):

```ts
import { Data } from '@generated/data' // Used for generated data types (from #transformers)
import { InertiaProps } from '@/types' // Used for type-checking inertia props
```

**Example:**

```tsx
// inertia/pages/admin/posts/index.tsx

import { Head } from '@inertiajs/react'

import { Data } from '@generated/data' 
import { InertiaProps } from '@/types'

export default function Index({ posts }: InertiaProps<{
    posts: Data.Post[]
}>) {
  return (
    <>
      <Head title="Posts - Admin Panel" />
        {
            /* The content*/
        }
    </>
  )
}
```

**Example Pagination**:

```tsx
// inertia/pages/admin/posts/index.tsx

import { Head } from '@inertiajs/react'

import { Data } from '@generated/data' 
import { InertiaProps } from '@/types'
import { Paginate } from '@/types/paginate'

export default function Index({ posts }: InertiaProps<{
    posts: Paginate<Data.Post[]>
}>) {
  return (
    <>
      <Head title="Posts - Admin Panel" />
        {
            /* The content*/
        }
    </>
  )
}
```

If `inertia/types/paginate.ts` doesn't exists, create one:

```ts
export interface Paginate<T> {
    data: T
    metadata: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
    }
}
```

Note: If the data doesnt came from models, e.g. `calendar: Record<string, boolean>`, make sure it's the same as in frontend

### G. Link and Routing

Example:

```tsx
import { Link } from '@adonisjs/inertia/react'

<Link route="posts.index">Posts</Link>
<Link route="posts.show" routeParams={{ slug: post.slug }}>{post.title}</Link>
```

Also there is route helper by tuyau. The types will generated as long the dev server online.

```tsx
import { urlFor } from '@/client'

const url = urlFor('home') // Will resolve as '/'
const paginationUrl = urlFor('posts.index', {}, { qs: { page: 2 } })

// For the route with parameters (prefer use route and route params from Link component)
<Link href={urlFor('posts.show', { slug: post.slug })}>{post.title}</Link>
```

### H. Zod Validation

Always use zod mini

**Example:**

```ts
// inertia/lib/validations/user.tsx

import { z } from 'zod/mini'

export const signUpSchema = z
  .object({
    name: z
      .string()
      .check(z.minLength(3))
      .check(z.maxLength(255)),
    email: z.email().check(z.maxLength(255)),
    password: z
      .string()
      .check(z.minLength(8))
      .check(z.maxLength(32)),
    passwordConfirmation: z.string(),
  })
  .check(
    z.refine((data) => data.password === data.passwordConfirmation, {
      error: 'Password and confirmation password must be same',
      path: ['passwordConfirmation'],
    }),
  )

export const loginSchema = z.object({
  email: z.email().check(z.maxLength(255)),
  password: z.string().check(z.maxLength(255)),
  rememberMe: z.optional(z.boolean()),
})

export type SignUpSchema = z.infer<typeof signUpSchema>
export type LoginSchema = z.infer<typeof loginSchema>
```

### I. Form

For more form structure see: `https://ui.shadcn.com/docs/forms/react-hook-form`

**Example:**

```tsx
//inertia/pages/auth/sign-up.tsx

import { useCallback, useId } from 'react'
import { Link, useRouter } from '@adonisjs/inertia/react'
import { Controller, useForm } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { type SignUpSchema, signUpSchema } from '@/lib/validations/user'

export default function SignUpPage() {
  const formId = useId()
  const router = useRouter()
  const { control, handleSubmit, setError, formState } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = useCallback(
    (data: SignUpSchema) => {
      router.visit(
        {
          route: 'auth.signup.store', // tuyau type safe
        },
        {
          method: 'post',
          data,
          preserveState: true,
          onError: (errors) => {
            Object.entries(errors).forEach(([field, message]) => {
              setError(field as keyof SignUpSchema, {
                message,
              })
            })
          },
          onSuccess: () => {
            // toast.success("Registration success")
          }
        }
      )
    },
    [router, setError]
  )

  return (
    <>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formId}-${field.name}`}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={`${formId}-${field.name}`}
                    aria-invalid={fieldState.invalid}
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <LoadingButton type="submit" className="w-full" loading={formState.isSubmitting}>
              Sign up
            </LoadingButton>
            <p className="text-center text-sm">
              Already have an account?{' '}
              <Link route="auth.login" className="font-medium text-sky-600">
                Sign in
              </Link>
            </p>
        </form>
    </>
  )
}
```

### J. Global Inertia Data

See: `app/middleware/inertia_middleware.ts`

## 5. Commands

```bash
# Start
pnpm start

# Build
pnpm build

# Dev
pnpm dev

# Test
pnpm test

# Lint
pnpm lint

# Format
pnpm format

# Typecheck
pnpm typecheck
```

Agents: For adonisjs command, see `node ace`

## 6. What NOT to Do

- Don't introduce a new state management library (Redux, Zustand, etc.) without discussion — Context + Inertia shared data is the established pattern here.
- Don't bypass VineJS validation "just for this one endpoint."
- Don't add a new ORM query builder pattern that diverges from existing Lucid model conventions.
- Don't reformat/rewrite unrelated files as a side effect of an unrelated change.

## 7. When Unsure

If a convention isn't covered above:

1. Search the codebase for a similar existing pattern and follow it.
2. If none exists, ask user.
