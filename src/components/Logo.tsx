import Image from 'next/image'

type LogoProps = Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt'>

function LogoImage({ className, ...rest }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Products Manager APP"
      width={36}
      height={36}
      className={className?.replace(/fill-\S+/g, '').trim()}
      style={{ height: '2.25rem', width: 'auto' }}
      priority
      {...rest}
    />
  )
}

// Logomark - smaller logo icon (same as Logo for this project)
export function Logomark(props: LogoProps) {
  return <LogoImage {...props} />
}

// Logo - full logo (same as Logomark for this project)
export function Logo(props: LogoProps) {
  return <LogoImage {...props} />
}
