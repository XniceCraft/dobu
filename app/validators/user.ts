import vine from '@vinejs/vine'

export const signupValidator = vine.create({
  avatar: vine.file({ size: '5mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] }),
  name: vine.string().minLength(2).maxLength(255),
  email: vine.string().email().maxLength(255).unique({ table: 'users', column: 'email' }),
  password: vine.string().minLength(8).maxLength(32).confirmed({
    confirmationField: 'passwordConfirmation',
  }),
  birthdate: vine
    .date({
      formats: ['iso8601'],
    })
    .beforeOrEqual('today'),
  weight: vine.number().min(1).max(1000),
  height: vine.number().min(100).max(300),
  gender: vine.enum(['male', 'female']),
  dayStart: vine.string(),
  dayEnd: vine.string(),
  climate: vine.enum(['cold', 'temperate', 'hot', 'tropical']),
  workType: vine.enum(['indoor', 'semi-outdoor', 'outdoor']),
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
