import clsx from 'clsx'

import { Icon } from '@/components/Icon'

const styles = {
  note: {
    container:
      'bg-sky-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
    title: 'text-sky-900 dark:text-sky-400',
    body: 'text-sky-800 [--tw-prose-background:var(--color-sky-50)] prose-a:text-sky-900 prose-code:text-sky-900 dark:text-slate-300 dark:prose-code:text-slate-300',
  },
  warning: {
    container:
      'bg-amber-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
    title: 'text-amber-900 dark:text-amber-500',
    body: 'text-amber-800 [--tw-prose-underline:var(--color-amber-400)] [--tw-prose-background:var(--color-amber-50)] prose-a:text-amber-900 prose-code:text-amber-900 dark:text-slate-300 dark:[--tw-prose-underline:var(--color-sky-700)] dark:prose-code:text-slate-300',
  },
  success: {
    container:
      'bg-emerald-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
    title: 'text-emerald-900 dark:text-emerald-400',
    body: 'text-emerald-800 [--tw-prose-background:var(--color-emerald-50)] prose-a:text-emerald-900 prose-code:text-emerald-900 dark:text-slate-300 dark:prose-code:text-slate-300',
  },
  danger: {
    container:
      'bg-red-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
    title: 'text-red-900 dark:text-red-400',
    body: 'text-red-800 [--tw-prose-background:var(--color-red-50)] prose-a:text-red-900 prose-code:text-red-900 dark:text-slate-300 dark:prose-code:text-slate-300',
  },
  error: {
    container:
      'bg-red-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
    title: 'text-red-900 dark:text-red-400',
    body: 'text-red-800 [--tw-prose-background:var(--color-red-50)] prose-a:text-red-900 prose-code:text-red-900 dark:text-slate-300 dark:prose-code:text-slate-300',
  },
  info: {
    container:
      'bg-blue-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
    title: 'text-blue-900 dark:text-blue-400',
    body: 'text-blue-800 [--tw-prose-background:var(--color-blue-50)] prose-a:text-blue-900 prose-code:text-blue-900 dark:text-slate-300 dark:prose-code:text-slate-300',
  },
}

const icons = {
  note: (props: { className?: string }) => <Icon icon="lightbulb" {...props} />,
  warning: (props: { className?: string }) => (
    <Icon icon="warning" color="amber" {...props} />
  ),
  success: (props: { className?: string }) => (
    <Icon icon="lightbulb" {...props} />
  ),
  danger: (props: { className?: string }) => (
    <Icon icon="warning" color="amber" {...props} />
  ),
  error: (props: { className?: string }) => (
    <Icon icon="warning" color="amber" {...props} />
  ),
  info: (props: { className?: string }) => (
    <Icon icon="lightbulb" color="blue" {...props} />
  ),
}

export function Callout({
  title,
  children,
  type = 'note',
}: {
  title?: string
  children: React.ReactNode
  type?: keyof typeof styles
}) {
  let IconComponent = icons[type]

  return (
    <div className={clsx('my-8 flex rounded-3xl p-6', styles[type].container)}>
      <IconComponent className="h-8 w-8 flex-none" />
      <div className="ml-4 flex-auto">
        {title && (
          <p
            className={clsx('not-prose font-display text-xl', styles[type].title)}
          >
            {title}
          </p>
        )}
        <div className={clsx('prose mt-2.5', styles[type].body)}>
          {children}
        </div>
      </div>
    </div>
  )
}
