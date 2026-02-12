import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { methodologyEnum } from "./enums";
import { users } from "./users";

export const videoProgress = pgTable(
  "video_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    methodology: methodologyEnum("methodology").notNull(),
    muxAssetId: varchar("mux_asset_id", { length: 255 }).notNull(),
    watchPercentage: decimal("watch_percentage", {
      precision: 5,
      scale: 2,
    }).default("0.00"),
    totalWatchTime: integer("total_watch_time").default(0), // seconds
    completed: boolean("completed").default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    lastPosition: decimal("last_position", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_video_progress").on(
      table.userId,
      table.methodology,
      table.muxAssetId
    ),
    index("idx_video_progress_user").on(table.userId),
  ]
);
