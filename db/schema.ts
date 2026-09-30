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
  stockBySize: text("stock_by_size"),
  description: text("description"),
  moreInfo: text("more_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productBySize = pgTable("product_by_size", {
  productSizeId: uuid("product_size_id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => shopItems.id),
  size: varchar("size", { length: 10 }),
  stock: integer("stock"),
});

export const cart = pgTable("cart", {
  uid: uuid("uid").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => shopItems.id),
  userId: uuid("user_id").notNull(),
  size: varchar("size", { length: 10}),
  quantity: integer("quantity").default(1).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  total: integer("total").notNull(),
  status: varchar("status", { length: 20 }).default("placed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => shopItems.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  size: varchar("size", { length: 10 }),
  quantity: integer("quantity").default(1).notNull(),
});

