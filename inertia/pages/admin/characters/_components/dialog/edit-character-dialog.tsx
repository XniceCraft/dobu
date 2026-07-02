import { useCallback, useState, useId, useImperativeHandle } from 'react'
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
} from '@/components/ui/dialog'
import { CharacterField } from '../field/character-field'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { updateCharacterSchema, type UpdateCharacterSchema } from '@/lib/validations/character'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import type { Data } from '@generated/data'

export function EditCharacterDialog({
  ref,
}: {
  ref: React.RefObject<{ editCharacter: (character: Data.Character) => void } | null>
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [character, setCharacter] = useState<Data.Character | null>(null)

  const formPrefix = useId()
  const router = useRouter()
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<UpdateCharacterSchema>({
    resolver: zodResolver(updateCharacterSchema),
  })

  const onSubmit = useCallback(
    (data: UpdateCharacterSchema) => {
      if (!character?.id) return

      router.visit(
        {
          route: 'admin.characters.update',
          routeParams: { id: character.id },
        },
        {
          method: 'post',
          data,
          preserveState: true,
          onError: (errors) => {
            Object.entries(errors).forEach(([field, message]) => {
              setError(field as keyof UpdateCharacterSchema, {
                message,
              })
            })
          },
          onSuccess: () => {
            toast.success('Karakter berhasil diubah')
            setDialogOpen(false)
          },
        }
      )
    },
    [router, setError, setDialogOpen, character]
  )

  useImperativeHandle(ref, () => ({
    editCharacter: (character: Data.Character) => {
      setCharacter(character)
      setDialogOpen(true)
      reset({
        name: character.name,
      })
    },
  }))

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">Edit Karakter</DialogTitle>
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
                {character && (
                  <CharacterField onChange={field.onChange} existingImage={character.image} />
                )}
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </form>
        <DialogFooter className="flex-col">
          <LoadingButton type="submit" form={formPrefix} loading={isSubmitting}>
            Simpan
          </LoadingButton>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
