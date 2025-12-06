import Image from 'next/image'

type LogoProps = Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt'>

export function Logomark({ className, ...rest }: LogoProps) {
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

export function Logo({ className, ...rest }: LogoProps) {
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
