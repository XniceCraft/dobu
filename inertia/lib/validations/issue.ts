import { z } from 'zod/mini'

export const createIssueSchema = z.object({
  report: z
    .string()
    .check(z.minLength(1, 'Laporan harus diisi'))
    .check(z.maxLength(2048, 'Laporan tidak boleh lebih dari 2048 karakter')),
})

export type CreateIssueSchema = z.infer<typeof createIssueSchema>
