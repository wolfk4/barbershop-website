'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Popup from "@/components/Popup"

export function NewPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [popup, setPopup] = useState("")
  const [done, setDone] = useState(false)

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-sm space-y-4 rounded-xl border border-gray-200 bg-white p-6 text-center">
        <p className="text-gray-900">This reset link is invalid or has expired.</p>
        <Link href="/reset-password" className="text-sm text-blue-500 hover:underline">
          Request a new link
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setPopup(data?.error ?? "Something went wrong. Please try again.")
        return
      }

      setDone(true)
      setPopup("Your password has been reset. You can log in now.")
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
        <h1 className="text-2xl font-semibold text-gray-900">Set New Password</h1>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError("")
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value)
              setError("")
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || done}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Reset Password"}
        </button>
      </form>

      {popup ? (
        <Popup
          message={popup}
          buttonText={done ? "Go to login" : "OK"}
          onClose={() => {
            setPopup("")
            if (done) router.push("/login")
          }}
        />
      ) : null}
    </>
  )
}
