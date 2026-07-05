import { z } from 'zod/mini'

const weightField = z.coerce
  .number<number>()
  .check(z.gte(1, 'Berat badan minimal 1 kg'))
  .check(z.lte(1000, 'Berat badan maksimal 1000 kg'))

const heightField = z.coerce
  .number<number>()
  .check(z.gte(100, 'Tinggi badan minimal 100 cm'))
  .check(z.lte(300, 'Tinggi badan maksimal 300 cm'))

const workTypeField = z.enum(['indoor', 'semi-outdoor', 'outdoor'])

export const signUpSchema = z
  .object({
    avatar: z
      .file()
      .check(z.maxSize(5 * 1024 * 1024), z.mime(['image/jpeg', 'image/png', 'image/webp'])),
    birthdate: z
      .date()
      .check(z.minimum(new Date('1900-01-01'), { error: 'Terlalu tua!' }))
      .check(z.maximum(new Date(), { error: 'Terlalu muda!' })),
    name: z
      .string()
      .check(z.minLength(3, 'Nama minimal 3 karakter'))
      .check(z.maxLength(255, 'Nama maksimal 255 karakter')),
    email: z.email().check(z.maxLength(255, 'Email maksimal 255 karakter')),
    password: z
      .string()
      .check(z.minLength(8, 'Password minimal 8 karakter'))
      .check(z.maxLength(32, 'Password maksimal 32 karakter')),
    passwordConfirmation: z.string(),
    weight: weightField,
    height: heightField,
    gender: z.enum(['male', 'female']),
    dayStart: z.iso.time(),
    dayEnd: z.iso.time(),
    climate: z.enum(['cold', 'temperate', 'hot', 'tropical']),
    workType: workTypeField,
  })
  .check(
    z.refine((data) => data.password === data.passwordConfirmation, {
      error: 'Konfirmasi password salah',
      path: ['passwordConfirmation'],
    }),
    z.refine(({ dayStart, dayEnd }) => dayStart < dayEnd, {
      message: 'Awal hari harus sebelum akhir hari',
      path: ['dayEnd'],
    })
  )

export const loginSchema = z.object({
  email: z.email().check(z.maxLength(255, 'Email maksimal 255 karakter')),
  password: z.string(),
  rememberMe: z.optional(z.boolean()),
})

export const weightSchema = z.object({
  weight: weightField,
})

export const heightSchema = z.object({
  height: heightField,
})

export const workTypeSchema = z.object({
  workType: workTypeField,
})

export type SignUpSchema = z.infer<typeof signUpSchema>
export type LoginSchema = z.infer<typeof loginSchema>

export type WeightSchema = z.infer<typeof weightSchema>
export type HeightSchema = z.infer<typeof heightSchema>
export type WorkTypeSchema = z.infer<typeof workTypeSchema>
