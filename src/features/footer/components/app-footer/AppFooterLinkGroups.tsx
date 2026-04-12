import { Link } from 'react-router-dom'

import type { FooterLinkGroup } from '@/features/footer/logic/footer.types'

type AppFooterLinkGroupsProps = {
  groups: FooterLinkGroup[]
}

export function AppFooterLinkGroups({ groups }: AppFooterLinkGroupsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {groups.map((group) => (
        <div key={group.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{group.title}</h4>
          <ul className="mt-4 space-y-2.5">
            {group.links.map((link) => (
              <li key={link.id}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-slate-700 transition-colors hover:text-orange-700"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className="text-sm font-medium text-slate-700 transition-colors hover:text-orange-700"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}