import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertInquirySchema, 
  insertMarketingAgentSchema, 
  agentLoginSchema,
  insertSiteVisitEnquirySchema,
  insertConstructionServiceEnquirySchema,
  insertGeneralEnquirySchema,
  insertEmailSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Create new inquiry
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json({ 
        message: "Inquiry submitted successfully. Our team will contact you within 2 hours.",
        inquiry 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit inquiry" });
    }
  });

  // Create popup inquiry (simplified endpoint) - creates site visit enquiry
  app.post("/api/enquiries/popup", async (req, res) => {
    try {
      const validatedData = insertSiteVisitEnquirySchema.parse(req.body);
      const inquiry = await storage.createSiteVisitEnquiry(validatedData);
      res.status(201).json({ 
        message: "Enquiry submitted successfully. Our team will contact you soon.",
        inquiry 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  // Site visit enquiries
  app.post("/api/site-visit-enquiries", async (req, res) => {
    try {
      const validatedData = insertSiteVisitEnquirySchema.parse(req.body);
      const enquiry = await storage.createSiteVisitEnquiry(validatedData);
      res.status(201).json({ 
        message: "Site visit enquiry submitted successfully. We'll contact you to schedule your visit.",
        enquiry 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create site visit enquiry" });
    }
  });

  app.get("/api/site-visit-enquiries", async (req, res) => {
    try {
      const enquiries = await storage.getSiteVisitEnquiries();
      res.json(enquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site visit enquiries" });
    }
  });

  // Construction service enquiries
  app.post("/api/construction-service-enquiries", async (req, res) => {
    try {
      const validatedData = insertConstructionServiceEnquirySchema.parse(req.body);
      const enquiry = await storage.createConstructionServiceEnquiry(validatedData);
      res.status(201).json({ 
        message: "Construction service enquiry submitted successfully. Our construction team will contact you soon.",
        enquiry 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create construction service enquiry" });
    }
  });

  app.get("/api/construction-service-enquiries", async (req, res) => {
    try {
      const enquiries = await storage.getConstructionServiceEnquiries();
      res.json(enquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch construction service enquiries" });
    }
  });

  // General enquiries
  app.get("/api/general-enquiries", async (req, res) => {
    try {
      const enquiries = await storage.getGeneralEnquiries();
      res.json(enquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch general enquiries" });
    }
  });

  // Create consultation request
  app.post("/api/consultations", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const consultation = await storage.createInquiry(validatedData);
      res.status(201).json(consultation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to schedule consultation" });
    }
  });

  // Get all testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Get all inquiries (admin endpoint)
  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Marketing Agent Routes
  
  // Register new marketing agent
  app.post("/api/marketing-agents", async (req, res) => {
    try {
      console.log("Received registration data:", req.body);
      const validatedData = insertMarketingAgentSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      
      const agent = await storage.createMarketingAgent(validatedData);
      console.log("Created agent:", agent);
      
      res.status(201).json({ 
        message: "Marketing agent registration submitted successfully. We will review your application and contact you within 24 hours.",
        agent: { id: agent.id, fullName: agent.fullName, email: agent.email, status: agent.status }
      });
    } catch (error) {
      console.error("Marketing agent registration error:", error);
      console.error("Error stack:", error.stack);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        message: "Failed to register marketing agent",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Marketing Agent Login Route
  app.post("/api/marketing-agents/login", async (req, res) => {
    try {
      const { phone, password } = agentLoginSchema.parse(req.body);
      
      const agent = await storage.authenticateAgent(phone, password);
      if (!agent) {
        return res.status(401).json({ message: "Invalid phone number or password" });
      }

      res.json(agent);
    } catch (error) {
      console.error("Error during agent login:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Get all marketing agents (admin endpoint)
  app.get("/api/marketing-agents", async (req, res) => {
    try {
      const agents = await storage.getMarketingAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch marketing agents" });
    }
  });

  // Marketing Agents OTP Login - Step 1: Send OTP
  app.post("/api/marketing-agents/send-otp", async (req, res) => {
    try {
      const { phone } = req.body;
      
      if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
      }
      
      // Check if agent exists with this phone number
      const agent = await storage.getMarketingAgentByPhone(phone);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found with this phone number" });
      }
      
      if (agent.status !== "approved") {
        return res.status(403).json({ message: "Agent account is not approved yet" });
      }
      
      // Create OTP session
      const otpSession = await storage.createOtpSession(phone);
      
      res.json({ 
        message: "OTP sent successfully", 
        phone: phone,
        expiresAt: otpSession.expiresAt 
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Marketing Agents OTP Login - Step 2: Verify OTP
  app.post("/api/marketing-agents/verify-otp", async (req, res) => {
    try {
      const { phone, otp } = req.body;
      
      if (!phone || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required" });
      }
      
      const agent = await storage.verifyOtpSession(phone, otp);
      if (!agent) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
      }
      
      res.json(agent);
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });



  // Get inquiries for a specific marketing agent
  app.get("/api/marketing-agents/:id/inquiries", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid agent ID" });
      }
      
      const inquiries = await storage.getInquiriesByMarketingAgent(id);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent inquiries" });
    }
  });

  // Update inquiry lead status (admin only)
  app.patch("/api/inquiries/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid inquiry ID" });
      }
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const inquiry = await storage.updateInquiryStatus(id, status);
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inquiry status" });
    }
  });

  // Add agent comment to inquiry
  app.patch("/api/inquiries/:id/comment", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { comment } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid inquiry ID" });
      }
      
      if (!comment || comment.trim() === "") {
        return res.status(400).json({ message: "Comment is required" });
      }
      
      const inquiry = await storage.addAgentComment(id, comment.trim());
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to add agent comment" });
    }
  });

  // Update marketing agent status (admin endpoint)
  app.patch("/api/marketing-agents/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid agent ID" });
      }
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const agent = await storage.updateMarketingAgentStatus(id, status);
      res.json(agent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update agent status" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const admin = await storage.authenticateAdmin(email, password);
      if (!admin) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Store admin session
      (req.session as any).adminId = admin.id;
      (req.session as any).adminEmail = admin.email;
      
      res.json({ 
        id: admin.id, 
        email: admin.email, 
        fullName: admin.fullName 
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/admin/me", (req, res) => {
    if (!(req.session as any).adminId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    res.json({
      id: (req.session as any).adminId,
      email: (req.session as any).adminEmail
    });
  });

  // Email API endpoints (admin only)
  app.get("/api/emails", async (req, res) => {
    try {
      if (!(req.session as any).adminId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const emails = await storage.getEmails();
      res.json(emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ message: "Failed to fetch emails" });
    }
  });

  app.get("/api/emails/unread", async (req, res) => {
    try {
      if (!(req.session as any).adminId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const emails = await storage.getUnreadEmails();
      res.json(emails);
    } catch (error) {
      console.error("Error fetching unread emails:", error);
      res.status(500).json({ message: "Failed to fetch unread emails" });
    }
  });

  app.patch("/api/emails/:id/read", async (req, res) => {
    try {
      if (!(req.session as any).adminId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid email ID" });
      }
      
      const email = await storage.markEmailAsRead(id);
      res.json(email);
    } catch (error) {
      console.error("Error marking email as read:", error);
      res.status(500).json({ message: "Failed to mark email as read" });
    }
  });

  app.get("/api/emails/:id", async (req, res) => {
    try {
      if (!(req.session as any).adminId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid email ID" });
      }
      
      const email = await storage.getEmailById(id);
      if (!email) {
        return res.status(404).json({ message: "Email not found" });
      }
      
      res.json(email);
    } catch (error) {
      console.error("Error fetching email:", error);
      res.status(500).json({ message: "Failed to fetch email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
