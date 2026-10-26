import Footer from "@/components/footer"
import Header from "@/components/header"
import { auth } from "@/auth"
import { SignOut } from "@/components/signout-btn"
import { EmployeeList } from "./components/employee-list"
import { CreateEmployeeForm } from "./components/create-employee"


async function page() {
  const session = await auth()

  if (!session?.user) redirect("/login")
  if (session.user.role !== "admin") redirect("/")

  return (
    <div>
        <Header />
        <div className="items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
            <h2>Welcome, {session.user.name}!</h2>
            <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 md:grid-cols-2">
              <section>
                <EmployeeList />
              </section>
              <section>
                <CreateEmployeeForm />
              </section>
            </div>
            <div>
              <div className="max-w-xl mx-auto">
                <h2>Create Products</h2>
                <CreateProductForm />
              </div>
              <div className="max-w-xl mx-auto mt-8">
                <SignOut />
              </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default page
