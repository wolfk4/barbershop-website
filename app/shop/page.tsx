'use client'
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
import { db } from "@/db/drizzle"
import { shopItems } from "@/db/schema"
import { useEffect, useState } from "react"
import { ShopItem } from "@/lib/types"


function Page() {
const [items, setItems] = useState([]);


useEffect(() => {
  const fetchItems = async () => {
    try {
      const response = await fetch("/api/shop");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch shop items:", error);
    }

  }
  fetchItems()
}, [])

  if(!items || items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          <h2 className="text-4xl font-bold mb-2">Shop Page</h2>
          <p className="text-gray-600 mb-10">
            Welcome to our shop!
          </p>
          <p className="text-gray-600 mb-10">
            No products available at the moment. Please check back later.
          </p>
        </div>
      </div>
    )
  }




  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <h2 className="text-4xl font-bold mb-2">Shop Page</h2>
        <p className="text-gray-600 mb-10">
          Welcome to our shop!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: ShopItem) => (
            <Link href={`/shop/${item.id}`} key={item.id}>
            <Card className="rounded-2xl shadow-md border" key={item.id}>
              <CardHeader>
                <img
                  src={item.image}
                  alt={item.title}

                className="rounded-xl object-cover"
              />

              <CardTitle className="mt-4 text-2xl">
                {item.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 mb-4">
                {item.description}
              </p>

              <p className="text-2xl font-bold">${item.price.toFixed(2)}</p>
            </CardContent>

            <CardFooter>
              <Link href={`/shop/${item.id}`}>
                <Button className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
          </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Page