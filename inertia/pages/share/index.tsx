import { useCallback, useMemo, useRef, useState } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { Head } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card1, Card2, Card3, Card4 } from './_components/share-card'
import { ThumbnailScaler } from './_components/thumbnail-scaler'
import { ShareIcon, XIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { domToBlob } from 'modern-screenshot'
import toast from 'react-hot-toast'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'
import { SaveIcon } from 'lucide-react'

export default function ShareIndex({
  user,
  todayDrinkMl,
  todayLogs,
  targetMl,
  targetPerInterval,
  streak,
  character,
}: InertiaProps<{
  todayDrinkMl: number
  todayLogs: Data.DrinkLog[]
  targetMl: number
  targetPerInterval: number
  streak: number
  character: Data.Character
}>) {
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)
  const card4Ref = useRef<HTMLDivElement>(null)
  const refs = useMemo(() => [card1Ref, card2Ref, card3Ref, card4Ref], [])

  const [selected, setSelected] = useState(0)

  const handleShare = useCallback(async () => {
    const selectedCardRef = refs[selected]
    if (!selectedCardRef.current) {
      toast.error('Gagal membuat kartu. Coba lagi.')
      return
    }

    const blob = await domToBlob(selectedCardRef.current, {
      quality: 1,
      scale: 3,
    })
    if (!blob) {
      toast.error('Gagal membuat kartu. Coba lagi.')
      return
    }

    const file = new File([blob], 'dobu-share.png', { type: 'image/png' })

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Progress Hidrasi',
          text: `${todayDrinkMl}ml / ${targetMl}ml dari target hari ini`,
        })
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          toast.error('Gagal membagikan. Mungkin coba tombol simpan?')
        }
      }
      return
    }
  }, [selected, refs, todayDrinkMl, targetMl])

  const handleSave = useCallback(async () => {
    const selectedCardRef = refs[selected]
    if (!selectedCardRef.current) {
      toast.error('Gagal menyimpan kartu. Coba lagi.')
      return
    }

    const blob = await domToBlob(selectedCardRef.current, {
      quality: 1,
      scale: 3,
    })
    if (!blob) {
      toast.error('Gagal membuat kartu. Coba lagi.')
      return
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'dobu-share.png'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }, [selected, refs])

  return (
    <>
      <Head title="Bagikan Progress" />

      <div className="h-screen flex flex-col relative overflow-hidden">
        <main className="flex-1 flex flex-col py-5 mx-auto w-full max-w-96">
          <section className="flex gap-3 items-center mb-5">
            <Button variant="ghost" size="icon" asChild>
              <Link route="home">
                <XIcon />
              </Link>
            </Button>
            <h1 className="text-lg">Bagikan Progress</h1>
          </section>

          <section className="bg-gray-100 p-8 max-w-88 w-full rounded-lg">
            <div className="grid grid-cols-2 gap-5">
              <div
                onClick={() => setSelected(0)}
                className={cn(
                  'aspect-3/4 w-full rounded-lg bg-[#8B98A7] overflow-hidden',
                  selected === 0 && 'border-2 border-blue-500'
                )}
              >
                <ThumbnailScaler>
                  <Card1
                    todayDrinkMl={todayDrinkMl}
                    targetMl={targetMl}
                    targetPerInterval={targetPerInterval}
                    todayLogs={todayLogs}
                    streak={streak}
                    character={character}
                  />
                </ThumbnailScaler>
              </div>
              <div
                onClick={() => setSelected(1)}
                className={cn(
                  'aspect-3/4 w-full rounded-lg bg-[#8B98A7] overflow-hidden',
                  selected === 1 && 'border-2 border-blue-500'
                )}
              >
                <ThumbnailScaler>
                  <Card2
                    todayDrinkMl={todayDrinkMl}
                    targetMl={targetMl}
                    targetPerInterval={targetPerInterval}
                    todayLogs={todayLogs}
                    streak={streak}
                    character={character}
                  />
                </ThumbnailScaler>
              </div>
              <div
                onClick={() => setSelected(2)}
                className={cn(
                  'aspect-3/4 w-full rounded-lg bg-[#8B98A7] overflow-hidden',
                  selected === 2 && 'border-2 border-blue-500'
                )}
              >
                <ThumbnailScaler>
                  <Card3
                    todayDrinkMl={todayDrinkMl}
                    targetMl={targetMl}
                    targetPerInterval={targetPerInterval}
                    todayLogs={todayLogs}
                    streak={streak}
                    character={character}
                  />
                </ThumbnailScaler>
              </div>
              <div
                onClick={() => setSelected(3)}
                className={cn(
                  'aspect-3/4 w-full rounded-lg bg-[#8B98A7] overflow-hidden',
                  selected === 3 && 'border-2 border-blue-500'
                )}
              >
                <ThumbnailScaler>
                  <Card4
                    todayDrinkMl={todayDrinkMl}
                    todayLogs={todayLogs}
                    targetMl={targetMl}
                    targetPerInterval={targetPerInterval}
                    userName={user!.name}
                    userAvatar={user!.avatar}
                    streak={streak}
                    character={character}
                  />
                </ThumbnailScaler>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button className="flex-1/2" variant="gradient" onClick={handleShare}>
                <ShareIcon /> Bagikan
              </Button>
              <Button className="flex-1/2" variant="gradient" onClick={handleSave}>
                <SaveIcon /> Simpan
              </Button>
            </div>
          </section>
        </main>
      </div>

      <div style={{ position: 'fixed', left: -9999, top: 0 }}>
        <Card1
          ref={card1Ref}
          todayDrinkMl={todayDrinkMl}
          targetMl={targetMl}
          targetPerInterval={targetPerInterval}
          todayLogs={todayLogs}
          streak={streak}
          character={character}
        />
        <Card2
          ref={card2Ref}
          todayDrinkMl={todayDrinkMl}
          targetMl={targetMl}
          targetPerInterval={targetPerInterval}
          todayLogs={todayLogs}
          streak={streak}
          character={character}
        />
        <Card3
          ref={card3Ref}
          todayDrinkMl={todayDrinkMl}
          targetMl={targetMl}
          targetPerInterval={targetPerInterval}
          todayLogs={todayLogs}
          streak={streak}
          character={character}
        />
        <Card4
          ref={card4Ref}
          todayDrinkMl={todayDrinkMl}
          todayLogs={todayLogs}
          targetMl={targetMl}
          targetPerInterval={targetPerInterval}
          userName={user!.name}
          userAvatar={user!.avatar}
          streak={streak}
          character={character}
        />
      </div>
    </>
  )
}
