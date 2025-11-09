import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Remover foreign keys existentes
    ALTER TABLE "bot_flows_buttons" DROP CONSTRAINT IF EXISTS "bot_flows_buttons_parent_id_fk";
    ALTER TABLE "bot_flows_buttons" DROP CONSTRAINT IF EXISTS "bot_flows_buttons_next_flow_id_bot_flows_id_fk";

    -- **REMOVER A FK DE payload_locked_documents_rels**
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_bot_flows_fk";

    -- 2. Criar novos tipos ENUM
    CREATE TYPE "public"."enum_user_messages_type" AS ENUM ('text', 'interactive', 'status');
    CREATE TYPE "public"."enum_chats_status" AS ENUM ('new', 'active', 'inactive');
    CREATE TYPE "public"."enum_chats_type" AS ENUM ('ai', 'bot-flow');

    -- 3. Criar novas tabelas
    CREATE TABLE "ai_messages" (
      "id" serial PRIMARY KEY NOT NULL,
      "chat_id" integer NOT NULL,
      "user_question_id" integer NOT NULL,
      "content" varchar NOT NULL,
      "timestamp" timestamp(3) with time zone NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "user_messages" (
      "id" serial PRIMARY KEY NOT NULL,
      "chat_id" integer NOT NULL,
      "content" varchar NOT NULL,
      "type" "enum_user_messages_type" DEFAULT 'text' NOT NULL,
      "timestamp" timestamp(3) with time zone NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "chats" (
      "id" serial PRIMARY KEY NOT NULL,
      "user_phone" varchar NOT NULL,
      "status" "enum_chats_status" DEFAULT 'new' NOT NULL,
      "type" "enum_chats_type" DEFAULT 'bot-flow' NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- 4. Alterar tipos das colunas
    ALTER TABLE "bot_flows_buttons" ALTER COLUMN "_parent_id" SET DATA TYPE varchar;
    ALTER TABLE "bot_flows_buttons" ALTER COLUMN "next_flow_id" SET DATA TYPE varchar;
    ALTER TABLE "bot_flows" ALTER COLUMN "id" SET DATA TYPE varchar;

    ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "bot_flows_id" SET DATA TYPE varchar;

    -- 5. Adicionar novas colunas
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ai_messages_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "user_messages_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "chats_id" integer;

    -- 6. Recriar as foreign keys removidas
    ALTER TABLE "bot_flows_buttons"
      ADD CONSTRAINT "bot_flows_buttons_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "bot_flows"("id") ON DELETE CASCADE;

    ALTER TABLE "bot_flows_buttons"
      ADD CONSTRAINT "bot_flows_buttons_next_flow_id_bot_flows_id_fk"
      FOREIGN KEY ("next_flow_id") REFERENCES "bot_flows"("id") ON DELETE CASCADE;

    -- **Recriar a FK de payload_locked_documents_rels**
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_bot_flows_fk"
      FOREIGN KEY ("bot_flows_id") REFERENCES "bot_flows"("id") ON DELETE CASCADE;

    -- 7. Foreign keys para as novas tabelas
    ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_chat_id_chats_id_fk"
      FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE SET NULL;

    ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_user_question_id_user_messages_id_fk"
      FOREIGN KEY ("user_question_id") REFERENCES "public"."user_messages"("id") ON DELETE SET NULL;

    ALTER TABLE "user_messages" ADD CONSTRAINT "user_messages_chat_id_chats_id_fk"
      FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE SET NULL;

    -- 8. Criar índices
    CREATE INDEX "ai_messages_chat_idx" ON "ai_messages" ("chat_id");
    CREATE INDEX "ai_messages_user_question_idx" ON "ai_messages" ("user_question_id");
    CREATE INDEX "user_messages_chat_idx" ON "user_messages" ("chat_id");
    CREATE UNIQUE INDEX "chats_user_phone_idx" ON "chats" ("user_phone");

    -- 9. Foreign keys em payload_locked_documents_rels
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_messages_fk"
      FOREIGN KEY ("ai_messages_id") REFERENCES "public"."ai_messages"("id") ON DELETE CASCADE;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_user_messages_fk"
      FOREIGN KEY ("user_messages_id") REFERENCES "public"."user_messages"("id") ON DELETE CASCADE;

    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chats_fk"
      FOREIGN KEY ("chats_id") REFERENCES "public"."chats"("id") ON DELETE CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ai_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "user_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "ai_messages" CASCADE;
  DROP TABLE "user_messages" CASCADE;
  DROP TABLE "chats" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ai_messages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_user_messages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_chats_fk";
  
  DROP INDEX "payload_locked_documents_rels_ai_messages_id_idx";
  DROP INDEX "payload_locked_documents_rels_user_messages_id_idx";
  DROP INDEX "payload_locked_documents_rels_chats_id_idx";
  ALTER TABLE "bot_flows_buttons" ALTER COLUMN "_parent_id" SET DATA TYPE integer;
  ALTER TABLE "bot_flows_buttons" ALTER COLUMN "next_flow_id" SET DATA TYPE integer;
  ALTER TABLE "bot_flows" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "bot_flows_id" SET DATA TYPE integer;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ai_messages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "user_messages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "chats_id";
  DROP TYPE "public"."enum_user_messages_type";
  DROP TYPE "public"."enum_chats_status";
  DROP TYPE "public"."enum_chats_type";`)
}
