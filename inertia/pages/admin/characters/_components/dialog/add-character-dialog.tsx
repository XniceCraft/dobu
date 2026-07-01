import { useCallback, useState, useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from '@adonisjs/inertia/react'
import { Button, LoadingButton } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CharacterField } from '../field/character-field'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PlusIcon } from '@phosphor-icons/react'
import { upsertCharacterSchema, type UpsertCharacterSchema } from '@/lib/validations/character'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

export function AddCharacterDialog() {
  const formPrefix = useId()
  const router = useRouter()
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<UpsertCharacterSchema>({
    resolver: zodResolver(upsertCharacterSchema),
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  const onSubmit = useCallback(
    (data: UpsertCharacterSchema) => {
      router.visit(
        {
          route: 'admin.characters.store',
        },
        {
          method: 'post',
          data,
          preserveState: true,
          onError: (errors) => {
            Object.entries(errors).forEach(([field, message]) => {
              setError(field as keyof UpsertCharacterSchema, {
                message,
              })
            })
          },
          onSuccess: () => {
            toast.success('Karakter berhasil ditambahkan')
            setDialogOpen(false)
            reset()
          },
        }
      )
    },
    [router, setError, setDialogOpen, reset]
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl">
          <PlusIcon />
          Tambah Karakter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">Tambahkan Karakter</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} id={formPrefix} className="space-y-6">
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
                  className="rounded-lg"
                  placeholder="Masukkan nama karakter"
                  type="text"
                  required
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="image"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <CharacterField onChange={field.onChange} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </form>
        <DialogFooter className="flex-col">
          <LoadingButton type="submit" form={formPrefix} loading={isSubmitting}>
            Tambah
          </LoadingButton>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
