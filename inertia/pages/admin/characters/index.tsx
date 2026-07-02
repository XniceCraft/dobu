import { useRef } from 'react'
import { AddCharacterDialog } from './_components/dialog/add-character-dialog'
import { AdminContainer } from '@/components/container/admin-container'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { DeleteCharacterDialog } from './_components/dialog/delete-character-dialog'
import { EditCharacterDialog } from './_components/dialog/edit-character-dialog'
import { Head } from '@inertiajs/react'
import { ImageIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react'
import { formatDate } from '@/lib/utils/date'

import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

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
  const editDialogRef = useRef<{ editCharacter: (character: Data.Character) => void }>(null)
  const deleteDialogRef = useRef<{ deleteCharacter: (character: Data.Character) => void }>(null)

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
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-rule font-medium text-xs tracking-wider text-ink-3 uppercase">
                        <th className="pb-3 pl-4">Karakter</th>
                        <th className="pb-3">ID</th>
                        <th className="pb-3">Tanggal Dibuat</th>
                        <th className="pb-3 text-right pr-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rule/40">
                      {characters.map((character) => (
                        <tr
                          key={character.id}
                          className="group hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-3.5 pl-4 flex items-center gap-3">
                            <div className="size-10 overflow-hidden rounded-lg bg-surface flex items-center justify-center border border-rule/50">
                              {character.image ? (
                                <img
                                  src={character.image}
                                  alt={character.name}
                                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <ImageIcon className="size-5 text-ink-3" />
                              )}
                            </div>
                            <span className="font-medium text-sm text-ink">{character.name}</span>
                          </td>
                          <td className="py-3.5 text-sm text-ink-2 font-mono">#{character.id}</td>
                          <td className="py-3.5 text-sm text-ink-2">
                            {character.createdAt ? formatDate(character.createdAt) : '-'}
                          </td>
                          <td className="py-3.5 text-right pr-4">
                            <div className="inline-flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-8 rounded-lg text-ink-2 hover:bg-muted hover:text-ink"
                                onClick={() => editDialogRef.current?.editCharacter(character)}
                              >
                                <PencilIcon className="size-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-8 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/60 dark:hover:text-red-400"
                                onClick={() => deleteDialogRef.current?.deleteCharacter(character)}
                              >
                                <TrashIcon className="size-4" />
                                <span className="sr-only">Hapus</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
          <EditCharacterDialog ref={editDialogRef} />
          <DeleteCharacterDialog ref={deleteDialogRef} />
        </AdminContainer>
      </AdminLayout>
    </>
  )
}
