'use server'

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function submitEmployeeLogin(formData: FormData) {
  try {
    await signIn("credentials", {
      // The current users table stores the login identifier in its email column.
      email: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/admin",
    })
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      redirect("/login?error=credentials")
    }

    throw error
  }
}