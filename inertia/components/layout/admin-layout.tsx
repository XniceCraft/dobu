import { AdminSidebar } from '@/components/sidebar/admin-sidebar'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-no-wrap min-h-screen">
      <AdminSidebar />
      <main className="h-screen w-full bg-paper px-4 py-8 text-ink sm:px-6 lg:px-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
