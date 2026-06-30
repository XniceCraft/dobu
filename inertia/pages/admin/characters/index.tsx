import { AdminContainer } from '@/components/container/admin-container'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Head } from '@inertiajs/react'
import { ImageIcon } from '@phosphor-icons/react'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'
import { AddCharacterDialog } from './_components/dialog/add-character-dialog'

export const numberFormatter = new Intl.NumberFormat('en')

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-3xl border border-rule bg-surface p-5 shadow-sm">
      <p className="text-sm font-medium text-ink-2">{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">
        {numberFormatter.format(value)}
      </p>
    </article>
  )
}

export default function CharactersIndex({
  characters,
}: InertiaProps<{ characters: Data.Character[] }>) {
  return (
    <>
      <Head title="Karakter" />

      <AdminLayout>
        <AdminContainer>
          <header className="flex flex-col gap-4 border-b border-rule pb-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs tracking-[0.18em] text-ink-3 uppercase">
                Admin Panel
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Karakter Preset
              </h1>
              <p className="mt-3 text-sm leading-6 text-ink-2 sm:text-base">
                Daftar semua preset gambar karakter yang aktif di dalam sistem.
              </p>
            </div>
          </header>

          <section
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="Character metrics"
          >
            <MetricCard label="Total Karakter" value={characters?.length ?? 0} />
          </section>

          <section className="overflow-hidden rounded-3xl border border-rule bg-surface shadow-sm">
            <div className="flex flex-wrap gap-3 border-b border-rule px-5 py-4 items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">Semua Karakter</h2>
                <p className="text-sm text-ink-3">
                  {numberFormatter.format(characters?.length ?? 0)} records
                </p>
              </div>
              <AddCharacterDialog />
            </div>

            <div className="p-6">
              {characters && characters.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {characters.map((character) => (
                    <article
                      key={character.id}
                      className="group relative flex flex-col items-center justify-center rounded-2xl border border-rule bg-paper p-3 transition-all duration-200 hover:scale-[1.02] hover:border-accent hover:shadow-md"
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-xl bg-surface flex items-center justify-center border border-rule/50">
                        <img
                          src={character.image}
                          alt={`Karakter ${character.id}`}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="mt-3 flex w-full items-center justify-between px-1">
                        <span className="font-mono text-xs font-semibold text-ink-2">
                          ID: #{character.id}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-16 text-center">
                  <div className="rounded-3xl bg-accent-subtle p-4 text-accent">
                    <ImageIcon className="size-8" weight="duotone" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-ink">Belum ada karakter</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-ink-2">
                    Preset gambar karakter belum ditambahkan ke dalam database.
                  </p>
                </div>
              )}
            </div>
          </section>
        </AdminContainer>
      </AdminLayout>
    </>
  )
}
