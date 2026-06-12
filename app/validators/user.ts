import vine from '@vinejs/vine'

const avatar = () => vine.file({ size: '5mb', extnames: ['jpg', 'png', 'webp'] })
const name = () => vine.string().minLength(2).maxLength(255)
const email = () => vine.string().email().maxLength(255)
const password = () => vine.string().minLength(8).maxLength(32)
const birthdate = () =>
  vine
    .date({
      formats: ['iso8601'],
    })
    .beforeOrEqual('today')
const weight = () => vine.number().min(1).max(1000)
const dayStart = () => vine.string()
const dayEnd = () => vine.string()
const workType = () => vine.enum(['indoor', 'semi-outdoor', 'outdoor'])

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  avatar: avatar(),
  name: name(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
  birthdate: birthdate(),
  weight: weight(),
  dayStart: dayStart(),
  dayEnd: dayEnd(),
  workType: workType(),
})

export const loginValidator = vine.create({
  email: vine.string().email(),
  password: vine.string(),
  rememberMe: vine.boolean().optional(),
})

export const updateUserValidator = vine.create(
  signupValidator.schema
    .partial(['name', 'birthdate', 'weight', 'dayStart', 'dayEnd', 'workType', 'avatar'])
    .omit(['email', 'password'])
)
