export function CharacterBackground() {
  return (
    <>
      <div className="absolute top-0 left-1/2 -translate-1/2 w-150 h-180 rounded-full bg-[#bcebf7] -z-30" />
      <div className="absolute top-0 left-1/2 -translate-1/2 w-135 h-162 rounded-full bg-[#ccf0fa] -z-20" />
      <div className="absolute top-0 left-1/2 -translate-1/2 w-120 h-144 rounded-full bg-[#d8f7ff] -z-10" />

      <div className="absolute top-1/2 left-1/2 -z-10 -translate-1/2 w-100">
        <img
          src="/assets/image/home-character.webp"
          className="block w-full relative"
          alt="Home Character"
        />
        <img
          src="/assets/image/home-bottom-circle.webp"
          className="block absolute -bottom-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 -z-20 min-w-3xl"
          alt="Home Character"
        />
      </div>
    </>
  )
}
