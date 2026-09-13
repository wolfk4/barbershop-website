"use client"

import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CartItem} from "@/lib/types"

function Page() {
  const [items, setItems] = useState<CartItem[]>([])

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
    }
    fetchItems()
  }, [])


  const removeItem = async (productId: string) => {
    try {
    const response = await fetch("/api/shop/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: productId }),
    })

    if (!response.ok) {
      throw new Error("errorr removing item")
    }

    // removes the item
    setItems(items.filter((item) => item.productId !== productId))
  } catch (error) {
    console.error("Unable to remove item:", error)
  }
}



  console.log("Cart items:", items)
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          <h2 className="text-4xl font-bold mb-2">
            Shopping Bag
          </h2>

          <p className="text-gray-600 mb-10">
            Your shopping bag is currently empty.
          </p>

          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-3">
                Your bag is empty
              </h3>

              <p className="text-gray-500 mb-6">
                Add some products to your shopping bag to get started.
              </p>

              <Link href="/shop">
                <Button>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  const total = items.reduce(
    (sum, item) => sum + item.price,
    0
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold">
            Shopping Bag
          </h2>

          <p className="text-gray-600 mt-2">
           {items.length} item{items.length !== 1 ? 's' : ''} in your bag
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row gap-5">

                  {/* Product Image */}
                  <Link
                    href={`/shop/${item.image}`}
                    className="shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full sm:w-36 h-36 object-cover rounded-xl"
                    />
                  </Link>

                  {/* Product Information */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link href={`/shop/${item.id}`}>
                          <h3 className="text-xl font-semibold hover:underline">
                            {item.title}
                          </h3>
                        </Link>

                        <p className="text-gray-500 mt-2 text-sm">
                          {item.description}
                        </p>
                      </div>

                      <p className="text-xl font-bold whitespace-nowrap">
                        ${item.price}
                      </p>
                    </div>

                    <div className="mt-auto pt-5 flex items-center justify-between">

                      {/* Quantity */}
                      <div className="flex items-center border rounded-lg">
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-9 w-9 p-0"
                        >
                          −
                        </Button>

                        <span className="w-10 text-center font-medium">
                          1
                        </span>

                        <Button
                          type="button"
                          variant="ghost"
                          className="h-9 w-9 p-0"
                        >
                          +
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link href="/shop">
                <Button variant="outline">
                  ← Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-2xl p-6 shadow-sm sticky top-6">
              <h3 className="text-2xl font-semibold mb-6">
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <span className="text-lg font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-bold">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link href="/checkout">
              <Button className="w-full mt-6 h-12 text-base">
                Proceed to Checkout
              </Button>
              </Link>

              <p className="text-xs text-gray-500 text-center mt-4">
                Taxes and shipping calculated at checkout.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Page