import { decimal, varchar } from "drizzle-orm/pg-core";

export const locationFields = {
	address: varchar("address", { length: 255 }).notNull(),
	city: varchar("city", { length: 100 }).notNull(),
	state: varchar("state", { length: 100 }),
	country_code: varchar("country_code", { length: 2 }).notNull(),
	postal_code: varchar("postal_code", { length: 20 }),
	timezone: varchar("timezone", { length: 100 }).notNull(),
	plus_code: varchar("plus_code", { length: 20 }),
	lat: decimal("lat", { precision: 11, scale: 8 }).$type<number>(),
	lng: decimal("lng", { precision: 11, scale: 8 }).$type<number>(),
};
