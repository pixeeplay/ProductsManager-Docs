import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import { navigation, isGroup } from '@/lib/navigation'

export function Navigation({
  className,
  onLinkClick,
}: {
  className?: string
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>
}) {
  let pathname = usePathname()

  return (
    <nav className={clsx('text-base lg:text-sm', className)} aria-label="Documentation">
      <ul role="list" className="space-y-9">
        {navigation.map((item, index) => {
          if (isGroup(item)) {
            return (
              <li key={item.group}>
                <h3 className="mt-2 border-b border-slate-200 pb-2 text-xs font-semibold uppercase tracking-wide text-sky-500 dark:border-slate-700">
                  {item.group}
                </h3>
              </li>
            )
          }

          return (
            <li key={item.title + '-' + index}>
              <h2 className="font-display font-medium text-slate-900 dark:text-white">
                {item.title}
              </h2>
              <ul
                role="list"
                className="mt-2 space-y-2 border-l-2 border-slate-100 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-800"
              >
                {item.links.map((link) => (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      onClick={onLinkClick}
                      className={clsx(
                        'block w-full pl-3.5 before:pointer-events-none before:absolute before:top-1/2 before:-left-1 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
                        link.href === pathname
                          ? 'font-semibold text-sky-500 before:bg-sky-500'
                          : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300',
                      )}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
