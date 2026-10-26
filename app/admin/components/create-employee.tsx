"use client"

import { useState, type SubmitEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { sqlInjectCheck } from "@/lib/sql-inject-check"

export function CreateEmployeeForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedEmail = email.trim()
    if (!sqlInjectCheck(normalizedEmail)) {
      toast.error("Please enter a valid email address.", {
        position: "bottom-right",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create employee")
      }

      toast.success("Employee account created successfully.", {
        position: "bottom-right",
      })
      setName("")
      setEmail("")
      setPassword("")
    } catch (error) {
      console.error("Failed to create employee", error)
      toast.error("Failed to create account. Please try again.", {
        position: "bottom-right",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Employee</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="employee-name">Name</FieldLabel>
              <Input
                id="employee-name"
                name="name"
                autoComplete="name"
                placeholder="Employee name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="employee-email">Email</FieldLabel>
              <Input
                id="employee-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="employee@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="employee-password">Temporary Password</FieldLabel>
              <Input
                id="employee-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Employee"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}