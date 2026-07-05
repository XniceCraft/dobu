import { useCallback } from 'react'
import { Head, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@phosphor-icons/react'

export default function Forbidden() {
  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      router.visit('/')
    }
  }, [])

  return (
    <>
      <Head title="403 Forbidden" />

      <div className="h-screen flex flex-col items-center justify-center overflow-hidden">
        <main>
          <div className="flex flex-col sm:flex-row items-center gap-5 mb-20 sm:mb-5">
            <img
              src="/assets/image/home-character.webp"
              className="block h-64 object-contain"
              alt="DobU Character"
            />

            <div className="text-center sm:text-left">
              <h2 className="text-5xl font-bold mb-2">403</h2>
              <h1 className="text-sm tracking-wide mb-7">Akses Ditolak</h1>
            </div>
          </div>
          <Button variant="gradient" onClick={handleBack} className="flex mx-auto h-auto py-3 px-6">
            Kembali <ArrowRightIcon />
          </Button>
        </main>
      </div>
    </>
  )
}
