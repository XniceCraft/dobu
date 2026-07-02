import vine from '@vinejs/vine'

const slug = () => vine.string().exists({ table: 'families', column: 'slug' })

export const joinFamilyValidator = vine.create({ slug: slug() })
