import { index, integer, pgTable, serial, smallint, text, timestamp, uniqueIndex, varchar, uuid } from "drizzle-orm/pg-core";



export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: varchar({ length: 50 }).notNull().default("user"),
  password: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const barbers = pgTable("barbers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "set null" }),
}, (table) => ({
  userIdUniqueIdx: uniqueIndex("barbers_user_id_unique").on(table.userId),
}));

export const portfolioImages = pgTable("portfolio_images", {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerUserId: integer("owner_user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    objectKey: text("object_key").notNull().unique(),
    slot: smallint("slot"),
    contentType: varchar("content_type", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    ownerUserIdIdx: index("portfolio_images_owner_user_id_idx").on(table.ownerUserId),
    ownerSlotUnique: uniqueIndex("portfolio_images_owner_slot_unique").on(table.ownerUserId, table.slot),
  }),
);

export const shopItems = pgTable("shop_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  image: text("image"),
  price: integer("price").notNull(),
  stockBySize: text("stock_by_size"),
  stripeLink: varchar("stripe_link", { length: 255 }),
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
  stripeCheckoutSessionId: varchar("stripe_checkout_session_id", { length: 255 }),
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

