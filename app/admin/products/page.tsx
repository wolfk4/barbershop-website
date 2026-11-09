import Footer from "@/components/footer"
import Header from "@/components/header"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/db/drizzle"
import { shopItems } from "@/db/schema"
import { desc, isNull } from "drizzle-orm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DeleteProductButton } from "../components/delete-product-button"
import { Button } from "@/components/ui/button"
import { productImageUrl } from "@/lib/product-images"
 
async function page() {
  const session = await auth()
 
  if (!session?.user) redirect("/login")
  if (session.user.role !== "admin") redirect("/")
 
  const products = await db
    .select({
      id: shopItems.id,
      title: shopItems.title,
      price: shopItems.price,
      image: shopItems.image,
    })
    .from(shopItems)
    .where(isNull(shopItems.deletedAt))
    .orderBy(desc(shopItems.createdAt))
 
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-black py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/admin" className="text-sm underline">← Back</Link>
 
          <Card className="w-full mt-4">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Edit or delete products from the shop.</CardDescription>
            </CardHeader>
 
            <CardContent>
              {products.length === 0 ? (
                <p className="text-sm text-gray-500">No products yet.</p>
              ) : (
                <ul className="divide-y">
                  {products.map((product) => (
                    <li key={product.id} className="flex flex-wrap items-center gap-4 py-3">
                      {product.image ? (
                        <img
                          src={productImageUrl(product.id, product.image) ?? ""}
                          alt={product.title}
                          className="size-14 rounded-md object-cover"
                        />
                      ) : (
                        <div className="size-14 rounded-md bg-gray-200" />
                      )}
 
                      <div className="flex-1">
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-gray-500">${(product.price / 100).toFixed(2)}</p>
                      </div>
 
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/products/${product.id}/edit`} aria-label={`Edit ${product.title}`}>Edit</Link>
                      </Button>
                      <DeleteProductButton id={product.id} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
 
export default page
 