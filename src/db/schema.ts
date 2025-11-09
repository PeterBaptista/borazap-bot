import {
  pgTable,
  index,
  uniqueIndex,
  serial,
  varchar,
  timestamp,
  numeric,
  foreignKey,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const media = pgTable(
  'media',
  {
    id: serial().primaryKey().notNull(),
    alt: varchar().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    url: varchar(),
    thumbnailURL: varchar('thumbnail_u_r_l'),
    filename: varchar(),
    mimeType: varchar('mime_type'),
    filesize: numeric(),
    width: numeric(),
    height: numeric(),
    focalX: numeric('focal_x'),
    focalY: numeric('focal_y'),
  },
  (table) => [
    index('media_created_at_idx').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    uniqueIndex('media_filename_idx').using(
      'btree',
      table.filename.asc().nullsLast().op('text_ops'),
    ),
    index('media_updated_at_idx').using(
      'btree',
      table.updatedAt.asc().nullsLast().op('timestamptz_ops'),
    ),
  ],
)

export const users = pgTable(
  'users',
  {
    id: serial().primaryKey().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    email: varchar().notNull(),
    resetPasswordToken: varchar('reset_password_token'),
    resetPasswordExpiration: timestamp('reset_password_expiration', {
      precision: 3,
      withTimezone: true,
      mode: 'string',
    }),
    salt: varchar(),
    hash: varchar(),
    loginAttempts: numeric('login_attempts').default('0'),
    lockUntil: timestamp('lock_until', { precision: 3, withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index('users_created_at_idx').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    uniqueIndex('users_email_idx').using('btree', table.email.asc().nullsLast().op('text_ops')),
    index('users_updated_at_idx').using(
      'btree',
      table.updatedAt.asc().nullsLast().op('timestamptz_ops'),
    ),
  ],
)

export const payloadLockedDocuments = pgTable(
  'payload_locked_documents',
  {
    id: serial().primaryKey().notNull(),
    globalSlug: varchar('global_slug'),
    updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('payload_locked_documents_created_at_idx').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('payload_locked_documents_global_slug_idx').using(
      'btree',
      table.globalSlug.asc().nullsLast().op('text_ops'),
    ),
    index('payload_locked_documents_updated_at_idx').using(
      'btree',
      table.updatedAt.asc().nullsLast().op('timestamptz_ops'),
    ),
  ],
)

export const payloadMigrations = pgTable(
  'payload_migrations',
  {
    id: serial().primaryKey().notNull(),
    name: varchar(),
    batch: numeric(),
    updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('payload_migrations_created_at_idx').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('payload_migrations_updated_at_idx').using(
      'btree',
      table.updatedAt.asc().nullsLast().op('timestamptz_ops'),
    ),
  ],
)

export const usersSessions = pgTable(
  'users_sessions',
  {
    order: integer('_order').notNull(),
    parentId: integer('_parent_id').notNull(),
    id: varchar().primaryKey().notNull(),
    createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }),
    expiresAt: timestamp('expires_at', {
      precision: 3,
      withTimezone: true,
      mode: 'string',
    }).notNull(),
  },
  (table) => [
    index('users_sessions_order_idx').using('btree', table.order.asc().nullsLast().op('int4_ops')),
    index('users_sessions_parent_id_idx').using(
      'btree',
      table.parentId.asc().nullsLast().op('int4_ops'),
    ),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [users.id],
      name: 'users_sessions_parent_id_fk',
    }).onDelete('cascade'),
  ],
)

export const payloadLockedDocumentsRels = pgTable(
  'payload_locked_documents_rels',
  {
    id: serial().primaryKey().notNull(),
    order: integer(),
    parentId: integer('parent_id').notNull(),
    path: varchar().notNull(),
    usersId: integer('users_id'),
    mediaId: integer('media_id'),
  },
  (table) => [
    index('payload_locked_documents_rels_media_id_idx').using(
      'btree',
      table.mediaId.asc().nullsLast().op('int4_ops'),
    ),
    index('payload_locked_documents_rels_order_idx').using(
      'btree',
      table.order.asc().nullsLast().op('int4_ops'),
    ),
    index('payload_locked_documents_rels_parent_idx').using(
      'btree',
      table.parentId.asc().nullsLast().op('int4_ops'),
    ),
    index('payload_locked_documents_rels_path_idx').using(
      'btree',
      table.path.asc().nullsLast().op('text_ops'),
    ),
    index('payload_locked_documents_rels_users_id_idx').using(
      'btree',
      table.usersId.asc().nullsLast().op('int4_ops'),
    ),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [payloadLockedDocuments.id],
      name: 'payload_locked_documents_rels_parent_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.usersId],
      foreignColumns: [users.id],
      name: 'payload_locked_documents_rels_users_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.mediaId],
      foreignColumns: [media.id],
      name: 'payload_locked_documents_rels_media_fk',
    }).onDelete('cascade'),
  ],
)

export const payloadPreferences = pgTable(
  'payload_preferences',
  {
    id: serial().primaryKey().notNull(),
    key: varchar(),
    value: jsonb(),
    updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('payload_preferences_created_at_idx').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('payload_preferences_key_idx').using('btree', table.key.asc().nullsLast().op('text_ops')),
    index('payload_preferences_updated_at_idx').using(
      'btree',
      table.updatedAt.asc().nullsLast().op('timestamptz_ops'),
    ),
  ],
)

export const payloadPreferencesRels = pgTable(
  'payload_preferences_rels',
  {
    id: serial().primaryKey().notNull(),
    order: integer(),
    parentId: integer('parent_id').notNull(),
    path: varchar().notNull(),
    usersId: integer('users_id'),
  },
  (table) => [
    index('payload_preferences_rels_order_idx').using(
      'btree',
      table.order.asc().nullsLast().op('int4_ops'),
    ),
    index('payload_preferences_rels_parent_idx').using(
      'btree',
      table.parentId.asc().nullsLast().op('int4_ops'),
    ),
    index('payload_preferences_rels_path_idx').using(
      'btree',
      table.path.asc().nullsLast().op('text_ops'),
    ),
    index('payload_preferences_rels_users_id_idx').using(
      'btree',
      table.usersId.asc().nullsLast().op('int4_ops'),
    ),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [payloadPreferences.id],
      name: 'payload_preferences_rels_parent_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.usersId],
      foreignColumns: [users.id],
      name: 'payload_preferences_rels_users_fk',
    }).onDelete('cascade'),
  ],
)
