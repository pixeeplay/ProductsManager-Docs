export function Logomark(props: React.ComponentPropsWithoutRef<'img'>) {
  const { className, ...rest } = props
  return (
    <img
      src="/logo.png"
      alt="Products Manager APP"
      className={className?.replace(/fill-\S+/g, '').trim()}
      style={{ height: '2.25rem', width: 'auto' }}
      {...rest}
    />
  )
}

export function Logo(props: React.ComponentPropsWithoutRef<'img'>) {
  const { className, ...rest } = props
  return (
    <img
      src="/logo.png"
      alt="Products Manager APP"
      className={className?.replace(/fill-\S+/g, '').trim()}
      style={{ height: '2.25rem', width: 'auto' }}
      {...rest}
    />
  )
}
