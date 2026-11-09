import Footer from "@/components/footer"
import Header from "@/components/header"
import { auth } from "@/auth"
import { db } from "@/db/drizzle"
import { productBySize, shopItems } from "@/db/schema"
import { and, eq, isNull } from "drizzle-orm"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { CreateProductForm } from "../../../components/form"
import { productImageUrl } from "@/lib/product-images"

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "admin") redirect("/")

  const { id } = await params
  if (!uuidPattern.test(id)) notFound()
  const [product] = await db.select().from(shopItems)
    .where(and(eq(shopItems.id, id), isNull(shopItems.deletedAt))).limit(1)
  if (!product) notFound()

  const variants = await db.select({ size: productBySize.size, stock: productBySize.stock })
    .from(productBySize).where(eq(productBySize.productId, id))
  let sizes: { size: string; stock: number }[]
  if (variants.length) {
    sizes = variants.map(({ size, stock }) => {
      if (!size || stock === null || stock < 0) throw new Error("Invalid product stock data.")
      return { size, stock }
    })
  } else if (product.stockBySize) {
    const stock: unknown = JSON.parse(product.stockBySize)
    if (!stock || typeof stock !== "object" || Array.isArray(stock)) throw new Error("Invalid product stock data.")
    sizes = Object.entries(stock).map(([size, value]) => {
      if (!size || typeof value !== "number" || !Number.isInteger(value) || value < 0) throw new Error("Invalid product stock data.")
      return { size, stock: value }
    })
  } else {
    sizes = []
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-black py-8">
        <div className="max-w-xl mx-auto px-4">
          <Link href="/admin/products" className="text-sm underline">← Back to products</Link>
          <div className="mt-4">
            <CreateProductForm product={{
              id: product.id,
              title: product.title,
              description: product.description,
              price: product.price,
              image: productImageUrl(product.id, product.image),
              sizes,
              hasStripePrice: !!product.stripeLink,
            }} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
