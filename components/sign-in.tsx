'use client'

import { useState } from "react"
import { submitEmployeeLogin } from "@/app/login/actions"

export function SignIn() {
  const [usernameError, setUsernameError] = useState("")

  return (
    <form
      className="mx-auto w-full max-w-sm space-y-5 rounded-xl border border-gray-200 bg-white p-6"
      action={submitEmployeeLogin}
    >
      <h1 className="text-2xl font-semibold text-gray-900">Employee Login</h1>

      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          onInvalid={() => setUsernameError("Username is required.")}
          onChange={() => setUsernameError("")}
          aria-invalid={Boolean(usernameError)}
          aria-describedby={usernameError ? "username-error" : undefined}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        {usernameError ? (
          <p id="username-error" className="text-sm text-red-600" role="alert">
            {usernameError}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Sign In
      </button>
    </form>
  );
}