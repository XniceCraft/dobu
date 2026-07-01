import { z } from 'zod/mini'

export const upsertCharacterSchema = z.object({
  name: z
    .string()
    .check(z.minLength(1, 'Nama tidak boleh kosong'))
    .check(z.maxLength(255, 'Nama tidak boleh lebih dari 255 karakter')),
  image: z
    .file()
    .check(z.maxSize(5 * 1024 * 1024), z.mime(['image/jpeg', 'image/png', 'image/webp'])),
})

export type UpsertCharacterSchema = z.infer<typeof upsertCharacterSchema>
