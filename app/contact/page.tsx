import Footer from "@/components/footer"
import Header from "@/components/header"

function Page() {
  const hours = [
    { day: "Sunday", open: "10:00 AM", closed: "5:00 PM" },
    { day: "Monday", open: "10:00 AM", closed: "6:00 PM" },
    { day: "Tuesday", open: "10:00 AM", closed: "6:00 PM" },
    { day: "Wednesday", open: "10:00 AM", closed: "6:00 PM" },
    { day: "Thursday", open: "10:00 AM", closed: "6:00 PM" },
    { day: "Friday", open: "10:00 AM", closed: "6:00 PM" },
    { day: "Saturday", open: "9:00 AM", closed: "5:00 PM" },
  ]

  return (
    <div>
      <Header />
      <div className="pb-12">
      <h2 className="text-[52px] font-bold mb-4 pt-20 mx-auto text-center">
        Contact
      </h2>

      <div className="w-full flex mx-auto max-w-[1200px] pt-20 gap-10 px-6">
        
        <div className="w-1/2 flex flex-col justify-center">
          <p className="text-xl mb-2">
            5411 San Juan Ave, Citrus Heights, CA 95610
          </p>

          <p className="text-xl mb-2">
            Phone: (916) 844-7020
          </p>

          <p className="text-xl mb-6">
            Email: info@barbershop.com
          </p>

          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">
              Business Hours
            </h3>

            <div className="space-y-2">
              {hours.map((hour) => (
                <div
                  key={hour.day}
                  className="flex justify-between border-b pb-2 text-lg"
                >
                  <span className="font-medium">
                    {hour.day}
                  </span>

                  <span>
                    {hour.open} - {hour.closed}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <iframe
            src="https://www.google.com/maps?q=5411+San+Juan+Ave&output=embed"
            className="w-full h-[500px] rounded-xl"
          />
        </div>
      </div>
      </div>

      <Footer />
    </div>
  )
}

export default Page