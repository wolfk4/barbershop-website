import Footer from "@/components/footer"
import Header from "@/components/header"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import Link from "next/link"

function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <h2 className="text-4xl font-bold mb-2">Shop Page</h2>
        <p className="text-gray-600 mb-10">
          Welcome to our shop!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="rounded-2xl shadow-md border">
            <CardHeader>
              <img
                src="/tshirt.jpg"
                alt="Product"
                className="rounded-xl object-cover"
              />

              <CardTitle className="mt-4 text-2xl">
                Kaiizen Cutz T-Shirt
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 mb-4">
                High quality product with modern design and great performance.
              </p>

              <p className="text-2xl font-bold">$49.99</p>
            </CardContent>

            <CardFooter>
              <Link href="/shop/1">
                <Button className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Page