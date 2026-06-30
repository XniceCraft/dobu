import { useCallback, useState } from 'react'
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
import { Field, FieldError } from '@/components/ui/field'
import { PlusIcon } from '@phosphor-icons/react'
import { upsertCharacterSchema, type UpsertCharacterSchema } from '@/lib/validations/character'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

export function AddCharacterDialog() {
  const router = useRouter()
  const {
    control,
    handleSubmit,
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
          },
        }
      )
    },
    [router, setError, setDialogOpen]
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
        <form onSubmit={handleSubmit(onSubmit)} id="add-character-form">
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
          <LoadingButton type="submit" form="add-character-form" loading={isSubmitting}>
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
