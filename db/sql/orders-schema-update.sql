-- Updates the orders table to match db/schema.ts:
-- splits customer_name into first/last, adds phone + shipping address,
-- and changes status from varchar to an enum.
-- Run this once on Neon (SQL editor) before running drizzle-kit push.
-- Safe to run on a table that already has orders in it.

BEGIN;

-- status enum
DO $$ BEGIN
  CREATE TYPE "order_status" AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- first/last name, filled from the old customer_name column
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "customer_first_name" varchar(100);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "customer_last_name" varchar(100);

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
    UPDATE "orders"
    SET
      "customer_first_name" = split_part(trim("customer_name"), ' ', 1),
      "customer_last_name" = trim(substr(trim("customer_name"), length(split_part(trim("customer_name"), ' ', 1)) + 1))
    WHERE "customer_first_name" IS NULL;
  END IF;
END $$;

ALTER TABLE "orders" ALTER COLUMN "customer_first_name" SET NOT NULL;
ALTER TABLE "orders" ALTER COLUMN "customer_last_name" SET NOT NULL;
ALTER TABLE "orders" DROP COLUMN IF EXISTS "customer_name";

-- phone + shipping address (nullable so old orders are fine)
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "customer_phone" varchar(20);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_street" varchar(255);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_city" varchar(100);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_state" varchar(2);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_zip" varchar(10);

-- old orders were saved as "placed", which is the same as pending
UPDATE "orders" SET "status" = 'pending' WHERE "status" NOT IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "order_status" USING "status"::"order_status";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending';

COMMIT;
