import { useCallback, useMemo, useRef, useState } from 'react'
import { LoadingButton } from '@/components/ui/button'
import { PlayIcon } from '@phosphor-icons/react'
import { clamp } from '@/lib/utils/math'
import { cn } from '@/lib/utils'

import type { Data } from '@generated/data'
import { useRouter } from '@adonisjs/inertia/react'
import toast from 'react-hot-toast'

export function CharacterSelector({
  characters,
  selectedId,
}: {
  characters: Data.Character[]
  selectedId: number
}) {
  const router = useRouter()
  const cursor = useMemo(
    () => characters.findIndex(({ id }) => id === selectedId),
    [characters, selectedId]
  )

  const cursorRef = useRef(cursor)
  const pointerTitleRef = useRef<HTMLParagraphElement>(null)
  const titles = useRef<HTMLParagraphElement[]>([])
  const thumbnails = useRef<HTMLImageElement[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)

  // +1: right, -1: left
  const handleMove = useCallback(
    (direction: number) => {
      const newCursor = clamp(cursorRef.current + direction, 0, characters.length - 1)
      if (newCursor === cursorRef.current) return

      const newData: Array<null | Data.Character> = Array.from({ length: 5 }, () => null)
      for (let i = 0; i < 5; i++) {
        const idx = newCursor + (i - 2)
        if (idx < 0 || idx >= characters.length) continue

        newData[i] = characters[idx]
      }

      cursorRef.current = newCursor
      pointerTitleRef.current!.textContent = `${newCursor + 1} / ${characters.length}`

      let dataCounter = 0
      for (let i = -2; i <= 2; i++) {
        const idx = newCursor + i

        if (idx < 0 || idx >= characters.length || !newData[dataCounter]) {
          titles.current[dataCounter].textContent = ''
          thumbnails.current[dataCounter].src = ''
          thumbnails.current[dataCounter].alt = ''
          thumbnails.current[dataCounter].style['display'] = 'none'
        } else {
          titles.current[dataCounter].textContent = newData[dataCounter]!.name
          thumbnails.current[dataCounter].src = newData[dataCounter]!.image
          thumbnails.current[dataCounter].alt = newData[dataCounter]!.name
          thumbnails.current[dataCounter].style['display'] = 'block'
        }

        dataCounter++
      }
    },
    [characters]
  )

  const onChange = useCallback(() => {
    setIsSubmitting(true)
    router.visit(
      {
        route: 'dress.update',
      },
      {
        method: 'post',
        data: {
          characterId: characters[cursorRef.current].id,
        },
        preserveState: true,
        onError: () => {
          toast.error('Terjadi kesalahan')
        },
        onSuccess: () => {
          toast.success('Karakter berhasil diubah')
        },
        onFinish: () => {
          setIsSubmitting(false)
        },
      }
    )
  }, [router, characters])

  return (
    <>
      <section className="max-w-88 w-full flex justify-center overflow-visible">
        <div className="flex gap-5 py-8">
          {Array.from({ length: 5 }).map((_, index) => {
            const idx = cursor + (index - 2)
            const isEmpty = idx < 0 || idx >= characters.length

            return (
              <div
                key={index}
                className={cn('min-w-32 sm:min-w-40 md::min-w-48', index === 2 && 'scale-125')}
              >
                <p
                  ref={(e) => {
                    titles.current[index] = e!
                  }}
                  className="text-center text-xl font-semibold mb-5 text-gray-800"
                >
                  {isEmpty ? ' ' : characters[idx]?.name}
                </p>
                <img
                  ref={(e) => {
                    thumbnails.current[index] = e!
                  }}
                  className="w-full aspect-square object-cover"
                  src={isEmpty ? undefined : characters[idx]?.image}
                  alt={isEmpty ? 'image alt' : characters[idx]?.name}
                  style={{
                    display: isEmpty ? 'none' : 'block',
                  }}
                />
              </div>
            )
          })}
        </div>
      </section>
      <div className="flex justify-center items-center gap-2">
        <button onClick={() => handleMove(-1)} className="p-4 rounded-full ">
          <PlayIcon className="rotate-180 text-gray-700 size-8" weight="fill" />
        </button>
        <p ref={pointerTitleRef} className="text-sm font-semibold text-gray-700">
          {cursor + 1} / {characters.length}
        </p>
        <button onClick={() => handleMove(1)} className="p-4 rounded-full">
          <PlayIcon weight="fill" className="text-gray-700 size-8" />
        </button>
      </div>
      <LoadingButton
        variant="gradient"
        className="w-full max-w-56 py-3 h-auto"
        loading={isSubmitting}
        onClick={onChange}
      >
        Pakai
      </LoadingButton>
    </>
  )
}
