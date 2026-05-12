CREATE TABLE "barbers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
