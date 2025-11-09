import { relations } from "drizzle-orm/relations";
import { users, usersSessions, payloadLockedDocuments, payloadLockedDocumentsRels, media, payloadPreferences, payloadPreferencesRels } from "./schema";

export const usersSessionsRelations = relations(usersSessions, ({one}) => ({
	user: one(users, {
		fields: [usersSessions.parentId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	usersSessions: many(usersSessions),
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
	payloadPreferencesRels: many(payloadPreferencesRels),
}));

export const payloadLockedDocumentsRelsRelations = relations(payloadLockedDocumentsRels, ({one}) => ({
	payloadLockedDocument: one(payloadLockedDocuments, {
		fields: [payloadLockedDocumentsRels.parentId],
		references: [payloadLockedDocuments.id]
	}),
	user: one(users, {
		fields: [payloadLockedDocumentsRels.usersId],
		references: [users.id]
	}),
	media: one(media, {
		fields: [payloadLockedDocumentsRels.mediaId],
		references: [media.id]
	}),
}));

export const payloadLockedDocumentsRelations = relations(payloadLockedDocuments, ({many}) => ({
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const mediaRelations = relations(media, ({many}) => ({
	payloadLockedDocumentsRels: many(payloadLockedDocumentsRels),
}));

export const payloadPreferencesRelsRelations = relations(payloadPreferencesRels, ({one}) => ({
	payloadPreference: one(payloadPreferences, {
		fields: [payloadPreferencesRels.parentId],
		references: [payloadPreferences.id]
	}),
	user: one(users, {
		fields: [payloadPreferencesRels.usersId],
		references: [users.id]
	}),
}));

export const payloadPreferencesRelations = relations(payloadPreferences, ({many}) => ({
	payloadPreferencesRels: many(payloadPreferencesRels),
}));