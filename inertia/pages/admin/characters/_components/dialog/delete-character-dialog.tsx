import { useCallback, useImperativeHandle, useState } from 'react'
import { useRouter } from '@adonisjs/inertia/react'
import { Button, LoadingButton } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import toast from 'react-hot-toast'

import type { Data } from '@generated/data'

export function DeleteCharacterDialog({
  ref,
}: {
  ref: React.RefObject<{ deleteCharacter: (character: Data.Character) => void } | null>
}) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [character, setCharacter] = useState<Data.Character | null>(null)

  useImperativeHandle(ref, () => ({
    deleteCharacter: (character: Data.Character) => {
      setCharacter(character)
      setDialogOpen(true)
    },
  }))

  const onDelete = useCallback(() => {
    if (!character) return

    setIsDeleting(true)
    router.visit(
      {
        route: 'admin.characters.destroy',
        routeParams: { id: character.id },
      },
      {
        method: 'post',
        preserveState: true,
        onSuccess: () => {
          toast.success('Karakter berhasil dihapus')
          setDialogOpen(false)
        },
        onFinish: () => {
          setIsDeleting(false)
        },
      }
    )
  }, [router, character])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">Hapus Karakter</DialogTitle>
          {character?.name && (
            <DialogDescription className="text-ink-2 text-sm">
              Apakah Anda yakin ingin menghapus karakter <strong>{character.name}</strong>? Tindakan
              ini tidak dapat dibatalkan.
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="flex-col">
          <LoadingButton onClick={onDelete} loading={isDeleting} variant="destructive">
            Hapus
          </LoadingButton>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
