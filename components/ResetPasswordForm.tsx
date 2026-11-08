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
        className="mx-auto w-full max-w-sm space-y-5 rounded-2xl bg-white p-8 shadow-2xl"
      >
        <h1 className="text-center text-2xl font-extrabold uppercase tracking-widest text-black">Reset Password</h1>
        <p className="text-center text-sm text-gray-600">
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
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
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
          className="w-full rounded-full bg-black px-4 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
 
        <div className="text-center">
          <Link href="/login" className="text-sm text-gray-500 transition hover:text-black hover:underline">
            Back to login
          </Link>
        </div>
      </form>
 
      {popup ? <Popup message={popup} onClose={() => setPopup("")} /> : null}
    </>
  )
}
