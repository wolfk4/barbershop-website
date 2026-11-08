import Footer from "@/components/footer"
import Header from "@/components/header"
import { auth } from "@/auth"
import { SignOut } from "@/components/signout-btn"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ClipboardList, Images, Package, Settings } from "lucide-react"
import { EmployeeList } from "./components/employee-list"
import { CreateEmployeeForm } from "./components/create-employee"
import { CreateProductForm } from "./components/form"
 
// quick links so admins don't have to type the urls
const adminLinks = [
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]
 
async function page() {
  const session = await auth()
 
  if (!session?.user) redirect("/login")
  if (session.user.role !== "admin") redirect("/")
 
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-black">
      <Header />
 
      {/* title - same black banner as the other pages */}
      <section className="bg-black px-6 py-14 text-center text-white md:py-16">
        <h1 className="text-4xl font-extrabold uppercase tracking-widest md:text-6xl">Admin</h1>
        <p className="mt-4 text-gray-300">Welcome, {session.user.name}!</p>
      </section>
 
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-14 px-6 py-12">
        {/* quick links + sign out */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav className="flex flex-wrap gap-3">
            {adminLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-full border border-black px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition hover:bg-black hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <SignOut />
        </div>
 
        {/* team */}
        <section>
          <h2 className="mb-6 text-2xl font-extrabold uppercase tracking-widest">Team</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <EmployeeList />
            <CreateEmployeeForm />
          </div>
        </section>
 
        {/* products */}
        <section>
          <h2 className="mb-6 text-2xl font-extrabold uppercase tracking-widest">New Product</h2>
          {/* keep the form from stretching too wide */}
          <div className="max-w-2xl">
            <CreateProductForm />
          </div>
        </section>
      </main>
 
      <Footer />
    </div>
  )
}
 
export default page

