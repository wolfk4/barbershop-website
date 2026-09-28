"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/cart-btn"

type SizeSelectorProps = {
    readonly itemId: string;
    readonly stockBySize: Record<string, number>; // Object with sizes as keys and stock counts as values
};

export function SizeSelector({ itemId, stockBySize }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState("")
  const allSizes = ["S", "M", "L", "XL", "2XL"]; // Defines all possibles sizes

  return (
    <div>
      <div className="flex gap-2">
        {allSizes.map((size) => {
          const stock = stockBySize[size] ?? 0;
          const isAvailable = stock > 0;

          return (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              onClick={() => setSelectedSize(size)}
              disabled={!isAvailable}
            >
              {isAvailable ? size : `${size} (Out of stock)`}
            </Button>
          );
        })}
      </div>

      <AddToCartButton itemId={itemId} size={selectedSize} />
    </div>
  )
}