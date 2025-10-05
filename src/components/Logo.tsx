import Image from 'next/image'
import logoImage from '@/images/logo.png'

export function Logomark(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div {...props}>
      <Image src={logoImage} alt="Products Manager APP" width={40} height={40} />
    </div>
  )
}

export function Logo(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div {...props}>
      <Image
        src={logoImage}
        alt="Products Manager APP"
        width={200}
        height={50}
        priority
      />
    </div>
  )
}
