
'use client'
import Footer from "@/components/footer"
import Header from "@/components/header"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ShopItem } from "@/lib/types"
import { ShoppingBag } from "lucide-react"
 
function Page() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/shop")
        const data = await response.json()
        setItems(data)
      } catch (error) {
        console.error("Failed to fetch shop items:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])
 
  const isEmpty = !loading && (!items || items.length === 0)
 
  return (
    <div className="font-sans bg-white text-black min-h-screen flex flex-col">
      <Header />
 
      {/* title */}
      <section className="bg-black text-white py-14 md:py-16 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-widest">Shop</h1>
      </section>
 
      <main className="flex-1 max-w-300 mx-auto w-full px-6 py-16 text-left">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
                <div className="h-5 w-1/2 bg-gray-100 rounded mt-4 animate-pulse" />
                <div className="h-5 w-1/4 bg-gray-100 rounded mt-2 animate-pulse" />
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="border rounded-2xl py-20 px-6 text-center">
            <div className="bg-black text-white rounded-full p-4 w-fit mx-auto mb-6">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Nothing in stock right now</h2>
            <p className="text-gray-500">Check back soon for new merch.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <Link href={`/shop/${item.id}`} key={item.id} className="group">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border group-hover:border-black transition">
                    {item.image && <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />}
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition bg-white text-black text-xs font-bold uppercase tracking-wide px-5 py-2 rounded-full whitespace-nowrap">
                      View Product
                    </span>
                  </div>
 
                  <div className="flex items-start justify-between gap-4 mt-4">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold group-hover:underline truncate">
                        {item.title}
                      </h2>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <p className="text-lg font-bold whitespace-nowrap">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
 
      <Footer />
    </div>
  )
}
 
export default Page


