import { fireEvent, render, screen } from "@testing-library/react"
import { SignIn } from "@/components/sign-in"
import { submitEmployeeLogin } from "@/app/login/actions"
import { AuthError } from "next-auth"

// fake login so we don't need the real database
jest.mock("@/auth", () => ({ signIn: jest.fn() }))

jest.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {
    type = "CredentialsSignin"
  },
}))

// the real redirect stops the page by throwing, so the fake one does too
jest.mock("next/navigation", () => ({
  redirect: jest.fn(() => {
    throw new Error("REDIRECT")
  }),
}))

const mockSignIn: jest.Mock = jest.requireMock("@/auth").signIn
const mockRedirect: jest.Mock = jest.requireMock("next/navigation").redirect

function loginForm(username: string, password: string) {
  const form = new FormData()
  form.set("username", username)
  form.set("password", password)
  return form
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe("Employee Login", () => {
  it("login form has username, password, and sign in button", () => {
    render(<SignIn />)
    expect(screen.getByLabelText("Username")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password")
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Forgot your password?" })).toHaveAttribute("href", "/reset-password")
  })

  it("shows an error when username or password is empty", () => {
    render(<SignIn />)
    fireEvent.invalid(screen.getByLabelText("Username"))
    fireEvent.invalid(screen.getByLabelText("Password"))

    expect(screen.getByText("Username is required.")).toBeInTheDocument()
    expect(screen.getByText("Password is required.")).toBeInTheDocument()
  })

  it("right username and password goes to the dashboard", async () => {
    mockSignIn.mockResolvedValue(undefined)
    await submitEmployeeLogin(loginForm("miketyson", "Password123!"))

    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      username: "miketyson",
      password: "Password123!",
      redirectTo: "/dashboard",
    })
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it("wrong password sends you back to login with an error", async () => {
    mockSignIn.mockRejectedValue(new AuthError())
    await expect(submitEmployeeLogin(loginForm("miketyson", "wrongpassword"))).rejects.toThrow("REDIRECT")

    expect(mockRedirect).toHaveBeenCalledWith("/login?error=credentials")
  })
})
