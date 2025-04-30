import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request data against schema
      const validatedData = contactSchema.parse(req.body);
      
      // Store contact message
      const message = await storage.saveContactMessage(validatedData);
      
      // Return success response
      res.status(200).json({ 
        success: true,
        message: "Message sent successfully",
        id: message.id 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false,
        message: "Invalid form data",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
