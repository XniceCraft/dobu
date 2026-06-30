import vine from '@vinejs/vine'

export const imageField = () => vine.file({ size: '5mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })
