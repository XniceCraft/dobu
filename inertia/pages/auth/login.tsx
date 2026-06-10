import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/mini'
import { useCallback } from 'react'

const loginSchema = z.object({
  avatar: z.file(),
  birtdayDate: z.date(),
  name: z
    .string()
    .check(z.minLength(3, 'Nama minimal 3 karakter'))
    .check(z.maxLength(255, 'Nama maksimal 255 karakter')),
  email: z.email().check(z.maxLength(255, 'Email maksimal 255 karakter')),
  password: z
    .string()
    .check(z.minLength(8, 'Password minimal 8 karakter'))
    .check(z.maxLength(255, 'Password maksimal 255 karakter')),
  weight: z
    .number()
    .check(z.lte(1, 'Berat badan minimal 1 kg'))
    .check(z.gte(1000, 'Berat badan maksimal 1000 kg')),
  dayStart: z.iso.time(),
  dayEnd: z.iso.time(),
  workType: z.enum(['indoor', 'semi-outdoor', 'outdoor']),
})

export default function Login() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {},
  })

  const onSubmit = useCallback((data: z.infer<typeof loginSchema>) => {
    console.log(data)
  }, [])

  return (
    <main className="max-w-96 mx-auto w-full">
      <img src="/assets/image/home-character.webp" className="h-20 object-cover" alt="Character" />
      <h1 className="font-bold text-xl">Login</h1>
      <p>Masukkan detail akun anda untuk login</p>
    </main>
  )
}
