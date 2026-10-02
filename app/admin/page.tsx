import Footer from "@/components/footer"
import Header from "@/components/header"
import { CreateProductForm } from "./components/form"
import { auth } from "@/auth"
import { SignOut } from "@/components/signout-btn"




async function page() {
   const session = await auth()

   if (!session?.user) return null
  return (
    <div>
        <Header />
        <div className="items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
            <h2>Welcome, {session.user.name}!</h2>


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
        <Footer />
    </div>
  )
}

export default page