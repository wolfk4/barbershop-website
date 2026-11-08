import { NewPasswordForm } from '@/components/NewPasswordForm'
import Image from 'next/image'
import Link from 'next/link'
 
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
 
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-12 font-sans">
      <Link href="/" className="mb-8 flex flex-col items-center gap-3 text-white">
        <Image src="/KClogo.png" alt="Kaizen Cutz logo" width={96} height={96} priority />
        <span className="text-xl font-extrabold uppercase tracking-widest">Kaizen Cutz</span>
      </Link>
      <NewPasswordForm token={token ?? ""} />
    </div>
  )
}

