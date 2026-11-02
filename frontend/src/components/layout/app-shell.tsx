import { Briefcase, FileText, Landmark, LayoutDashboard, ListChecks, Users, type LucideIcon } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { TickIcon } from '@/components/ui/tick-icon'
import { cn } from '@/lib/utils'

const NAV_ITEMS: readonly { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/', label: 'Pulpit', icon: LayoutDashboard, end: true },
  { to: '/rozliczenia', label: 'Rozliczenia', icon: ListChecks },
  { to: '/transakcje', label: 'Transakcje', icon: Landmark },
  { to: '/faktury', label: 'Faktury', icon: FileText },
  { to: '/kontrahenci', label: 'Kontrahenci', icon: Users },
  { to: '/uslugi', label: 'Usługi', icon: Briefcase },
]

export function AppShell() {
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[16rem_minmax(0,1fr)] md:gap-2 md:p-3">
      <a
        href="#main"
        className="sr-only z-10 rounded-control bg-sheet px-3 py-2 text-pen focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Przejdź do treści
      </a>

      <aside className="glass sticky top-0 z-20 flex flex-col border-b border-rule-soft md:top-3 md:h-[calc(100dvh-1.5rem)] md:rounded-card md:border md:shadow-card">
        <div className="flex items-center gap-2.5 px-4 py-4 md:px-5 md:py-6">
          <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-pen to-tick text-white shadow-pop">
            <TickIcon className="size-5" />
          </span>
          <span className="text-gradient font-display text-xl font-semibold tracking-tight">Uzgodnienia</span>
        </div>

        <nav aria-label="Główne" className="px-3 pb-3 md:flex-1 md:pb-0">
          <ul className="flex gap-1 overflow-x-auto md:flex-col">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-control px-3 py-2 whitespace-nowrap transition-all duration-150',
                      isActive
                        ? 'bg-pen-soft font-medium text-pen shadow-sm'
                        : 'text-ink-soft hover:bg-rule-soft hover:text-ink',
                    )
                  }
                >
                  <Icon aria-hidden className="size-[1.125rem]" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mx-3 mb-3 hidden rounded-control bg-pen-soft px-3 py-2.5 text-xs text-ink-soft md:block">
          Dane demonstracyjne. Backend jest zastąpiony mockami.
        </p>
      </aside>

      <main id="main" className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
