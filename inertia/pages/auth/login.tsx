import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useRouter } from '@adonisjs/inertia/react'
import { Head } from '@inertiajs/react'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/button'
import { PasswordField } from '@/components/field/password-field'
import { loginSchema, type LoginSchema } from '@/lib/validations/user'
import { zodResolver } from '@hookform/resolvers/zod'

export default function Login() {
  const router = useRouter()
  const { control, handleSubmit, setError, formState } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = useCallback(
    (data: LoginSchema) => {
      router.visit(
        {
          route: 'auth.login.store',
        },
        {
          method: 'post',
          data,
          preserveState: true,
          onError: (errors) => {
            Object.entries(errors).forEach(([field, message]) => {
              setError(field as keyof LoginSchema, {
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
    <>
      <Head title="Masuk" />

      <main className="max-w-96 mx-auto w-full py-12 px-4">
        <img
          src="/assets/image/home-character.webp"
          className="block h-28 object-cover mx-auto"
          alt="Character"
        />
        <section className="bg-white p-6 rounded-2xl shadow border border-gray-50">
          <h1 className="font-bold text-xl text-center mb-1">Masuk</h1>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Masukkan data anda untuk masuk
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              placeholder="Masukkan kata sandi"
            />
            <Controller
              control={control}
              name="rememberMe"
              render={({ field: { onChange, onBlur, value, name, ref }, fieldState }) => (
                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                  <Checkbox
                    ref={ref}
                    id={name}
                    checked={value}
                    onCheckedChange={onChange}
                    onBlur={onBlur}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel htmlFor={name}>Ingat Saya</FieldLabel>
                </Field>
              )}
            />
            <LoadingButton type="submit" className="w-full" loading={formState.isSubmitting}>
              Masuk
            </LoadingButton>
            <p className="text-center text-sm">
              Belum memiliki akun?{' '}
              <Link route="auth.signup" className="font-medium text-sky-600">
                Daftar
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  )
}
