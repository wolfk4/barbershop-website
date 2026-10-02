import NextAuth, { User } from "next-auth"
import NeonAdapter from "@auth/neon-adapter"
import { Pool } from "@neondatabase/serverless"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db/db"
import { usersTable } from "./db/schema"
import { eq } from "drizzle-orm"

//Later use bcryptjs to hash and compare passwords for better security.
// import { compare } from "bcryptjs"


export const { handlers, auth, signIn, signOut } = NextAuth(() => {

  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return {
    adapter: NeonAdapter(pool),
    session: {
        strategy: "jwt",
      },
      providers: [
        Credentials({
            async authorize(credentials) {
              const email =
                typeof credentials?.email === "string"
                  ? credentials.email.trim()
                  : "";

              const password =
                typeof credentials?.password === "string"
                  ? credentials.password
                  : "";

              if (!email || !password) {
                console.log("Login failed: missing email or password");
                return null;
              }

              const [user] = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, email))
                .limit(1);

              if (!user) {
                console.log("Login failed: no matching email");
                return null;
              }

              if (password !== user.password) {
                console.log("Login failed: password mismatch");
                return null;
              }

              console.log("Login successful");

              return {
                id: user.id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
        }),
      ],
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
            token.name = user.name;
            token.role = (user as any).role
          }
          return token
        },
        async session({ session, token }) {
          if (session.user) {
            session.user.id = token.id as string;
            session.user.name = token.name as string;
            session.user.role = token.role as string;
          }

          return session;
        },
      },
      secret: process.env.NEXTAUTH_SECRET!,
      pages: {
        signIn: '/login'
      }
      }
})
