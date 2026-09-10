import Footer from "@/components/footer"
import Header from "@/components/header"
import { CreateProductForm } from "./components/form"




function page() {
  return (
    <div>
        <Header />
        <div className="items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
            <h2> Admin Portal</h2>


            <div>
              <div className="max-w-xl mx-auto">
                <h2>Create Products</h2>
                <CreateProductForm />
              </div>
              
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default page