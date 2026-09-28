"use client"

import { useState } from "react"
import { AddToCartButton } from "@/components/cart-btn"
import { SizeSelector } from "@/components/size-selector"

type ProductPurchaseControlsProps = {
  readonly itemId: string
  readonly sizes: Array<{ size: string | null; stock: number }>
}

export function ProductPurchaseControls(props: Readonly<ProductPurchaseControlsProps>) {
  const [selectedSize, setSelectedSize] = useState("")
  const { itemId, sizes } = props

  return (
    <>
      <SizeSelector
        sizes={sizes}
        onSizeChange={setSelectedSize}
      />
      <AddToCartButton itemId={itemId} size={selectedSize} />
    </>
  )
}