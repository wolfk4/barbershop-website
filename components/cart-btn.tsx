"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type AddToCartButtonProps = {
  itemId: string
  size: string
}

export function AddToCartButton({
  itemId,
  size,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)

  const addToCart = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/shop/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          size,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error ?? "Failed to add item to cart")
      }

      toast.success("Added to cart")
    } catch (error) {
      console.error("Error adding to cart:", error)

      toast.error(error instanceof Error ? error.message : "Failed to add item to cart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 w-full">
    <Button
      className="mt-6 w-full"
      onClick={addToCart}
      disabled={loading || size === ""}
    >
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
     <form
  action="/api/stripe/checkout"
  method="POST"
  className="mt-4 flex w-full max-w-sm flex-col gap-3"
>
  <input type="hidden" name="title" value={"Hoodie"} />

  <label htmlFor="customer_name">Your name</label>
  <input
    id="customer_name"
    name="customer_name"
    type="text"
    autoComplete="name"
    required
    minLength={2}
    maxLength={120}
    className="rounded border px-3 py-2"
  />

    <Button
      className="mt-6 w-full bg-[#635BFF]"
      onClick={addToCart}
      type="submit"
    >
      Checkout with Stripe
    </Button>
</form>
    </div>
  )
}