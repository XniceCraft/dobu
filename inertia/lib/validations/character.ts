import { z } from 'zod/mini'

export const upsertCharacterSchema = z.object({
  image: z
    .file()
    .check(z.maxSize(5 * 1024 * 1024), z.mime(['image/jpeg', 'image/png', 'image/webp'])),
})

export type UpsertCharacterSchema = z.infer<typeof upsertCharacterSchema>
