'use client'

import { usePathname } from 'next/navigation'

import { navigation, isGroup } from '@/lib/navigation'

export function DocsHeader({ title }: { title?: string }) {
  let pathname = usePathname()
  let section = navigation.find((item) =>
    !isGroup(item) && 'links' in item && item.links.find((link) => link.href === pathname),
  )

  let sectionTitle = section && 'title' in section ? section.title : undefined

  if (!title && !sectionTitle) {
    return null
  }

  return (
    <header className="mb-9 space-y-1">
      {sectionTitle && (
        <p className="font-display text-sm font-medium text-sky-500">
          {sectionTitle}
        </p>
      )}
      {title && (
        <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
      )}
    </header>
  )
}
