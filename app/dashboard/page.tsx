import { redirect } from "next/navigation"
import { auth } from "@/auth"
 
// after login everyone lands here, then gets sent to the right dashboard
export default async function DashboardRedirect() {
  const session = await auth()
 
  if (session?.user?.role === "admin") redirect("/admin")
  if (session?.user?.role === "employee") redirect("/employee/dashboard")
  redirect("/login")
}
 