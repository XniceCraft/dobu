import { Head } from '@inertiajs/react'

export default function ServerError() {
  return (
    <>
      <Head title="Internal Server Error" />

      <div className="h-screen flex flex-col items-center justify-center overflow-hidden">
        <main className="flex flex-col sm:flex-row items-center gap-5 mb-20 sm:mb-5">
          <img
            src="/assets/image/home-character.webp"
            className="block h-64 object-contain"
            alt="DobU Character"
          />

          <div className="text-center sm:text-left">
            <h1 className="text-lg font-bold tracking-wide mb-2">Internal Server Error</h1>
            <h2 className="text-5xl mb-7">500</h2>
            <p>Kami akan segera kembali</p>
          </div>
        </main>
      </div>
    </>
  )
}
