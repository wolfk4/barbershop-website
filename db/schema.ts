import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";



export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});


export const barbers = pgTable("barbers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});