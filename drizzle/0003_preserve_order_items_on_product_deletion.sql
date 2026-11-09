-- Custom SQL migration file, put your code below! --
ALTER TABLE "order_items" DROP CONSTRAINT IF EXISTS "order_items_product_id_shop_items_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "product_id" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_shop_items_id_fk"
  FOREIGN KEY ("product_id") REFERENCES "shop_items"("id") ON DELETE SET NULL;