import { z } from 'zod/mini'

const birthdate = z
  .date()
  .check(z.minimum(new Date('1900-01-01'), { error: 'Terlalu tua!' }))
  .check(z.maximum(new Date(), { error: 'Terlalu muda!' }))

const name = z
  .string()
  .check(z.minLength(3, 'Nama minimal 3 karakter'))
  .check(z.maxLength(255, 'Nama maksimal 255 karakter'))

const email = z.email().check(z.maxLength(255, 'Email maksimal 255 karakter'))

const weight = z.coerce
  .number<number>()
  .check(z.gte(1, 'Berat badan minimal 1 kg'))
  .check(z.lte(1000, 'Berat badan maksimal 1000 kg'))

const dayStart = z.iso.time()
const dayEnd = z.iso.time()
const workType = z.enum(['indoor', 'semi-outdoor', 'outdoor'])

export const signUpSchema = z
  .object({
    birthdate: birthdate,
    name: name,
    email: email,
    password: z
      .string()
      .check(z.minLength(8, 'Password minimal 8 karakter'))
      .check(z.maxLength(32, 'Password maksimal 255 karakter')),
    passwordConfirmation: z.string(),
    weight,
    dayStart,
    dayEnd,
    workType,
  })
  .check(
    z.refine((data) => data.password === data.passwordConfirmation, {
      error: 'Konfirmasi password salah',
      path: ['passwordConfirmation'],
    })
  )
