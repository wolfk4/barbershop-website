import Footer from "@/components/footer"
import Header from "@/components/header"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { OrdersManager } from "../components/orders-manager"
 
async function page() {
  const session = await auth()
 
  if (!session?.user) redirect("/login")
  if (session.user.role !== "admin") redirect("/")
 
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-black py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/admin" className="text-sm underline">← Back</Link>
          <OrdersManager />
        </div>
      </div>
      <Footer />
    </div>
  )
}
 
export default page
 