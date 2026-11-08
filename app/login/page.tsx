
import { SignIn } from '@/components/sign-in'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
 
function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-12 font-sans">
      <Link href="/" className="mb-8 flex flex-col items-center gap-3 text-white">
        <Image src="/KClogo.png" alt="Kaizen Cutz logo" width={96} height={96} priority />
        <span className="text-xl font-extrabold uppercase tracking-widest">Kaizen Cutz</span>
      </Link>
 
      <SignIn />
 
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gray-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to site
      </Link>
    </div>
  )
}
 
export default Page

