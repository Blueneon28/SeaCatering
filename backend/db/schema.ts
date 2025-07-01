import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  price: integer("price"), // per meal
  description: text("description"),
  imageUrl: text("image_url"),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  message: text("message"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }),
  phone: varchar("phone", { length: 15 }),
  planId: integer("plan_id").references(() => mealPlans.id),
  mealTypes: jsonb("meal_types"), // ["breakfast", "dinner"]
  deliveryDays: jsonb("delivery_days"), // ["monday", "tuesday"]
  allergies: text("allergies"),
  totalPrice: integer("total_price"),
  createdAt: timestamp("created_at").defaultNow(),
});
