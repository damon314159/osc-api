CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "collections_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"duration" integer NOT NULL,
	"outcome" text NOT NULL,
	"collection_id" integer,
	CONSTRAINT "courses_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'USER' NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE no action ON UPDATE no action;