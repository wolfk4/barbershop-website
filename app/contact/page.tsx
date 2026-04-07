import Footer from "@/components/footer"
import Header from "@/components/header"



function page() {
  return (
    <div>
        <Header />

        <h2 className="text-[52px] font-bold mb-4 pt-20 mx-auto text-center">Contact</h2>
    
    
      <div className="w-full flex mx-auto max-w-1/2 pt-30">

        
        <div className="w-1/2 flex flex-col justify-center p-8">
          
          <p className="text-xl mb-2">5411 San Juan Ave, Citrus Heights, CA 95610</p>
          <p className="text-xl mb-2">Phone: (916) 844-7020</p>
          <p className="text-xl mb-2">Email: info@barbershop.com</p>
        </div>
        <div className="w-1/2 ">
          <iframe
          src="https://www.google.com/maps?q=5411+San+Juan+Ave&output=embed"
          className="w-full h-125"
        />


        </div>
    </div>
    <Footer />
    </div>
  )
}

export default page