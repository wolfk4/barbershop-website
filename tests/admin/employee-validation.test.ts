///<reference types="jest" />

import { parseEmployeeId } from "@/lib/employee-validation"

describe("parseEmployeeId", () => {
  it("accepts a positive employee ID", () => {
    expect(parseEmployeeId("42")).toBe(42)
  })

  it("rejects text that is not an ID", () => {
    expect(parseEmployeeId("abc")).toBeNull()
  })

  it("rejects zero", () => {
    expect(parseEmployeeId("0")).toBeNull()
  })
})