"use client"
 
import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
 
const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]
 
type Order = {
  id: string
  customerName: string
  total: number
  status: string
  items: { title: string; size: string | null; quantity: number }[]
}
 
export function OrdersManager() {
  const [orders, setOrders] = React.useState<Order[]>([])
  const [loading, setLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState(false)
 
  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/orders")
        if (!res.ok) throw new Error()
        setOrders(await res.json())
      } catch {
        setLoadError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
 
  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>View orders and update their status.</CardDescription>
      </CardHeader>
 
      <CardContent>
        {loading && <p className="text-sm text-gray-500">Loading orders...</p>}
 
        {!loading && loadError && (
          <p className="text-sm text-red-600">Couldn't load orders.</p>
        )}
 
        {!loading && !loadError && orders.length === 0 && (
          <p className="text-sm text-gray-500">No orders yet.</p>
        )}
 
        {!loading && !loadError && orders.length > 0 && (
          <ul className="divide-y">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
 
function OrderRow({ order }: { order: Order }) {
  // savedStatus is what's in the database, selected is what's in the dropdown
  const [savedStatus, setSavedStatus] = React.useState(order.status)
  const [selected, setSelected] = React.useState(order.status)
  const [saving, setSaving] = React.useState(false)
 
  const savedLabel =
    STATUSES.find((s) => s.value === savedStatus)?.label ?? savedStatus
 
  async function updateStatus() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selected }),
      })
      if (!res.ok) throw new Error()
 
      setSavedStatus(selected)
      toast.success("Order status updated.", { position: "bottom-right" })
    } catch {
      setSelected(savedStatus)
      toast.error("Update failed.", { position: "bottom-right" })
    } finally {
      setSaving(false)
    }
  }
 
  return (
    <li className="py-4 flex flex-col gap-3">
      <div className="flex flex-wrap justify-between gap-2">
        <div>
          <p className="font-medium">{order.customerName}</p>
          <p className="text-xs text-gray-500 break-all">Order #{order.id}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">${order.total.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Status: {savedLabel}</p>
        </div>
      </div>
 
      {order.items.length === 0 ? (
        <p className="text-sm text-gray-500">No items</p>
      ) : (
        <ul className="text-sm">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.title}
              {item.size && <span className="text-gray-500"> ({item.size})</span>}
              <span className="text-gray-500"> x{item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
 
      <div className="flex items-center gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border rounded-md h-9 px-2 text-sm bg-white dark:bg-black"
          aria-label="Order status"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <Button size="sm" onClick={updateStatus} disabled={saving || selected === savedStatus}>
          {saving ? "Updating..." : "Update Status"}
        </Button>
      </div>
    </li>
  )
}
 