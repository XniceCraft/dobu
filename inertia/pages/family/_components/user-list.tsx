import { clamp } from '@/lib/utils/math'

interface Props {
  avatar: string
  totalMl: number
  targetMl: number
  character?: string
}

export function UserList({ avatar, totalMl, targetMl, character }: Props) {
  return (
    <div className="relative bg-gray-200 rounded-full h-8 flex items-center justify-center">
      <img
        src={avatar}
        alt="Avatar"
        className="absolute top-1/2 left-0 -translate-1/2 w-10 h-10 rounded-full object-cover z-1"
      />
      <div
        className="absolute bg-sky-400 top-0 left-0 w-full h-full origin-left rounded-full"
        style={{
          transform: `scaleX(${clamp(totalMl / targetMl, 0, 1)})`,
        }}
      />
      <p className="relative z-2 text-sm font-medium">{`${totalMl}/${targetMl} ML`}</p>
      {character && (
        <img
          src={character}
          alt="Character"
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full object-cover z-1"
        />
      )}
    </div>
  )
}
