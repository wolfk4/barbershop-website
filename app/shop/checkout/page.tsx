"use client"

import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import type { CartItem } from "@/lib/types"
import Link from "next/link"
import { useEffect, useState } from "react"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isActive = true

    const loadCart = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/shop/cart", { cache: "no-store" })

        if (!response.ok) {
          throw new Error("Could not load your cart")
        }

        const cartItems: CartItem[] = await response.json()

        if (isActive) {
          setItems(cartItems)
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Could not load your cart")
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadCart()

    return () => {
      isActive = false
    }
  }, [reloadKey])

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Link href="/shop/cart" className="text-sm underline underline-offset-4">
            Back to cart
          </Link>
        </div>

        <section aria-labelledby="order-summary-heading" className="border-y border-gray-300 py-6">
          <h2 id="order-summary-heading" className="mb-6 text-xl font-semibold">
            Order Summary
          </h2>

          {isLoading && (
            <output className="py-8 text-gray-600">
              Loading order summary...
            </output>
          )}

          {!isLoading && error && (
            <div role="alert" className="py-8">
              <p className="mb-4 text-red-700">{error}</p>
              <Button type="button" variant="outline" onClick={() => setReloadKey((key) => key + 1)}>
                Try again
              </Button>
            </div>
          )}

          {!isLoading && !error && items.length === 0 && (
            <div className="py-8">
              <p className="mb-4 text-gray-600">Your cart is empty.</p>
              <Link href="/shop">
                <Button variant="outline">Continue shopping</Button>
              </Link>
            </div>
          )}

          {!isLoading && !error && items.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm text-gray-600">
                      <th scope="col" className="pb-3 pr-4 font-medium">Item</th>
                      <th scope="col" className="pb-3 px-4 font-medium">Size</th>
                      <th scope="col" className="pb-3 px-4 text-right font-medium">Quantity</th>
                      <th scope="col" className="pb-3 pl-4 text-right font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 last:border-0">
                        <th scope="row" className="py-4 pr-4 font-medium">{item.title}</th>
                        <td className="py-4 px-4 text-gray-600">{item.size.toUpperCase()}</td>
                        <td className="py-4 px-4 text-right">{item.quantity}</td>
                        <td className="py-4 pl-4 text-right font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ml-auto mt-6 flex max-w-sm justify-between border-t border-gray-300 pt-4 text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}