import { useMemo } from 'react'
import { DrinkLogChart } from './drink-log-chart'
import { getStreak } from '@/lib/utils/streak'
import { CARD_WIDTH, CARD_HEIGHT } from '../_lib/card'

import type { Data } from '@generated/data'

export function Card1({
  ref,
  todayDrinkMl,
  targetMl,
  targetPerInterval,
  todayLogs,
  streak,
  character,
}: {
  ref?: React.Ref<HTMLDivElement> | undefined
  todayDrinkMl: number
  targetMl: number
  targetPerInterval: number
  todayLogs: Data.DrinkLog[]
  streak: number
  character: Data.Character
}) {
  const { purple, blue } = useMemo(() => getStreak(streak), [streak])

  return (
    <div
      ref={ref}
      className="bg-[#8B98A7] text-white text-center flex flex-col justify-center items-center text-lg"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <div className="max-w-56 w-full mb-2">
        <DrinkLogChart todayLogs={todayLogs} height={60} maxHeight={60} />
      </div>
      <p className="mb-0">
        <span className="font-bold">{todayDrinkMl} ml /</span>
        {targetMl} ml
      </p>
      <p className="mb-2 font-light">Today</p>
      <p className="font-bold mb-0">{targetPerInterval} ml</p>
      <p className="mb-0 font-light">AVG</p>
      <div className="flex gap-1 mt-3">
        {Array.from({ length: purple }).map((_, i) => (
          <img
            key={i}
            src="/assets/image/droplet-purple.webp"
            alt="Droplet Purple"
            className="w-6 h-6 object-contain"
          />
        ))}
        {Array.from({ length: blue }).map((_, i) => (
          <img
            key={i}
            src="/assets/image/droplet.webp"
            alt="Droplet Blue"
            className="w-6 h-6 object-contain"
          />
        ))}
      </div>
      <p className="mt-1 mb-3 font-light">
        {streak} streak{streak !== 1 && 's'}!
      </p>
      <img
        src={character.image}
        alt={character.name}
        className="block mx-auto w-16 h-16 rounded-4xl object-cover"
      />
    </div>
  )
}

export function Card2({
  ref,
  todayDrinkMl,
  targetMl,
  targetPerInterval,
  todayLogs,
  streak,
  character,
}: {
  ref?: React.Ref<HTMLDivElement> | undefined
  todayDrinkMl: number
  targetMl: number
  targetPerInterval: number
  todayLogs: Data.DrinkLog[]
  streak: number
  character: Data.Character
}) {
  const { purple, blue } = useMemo(() => getStreak(streak), [streak])

  return (
    <div
      ref={ref}
      className="bg-[#8B98A7] text-black text-center flex flex-col justify-center items-center text-lg"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <div className="bg-linear-to-b from-white to-white/10 backdrop-blur-sm p-6 rounded-4xl">
        <img
          src={character.image}
          alt={character.name}
          className="block mx-auto w-36 h-36 object-cover rounded-2xl"
        />
        <p className="mt-1 mb-2">{character.name}</p>
        <DrinkLogChart todayLogs={todayLogs} height={60} maxHeight={60} />
        <div className="flex gap-1 my-3 justify-center">
          {Array.from({ length: purple }).map((_, i) => (
            <img
              key={i}
              src="/assets/image/droplet-purple.webp"
              alt="Droplet Purple"
              className="w-6 h-6 object-contain"
            />
          ))}
          {Array.from({ length: blue }).map((_, i) => (
            <img
              key={i}
              src="/assets/image/droplet.webp"
              alt="Droplet Blue"
              className="w-6 h-6 object-contain"
            />
          ))}
        </div>
        <p className="mb-0 font-light">Today</p>
        <p className="mb-2">
          <span className="font-bold">{todayDrinkMl} ml /</span>
          {targetMl} ml
        </p>
        <p className="mb-0 font-light">Avg</p>
        <p className="font-bold mb-2">{targetPerInterval} ml</p>
      </div>
    </div>
  )
}

