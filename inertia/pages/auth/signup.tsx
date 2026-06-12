import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, LoadingButton } from '@/components/ui/button'
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
import { signUpSchema } from '@/lib/validations/user'

import type { z } from 'zod/mini'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload'
import { CloudUploadIcon, XIcon } from 'lucide-react'

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
          forceFormData: true,
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
            name="avatar"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Foto Profil</FieldLabel>
                <FileUpload
                  value={field.value ? [field.value] : []}
                  onValueChange={(files) => {
                    field.onChange(files[0])
                  }}
                  accept="image/jpeg, image/png, image/webp"
                  maxFiles={1}
                  maxSize={5 * 1024 * 1024}
                  onFileReject={(_, message) => {
                    setError('avatar', {
                      message,
                    })
                  }}
                >
                  <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
                    <CloudUploadIcon className="size-4" />
                    Drag and drop or
                    <FileUploadTrigger asChild>
                      <Button variant="link" size="sm" className="p-0">
                        choose files
                      </Button>
                    </FileUploadTrigger>
                    to upload
                  </FileUploadDropzone>
                  <FileUploadList>
                    {field.value && (
                      <FileUploadItem value={field.value}>
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemDelete asChild>
                          <Button variant="ghost" size="icon" className="size-7">
                            <XIcon />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    )}
                  </FileUploadList>
                </FileUpload>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
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
