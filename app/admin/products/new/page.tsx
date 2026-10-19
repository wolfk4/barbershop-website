import Footer from "@/components/footer"
import Header from "@/components/header"
import { CreateProductForm } from "../../components/form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

async function page() {
  const session = await auth()

  if (!session?.user) redirect("/login")
  if (session.user.role !== "admin") redirect("/")

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-black py-8">
        <div className="max-w-xl mx-auto">
          <Link href="/admin" className="text-sm underline">← Back</Link>
          <h2 className="text-xl my-4">Create Product</h2>
          <CreateProductForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default page
