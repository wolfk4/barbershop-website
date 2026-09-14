"use client";

import { useState } from "react";

type SizeSelectorProps = {
    readonly stockBySize: Record<string, number>; // Object with sizes as keys and stock counts as values
};

export function SizeSelector ({ stockBySize }: SizeSelectorProps) {
    const [selectedSize, setSelectedSize] = useState("");
    const allSizes = ["S", "M", "L", "XL", "2XL"]; // Defines all possibles sizes

    return (
  <div>
    <select
      id="size"
      value={selectedSize}
      onChange={(event) => setSelectedSize(event.target.value)}
      className="rounded-md border border-gray-400 bg-white px-3 py-2 text-center"
    >
      <option value="">Select a size</option>

      {allSizes.map((size) => {
        const stock = stockBySize[size] ?? 0;
        const isAvailable = stock > 0;

        return (
          <option key={size} value={size} disabled={!isAvailable}>
            {isAvailable ? size : `${size} (Out of stock)`}
          </option>
        );
      })}
    </select>
  </div>
);
}