// src/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import "dotenv/config";

import homepage from "./routes/homepage";
import mealPlans from "./routes/meal-plans";
import subscribe from "./routes/subscribe";
import testimonials from "./routes/testimonials";
import auth from "./routes/auth";
import dashboard from "./routes/dashboard";
import admin from "./routes/admin";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

app.route("/", homepage);
app.route("/meal-plans", mealPlans);
app.route("/subscribe", subscribe);
app.route("/testimonials", testimonials);
app.route("/auth", auth);
app.route("/dashboard", dashboard);
app.route("/admin", admin);

serve({ fetch: app.fetch, port: 3000 });
