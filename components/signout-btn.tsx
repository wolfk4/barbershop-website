import { signOut } from "@/auth"
import { Button } from "./ui/button"
import { redirect } from "next/navigation"


export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
        redirect("/login")
      }}
    >
      <Button type="submit">Sign Out</Button>
    </form>
  )
}