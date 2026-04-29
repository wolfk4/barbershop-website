import NextAuth from "next-auth"
import NeonAdapter from "@auth/neon-adapter"
import { Pool } from "@neondatabase/serverless"

export const { handlers, auth, signIn, signOut } = NextAuth(() => {

  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return {
    adapter: NeonAdapter(pool),
    providers: [],
  }
})