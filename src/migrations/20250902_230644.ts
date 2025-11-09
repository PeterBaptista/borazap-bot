import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "bot_flows_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"next_flow_id" integer
  );
  
  CREATE TABLE "bot_flows" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"header" varchar,
  	"body" varchar NOT NULL,
  	"footer" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "bot_flows_id" integer;
  ALTER TABLE "bot_flows_buttons" ADD CONSTRAINT "bot_flows_buttons_next_flow_id_bot_flows_id_fk" FOREIGN KEY ("next_flow_id") REFERENCES "public"."bot_flows"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bot_flows_buttons" ADD CONSTRAINT "bot_flows_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."bot_flows"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "bot_flows_buttons_order_idx" ON "bot_flows_buttons" USING btree ("_order");
  CREATE INDEX "bot_flows_buttons_parent_id_idx" ON "bot_flows_buttons" USING btree ("_parent_id");
  CREATE INDEX "bot_flows_buttons_next_flow_idx" ON "bot_flows_buttons" USING btree ("next_flow_id");
  CREATE INDEX "bot_flows_updated_at_idx" ON "bot_flows" USING btree ("updated_at");
  CREATE INDEX "bot_flows_created_at_idx" ON "bot_flows" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bot_flows_fk" FOREIGN KEY ("bot_flows_id") REFERENCES "public"."bot_flows"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_bot_flows_id_idx" ON "payload_locked_documents_rels" USING btree ("bot_flows_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bot_flows_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "bot_flows" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "bot_flows_buttons" CASCADE;
  DROP TABLE "bot_flows" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_bot_flows_fk";
  
  DROP INDEX "payload_locked_documents_rels_bot_flows_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "bot_flows_id";`)
}