export function Card3({
  ref,
  todayDrinkMl,
  targetMl,
  targetPerInterval,
  todayLogs,
  streak,
  character,
}: {
  ref?: React.Ref<HTMLDivElement> | undefined
  todayDrinkMl: number
  targetMl: number
  targetPerInterval: number
  todayLogs: Data.DrinkLog[]
  streak: number
  character: Data.Character
}) {
  const { purple, blue } = useMemo(() => getStreak(streak), [streak])

  return (
    <div
      ref={ref}
      className="bg-[#8B98A7] text-black text-center flex flex-col justify-center items-center"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <div className="bg-linear-to-r from-white to-white/10 flex gap-3 backdrop-blur-sm p-6 rounded-4xl">
        <div>
          <img
            src={character.image}
            alt={character.name}
            className="block mx-auto w-24 h-24 object-cover rounded-2xl"
          />
          <p className="mt-1 mb-2">{character.name}</p>
        </div>
        <div className="flex flex-col text-sm">
          <DrinkLogChart todayLogs={todayLogs} height={60} maxHeight={60} />

          <div className="flex gap-3">
            <div>
              <p className="mb-0 font-light">Today</p>
              <p>
                <span className="font-bold">{todayDrinkMl} ml /</span>
                {targetMl} ml
              </p>
            </div>
            <div>
              <p className="mb-0 font-light">Avg</p>
              <p className="font-bold">{targetPerInterval} ml</p>
            </div>
          </div>
          <div className="flex gap-1 my-3 justify-center">
            {Array.from({ length: purple }).map((_, i) => (
              <img
                key={i}
                src="/assets/image/droplet-purple.webp"
                alt="Droplet Purple"
                className="w-6 h-6 object-contain"
              />
            ))}
            {Array.from({ length: blue }).map((_, i) => (
              <img
                key={i}
                src="/assets/image/droplet.webp"
                alt="Droplet Blue"
                className="w-6 h-6 object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Card4({
  ref,
  todayDrinkMl,
  todayLogs,
  targetMl,
  targetPerInterval,
  userName,
  userAvatar,
  streak,
  character,
}: {
  ref?: React.Ref<HTMLDivElement> | undefined
  todayDrinkMl: number
  todayLogs: Data.DrinkLog[]
  targetMl: number
  targetPerInterval: number
  userName: string
  userAvatar: Data.User['avatar']
  streak: number
  character: Data.Character
}) {
  const { purple, blue } = useMemo(() => getStreak(streak), [streak])

  return (
    <div
      ref={ref}
      className="relative bg-gray-100 text-black text-center flex flex-col p-8"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <img
        className="absolute -top-12 left-0 size-32 object-contain z-0"
        src="/assets/image/share/lt.webp"
        alt="Share background"
      />
      <img
        className="absolute bottom-30 -left-16 size-32 object-contain z-0"
        src="/assets/image/share/lb.webp"
        alt="Share background"
      />
      <img
        className="absolute top-12 -right-12 size-40 object-contain z-0"
        src="/assets/image/share/rt.webp"
        alt="Share background"
      />
      <img
        className="absolute bottom-24 -right-12 size-42 object-contain z-0"
        src="/assets/image/share/rb.webp"
        alt="Share background"
      />
      <div className="bg-white/10 w-full h-full gap-3 backdrop-blur shadow-lg p-6 rounded-4xl relative">
        <div className="flex gap-3 items-center">
          <img
            src={userAvatar ?? undefined}
            alt={userName}
            className="size-8 rounded-full shadow-sm border object-cover"
          />
          <p className="text-sm font-medium">{userName}</p>
        </div>

        <DrinkLogChart todayLogs={todayLogs} height={80} maxHeight={80} />

        <div className="flex justify-between gap-3 text-left mb-3">
          <div>
            <p className="mb-0 font-light text-xs">Today</p>
            <p className="text-xs">
              <span className="font-bold">{todayDrinkMl} ml /</span>
              {targetMl} ml
            </p>
          </div>
          <div className="text-right">
            <p className="mb-0 font-light text-xs">Avg</p>
            <p className="font-bold text-xs">{targetPerInterval} ml</p>
          </div>
        </div>
        <img
          src={character.image}
          alt={character.name}
          className="block mx-auto w-24 h-24 object-cover rounded-2xl relative z-1"
        />
      </div>
      <img
        className="absolute translate-y-1/2 -bottom-24 left-0 w-full scale-175 h-full object-contain z-0"
        src="/assets/image/share/share-background.webp"
        alt="Share background"
      />
      <div className="absolute translate-y-1/2 -bottom-22 left-0 w-full h-full z-1">
        <p>{character.name}</p>
        <div className="flex gap-1 my-3 justify-center">
          {Array.from({ length: purple }).map((_, i) => (
            <img
              key={i}
              src="/assets/image/droplet-purple.webp"
              alt="Droplet Purple"
              className="w-6 h-6 object-contain"
            />
          ))}
          {Array.from({ length: blue }).map((_, i) => (
            <img
              key={i}
              src="/assets/image/droplet.webp"
              alt="Droplet Blue"
              className="w-6 h-6 object-contain"
            />
          ))}
        </div>
        <p>
          {streak} streak{streak === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  )
}
