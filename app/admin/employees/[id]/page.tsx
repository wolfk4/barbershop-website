import Footer from "@/components/footer"
import Header from "@/components/header"
import { auth } from "@/auth"
import { db } from "@/db/drizzle"
import { usersTable } from "@/db/schema"
import { parseEmployeeId } from "@/lib/employee-validation"
import { and, eq } from "drizzle-orm"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { UpdateEmployeeForm } from "../../components/update-employee-form"

export default async function UpdateEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  if (session.user.role !== "admin") redirect("/")

  const { id } = await params
  const employeeId = parseEmployeeId(id)
  if (employeeId === null) notFound()

  const [employee] = await db
    .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
    .from(usersTable)
    .where(and(eq(usersTable.id, employeeId), eq(usersTable.role, "employee")))
    .limit(1)

  if (!employee) notFound()

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-black">
      <Header />
      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-12">
        <Link href="/admin" className="text-sm underline">← Back to Admin</Link>
        <div className="mt-4">
          <UpdateEmployeeForm employee={employee} />
        </div>
      </main>
      <Footer />
    </div>
  )
}