import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_bot_flows_type" AS ENUM('button', 'text');
  ALTER TABLE "bot_flows_buttons" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "bot_flows" ADD COLUMN "type" "enum_bot_flows_type" DEFAULT 'text' NOT NULL;
  ALTER TABLE "bot_flows" DROP COLUMN "header";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "bot_flows" RENAME COLUMN "type" TO "header";
  ALTER TABLE "bot_flows_buttons" ALTER COLUMN "title" SET NOT NULL;
  DROP TYPE "public"."enum_bot_flows_type";`)
}
