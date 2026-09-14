import { integer, pgTable, serial, text, timestamp, varchar, uuid } from "drizzle-orm/pg-core";



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


export const shopItems = pgTable("shop_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  image: text("image"),
  price: integer("price").notNull(),
  description: text("description"),
  moreInfo: text("more_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cart = pgTable("cart", {
  uid: uuid("uid").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => shopItems.id).notNull(),
  userId: uuid("user_id").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

