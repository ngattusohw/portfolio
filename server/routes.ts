import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSchema, blogPostSchema, blogMediaSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";

// Helper function for handling errors
function handleError(res: Response, error: unknown) {
  console.error("API Error:", error);
  return res.status(400).json({
    success: false,
    message: "Invalid request data",
    error: error instanceof Error ? error.message : "Unknown error"
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);
  
  // Auth routes to check user authentication status
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
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
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const tag = req.query.tag as string | undefined;
      
      // Check if the user is authenticated (admin) or if includeDrafts is explicitly set to 'true'
      const isAdmin = req.isAuthenticated();
      // Parse query string parameter for includeDrafts
      const includeDraftsParam = req.query.includeDrafts === 'true';
      
      // For debugging
      console.log(`Blog posts request - isAdmin: ${isAdmin}, includeDraftsParam: ${includeDraftsParam}`);
      
      // Either show drafts if user is admin or if includeDrafts is explicitly requested
      // In production you would typically only want isAdmin, but for testing we'll allow the param
      const includeDrafts = isAdmin || includeDraftsParam;
      
      const posts = await storage.getAllBlogPosts(limit, offset, tag, includeDrafts);
      res.json({ success: true, posts });
    } catch (error) {
      handleError(res, error);
    }
  });

  // Get a single blog post by slug (public)
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const isAdmin = req.isAuthenticated();
      const post = await storage.getBlogPostBySlug(req.params.slug);
      
      if (!post) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }
      
      // Check if the post is a draft and the user is not an admin
      if (post.status === "draft" && !isAdmin) {
        console.log(`Non-admin tried to access draft post: ${post.slug}`);
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
      console.log("Received blog post creation request:", JSON.stringify(req.body, null, 2));
      
      // Validate the data
      console.log("Validating blog post data with schema");
      const validatedData = blogPostSchema.parse(req.body);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
      
      // Create the post
      console.log("Attempting to save blog post to database");
      const post = await storage.createBlogPost(validatedData);
      console.log("Blog post created successfully with ID:", post.id);
      
      res.status(201).json({ success: true, post });
    } catch (error) {
      console.error("Error creating blog post:", error);
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
