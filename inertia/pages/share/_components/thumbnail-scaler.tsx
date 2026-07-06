import { useEffect, useRef, useState } from 'react'
import { CARD_HEIGHT, CARD_WIDTH } from '../_lib/card'

export function ThumbnailScaler({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      setScale(ref.current.getBoundingClientRect().width / CARD_WIDTH)
    }
  }, [])

  return (
    <div ref={ref} className="h-full w-full relative overflow-hidden">
      {scale !== null && (
        <div
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
