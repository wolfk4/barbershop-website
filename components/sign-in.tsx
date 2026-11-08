
'use client'
 
import { useState } from "react"
import { submitEmployeeLogin } from "@/app/login/actions"
import PasswordResetLink from "@/components/PasswordResetLink"
 
export function SignIn() {
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")
 
  return (
    <form
      className="mx-auto w-full max-w-sm space-y-5 rounded-2xl bg-white p-8 shadow-2xl"
      action={submitEmployeeLogin}
    >
      <h1 className="text-center text-2xl font-extrabold uppercase tracking-widest text-black">Employee Login</h1>
 
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
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
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
          onInvalid={() => setPasswordError("Password is required.")}
          onChange={() => setPasswordError("")}
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "password-error" : undefined}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
        />
        {passwordError ? (
          <p id="password-error" className="text-sm text-red-600" role="alert">
            {passwordError}
          </p>
        ) : null}
      </div>
 
      <button
        type="submit"
        className="w-full rounded-full bg-black px-4 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        Sign In
      </button>
 
      <PasswordResetLink className="text-sm text-gray-500 transition hover:text-black hover:underline" />
    </form>
  );
}
