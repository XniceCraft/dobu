import { useCallback, useId } from 'react'
import { Link, useRouter } from '@adonisjs/inertia/react'
import { Controller, useForm } from 'react-hook-form'
import { Head } from '@inertiajs/react'
import { AvatarField } from './_components/field/avatar-field'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button, LoadingButton } from '@/components/ui/button'
import { PasswordField } from '@/components/field/password-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { type SignUpSchema, signUpSchema } from '@/lib/validations/user'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

export default function SignUp() {
  const formPrefix = useId()
  const router = useRouter()
  const { control, handleSubmit, setError, formState } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = useCallback(
    (data: SignUpSchema) => {
      router.visit(
        {
          route: 'auth.signup.store',
        },
        {
          method: 'post',
          data,
          preserveState: true,
          forceFormData: true,
          onError: (errors) => {
            Object.entries(errors).forEach(([field, message]) => {
              setError(field as keyof SignUpSchema, {
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
      <Head title="Daftar" />

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
          <form onSubmit={handleSubmit(onSubmit, console.log)} className="space-y-6">
            <Controller
              control={control}
              name="avatar"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Foto Profil</FieldLabel>
                  <AvatarField onChange={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formPrefix}-${field.name}`}>Nama</FieldLabel>
                  <Input
                    {...field}
                    id={`${formPrefix}-${field.name}`}
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
                  <FieldLabel htmlFor={`${formPrefix}-${field.name}`}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={`${formPrefix}-${field.name}`}
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
                  <FieldLabel htmlFor={`${formPrefix}-${field.name}`}>Tanggal Lahir</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="date" className="justify-start font-normal">
                        {field.value ? field.value.toLocaleDateString() : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        defaultMonth={field.value}
                        captionLayout="dropdown"
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="weight"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formPrefix}-${field.name}`}>Berat Badan</FieldLabel>
                  <Input
                    {...field}
                    id={`${formPrefix}-${field.name}`}
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
              name="height"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formPrefix}-${field.name}`}>Tinggi Badan</FieldLabel>
                  <Input
                    {...field}
                    id={`${formPrefix}-${field.name}`}
                    aria-invalid={fieldState.invalid}
                    type="number"
                    step={1}
                    min={100}
                    max={300}
                    placeholder="Masukkan tinggi badan anda"
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="gender"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formPrefix}-${field.name}`}>Jenis Kelamin</FieldLabel>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Pilih Jenis Kelamin" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="dayStart"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formPrefix}-${field.name}`}>Awal Hari</FieldLabel>
                  <Input
                    {...field}
                    id={`${formPrefix}-${field.name}`}
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
                  <FieldLabel htmlFor={`${formPrefix}-${field.name}`}>Akhir Hari</FieldLabel>
                  <Input
                    {...field}
                    id={`${formPrefix}-${field.name}`}
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
              name="climate"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formPrefix}-${field.name}`}>Iklim</FieldLabel>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Pilih Iklim" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="cold">Dingin</SelectItem>
                      <SelectItem value="temperate">Sedang</SelectItem>
                      <SelectItem value="hot">Panas</SelectItem>
                      <SelectItem value="tropical">Tropis</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="workType"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formPrefix}-${field.name}`}>Jenis Pekerjaan</FieldLabel>
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
    </>
  )
}
