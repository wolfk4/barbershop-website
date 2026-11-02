'use client'

import { useState } from "react"
import Link from "next/link"
import Popup from "@/components/Popup"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [loading, setLoading] = useState(false)
  const [popup, setPopup] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const value = email.trim()
    if (!value) {
      setEmailError("Email is required.")
      return
    }
    if (!EMAIL_PATTERN.test(value)) {
      setEmailError("Enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      })

      if (!res.ok) throw new Error()

      setPopup("A password reset link has been sent to your email.")
      setEmail("")
    } catch {
      setPopup("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-sm space-y-5 rounded-xl border border-gray-200 bg-white p-6"
      >
        <h1 className="text-2xl font-semibold text-gray-900">Reset Password</h1>
        <p className="text-sm text-gray-600">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError("")
            }}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "email-error" : undefined}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {emailError ? (
            <p id="email-error" className="text-sm text-red-600" role="alert">
              {emailError}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center">
          <Link href="/login" className="text-sm text-blue-500 hover:underline">
            Back to login
          </Link>
        </div>
      </form>

      {popup ? <Popup message={popup} onClose={() => setPopup("")} /> : null}
    </>
  )
}
