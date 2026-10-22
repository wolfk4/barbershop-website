"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = React.useState(false)

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this product?")) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()

      toast.success("Product deleted.", { position: "bottom-right" })
      router.refresh()
    } catch {
      toast.error("Deletion failed.", { position: "bottom-right" })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
      {deleting ? "Deleting..." : "Delete"}
    </Button>
  )
}