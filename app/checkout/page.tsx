"use client"
 
import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CartItem } from "@/lib/types"
 
 
function Page() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [placingOrder, setPlacingOrder] = useState(false)
 
  // load cart items for the summary
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/shop/cart")
 
        if (!response.ok) {
          throw new Error("Failed to fetch cart")
        }
 
        const data = await response.json()
        setItems(data)
      } catch (error) {
        console.error("Failed to fetch cart:", error)
      }
      setLoading(false)
    }
 
    fetchItems()
  }, [])
 
  const total = items.reduce(
    (sum, item) => sum + item.price,
    0
  )
 
  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault()
 
    // stops double clicks
    if (placingOrder) return
    setPlacingOrder(true)
 
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      })
 
      if (!response.ok) {
        throw new Error("Order failed")
      }
 
      const data = await response.json()
      toast.success("Order placed successfully! Check your email for confirmation.")
 
      // wait a sec so they can see the popup before we redirect
      setTimeout(() => {
        router.push(`/order-confirmation/${data.orderId}`)
      }, 1500)
    } catch (error) {
      console.error("Failed to place order:", error)
      toast.error("Order failed. Please check your details and try again.")
      setPlacingOrder(false)
    }
  }
 
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          <p className="text-gray-500">Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }
 
  // nothing to check out
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
 
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          <h2 className="text-4xl font-bold mb-8">
            Checkout
          </h2>
 
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">
              Your bag is empty.
            </p>
 
            <Link href="/shop">
              <Button>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
 
        <Footer />
      </div>
    )
  }
 
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
 
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <h2 className="text-4xl font-bold mb-8">
          Checkout
        </h2>
 
        <form
          onSubmit={placeOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
 
          {/* Customer Info */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-2xl font-semibold">
              Your Info
            </h3>
 
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={placingOrder}
              />
            </div>
 
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={placingOrder}
              />
              {/* confirmation email goes to this address */}
              <p className="text-xs text-gray-500">
                Your order confirmation will be sent here.
              </p>
            </div>
 
            <Link href="/shop/cart">
              <Button type="button" variant="outline">
                ← Back to Bag
              </Button>
            </Link>
          </div>
 
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-2xl p-6 shadow-sm sticky top-6">
              <h3 className="text-2xl font-semibold mb-6">
                Order Summary
              </h3>
 
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.uid} className="flex justify-between text-sm">
                    <span>
                      {item.title}
                      {item.size && <span className="text-gray-500"> ({item.size})</span>}
                    </span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
 
              <div className="border-t pt-4 flex justify-between">
                <span className="text-lg font-semibold">
                  Total
                </span>
 
                <span className="text-2xl font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
 
              {/* disabled while the order is going through */}
              <Button
                type="submit"
                className="w-full mt-6 h-12 text-base"
                disabled={placingOrder}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
 
        </form>
      </main>
 
      <Footer />
    </div>
  )
}
 
export default Page
 
