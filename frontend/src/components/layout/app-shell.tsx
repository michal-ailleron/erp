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
    <div className="min-h-dvh md:grid md:grid-cols-[14.5rem_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only z-10 bg-sheet px-3 py-2 text-pen focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Przejdź do treści
      </a>

      <aside className="flex flex-col border-b border-rule bg-sheet md:sticky md:top-0 md:h-dvh md:border-r md:border-b-0">
        <div className="flex items-center gap-2 px-4 py-4 md:py-6">
          <TickIcon className="size-6 text-tick" />
          <span className="font-serif text-2xl tracking-tight text-ink">Uzgodnienia</span>
        </div>

        <nav aria-label="Główne" className="px-2 pb-2 md:flex-1 md:pb-0">
          <ul className="flex gap-1 overflow-x-auto md:flex-col">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-control px-3 py-2 whitespace-nowrap',
                      isActive ? 'bg-pen-soft font-medium text-pen' : 'text-ink-soft hover:bg-rule-soft hover:text-ink',
                    )
                  }
                >
                  <Icon aria-hidden className="size-4" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <p className="hidden px-4 py-4 text-xs text-ink-faint md:block">
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
