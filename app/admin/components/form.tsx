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
 
export function CreateProductForm() {
  const router = useRouter()
  const formRef = React.useRef<HTMLFormElement>(null)
  const [sizes, setSizes] = React.useState<string[]>([])
  const [errors, setErrors] = React.useState<Errors>({})
  const [submitting, setSubmitting] = React.useState(false)
 
  function toggleSize(size: string) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }
 
  function resetForm() {
    formRef.current?.reset()
    setSizes([])
    setErrors({})
  }
 
  function validate(data: FormData): Errors {
    const errs: Errors = {}
 
    if (!String(data.get("name") ?? "").trim()) errs.name = "Product name is required."
    if (!String(data.get("description") ?? "").trim()) errs.description = "Description is required."
 
    const priceRaw = String(data.get("price") ?? "").trim()
    const price = Number(priceRaw)
    if (priceRaw === "" || !Number.isFinite(price) || price <= 0) {
      errs.price = "Price must be a positive number."
    }
 
    if (sizes.length === 0) errs.sizes = "Pick at least one size."
 
    const stockErrs: Record<string, string> = {}
    for (const size of sizes) {
      const raw = String(data.get(`stock_${size}`) ?? "").trim()
      const n = Number(raw)
      if (raw === "" || !Number.isInteger(n) || n < 0) {
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
      const res = await fetch("/api/admin/products", { method: "POST", body: data })
      if (!res.ok) throw new Error()
 
      toast.success("Product created successfully.", { position: "bottom-right" })
      resetForm()
      router.refresh()
    } catch {
      toast.error("Failed to create product.", { position: "bottom-right" })
    } finally {
      setSubmitting(false)
    }
  }
 
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>Fill in the details to create a new product.</CardDescription>
      </CardHeader>
 
      <CardContent>
        <form id="create-product-form" ref={formRef} onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
              <Input
                id="product-name"
                name="name"
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
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                aria-invalid={!!errors.price}
              />
              {errors.price && <FieldError errors={[{ message: errors.price }]} />}
            </Field>
 
            {/* Sizes */}
            <Field data-invalid={!!errors.sizes}>
              <FieldLabel>Sizes</FieldLabel>
              <div className="flex flex-wrap gap-4">
                {SIZES.map((size) => (
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
                  {SIZES.filter((s) => sizes.includes(s)).map((size) => (
                    <div key={size} className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="w-10 text-sm">{size}</span>
                        <Input
                          name={`stock_${size}`}
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
              <Input id="product-image" name="image" type="file" accept="image/*" />
              <FieldDescription>Optional, but recommended.</FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
 
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <Button type="submit" form="create-product-form" disabled={submitting}>
            {submitting ? "Creating..." : "Create Product"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
