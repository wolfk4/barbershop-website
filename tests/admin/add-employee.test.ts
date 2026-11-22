/**
 * @jest-environment node
 */

import { POST } from "@/app/api/admin/employees/route"

// fake login and database
jest.mock("@/auth", () => ({ auth: jest.fn() }))
jest.mock("@/db/drizzle", () => ({ db: { execute: jest.fn() } }))
jest.mock("bcryptjs", () => ({ hash: async () => "hashed-password" }))

const mockAuth: jest.Mock = jest.requireMock("@/auth").auth
const mockExecute: jest.Mock = jest.requireMock("@/db/drizzle").db.execute

function addEmployee(body: object) {
  const request = new Request("http://localhost/api/admin/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  return POST(request)
}

const newBarber = { name: "The Rizzler", email: "rizzler@kaizencutz.com", password: "Password123!" }

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, "error").mockImplementation(() => {})
  mockAuth.mockResolvedValue({ user: { id: "1", role: "admin" } })
})

describe("Admin - Add Employee", () => {
  it("only admins can add employees", async () => {
    // not logged in
    mockAuth.mockResolvedValueOnce(null)
    expect((await addEmployee(newBarber)).status).toBe(401)

    // logged in as a barber, not an admin
    mockAuth.mockResolvedValueOnce({ user: { id: "2", role: "employee" } })
    expect((await addEmployee(newBarber)).status).toBe(403)

    expect(mockExecute).not.toHaveBeenCalled()
  })

  it("admin can add a new employee", async () => {
    mockExecute.mockResolvedValue({ rows: [{ id: 5, name: "The Rizzler", email: "rizzler@kaizencutz.com" }] })
    const response = await addEmployee(newBarber)

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({
      employee: { id: 5, name: "The Rizzler", email: "rizzler@kaizencutz.com" },
    })
  })

  it("can't add an employee with missing info", async () => {
    const response = await addEmployee({ name: "The Rizzler", email: "", password: "" })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Name, email, and password are required" })
    expect(mockExecute).not.toHaveBeenCalled()
  })

  it("can't add an employee with a bad email", async () => {
    const response = await addEmployee({ ...newBarber, email: "rizzler" })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Invalid email" })
    expect(mockExecute).not.toHaveBeenCalled()
  })

  it("can't add an employee with an email that's already used", async () => {
    mockExecute.mockRejectedValue({ code: "23505" })
    const response = await addEmployee(newBarber)

    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({ error: "Email already in use" })
  })
})
