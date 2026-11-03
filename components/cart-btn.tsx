"use client"
 
import { useState } from "react"
import { toast } from "sonner"
import { ShoppingBag } from "lucide-react"
 
type AddToCartButtonProps = {
  itemId: string
  size: string
}
 
export function AddToCartButton({ itemId, size }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
 
  const addToCart = async () => {
    try {
      setLoading(true)
 
      const response = await fetch("/api/shop/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, size }),
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
    <button
      type="button"
      onClick={addToCart}
      disabled={loading || size === ""}
      className="mt-6 w-full flex items-center justify-center gap-2 bg-black text-white font-bold uppercase tracking-wide py-4 rounded-full hover:bg-gray-800 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
    >
      <ShoppingBag className="w-5 h-5" />
      {loading ? "Adding..." : size === "" ? "Select a Size" : "Add to Cart"}
    </button>
  )
}
