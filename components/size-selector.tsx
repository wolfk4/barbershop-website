"use client"
 
import { useState } from "react"
import { AddToCartButton } from "@/components/cart-btn"
 
type SizeSelectorProps = {
  readonly itemId: string;
  readonly stockBySize: Record<string, number>; // sizes as keys, stock counts as values
};
 
export function SizeSelector({ itemId, stockBySize }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState("")
  const allSizes = ["S", "M", "L", "XL", "2XL"]
 
  const selectedStock = selectedSize ? stockBySize[selectedSize] ?? 0 : 0
 
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold uppercase tracking-wide">Size</span>
        {selectedSize && selectedStock > 0 && selectedStock <= 5 && (
          <span className="text-xs font-semibold text-red-600">
            Only {selectedStock} left
          </span>
        )}
      </div>
 
      <div className="grid grid-cols-5 gap-2">
        {allSizes.map((size) => {
          const isAvailable = (stockBySize[size] ?? 0) > 0
          const isSelected = selectedSize === size
 
          return (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              disabled={!isAvailable}
              aria-pressed={isSelected}
              title={isAvailable ? undefined : "Out of stock"}
              className={`h-12 rounded-full border text-sm font-semibold transition ${
                isSelected
                  ? "bg-black text-white border-black"
                  : isAvailable
                    ? "bg-white border-gray-300 hover:border-black"
                    : "bg-gray-50 border-gray-200 text-gray-300 line-through cursor-not-allowed"
              }`}
            >
              {size}
            </button>
          )
        })}
      </div>
 
      {allSizes.some((size) => !(stockBySize[size] > 0)) && (
        <p className="text-xs text-gray-400 mt-2">Crossed out sizes are sold out.</p>
      )}
 
      <AddToCartButton itemId={itemId} size={selectedSize} />
    </div>
  )
}
