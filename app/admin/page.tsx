import Footer from "@/components/footer"
import Header from "@/components/header"
import { auth } from "@/auth"
import { SignOut } from "@/components/signout-btn"
import { EmployeeList } from "./components/employee-list"




async function page() {
  const session = await auth()

  if (!session?.user) redirect("/login")
  if (session.user.role !== "admin") redirect("/")

  return (
    <div>
        <Header />
        <div className="items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
            <h2>Welcome, {session.user.name}!</h2>
            <div>
              <div className="max-w-xl mx-auto">
                <EmployeeList />
              </div>
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
