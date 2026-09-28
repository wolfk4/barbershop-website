import Footer from "@/components/footer"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db/drizzle"
import { orders, orderItems } from "@/db/schema"
import { eq } from "drizzle-orm"
 
 
async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
 
  let order
  let items
 
  // if the id in the url isnt a real uuid postgres throws, so catch it and show 404
  try {
    const result = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
 
    order = result[0]
 
    items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
  } catch (error) {
    console.error("Failed to fetch order:", error)
  }
 
  if (!order || !items) {
    notFound()
  }
 
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
 
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold mb-2">
            Thanks, {order.customerName}!
          </h2>
 
          <p className="text-gray-600 mb-1">
            Your order has been placed.
          </p>
 
          <p className="text-gray-600 mb-6">
            A confirmation email was sent to <strong>{order.customerEmail}</strong>.
          </p>
 
          <p className="text-sm text-gray-500 mb-4">
            Order #{order.id}
          </p>
 
          {/* Items */}
          <div className="space-y-3 border-t pt-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.title}
                  {item.size && <span className="text-gray-500"> ({item.size})</span>}
                  {item.quantity > 1 && <span className="text-gray-500"> x{item.quantity}</span>}
                </span>
 
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
 
          {/* Total */}
          <div className="border-t mt-4 pt-4 flex justify-between">
            <span className="text-lg font-semibold">
              Total
            </span>
 
            <span className="text-2xl font-bold">
              ${order.total.toFixed(2)}
            </span>
          </div>
 
          <Link href="/shop">
            <Button className="mt-8">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
 
      <Footer />
    </div>
  )
}
 
export default Page
 
