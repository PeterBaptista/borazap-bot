import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_knowledge_base_category" AS ENUM('general', 'product', 'support', 'internal');
  CREATE TABLE "knowledge_base_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "knowledge_base" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"category" "enum_knowledge_base_category" DEFAULT 'general' NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "knowledge_base_id" integer;
  ALTER TABLE "knowledge_base_tags" ADD CONSTRAINT "knowledge_base_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."knowledge_base"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "knowledge_base_tags_order_idx" ON "knowledge_base_tags" USING btree ("_order");
  CREATE INDEX "knowledge_base_tags_parent_id_idx" ON "knowledge_base_tags" USING btree ("_parent_id");
  CREATE INDEX "knowledge_base_updated_at_idx" ON "knowledge_base" USING btree ("updated_at");
  CREATE INDEX "knowledge_base_created_at_idx" ON "knowledge_base" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_base_fk" FOREIGN KEY ("knowledge_base_id") REFERENCES "public"."knowledge_base"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_knowledge_base_id_idx" ON "payload_locked_documents_rels" USING btree ("knowledge_base_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "knowledge_base_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "knowledge_base" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "knowledge_base_tags" CASCADE;
  DROP TABLE "knowledge_base" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_knowledge_base_fk";
  
  DROP INDEX "payload_locked_documents_rels_knowledge_base_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "knowledge_base_id";
  DROP TYPE "public"."enum_knowledge_base_category";`)
}
