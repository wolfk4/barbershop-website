"use client";

import { useState } from "react";

type SizeSelectorProps = {
  readonly sizes: Array<{ size: string | null; stock: number }>;
};

export function SizeSelector ({ sizes }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState("");

    return (
  <div>
    <select
      id="size"
      value={selectedSize}
      onChange={(event) => setSelectedSize(event.target.value)}
      className="h-10 w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-center"
    >
      <option value="">Select a size</option>

      {sizes.map(({ size, stock }) => {
        if (!size) return null;
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