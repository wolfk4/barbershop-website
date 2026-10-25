"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * EmployeeList component displays a list of employees in a card.
 * Fetches employee data from the server and handles loading, error, and empty states.
 * Routing needs to be implemented for updating employee details. (DT-122)
 */

type Employee = {
  id: number
  name: string
  email: string
}

export function EmployeeList() {
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function loadEmployees() {
      try {
        const res = await fetch("/api/admin/employees")
        if (!res.ok) throw new Error("Request failed")
        const data = (await res.json()) as { employees: Employee[] }
        if (!cancelled) setEmployees(data.employees)
      } catch {
        if (!cancelled) setError("Failed to load employees. Please try again.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadEmployees()
    return () => {
      cancelled = true
    }
  }, [])

  let content: React.ReactNode

  if (loading) {
    content = <p>Loading employees...</p>
  } else if (error) {
    content = <p role="alert">{error}</p>
  } else if (employees.length === 0) {
    content = <p>No employees yet.</p>
  } else {
    content = (
      <ul className="space-y-3">
        {employees.map((employee) => (
          <li key={employee.id} className="flex items-center justify-between gap-6">
            <div>
              <p className="font-medium">{employee.name}</p>
              <p className="text-sm text-muted-foreground">{employee.email}</p>
            </div>
            {/* TODO: /admin/employees/[id] is the Update Employee page (DT-122). */}
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/employees/${employee.id}`}>Update</Link>
            </Button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
