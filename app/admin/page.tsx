import Footer from "@/components/footer"
import Header from "@/components/header"
import { auth } from "@/auth"
import { SignOut } from "@/components/signout-btn"
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
        <div className="max-w-xl mx-auto flex flex-col gap-4">
          <h2 className="text-xl">Welcome, {session.user.name}!</h2>
          <Link
            href="/admin/products/new"
            className="bg-black text-white rounded p-2 text-center"
          >
            Create a product
          </Link>
          <Link
             href="/admin/products"
            className="bg-black text-white rounded p-2 text-center"
          >
            Delete a product
          </Link>
          <Link
            href="/admin/orders"
            className="bg-black text-white rounded p-2 text-center"
          >
            Manage orders
          </Link>
          <SignOut />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default page
