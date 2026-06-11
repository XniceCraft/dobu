import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(255)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  name: vine.string(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
  birthdate: vine
    .date({
      formats: ['iso8601'],
    })
    .beforeOrEqual('today'),
  weight: vine.number().min(1).max(1000),
  dayStart: vine.string(),
  dayEnd: vine.string(),
  workType: vine.enum(['indoor', 'semi-outdoor', 'outdoor']),
})

export const loginValidator = vine.create({
  email: vine.string().email(),
  password: vine.string(),
  rememberMe: vine.boolean().optional(),
})
