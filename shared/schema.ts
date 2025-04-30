import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User model for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  bio: text("bio"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users, {
  id: z.string(),
  username: z.string(),
  email: z.string().email().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
});

// Contact message model
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

export const insertContactSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// Blog post model
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  thumbnail_url: text("thumbnail_url"),
  published_at: timestamp("published_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  tags: text("tags").array(), // Array of tags for filtering
  status: text("status").notNull().default("draft"), // draft, published
});

// Blog post media model (for images, videos, etc.)
export const blogMedia = pgTable("blog_media", {
  id: serial("id").primaryKey(),
  blog_post_id: integer("blog_post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  media_type: text("media_type").notNull(), // image, video, youtube, etc.
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  order: integer("order").notNull().default(0), // For arranging media in a post
  metadata: json("metadata"), // For storing additional media information
});

// Blog schemas
export const blogPostSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  slug: z.string().min(5, { message: "Slug must be at least 5 characters" }),
  summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  thumbnail_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const blogMediaSchema = z.object({
  blog_post_id: z.number(),
  media_type: z.enum(["image", "video", "youtube", "vimeo"]),
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  thumbnail_url: true,
  tags: true,
  status: true,
});

export const insertBlogMediaSchema = createInsertSchema(blogMedia).pick({
  blog_post_id: true,
  media_type: true,
  url: true,
  title: true,
  description: true,
  order: true,
  metadata: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type ContactFormData = z.infer<typeof contactSchema>;
export type InsertContactMessage = z.infer<typeof insertContactSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogMedia = typeof blogMedia.$inferSelect;
export type InsertBlogMedia = z.infer<typeof insertBlogMediaSchema>;
