import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSchema, blogPostSchema, blogMediaSchema } from "@shared/schema";
import { setupAuth, isAuthenticated, hasAdminSession } from "./auth";
import { ZodError } from "zod";

// Helper function for handling errors
function handleError(res: Response, error: unknown) {
  console.error("API request failed:", error instanceof Error ? error.name : "Error", (error as { code?: string })?.code ?? "");
  if (error instanceof ZodError) {
    return res.status(400).json({ success: false, message: error.issues[0]?.message ?? "Invalid request data" });
  }
  if ((error as { code?: string })?.code === "23505") {
    return res.status(409).json({ success: false, message: "A post already uses that URL slug. Choose another one." });
  }
  return res.status(500).json({ success: false, message: "The request could not be saved. Please try again." });
}

export async function registerRoutes(app: Express, configureAuth = setupAuth): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Setup authentication
  await configureAuth(app);
  
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      const message = await storage.saveContactMessage(validatedData);
      
      res.status(200).json({ 
        success: true,
        message: "Message sent successfully",
        id: message.id 
      });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get all blog posts (public)
  app.get("/api/blog", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0) {
        return res.status(400).json({ success: false, message: "Invalid page size or offset." });
      }
      const tag = req.query.tag as string | undefined;
      
      const includeDrafts = hasAdminSession(req);
      
      const posts = await storage.getAllBlogPosts(limit, offset, tag, includeDrafts);
      res.json({ success: true, posts });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get a single blog post by slug (public)
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const isAdmin = hasAdminSession(req);
      const post = await storage.getBlogPostBySlug(req.params.slug);
      
      if (!post) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }
      
      // Check if the post is a draft and the user is not an admin
      if (post.status !== "published" && !isAdmin) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }
      
      // Get media for the post
      const media = await storage.getBlogMediaForPost(post.id);
      
      res.json({ success: true, post, media });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Create a new blog post (admin only)
  app.post("/api/blog", isAuthenticated, async (req, res) => {
    try {
      const validatedData = blogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      
      res.status(201).json({ success: true, post });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Update a blog post (admin only)
  app.put("/api/blog/:id", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const validatedData = blogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(postId, validatedData);
      
      if (!post) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }
      
      res.json({ success: true, post });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Delete a blog post (admin only)
  app.delete("/api/blog/:id", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(postId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Add media to a blog post (admin only)
  app.post("/api/blog/:postId/media", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const post = await storage.getBlogPost(postId);
      
      if (!post) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }
      
      const mediaData = {
        ...req.body,
        blog_post_id: postId
      };
      
      const validatedData = blogMediaSchema.parse(mediaData);
      const media = await storage.addBlogMedia(validatedData);
      res.status(201).json({ success: true, media });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get all media for a blog post
  app.get("/api/blog/:postId/media", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const post = await storage.getBlogPost(postId);
      if (!post || (post.status !== "published" && !hasAdminSession(req))) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }
      const media = await storage.getBlogMediaForPost(postId);
      res.json({ success: true, media });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Update blog media
  app.put("/api/blog/media/:id", isAuthenticated, async (req, res) => {
    try {
      const mediaId = parseInt(req.params.id);
      const validatedData = blogMediaSchema.partial().parse(req.body);
      const media = await storage.updateBlogMedia(mediaId, validatedData);
      
      if (!media) {
        return res.status(404).json({ success: false, message: "Media not found" });
      }
      
      res.json({ success: true, media });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Delete blog media
  app.delete("/api/blog/media/:id", isAuthenticated, async (req, res) => {
    try {
      const mediaId = parseInt(req.params.id);
      const success = await storage.deleteBlogMedia(mediaId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: "Media not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      handleError(res, error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
