import { users, contactMessages, blogPosts, blogMedia,
  type User, type InsertUser, 
  type ContactMessage, type InsertContactMessage,
  type ContactFormData,
  type BlogPost, type InsertBlogPost,
  type BlogMedia, type InsertBlogMedia
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: any): Promise<User>;
  
  // Contact methods
  saveContactMessage(message: ContactFormData): Promise<ContactMessage>;
  
  // Blog post methods
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(limit?: number, offset?: number, tag?: string): Promise<BlogPost[]>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Blog media methods
  addBlogMedia(media: InsertBlogMedia): Promise<BlogMedia>;
  getBlogMedia(id: number): Promise<BlogMedia | undefined>;
  getBlogMediaForPost(postId: number): Promise<BlogMedia[]>;
  updateBlogMedia(id: number, media: Partial<InsertBlogMedia>): Promise<BlogMedia | undefined>;
  deleteBlogMedia(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async upsertUser(userData: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        bio: userData.bio,
        profileImageUrl: userData.profileImageUrl,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          bio: userData.bio,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Contact methods
  async saveContactMessage(message: ContactFormData): Promise<ContactMessage> {
    const [savedMessage] = await db.insert(contactMessages)
      .values({
        name: message.name,
        email: message.email,
        subject: message.subject || "",
        message: message.message
      })
      .returning();
    return savedMessage;
  }

  // Blog post methods
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [createdPost] = await db.insert(blogPosts)
      .values(post)
      .returning();
    return createdPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    // Set updated_at to current timestamp
    const updateData = {
      ...post,
      updated_at: new Date()
    };
    
    const [updatedPost] = await db.update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async getAllBlogPosts(limit = 10, offset = 0, tag?: string): Promise<BlogPost[]> {
    let query = db.select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"));
    
    // We need to handle array contents differently
    // This will need to be adjusted based on how PostgreSQL stores and queries arrays
    // For now, we'll simplify by returning all posts when tag is specified
    // and filter in memory - this should be optimized in a production environment
    
    const posts = await query.orderBy(desc(blogPosts.published_at))
      .limit(limit)
      .offset(offset);
    
    if (tag) {
      return posts.filter(post => post.tags && post.tags.includes(tag));
    }
    
    return posts;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const [deleted] = await db.delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning({ id: blogPosts.id });
    return !!deleted;
  }

  // Blog media methods
  async addBlogMedia(media: InsertBlogMedia): Promise<BlogMedia> {
    const [createdMedia] = await db.insert(blogMedia)
      .values(media)
      .returning();
    return createdMedia;
  }

  async getBlogMedia(id: number): Promise<BlogMedia | undefined> {
    const [media] = await db.select()
      .from(blogMedia)
      .where(eq(blogMedia.id, id));
    return media;
  }

  async getBlogMediaForPost(postId: number): Promise<BlogMedia[]> {
    return await db.select()
      .from(blogMedia)
      .where(eq(blogMedia.blog_post_id, postId))
      .orderBy(blogMedia.order);
  }

  async updateBlogMedia(id: number, media: Partial<InsertBlogMedia>): Promise<BlogMedia | undefined> {
    const [updatedMedia] = await db.update(blogMedia)
      .set(media)
      .where(eq(blogMedia.id, id))
      .returning();
    return updatedMedia;
  }

  async deleteBlogMedia(id: number): Promise<boolean> {
    const [deleted] = await db.delete(blogMedia)
      .where(eq(blogMedia.id, id))
      .returning({ id: blogMedia.id });
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();
