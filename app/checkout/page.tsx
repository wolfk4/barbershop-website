'use client'

import { FormEvent, useState } from "react"
import Footer from "@/components/footer"
import Header from "@/components/header"

type CustomerInfo = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type FieldErrors = Partial<Record<keyof CustomerInfo, string>>

type ShippingAddress = {
  streetAddress: string
  city: string
  state: string
  zipCode: string
}

type ShippingFieldErrors = Partial<Record<keyof ShippingAddress, string>>

const initialCustomerInfo: CustomerInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
}

const initialShippingAddress: ShippingAddress = {
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

function validateCustomerInfo(values: CustomerInfo): FieldErrors {
  const nextErrors: FieldErrors = {}

  if (!values.firstName.trim()) {
    nextErrors.firstName = "First name is required."
  }

  if (!values.lastName.trim()) {
    nextErrors.lastName = "Last name is required."
  }

  if (!values.email.trim()) {
    nextErrors.email = "Email is required."
  } else if (!emailPattern.test(values.email)) {
    nextErrors.email = "That email format looks off. Try something like name@example.com."
  }

  if (!values.phone.trim()) {
    nextErrors.phone = "Phone number is required."
  } else if (!phonePattern.test(values.phone)) {
    nextErrors.phone = "Phone number needs exactly 10 digits (numbers only)."
  }

  return nextErrors
}

function validateShippingAddress(values: ShippingAddress): ShippingFieldErrors {
  const nextErrors: ShippingFieldErrors = {}

  if (!values.streetAddress.trim()) {
    nextErrors.streetAddress = "Street address is required."
  }

  if (!values.city.trim()) {
    nextErrors.city = "City is required."
  }

  if (!values.state.trim()) {
    nextErrors.state = "State is required."
  }

  if (!values.zipCode.trim()) {
    nextErrors.zipCode = "ZIP code is required."
  } else if (!zipPattern.test(values.zipCode)) {
    nextErrors.zipCode = "ZIP code must be exactly 5 digits."
  }

  return nextErrors
}

export default function CheckoutPage() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(initialCustomerInfo)
  const [customerErrors, setCustomerErrors] = useState<FieldErrors>({})
  const [submittedCustomer, setSubmittedCustomer] = useState<CustomerInfo | null>(null)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(initialShippingAddress)
  const [shippingErrors, setShippingErrors] = useState<ShippingFieldErrors>({})
  const [submittedShipping, setSubmittedShipping] = useState<ShippingAddress | null>(null)

  // Keep phone input clean as the user types.
  const normalizePhone = (value: string) => value.replace(/\D/g, "").slice(0, 10)
  const normalizeZip = (value: string) => value.replace(/\D/g, "").slice(0, 5)

  const handleCustomerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const nextValue = name === "phone" ? normalizePhone(value) : value

    setCustomerInfo((currentInfo) => ({
      ...currentInfo,
      [name]: nextValue,
    }))

    setCustomerErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }))
  }

  const handleCustomerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateCustomerInfo(customerInfo)
    setCustomerErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmittedCustomer(customerInfo)
  }

  const handleShippingChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    const nextValue = name === "zipCode" ? normalizeZip(value) : value

    setShippingAddress((currentAddress) => ({
      ...currentAddress,
      [name]: nextValue,
    }))

    setShippingErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }))
  }

  const handleShippingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateShippingAddress(shippingAddress)
    setShippingErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmittedShipping(shippingAddress)
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Header />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-400">
            Checkout Flow
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-[0.2em] md:text-4xl">
            Checkout Information Card
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-300 md:text-base">
            Quick detail pass before payment. Fill in customer details, then shipping
            address, then do one final review.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-white/10 bg-white p-6 text-stone-950 shadow-xl md:p-8">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500">
                  Step 1 of 3
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.12em]">
                  Tell Us About You
                </h2>
              </div>

              <form className="space-y-5" onSubmit={handleCustomerSubmit} noValidate>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-stone-700">First name</span>
                    <input
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={customerInfo.firstName}
                      onChange={handleCustomerChange}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
                      placeholder="First name"
                      aria-invalid={Boolean(customerErrors.firstName)}
                      aria-describedby={customerErrors.firstName ? "firstName-error" : undefined}
                    />
                    {customerErrors.firstName ? (
                      <span id="firstName-error" className="text-sm text-red-600">
                        {customerErrors.firstName}
                      </span>
                    ) : null}
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-stone-700">Last name</span>
                    <input
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={customerInfo.lastName}
                      onChange={handleCustomerChange}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
                      placeholder="Last name"
                      aria-invalid={Boolean(customerErrors.lastName)}
                      aria-describedby={customerErrors.lastName ? "lastName-error" : undefined}
                    />
                    {customerErrors.lastName ? (
                      <span id="lastName-error" className="text-sm text-red-600">
                        {customerErrors.lastName}
                      </span>
                    ) : null}
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-stone-700">Email</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={customerInfo.email}
                      onChange={handleCustomerChange}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
                      placeholder="name@example.com"
                      aria-invalid={Boolean(customerErrors.email)}
                      aria-describedby={customerErrors.email ? "email-error" : undefined}
                    />
                    {customerErrors.email ? (
                      <span id="email-error" className="text-sm text-red-600">
                        {customerErrors.email}
                      </span>
                    ) : null}
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-stone-700">Phone number</span>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={customerInfo.phone}
                      onChange={handleCustomerChange}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
                      placeholder="10 digits, no dashes"
                      aria-invalid={Boolean(customerErrors.phone)}
                      aria-describedby={customerErrors.phone ? "phone-error" : undefined}
                    />
                    {customerErrors.phone ? (
                      <span id="phone-error" className="text-sm text-red-600">
                        {customerErrors.phone}
                      </span>
                    ) : null}
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-stone-950 px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-stone-800"
                >
                  Save customer info
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white p-6 text-stone-950 shadow-xl md:p-8">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500">
                  Step 2 of 3
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.12em]">
                  Shipping Address
                </h2>
              </div>

              <form className="space-y-5" onSubmit={handleShippingSubmit} noValidate>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-stone-700">Street address</span>
                  <input
                    name="streetAddress"
                    type="text"
                    autoComplete="address-line1"
                    value={shippingAddress.streetAddress}
                    onChange={handleShippingChange}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
                    placeholder="123 Main St"
                    aria-invalid={Boolean(shippingErrors.streetAddress)}
                    aria-describedby={shippingErrors.streetAddress ? "streetAddress-error" : undefined}
                  />
                  {shippingErrors.streetAddress ? (
                    <span id="streetAddress-error" className="text-sm text-red-600">
                      {shippingErrors.streetAddress}
                    </span>
                  ) : null}
                </label>

                <div className="grid gap-5 md:grid-cols-3">
                  <label className="block space-y-2 md:col-span-1">
                    <span className="text-sm font-semibold text-stone-700">City</span>
                    <input
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
                      placeholder="City"
                      aria-invalid={Boolean(shippingErrors.city)}
                      aria-describedby={shippingErrors.city ? "city-error" : undefined}
                    />
                    {shippingErrors.city ? (
                      <span id="city-error" className="text-sm text-red-600">
                        {shippingErrors.city}
                      </span>
                    ) : null}
                  </label>

                  <label className="block space-y-2 md:col-span-1">
                    <span className="text-sm font-semibold text-stone-700">State</span>
                    <select
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleShippingChange}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
                      aria-invalid={Boolean(shippingErrors.state)}
                      aria-describedby={shippingErrors.state ? "state-error" : undefined}
                    >
                      <option value="">Select state</option>
                      {usStates.map((stateCode) => (
                        <option key={stateCode} value={stateCode}>
                          {stateCode}
                        </option>
                      ))}
                    </select>
                    {shippingErrors.state ? (
                      <span id="state-error" className="text-sm text-red-600">
                        {shippingErrors.state}
                      </span>
                    ) : null}
                  </label>

                  <label className="block space-y-2 md:col-span-1">
                    <span className="text-sm font-semibold text-stone-700">ZIP code</span>
                    <input
                      name="zipCode"
                      type="text"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      maxLength={5}
                      value={shippingAddress.zipCode}
                      onChange={handleShippingChange}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
                      placeholder="5 digits"
                      aria-invalid={Boolean(shippingErrors.zipCode)}
                      aria-describedby={shippingErrors.zipCode ? "zipCode-error" : undefined}
                    />
                    {shippingErrors.zipCode ? (
                      <span id="zipCode-error" className="text-sm text-red-600">
                        {shippingErrors.zipCode}
                      </span>
                    ) : null}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!submittedCustomer}
                  className="w-full rounded-2xl bg-stone-950 px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-500"
                >
                  Save shipping address
                </button>
                {!submittedCustomer ? (
                  <p className="text-sm text-stone-500">
                    Save Step 1 first, then shipping unlocks.
                  </p>
                ) : null}
              </form>
            </section>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-stone-900 p-6 shadow-xl md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">
              Step 3 of 3
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.12em] text-white">
              Review and Confirm
            </h2>

            {submittedCustomer && submittedShipping ? (
              <div className="mt-6 space-y-4 text-sm text-stone-200">
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.22em] text-stone-400">
                    First name
                  </span>
                  {submittedCustomer.firstName}
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.22em] text-stone-400">
                    Last name
                  </span>
                  {submittedCustomer.lastName}
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.22em] text-stone-400">
                    Email
                  </span>
                  {submittedCustomer.email}
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.22em] text-stone-400">
                    Phone
                  </span>
                  {submittedCustomer.phone}
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.22em] text-stone-400">
                    Street address
                  </span>
                  {submittedShipping.streetAddress}
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.22em] text-stone-400">
                    City
                  </span>
                  {submittedShipping.city}
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.22em] text-stone-400">
                    State
                  </span>
                  {submittedShipping.state}
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.22em] text-stone-400">
                    ZIP code
                  </span>
                  {submittedShipping.zipCode}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedCustomer(null)
                    setSubmittedShipping(null)
                  }}
                  className="mt-2 w-full rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:bg-white/10"
                >
                  Edit checkout info
                </button>
              </div>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-5 text-sm leading-6 text-stone-300">
                Finish Step 1 and Step 2, and everything will appear here for your
                final confirmation.
              </p>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}