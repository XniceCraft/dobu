import { Button } from '@/components/ui/button'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { Navbar } from '@/components/layout/navbar'
import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { ReactQRCode } from '@lglab/react-qr-code'
import { LinkIcon, XIcon } from '@phosphor-icons/react'
import { urlFor } from '@/client'

import type { InertiaProps } from '@/types'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

export default function InviteFamily({
  calendar,
  slug,
}: InertiaProps<{
  calendar: Record<string, number>
  slug: string
}>) {
  const inviteLink = `${import.meta.env.VITE_APP_URL}${urlFor('family.join', { slug })}`

  const handleCopyLink = useCallback(async () => {
    if (!navigator?.clipboard) return

    try {
      await navigator.clipboard.writeText(inviteLink)
      toast.success('Link berhasil disalin')
    } catch {
      toast.error('Gagal menyalin link')
    }
  }, [inviteLink])

  return (
    <>
      <Head title="Invite Family" />

      <div className="h-screen flex flex-col relative overflow-hidden">
        <Navbar calendar={calendar} />
        <main className="flex-1 flex flex-col items-center justify-center py-5">
          <section className="bg-white rounded-3xl p-8  max-w-88 w-full">
            <div className="flex items-center gap-3">
              <Link route="family.index">
                <XIcon className="text-xl" />
              </Link>
              <h1 className="text-xl font-semibold">Tambahkan Anggota</h1>
            </div>
            <div className="mx-auto w-fit">
              <ReactQRCode marginSize={2} size={256} value={inviteLink} />
            </div>
            <Button
              variant="ghost"
              className="h-auto text-lg mx-auto flex"
              onClick={handleCopyLink}
            >
              Salin Link <LinkIcon />
            </Button>
          </section>
        </main>

        <MobileNavigation />
      </div>
    </>
  )
}
