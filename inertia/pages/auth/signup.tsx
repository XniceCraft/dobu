import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { LoadingButton } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Link, useRouter } from '@adonisjs/inertia/react'
import { PasswordField } from '@/components/field/password-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/mini'

const signUpSchema = z
  .object({
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
      .check(z.maxLength(32, 'Password maksimal 255 karakter')),
    passwordConfirmation: z.string(),
    weight: z.coerce
      .number<number>()
      .check(z.gte(1, 'Berat badan minimal 1 kg'))
      .check(z.lte(1000, 'Berat badan maksimal 1000 kg')),
    dayStart: z.iso.time(),
    dayEnd: z.iso.time(),
    workType: z.enum(['indoor', 'semi-outdoor', 'outdoor']),
  })
  .check(
    z.refine((data) => data.password === data.passwordConfirmation, {
      error: 'Konfirmasi password salah',
      path: ['passwordConfirmation'],
    })
  )

export default function SignUp() {
  const router = useRouter()
  const { control, handleSubmit, setError, formState } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = useCallback(
    (data: z.infer<typeof signUpSchema>) => {
      router.visit(
        {
          route: 'auth.signup.store',
        },
        {
          method: 'post',
          data,
          preserveState: true,
          onError: (errors) => {
            Object.entries(errors).forEach(([field, message]) => {
              setError(field as keyof z.infer<typeof signUpSchema>, {
                message,
              })
            })
          },
        }
      )
    },
    [router, setError]
  )

  return (
    <main className="max-w-96 mx-auto w-full py-12 px-4">
      <img
        src="/assets/image/home-character.webp"
        className="block h-28 object-cover mx-auto"
        alt="Character"
      />
      <section className="bg-white p-6 rounded-2xl ">
        <h1 className="font-bold text-xl text-center mb-1">Daftar</h1>
        <p className="text-muted-foreground text-sm text-center mb-6">
          Lengkapi data anda untuk memulai
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="text"
                  placeholder="Masukkan nama anda"
                  required
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="email"
                  placeholder="Masukkan email anda"
                  required
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <PasswordField
            control={control}
            name="password"
            label="Kata Sandi"
            placeholder="Masukkan kata sandi baru"
          />
          <PasswordField
            control={control}
            name="passwordConfirmation"
            label="Konfirmasi Kata Sandi"
            placeholder="Masukkan ulang kata sandi"
          />
          <Controller
            control={control}
            name="birthdate"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Tanggal Lahir</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="date"
                  required
                  value={field.value?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    field.onChange(new Date(e.target.value))
                  }}
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="weight"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Berat Badan</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="number"
                  step={1}
                  min={1}
                  max={1000}
                  placeholder="Masukkan berat badan anda"
                  required
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="dayStart"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Awal Hari</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="time"
                  required
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="dayEnd"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Akhir Hari</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="time"
                  required
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="workType"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Jenis Pekerjaan</FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Pilih Jenis Pekerjaan" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value="indoor">Indoor</SelectItem>
                    <SelectItem value="semi-outdoor">Semi Outdoor</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <LoadingButton type="submit" className="w-full" loading={formState.isSubmitting}>
            Daftar
          </LoadingButton>
          <p className="text-center text-sm">
            Sudah memiliki akun?{' '}
            <Link route="auth.login" className="font-medium text-sky-600">
              Masuk
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}
