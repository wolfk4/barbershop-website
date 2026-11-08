"use client"
 
import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group"
 
const SIZES = ["S", "M", "L", "XL", "XXL"]
 
type Errors = {
  name?: string
  description?: string
  price?: string
  sizes?: string
  stock?: Record<string, string>
}

type Product = {
  id: string
  title: string
  description: string | null
  price: number
  image: string | null
  sizes: { size: string; stock: number }[]
  hasStripePrice: boolean
}

export function CreateProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const formRef = React.useRef<HTMLFormElement>(null)
  const [sizes, setSizes] = React.useState<string[]>(product?.sizes.map((item) => item.size) ?? [])
  const [errors, setErrors] = React.useState<Errors>({})
  const [submitting, setSubmitting] = React.useState(false)
  const availableSizes = Array.from(new Set([...SIZES, ...(product?.sizes.map((item) => item.size) ?? [])]))
  const formId = product ? "edit-product-form" : "create-product-form"
 
  function toggleSize(size: string) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }
 
  function resetForm() {
    formRef.current?.reset()
    setSizes(product?.sizes.map((item) => item.size) ?? [])
    setErrors({})
  }
 
  function validate(data: FormData): Errors {
    const errs: Errors = {}
 
    if (!String(data.get("name") ?? "").trim()) errs.name = "Product name is required."
    if (!String(data.get("description") ?? "").trim()) errs.description = "Description is required."
    if (product && String(data.get("name") ?? "").trim().length > 255) errs.name = "Product name must be 255 characters or fewer."
 
    const priceRaw = String(data.get("price") ?? "").trim()
    const price = Number(priceRaw)
    if (priceRaw === "" || !Number.isFinite(price) || price <= 0) {
      errs.price = "Price must be a positive number."
    }
    if (product && (!/^\d+(\.\d{1,2})?$/.test(priceRaw) || Math.round(price * 100) > 2147483647 || Math.round(price * 100) <= 0)) {
      errs.price = "Enter a positive price with at most two decimal places."
    }
 
    if (sizes.length === 0) errs.sizes = "Pick at least one size."
 
    const stockErrs: Record<string, string> = {}
    for (const size of sizes) {
      const raw = String(data.get(`stock_${size}`) ?? "").trim()
      const n = Number(raw)
      if (raw === "" || !Number.isInteger(n) || n < 0 || (product && (!/^\d+$/.test(raw) || n > 2147483647))) {
        stockErrs[size] = "Must be a whole number 0 or more."
      }
    }
    if (Object.keys(stockErrs).length > 0) errs.stock = stockErrs
 
    return errs
  }
 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
 
    const errs = validate(data)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
 
    setSubmitting(true)
    try {
      const res = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
        method: product ? "PUT" : "POST", body: data,
      })
      if (!res.ok) throw new Error()
 
      toast.success(product ? "Product updated successfully." : "Product created successfully.", { position: "bottom-right" })
      if (product) router.push("/admin/products")
      else resetForm()
      router.refresh()
    } catch {
      toast.error(product ? "Update failed." : "Failed to create product.", { position: "bottom-right" })
    } finally {
      setSubmitting(false)
    }
  }
 
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Create Product"}</CardTitle>
        <CardDescription>{product ? "Update the product details below." : "Fill in the details to create a new product."}</CardDescription>
      </CardHeader>
 
      <CardContent>
        <form id={formId} ref={formRef} onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
              <Input
                id="product-name"
                name="name"
                defaultValue={product?.title}
                placeholder="Product name"
                autoComplete="off"
                aria-invalid={!!errors.name}
              />
              {errors.name && <FieldError errors={[{ message: errors.name }]} />}
            </Field>
 
            {/* Description */}
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="product-description">Description</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  id="product-description"
                  name="description"
                  defaultValue={product?.description ?? ""}
                  placeholder="Describe the product..."
                  rows={5}
                  className="min-h-24 resize-none"
                  aria-invalid={!!errors.description}
                />
              </InputGroup>
              {errors.description && <FieldError errors={[{ message: errors.description }]} />}
            </Field>
 
            {/* Price */}
            <Field data-invalid={!!errors.price}>
              <FieldLabel htmlFor="product-price">Price ($)</FieldLabel>
              <Input
                id="product-price"
                name="price"
                defaultValue={product ? (product.price / 100).toFixed(2) : undefined}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                aria-invalid={!!errors.price}
              />
              {errors.price && <FieldError errors={[{ message: errors.price }]} />}
              {product?.hasStripePrice && <FieldDescription>Changing this price does not update the Stripe checkout price.</FieldDescription>}
            </Field>
 
            {/* Sizes */}
            <Field data-invalid={!!errors.sizes}>
              <FieldLabel>Sizes</FieldLabel>
              <div className="flex flex-wrap gap-4">
                {availableSizes.map((size) => (
                  <label key={size} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="sizes"
                      value={size}
                      checked={sizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="size-4"
                    />
                    {size}
                  </label>
                ))}
              </div>
              {errors.sizes && <FieldError errors={[{ message: errors.sizes }]} />}
            </Field>
 
            {/* Stock per size */}
            {sizes.length > 0 && (
              <Field>
                <FieldLabel>Stock per size</FieldLabel>
                <div className="flex flex-col gap-3">
                  {availableSizes.filter((s) => sizes.includes(s)).map((size) => (
                    <div key={size} className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="w-10 text-sm">{size}</span>
                        <Input
                          aria-label={`Stock for ${size}`}
                          name={`stock_${size}`}
                          defaultValue={product?.sizes.find((item) => item.size === size)?.stock}
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          className="w-28"
                          aria-invalid={!!errors.stock?.[size]}
                        />
                      </div>
                      {errors.stock?.[size] && (
                        <FieldError errors={[{ message: errors.stock[size] }]} />
                      )}
                    </div>
                  ))}
                </div>
              </Field>
            )}
 
            {/* Image */}
            <Field>
              <FieldLabel htmlFor="product-image">Image</FieldLabel>
              {product?.image && <img src={product.image} alt={`Current image for ${product.title}`} className="size-24 rounded-md object-cover" />}
              <Input id="product-image" name="image" type="file" accept="image/*" />
              <FieldDescription>{product ? "Leave empty to keep the current image." : "Optional, but recommended."}</FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
 
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <Button type="submit" form={formId} disabled={submitting}>
            {submitting ? (product ? "Saving..." : "Creating...") : (product ? "Save Changes" : "Create Product")}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
