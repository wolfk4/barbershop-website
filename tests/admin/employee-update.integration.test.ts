/// <reference types="jest" />

import { PUT } from "@/app/api/admin/employees/[id]/route"

jest.mock("@/auth", () => ({ auth: jest.fn() }))
jest.mock("@/db/drizzle", () => ({
  db: {
    update: jest.fn(),
  },
}))

const mockAuth: jest.Mock = jest.requireMock("@/auth").auth
const mockUpdate: jest.Mock = jest.requireMock("@/db/drizzle").db.update
const mockSet = jest.fn()
const mockWhere = jest.fn()
const mockReturning = jest.fn()

function updateEmployee(id: string, body: string) {
  const request = new Request("http://localhost/api/admin/employees/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  })

  return PUT(request, { params: Promise.resolve({ id }) })
}

describe("PUT /api/admin/employees/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { id: "1", role: "admin" } })
    mockUpdate.mockReturnValue({ set: mockSet })
    mockSet.mockReturnValue({ where: mockWhere })
    mockWhere.mockReturnValue({ returning: mockReturning })
    mockReturning.mockResolvedValue([{ id: 42, email: "barber@example.com" }])
  })

  it("updates a valid employee email", async () => {
    const response = await updateEmployee("42", JSON.stringify({ email: " barber@example.com " }))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ employee: { id: 42, email: "barber@example.com" } })
    expect(mockSet).toHaveBeenCalledWith({ email: "barber@example.com" })
    expect(mockReturning).toHaveBeenCalledTimes(1)
  })

  it("rejects an invalid email without updating the database", async () => {
    const response = await updateEmployee("42", JSON.stringify({ email: "not-an-email" }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Invalid email" })
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("rejects malformed JSON without updating the database", async () => {
    const response = await updateEmployee("42", "{")

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Invalid request" })
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("returns not found for an invalid employee ID", async () => {
    const response = await updateEmployee("abc", JSON.stringify({ email: "barber@example.com" }))

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: "Employee not found" })
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("returns not found when no employee matches the ID", async () => {
    mockReturning.mockResolvedValue([])
    const response = await updateEmployee("42", JSON.stringify({ email: "barber@example.com" }))

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: "Employee not found" })
  })

  it("requires a signed-in user", async () => {
    mockAuth.mockResolvedValue(null)
    const response = await updateEmployee("42", JSON.stringify({ email: "barber@example.com" }))

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ error: "Unauthorized" })
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("rejects users who are not admins", async () => {
    mockAuth.mockResolvedValue({ user: { id: "2", role: "employee" } })
    const response = await updateEmployee("42", JSON.stringify({ email: "barber@example.com" }))

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ error: "Forbidden" })
    expect(mockUpdate).not.toHaveBeenCalled()
  })
})
