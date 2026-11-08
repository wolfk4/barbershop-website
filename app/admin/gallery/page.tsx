import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { auth } from "@/auth"
import Header from "@/components/header"
import Footer from "@/components/footer"
import GalleryPortfolioManager from '../components/GalleryPortfolioManager'
 
async function Page() {
  // same check as /admin so only admins can get in
  const session = await auth()
 
  if (!session?.user) redirect("/login")
  if (session.user.role !== "admin") redirect("/")
 
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-black">
      <Header />
 
      {/* title - same black banner as the other pages */}
      <section className="bg-black px-6 py-14 text-center text-white md:py-16">
        <h1 className="text-4xl font-extrabold uppercase tracking-widest md:text-6xl">Gallery</h1>
      </section>
 
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <Link
          href="/admin"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Link>
 
        <GalleryPortfolioManager />
      </main>
 
      <Footer />
    </div>
  )
}
 
export default Page
 