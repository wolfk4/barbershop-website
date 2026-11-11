'use client'
 
import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Lock, ShoppingBag } from "lucide-react"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { CartItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
 
type CheckoutForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
}
 
type FormErrors = Partial<Record<keyof CheckoutForm, string>>
 
const initialForm: CheckoutForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
}
 
const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
]
 
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\d{10}$/
const zipPattern = /^\d{5}$/
 
const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 disabled:bg-gray-100 aria-invalid:border-red-500"
 
function validate(values: CheckoutForm): FormErrors {
  const errors: FormErrors = {}
 
  if (!values.firstName.trim()) errors.firstName = "First name is required."
  if (!values.lastName.trim()) errors.lastName = "Last name is required."
 
  if (!values.email.trim()) errors.email = "Email is required."
  else if (!emailPattern.test(values.email)) errors.email = "Try something like name@example.com."
 
  if (!values.phone.trim()) errors.phone = "Phone number is required."
  else if (!phonePattern.test(values.phone)) errors.phone = "Phone number needs 10 digits."
 
  if (!values.streetAddress.trim()) errors.streetAddress = "Street address is required."
  if (!values.city.trim()) errors.city = "City is required."
  if (!values.state.trim()) errors.state = "State is required."
 
  if (!values.zipCode.trim()) errors.zipCode = "ZIP code is required."
  else if (!zipPattern.test(values.zipCode)) errors.zipCode = "ZIP code must be 5 digits."
 
  return errors
}

 
// label + input + error message
function Field({
  label,
  name,
  error,
  hint,
  className = "",
  children,
}: {
  label: string
  name: string
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      {children}
      {error ? (
        <span id={`${name}-error`} className="block text-sm text-red-600">
          {error}
        </span>
      ) : hint ? (
        <span className="block text-xs text-gray-500">{hint}</span>
      ) : null}
    </label>
  )
}
 
function SectionTitle({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="bg-black text-white rounded-full w-9 h-9 flex items-center justify-center font-bold shrink-0">
        {step}
      </span>
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
  )
}
 
