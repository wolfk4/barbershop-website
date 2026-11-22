/**
 * @jest-environment node
 */
import { POST as requestReset } from "@/app/api/auth/reset-password/route"
import { POST as setNewPassword } from "@/app/api/auth/reset-password/confirm/route"

// fake database, each query returns the next item in this list
let dbResults: unknown[] = []
const mockSet = jest.fn()

jest.mock("@/db/db", () => {
  const query: Record<string, unknown> = {}
  ;["from", "where", "limit", "values", "returning"].forEach((name) => {
    query[name] = () => query
  })
  query.set = (values: unknown) => {
    mockSet(values)
    return query
  }
  query.then = (resolve: (value: unknown) => void) => resolve(dbResults.shift() ?? [])
  return { db: { select: () => query, insert: () => query, update: () => query, delete: () => query } }
})

// fake email so nothing actually sends
jest.mock("@/lib/email", () => ({ sendPasswordResetEmail: jest.fn() }))
jest.mock("bcryptjs", () => ({ hash: async () => "hashed-password" }))

const mockEmail: jest.Mock = jest.requireMock("@/lib/email").sendPasswordResetEmail

function send(route: (req: Request) => Promise<Response>, body: object) {
  return route(
    new Request("http://localhost/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  )
}

beforeEach(() => {
  jest.clearAllMocks()
  dbResults = []
})

describe("Password Reset", () => {
  it("sends a reset email to a real employee", async () => {
    dbResults = [[{ id: 1, name: "Mike Tyson", email: "mike@kaizencutz.com" }]]
    const response = await send(requestReset, { email: "mike@kaizencutz.com" })

    expect(response.status).toBe(200)
    expect(mockEmail).toHaveBeenCalledWith("mike@kaizencutz.com", "Mike Tyson", expect.stringContaining("/reset-password/new?token="))
  })

  it("email that isn't signed up gets the same answer but no email", async () => {
    dbResults = [[]]
    const response = await send(requestReset, { email: "nobody@kaizencutz.com" })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(mockEmail).not.toHaveBeenCalled()
  })

  it("bad email is rejected", async () => {
    const response = await send(requestReset, { email: "mike" })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Invalid email" })
  })

  it("good reset link changes the password", async () => {
    dbResults = [[{ userId: 1 }]]
    const response = await send(setNewPassword, { token: "abc123", password: "NewPassword123!" })

    expect(response.status).toBe(200)
    expect(mockSet).toHaveBeenCalledWith({ password: "hashed-password" })
  })

  it("short password or old link is rejected", async () => {
    // password too short
    let response = await send(setNewPassword, { token: "abc123", password: "short" })
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Password must be at least 8 characters." })

    // link already used or expired
    dbResults = [[]]
    response = await send(setNewPassword, { token: "oldlink", password: "NewPassword123!" })
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "This reset link is invalid or has expired." })
  })
})
