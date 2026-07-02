import { AdminContainer } from '@/components/container/admin-container'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Head } from '@inertiajs/react'

export default function DashboardPage() {
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
                Dasbor DobU
              </h1>
            </div>
          </header>
        </AdminContainer>
      </AdminLayout>
    </>
  )
}
