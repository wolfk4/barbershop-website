"use client"
 
import Footer from "@/components/footer"
import Header from "@/components/header"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CartItem } from "@/lib/types"
import { ShoppingBag, X } from "lucide-react"
 
function Page() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/shop/cart")
        if (!response.ok) throw new Error("Failed to fetch cart")
        const data = await response.json()
        setItems(data)
      } catch (error) {
        console.error("Failed to fetch cart:", error)
      } finally {
        setLoading(false)
      }
    }
 
    fetchItems()
  }, [])
 
  const removeItem = async (uid: string) => {
    try {
      const response = await fetch(`/api/shop/cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      })
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.uid !== uid))
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error)
    }
  }
 
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const isEmpty = !loading && items.length === 0
 
  return (
    <div className="font-sans bg-white text-black min-h-screen flex flex-col">
      <Header />
 
      {/* title */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <p className="uppercase tracking-[0.3em] text-sm text-gray-400 mb-3">
          Kaizen Cutz
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Shopping Bag</h1>
        <p className="text-gray-300">
          {loading
            ? "Loading your bag..."
            : isEmpty
              ? "Your bag is empty."
              : `${itemCount} item${itemCount !== 1 ? "s" : ""} in your bag`}
        </p>
      </section>
 
      <main className="flex-1 max-w-300 mx-auto w-full px-6 py-16">
        {loading ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {[0, 1].map((i) => (
                <div key={i} className="h-44 border rounded-2xl bg-gray-50 animate-pulse" />
              ))}
            </div>
            <div className="h-72 border rounded-2xl bg-gray-50 animate-pulse" />
          </div>
        ) : isEmpty ? (
          <div className="border rounded-2xl py-20 px-6 text-center">
            <div className="bg-black text-white rounded-full p-4 w-fit mx-auto mb-6">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Nothing here yet</h2>
            <p className="text-gray-500 mb-8">
              Check out the shop and grab some Kaizen Cutz gear.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white font-semibold uppercase tracking-wide px-8 py-3 rounded-full hover:bg-gray-800 transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            {/* cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.uid}
                  className="flex flex-col sm:flex-row gap-5 border rounded-2xl p-5 hover:border-black hover:shadow-md transition"
                >
                  <Link href={`/shop/${item.productId}`} className="shrink-0">
                    {item.image && <img
                      src={item.image}
                      alt={item.title}
                      className="w-full sm:w-36 h-36 object-cover rounded-xl bg-gray-100"
                    />}
                  </Link>
 
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link href={`/shop/${item.productId}`}>
                          <h3 className="text-xl font-semibold hover:underline">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.size && (
                            <span className="text-xs font-semibold uppercase tracking-wide border border-black rounded-full px-3 py-1">
                              Size {item.size.toUpperCase()}
                            </span>
                          )}
                          <span className="text-xs font-semibold uppercase tracking-wide bg-gray-100 rounded-full px-3 py-1">
                            Qty {item.quantity}
                          </span>
                        </div>
                      </div>
 
                      <p className="text-xl font-bold whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
 
                    <div className="mt-auto pt-5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeItem(item.uid)}
                        className="flex items-center gap-1 text-sm font-semibold text-gray-500 rounded-full px-4 py-2 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <X className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
 
              <Link
                href="/shop"
                className="inline-block mt-4 border border-black font-semibold uppercase tracking-wide text-sm px-8 py-3 rounded-full hover:bg-black hover:text-white transition"
              >
                ← Continue Shopping
              </Link>
            </div>
 
            {/* order summary */}
            <div>
              <div className="border rounded-2xl p-6 sticky top-6">
                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
 
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
 
                <div className="flex justify-between items-center bg-black text-white rounded-xl px-4 py-4 mt-5">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                </div>
 
                <Link
                  href="/checkout"
                  className="block text-center mt-6 bg-black text-white font-bold uppercase tracking-wide py-4 rounded-full hover:bg-gray-800 transition"
                >
                  Checkout
                </Link>
 
                <p className="text-xs text-gray-500 text-center mt-4">
                  Taxes calculated at checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
 
      <Footer />
    </div>
  )
}
 
export default Page