export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [form, setForm] = useState<CheckoutForm>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
 
  // load cart items for the summary
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/shop/cart")
        if (!response.ok) throw new Error("Failed to fetch cart")
        setItems(await response.json())
      } catch (error) {
        console.error("Failed to fetch cart:", error)
      }
      setLoading(false)
    }
 
    fetchItems()
  }, [])
 
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
 
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    let nextValue = value
    // keep phone and zip as digits only
    if (name === "phone") nextValue = value.replace(/\D/g, "").slice(0, 10)
    if (name === "zipCode") nextValue = value.replace(/\D/g, "").slice(0, 5)
 
    setForm((current) => ({ ...current, [name]: nextValue }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }
 
  // shared props for each input so the JSX stays short
  const inputProps = (name: keyof CheckoutForm) => ({
    name,
    value: form[name],
    onChange: handleChange,
    className: inputClass,
    disabled: placingOrder,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  })
 
  const checkoutWithStripe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (placingOrder) return

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.")
      return
    }

    // Submit before disabling the inputs so all customer details are included.
    event.currentTarget.submit()
    setPlacingOrder(true)
  }
  const isEmpty = !loading && items.length === 0
 
  return (
    <div className="font-sans bg-white text-black min-h-screen flex flex-col">
      <Header />
 
      {/* title */}
      <section className="bg-black text-white py-20 px-6 text-center">

        <h1 className="text-4xl md:text-6xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-300">
          {isEmpty ? "Your bag is empty." : "Almost done. Just a few details."}
        </p>
      </section>
 
      <main className="flex-1 max-w-300 mx-auto w-full px-6 py-16 text-left">
        {loading ? (
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {[0, 1].map((i) => (
                <div key={i} className="h-72 border rounded-2xl bg-gray-50 animate-pulse" />
              ))}
            </div>
            <div className="h-80 border rounded-2xl bg-gray-50 animate-pulse" />
          </div>
        ) : isEmpty ? (
          <div className="border rounded-2xl py-20 px-6 text-center">
            <div className="bg-black text-white rounded-full p-4 w-fit mx-auto mb-6">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Nothing to check out</h2>
            <p className="text-gray-500 mb-8">Add something to your bag first.</p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white font-semibold uppercase tracking-wide px-8 py-3 rounded-full hover:bg-gray-800 transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <form
            action="/api/stripe/checkout"
            method="POST"
            onSubmit={checkoutWithStripe}
            noValidate
            className="grid gap-10 lg:grid-cols-3"
          >
            <input type="hidden" name="title" value="Hoodie" />
            <div className="lg:col-span-2 space-y-6">
              {/* contact info */}
              <section className="border rounded-2xl p-6 md:p-8">
                <SectionTitle step={1} title="Your Info" />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="First name" name="firstName" error={errors.firstName}>
                    <input type="text" autoComplete="given-name" placeholder="First name" {...inputProps("firstName")} />
                  </Field>
                  <Field label="Last name" name="lastName" error={errors.lastName}>
                    <input type="text" autoComplete="family-name" placeholder="Last name" {...inputProps("lastName")} />
                  </Field>
                  <Field
                    label="Email"
                    name="email"
                    error={errors.email}
                    hint="Your order confirmation goes here."
                  >
                    <input type="email" autoComplete="email" placeholder="name@example.com" {...inputProps("email")} />
                  </Field>
                  <Field label="Phone" name="phone" error={errors.phone}>
                    <input
                      type="tel"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10 digits, no dashes"
                      {...inputProps("phone")}
                    />
                  </Field>
                </div>
              </section>
 
              {/* shipping */}
              <section className="border rounded-2xl p-6 md:p-8">
                <SectionTitle step={2} title="Shipping Address" />
                <div className="grid gap-5 md:grid-cols-6">
                  <Field
                    label="Street address"
                    name="streetAddress"
                    error={errors.streetAddress}
                    className="md:col-span-6"
                  >
                    <input type="text" autoComplete="address-line1" placeholder="123 Main St" {...inputProps("streetAddress")} />
                  </Field>
                  <Field label="City" name="city" error={errors.city} className="md:col-span-3">
                    <input type="text" autoComplete="address-level2" placeholder="City" {...inputProps("city")} />
                  </Field>
                  <Field label="State" name="state" error={errors.state} className="md:col-span-1">
                    <select autoComplete="address-level1" {...inputProps("state")}>
                      <option value="">--</option>
                      {usStates.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="ZIP" name="zipCode" error={errors.zipCode} className="md:col-span-2">
                    <input
                      type="text"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="95610"
                      {...inputProps("zipCode")}
                    />
                  </Field>
                </div>
              </section>
 
              <Link
                href="/shop/cart"
                className="inline-block border border-black font-semibold uppercase tracking-wide text-sm px-8 py-3 rounded-full hover:bg-black hover:text-white transition"
              >
                ← Back to Bag
              </Link>
            </div>
 
            {/* order summary */}
            <aside>
              <div className="border rounded-2xl p-6 lg:sticky lg:top-6">
                <SectionTitle step={3} title="Review" />
 
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.uid} className="flex gap-3 items-center">
                      <img
                        src={item.image ?? ""}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {item.size ? `Size ${item.size}` : ""}
                          {item.size && item.quantity ? " · " : ""}
                          Qty {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
 
                <div className="border-t mt-5 pt-5 space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
 
                <div className="flex justify-between items-center text-black rounded-xl py-4 mt-5">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                </div>
 
                <Button
                  className="mt-6 w-full bg-black text-white hover:bg-gray-800 py-4"
                  type="submit"
                  disabled={placingOrder}
                >
                  {placingOrder ? "Redirecting to Stripe..." : "Place Order"}
                </Button>

                <p className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-4">
                  <Lock className="w-3 h-3" /> Secure checkout
                </p>
              </div>
            </aside>
          </form>
        )}
      </main>
 
      <Footer />
    </div>
  )
}
