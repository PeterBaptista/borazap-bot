import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Remover FKs existentes que dependem de knowledge_base.id
    ALTER TABLE "knowledge_base_tags" DROP CONSTRAINT IF EXISTS "knowledge_base_tags_parent_id_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_knowledge_base_fk";

    -- 2. Alterar os tipos das colunas para varchar
    ALTER TABLE "knowledge_base" ALTER COLUMN "id" SET DATA TYPE varchar;
    ALTER TABLE "knowledge_base_tags" ALTER COLUMN "_parent_id" SET DATA TYPE varchar;
    ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "knowledge_base_id" SET DATA TYPE varchar;

    -- 3. Recriar FKs com o novo tipo
    ALTER TABLE "knowledge_base_tags"
      ADD CONSTRAINT "knowledge_base_tags_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "knowledge_base" ("id") ON DELETE CASCADE;

    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_knowledge_base_fk"
      FOREIGN KEY ("knowledge_base_id") REFERENCES "knowledge_base" ("id") ON DELETE CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Remover FKs que dependem do varchar
    ALTER TABLE "knowledge_base_tags" DROP CONSTRAINT IF EXISTS "knowledge_base_tags_parent_id_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_knowledge_base_fk";

    -- 2. Reverter tipos para integer/serial
    ALTER TABLE "knowledge_base_tags" ALTER COLUMN "_parent_id" SET DATA TYPE integer;
    ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "knowledge_base_id" SET DATA TYPE integer;
    ALTER TABLE "knowledge_base" ALTER COLUMN "id" SET DATA TYPE serial;

    -- 3. Recriar FKs originais
    ALTER TABLE "knowledge_base_tags"
      ADD CONSTRAINT "knowledge_base_tags_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "knowledge_base" ("id") ON DELETE CASCADE;

    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_knowledge_base_fk"
      FOREIGN KEY ("knowledge_base_id") REFERENCES "knowledge_base" ("id") ON DELETE CASCADE;
  `)
}
