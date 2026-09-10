"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type AddToCartButtonProps = {
  itemId: string
}

export function AddToCartButton({
  itemId,
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
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to cart")
      }

      toast.success("Added to cart")
    } catch (error) {
      console.error("Error adding to cart:", error)

      toast.error("Failed to add item to cart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className="mt-6 w-full"
      onClick={addToCart}
      disabled={loading}
    >
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  )
}