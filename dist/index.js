var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import session from "express-session";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminUsers: () => adminUsers,
  agentLoginSchema: () => agentLoginSchema,
  constructionServiceEnquiries: () => constructionServiceEnquiries,
  emails: () => emails,
  generalEnquiries: () => generalEnquiries,
  inquiries: () => inquiries,
  insertAdminUserSchema: () => insertAdminUserSchema,
  insertConstructionServiceEnquirySchema: () => insertConstructionServiceEnquirySchema,
  insertEmailSchema: () => insertEmailSchema,
  insertGeneralEnquirySchema: () => insertGeneralEnquirySchema,
  insertInquirySchema: () => insertInquirySchema,
  insertMarketingAgentSchema: () => insertMarketingAgentSchema,
  insertOtpSessionSchema: () => insertOtpSessionSchema,
  insertProjectSchema: () => insertProjectSchema,
  insertSiteVisitEnquirySchema: () => insertSiteVisitEnquirySchema,
  insertTestimonialSchema: () => insertTestimonialSchema,
  marketingAgents: () => marketingAgents,
  otpSessions: () => otpSessions,
  projects: () => projects,
  siteVisitEnquiries: () => siteVisitEnquiries,
  testimonials: () => testimonials
});
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  price: text("price").notNull(),
  status: text("status").notNull(),
  // "ready", "under-development", "upcoming"
  plotsAvailable: integer("plots_available").notNull(),
  plotSize: text("plot_size").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  amenities: jsonb("amenities").notNull(),
  // array of strings
  features: jsonb("features").notNull()
  // array of strings
});
var marketingAgents = pgTable("marketing_agents", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  password: text("password").notNull(),
  address: text("address"),
  experience: text("experience"),
  status: text("status").notNull().default("approved"),
  // "pending", "approved", "rejected"
  createdAt: timestamp("created_at").defaultNow()
});
var otpSessions = pgTable("otp_sessions", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  projectId: integer("project_id"),
  budget: text("budget"),
  message: text("message"),
  privacyAccepted: boolean("privacy_accepted").notNull().default(false),
  marketingAgentId: integer("marketing_agent_id"),
  marketingAgentName: text("marketing_agent_name"),
  leadStatus: text("lead_status").notNull().default("new"),
  // "new", "contacted", "site_visit_scheduled", "site_visit_completed", "negotiating", "deal_closed", "deal_lost"
  agentComment: text("agent_comment"),
  // Agent's comment/suggestion about lead status
  agentCommentDate: timestamp("agent_comment_date"),
  createdAt: timestamp("created_at").defaultNow()
});
var siteVisitEnquiries = pgTable("site_visit_enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  projectId: integer("project_id"),
  projectName: text("project_name"),
  // Store the actual project name
  marketingAgentName: text("marketing_agent_name"),
  message: text("message"),
  purpose: text("purpose"),
  // Optional field
  createdAt: timestamp("created_at").defaultNow()
});
var constructionServiceEnquiries = pgTable("construction_service_enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  serviceType: text("service_type").notNull(),
  // "construction", "planning", "design", etc.
  projectDetails: text("project_details"),
  budget: text("budget"),
  timeline: text("timeline"),
  createdAt: timestamp("created_at").defaultNow()
});
var generalEnquiries = pgTable("general_enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  purpose: text("purpose"),
  // Optional field
  createdAt: timestamp("created_at").defaultNow()
});
var testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerLocation: text("customer_location").notNull(),
  rating: integer("rating").notNull(),
  testimonial: text("testimonial").notNull()
});
var adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  messageId: text("message_id").unique().notNull(),
  // Unique email message ID to prevent duplicates
  from: text("from").notNull(),
  // Sender email address
  fromName: text("from_name"),
  // Sender display name
  to: text("to").notNull(),
  // Recipient email address
  subject: text("subject").notNull(),
  textContent: text("text_content"),
  // Plain text content
  htmlContent: text("html_content"),
  // HTML content
  receivedAt: timestamp("received_at").notNull(),
  // When email was received
  isRead: boolean("is_read").notNull().default(false),
  // Track if admin has read it
  priority: text("priority").default("normal"),
  // "high", "normal", "low"
  attachments: jsonb("attachments"),
  // Array of attachment info
  createdAt: timestamp("created_at").defaultNow()
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true
});
var insertMarketingAgentSchema = createInsertSchema(marketingAgents).omit({
  id: true,
  createdAt: true,
  status: true
}).extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().optional(),
  experience: z.string().optional()
});
var insertOtpSessionSchema = createInsertSchema(otpSessions).omit({
  id: true,
  createdAt: true,
  verified: true
});
var agentLoginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
var insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  leadStatus: true,
  budget: true
}).extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal(""))
});
var insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true
});
var insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  passwordHash: true
}).extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters")
});
var insertSiteVisitEnquirySchema = createInsertSchema(siteVisitEnquiries).omit({
  id: true,
  createdAt: true
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  projectId: z.number().optional(),
  projectName: z.string().optional(),
  marketingAgentName: z.string().optional(),
  message: z.string().optional(),
  purpose: z.string().optional()
});
var insertConstructionServiceEnquirySchema = createInsertSchema(constructionServiceEnquiries).omit({
  id: true,
  createdAt: true
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  serviceType: z.string().min(1, "Service type is required")
});
var insertGeneralEnquirySchema = createInsertSchema(generalEnquiries).omit({
  id: true,
  createdAt: true
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  purpose: z.string().optional()
});
var insertEmailSchema = createInsertSchema(emails).omit({
  id: true,
  createdAt: true,
  isRead: true
}).extend({
  messageId: z.string().min(1, "Message ID is required"),
  from: z.string().email("Valid sender email is required"),
  to: z.string().email("Valid recipient email is required"),
  subject: z.string().min(1, "Subject is required"),
  receivedAt: z.date()
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, or, sql, and } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/sms-service.ts
var SMSService = class {
  apiKey;
  constructor() {
    this.apiKey = process.env.FAST2SMS_API_KEY || "";
    if (this.apiKey) {
      console.log("Fast2SMS service initialized successfully");
    } else {
      console.log("Fast2SMS API key not found. Using development mode.");
    }
  }
  async sendOTP(phoneNumber, otp) {
    try {
      const cleanPhone = phoneNumber.replace(/^\+91\s*/, "").replace(/\s+/g, "");
      if (this.apiKey) {
        const message = `Your Terrawise agent login OTP is: ${otp}. This code expires in 10 minutes. Do not share this code.`;
        const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            "Authorization": this.apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            route: "otp",
            message,
            language: "english",
            flash: 0,
            numbers: cleanPhone
          })
        });
        const result = await response.json();
        if (result.return && result.return === true) {
          console.log(`SMS sent successfully to ${phoneNumber}. Request ID: ${result.request_id}`);
          return true;
        } else {
          throw new Error(`Fast2SMS API error: ${result.message || "Unknown error"}`);
        }
      } else {
        console.log(`\u{1F4F1} SMS TO ${phoneNumber}: Your Terrawise agent login OTP is: ${otp}. This code expires in 10 minutes.`);
        console.log(`\u{1F514} DEVELOPMENT MODE: Use OTP code ${otp} to login`);
        return true;
      }
    } catch (error) {
      console.error("Failed to send SMS:", error);
      console.log(`\u{1F4F1} BACKUP - OTP for ${phoneNumber}: ${otp}`);
      return false;
    }
  }
};
var smsService = new SMSService();

// server/storage.ts
var scryptAsync = promisify(scrypt);
var DatabaseStorage = class {
  async getProjects() {
    return await db.select().from(projects);
  }
  async getProjectById(id) {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || void 0;
  }
  async createProject(insertProject) {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }
  async createMarketingAgent(agent) {
    const hashedPassword = await this.hashPassword(agent.password);
    const [marketingAgent] = await db.insert(marketingAgents).values({
      ...agent,
      password: hashedPassword
    }).returning();
    return marketingAgent;
  }
  async authenticateAgent(phone, password) {
    const [agent] = await db.select().from(marketingAgents).where(eq(marketingAgents.phone, phone));
    if (!agent) {
      return null;
    }
    const isValid = await this.comparePasswords(password, agent.password);
    return isValid ? agent : null;
  }
  async getMarketingAgents() {
    return await db.select().from(marketingAgents);
  }
  async getMarketingAgentById(id) {
    const [agent] = await db.select().from(marketingAgents).where(eq(marketingAgents.id, id));
    return agent || void 0;
  }
  async getMarketingAgentByPhone(phone) {
    const [agent] = await db.select().from(marketingAgents).where(eq(marketingAgents.phone, phone));
    return agent || void 0;
  }
  async updateMarketingAgentStatus(id, status) {
    const [agent] = await db.update(marketingAgents).set({ status }).where(eq(marketingAgents.id, id)).returning();
    return agent;
  }
  async createInquiry(insertInquiry) {
    const [inquiry] = await db.insert(inquiries).values({
      ...insertInquiry,
      marketingAgentId: insertInquiry.marketingAgentId || null,
      marketingAgentName: insertInquiry.marketingAgentName || null
    }).returning();
    return inquiry;
  }
  async getInquiries() {
    return await db.select().from(inquiries);
  }
  async getInquiriesByMarketingAgent(agentId) {
    const agent = await this.getMarketingAgentById(agentId);
    const agentName = agent?.fullName;
    return await db.select({
      id: inquiries.id,
      fullName: inquiries.fullName,
      phone: inquiries.phone,
      email: inquiries.email,
      projectId: inquiries.projectId,
      budget: inquiries.budget,
      message: inquiries.message,
      privacyAccepted: inquiries.privacyAccepted,
      createdAt: inquiries.createdAt,
      marketingAgentId: inquiries.marketingAgentId,
      marketingAgentName: inquiries.marketingAgentName,
      leadStatus: inquiries.leadStatus,
      agentComment: inquiries.agentComment,
      agentCommentDate: inquiries.agentCommentDate,
      projectName: projects.name,
      projectLocation: projects.location
    }).from(inquiries).leftJoin(projects, eq(inquiries.projectId, projects.id)).where(
      agentName ? or(
        eq(inquiries.marketingAgentId, agentId),
        eq(inquiries.marketingAgentName, agentName)
      ) : eq(inquiries.marketingAgentId, agentId)
    );
  }
  async updateInquiryStatus(id, status) {
    const [inquiry] = await db.update(inquiries).set({ leadStatus: status }).where(eq(inquiries.id, id)).returning();
    return inquiry;
  }
  async addAgentComment(inquiryId, comment) {
    const [inquiry] = await db.update(inquiries).set({
      agentComment: comment,
      agentCommentDate: /* @__PURE__ */ new Date()
    }).where(eq(inquiries.id, inquiryId)).returning();
    return inquiry;
  }
  async getTestimonials() {
    return await db.select().from(testimonials);
  }
  async createTestimonial(insertTestimonial) {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }
  // Admin User Management
  async hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const buf = await scryptAsync(password, salt, 64);
    return `${buf.toString("hex")}.${salt}`;
  }
  async comparePasswords(supplied, stored) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync(supplied, salt, 64);
    return timingSafeEqual(hashedBuf, suppliedBuf);
  }
  async createAdminUser(userData) {
    const passwordHash = await this.hashPassword(userData.password);
    const [user] = await db.insert(adminUsers).values({
      email: userData.email,
      fullName: userData.fullName,
      passwordHash
    }).returning();
    return user;
  }
  async getAdminUserByEmail(email) {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return user;
  }
  async authenticateAdmin(email, password) {
    const user = await this.getAdminUserByEmail(email);
    if (!user) return null;
    const isValid = await this.comparePasswords(password, user.passwordHash);
    return isValid ? user : null;
  }
  // OTP Authentication Methods
  async createOtpSession(phone) {
    const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
    await db.delete(otpSessions).where(eq(otpSessions.phone, phone));
    const [otpSession] = await db.insert(otpSessions).values({
      phone,
      otp,
      expiresAt
    }).returning();
    await smsService.sendOTP(phone, otp);
    return otpSession;
  }
  async verifyOtpSession(phone, otp) {
    const [otpSession] = await db.select().from(otpSessions).where(
      and(
        eq(otpSessions.phone, phone),
        eq(otpSessions.otp, otp),
        eq(otpSessions.verified, false),
        sql`${otpSessions.expiresAt} > NOW()`
      )
    );
    if (!otpSession) {
      return null;
    }
    await db.update(otpSessions).set({ verified: true }).where(eq(otpSessions.id, otpSession.id));
    const agent = await this.getMarketingAgentByPhone(phone);
    return agent || null;
  }
  async cleanupExpiredOtpSessions() {
    await db.delete(otpSessions).where(sql`${otpSessions.expiresAt} <= NOW()`);
  }
  // New Enquiry Types Implementation
  async createSiteVisitEnquiry(enquiry) {
    const [siteVisitEnquiry] = await db.insert(siteVisitEnquiries).values({
      ...enquiry,
      email: enquiry.email || null,
      projectId: enquiry.projectId || null,
      projectName: enquiry.projectName || null,
      marketingAgentName: enquiry.marketingAgentName || null,
      message: enquiry.message || null,
      purpose: enquiry.purpose || null
    }).returning();
    return siteVisitEnquiry;
  }
  async getSiteVisitEnquiries() {
    return await db.select().from(siteVisitEnquiries).orderBy(sql`created_at DESC`);
  }
  async createConstructionServiceEnquiry(enquiry) {
    const [constructionEnquiry] = await db.insert(constructionServiceEnquiries).values({
      ...enquiry,
      email: enquiry.email || null,
      budget: enquiry.budget || null,
      projectDetails: enquiry.projectDetails || null,
      timeline: enquiry.timeline || null
    }).returning();
    return constructionEnquiry;
  }
  async getConstructionServiceEnquiries() {
    return await db.select().from(constructionServiceEnquiries).orderBy(sql`created_at DESC`);
  }
  async createGeneralEnquiry(enquiry) {
    const [generalEnquiry] = await db.insert(generalEnquiries).values({
      ...enquiry,
      purpose: enquiry.purpose || null
    }).returning();
    return generalEnquiry;
  }
  async getGeneralEnquiries() {
    return await db.select().from(generalEnquiries).orderBy(sql`created_at DESC`);
  }
  // Email methods
  async createEmail(emailData) {
    const [email] = await db.insert(emails).values({
      ...emailData,
      fromName: emailData.fromName || null,
      textContent: emailData.textContent || null,
      htmlContent: emailData.htmlContent || null,
      attachments: emailData.attachments || null
    }).returning();
    return email;
  }
  async getEmails() {
    return await db.select().from(emails).orderBy(sql`received_at DESC`);
  }
  async getUnreadEmails() {
    return await db.select().from(emails).where(eq(emails.isRead, false)).orderBy(sql`received_at DESC`);
  }
  async markEmailAsRead(id) {
    const [email] = await db.update(emails).set({ isRead: true }).where(eq(emails.id, id)).returning();
    return email;
  }
  async getEmailById(id) {
    const [email] = await db.select().from(emails).where(eq(emails.id, id));
    return email || void 0;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/projects", async (req, res) => {
    try {
      const projects2 = await storage.getProjects();
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
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
  app2.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json({
        message: "Inquiry submitted successfully. Our team will contact you within 2 hours.",
        inquiry
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to submit inquiry" });
    }
  });
  app2.post("/api/enquiries/popup", async (req, res) => {
    try {
      const validatedData = insertSiteVisitEnquirySchema.parse(req.body);
      const inquiry = await storage.createSiteVisitEnquiry(validatedData);
      res.status(201).json({
        message: "Enquiry submitted successfully. Our team will contact you soon.",
        inquiry
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });
  app2.post("/api/site-visit-enquiries", async (req, res) => {
    try {
      const validatedData = insertSiteVisitEnquirySchema.parse(req.body);
      const enquiry = await storage.createSiteVisitEnquiry(validatedData);
      res.status(201).json({
        message: "Site visit enquiry submitted successfully. We'll contact you to schedule your visit.",
        enquiry
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create site visit enquiry" });
    }
  });
  app2.get("/api/site-visit-enquiries", async (req, res) => {
    try {
      const enquiries = await storage.getSiteVisitEnquiries();
      res.json(enquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site visit enquiries" });
    }
  });
  app2.post("/api/construction-service-enquiries", async (req, res) => {
    try {
      const validatedData = insertConstructionServiceEnquirySchema.parse(req.body);
      const enquiry = await storage.createConstructionServiceEnquiry(validatedData);
      res.status(201).json({
        message: "Construction service enquiry submitted successfully. Our construction team will contact you soon.",
        enquiry
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create construction service enquiry" });
    }
  });
  app2.get("/api/construction-service-enquiries", async (req, res) => {
    try {
      const enquiries = await storage.getConstructionServiceEnquiries();
      res.json(enquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch construction service enquiries" });
    }
  });
  app2.get("/api/general-enquiries", async (req, res) => {
    try {
      const enquiries = await storage.getGeneralEnquiries();
      res.json(enquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch general enquiries" });
    }
  });
  app2.post("/api/consultations", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const consultation = await storage.createInquiry(validatedData);
      res.status(201).json(consultation);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to schedule consultation" });
    }
  });
  app2.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials2 = await storage.getTestimonials();
      res.json(testimonials2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });
  app2.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries2 = await storage.getInquiries();
      res.json(inquiries2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });
  app2.post("/api/marketing-agents", async (req, res) => {
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
      if (error instanceof z2.ZodError) {
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
  app2.post("/api/marketing-agents/login", async (req, res) => {
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
  app2.get("/api/marketing-agents", async (req, res) => {
    try {
      const agents = await storage.getMarketingAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch marketing agents" });
    }
  });
  app2.post("/api/marketing-agents/send-otp", async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
      }
      const agent = await storage.getMarketingAgentByPhone(phone);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found with this phone number" });
      }
      if (agent.status !== "approved") {
        return res.status(403).json({ message: "Agent account is not approved yet" });
      }
      const otpSession = await storage.createOtpSession(phone);
      res.json({
        message: "OTP sent successfully",
        phone,
        expiresAt: otpSession.expiresAt
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/marketing-agents/verify-otp", async (req, res) => {
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
  app2.get("/api/marketing-agents/:id/inquiries", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid agent ID" });
      }
      const inquiries2 = await storage.getInquiriesByMarketingAgent(id);
      res.json(inquiries2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent inquiries" });
    }
  });
  app2.patch("/api/inquiries/:id/status", async (req, res) => {
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
  app2.patch("/api/inquiries/:id/comment", async (req, res) => {
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
  app2.patch("/api/marketing-agents/:id/status", async (req, res) => {
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
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      const admin = await storage.authenticateAdmin(email, password);
      if (!admin) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      req.session.adminId = admin.id;
      req.session.adminEmail = admin.email;
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
  app2.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  app2.get("/api/admin/me", (req, res) => {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json({
      id: req.session.adminId,
      email: req.session.adminEmail
    });
  });
  app2.get("/api/emails", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const emails2 = await storage.getEmails();
      res.json(emails2);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ message: "Failed to fetch emails" });
    }
  });
  app2.get("/api/emails/unread", async (req, res) => {
    try {
      if (!req.session.adminId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const emails2 = await storage.getUnreadEmails();
      res.json(emails2);
    } catch (error) {
      console.error("Error fetching unread emails:", error);
      res.status(500).json({ message: "Failed to fetch unread emails" });
    }
  });
  app2.patch("/api/emails/:id/read", async (req, res) => {
    try {
      if (!req.session.adminId) {
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
  app2.get("/api/emails/:id", async (req, res) => {
    try {
      if (!req.session.adminId) {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/email-service.ts
import Imap from "imap";
import { simpleParser } from "mailparser";
var EmailService = class {
  imap;
  config = null;
  isConnected = false;
  checkInterval = null;
  constructor() {
    this.loadConfig();
  }
  loadConfig() {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT;
    const user = process.env.EMAIL_USER;
    const password = process.env.EMAIL_PASSWORD;
    if (host && port && user && password) {
      this.config = {
        host,
        port: parseInt(port),
        user,
        password,
        tls: true
      };
      console.log("Email service configured for:", user);
    } else {
      console.log("Email service not configured. Missing environment variables:");
      if (!host) console.log("- EMAIL_HOST");
      if (!port) console.log("- EMAIL_PORT");
      if (!user) console.log("- EMAIL_USER");
      if (!password) console.log("- EMAIL_PASSWORD");
    }
  }
  async connect() {
    if (!this.config) {
      console.log("Email service not configured");
      return false;
    }
    return new Promise((resolve) => {
      this.imap = new Imap({
        host: this.config.host,
        port: this.config.port,
        tls: this.config.tls,
        user: this.config.user,
        password: this.config.password
      });
      this.imap.once("ready", () => {
        console.log("Email service connected successfully");
        this.isConnected = true;
        resolve(true);
      });
      this.imap.once("error", (err) => {
        console.error("Email service connection error:", err.message);
        this.isConnected = false;
        resolve(false);
      });
      this.imap.once("end", () => {
        console.log("Email service connection ended");
        this.isConnected = false;
      });
      this.imap.connect();
    });
  }
  async disconnect() {
    if (this.imap && this.isConnected) {
      this.imap.end();
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
  async checkForNewEmails() {
    if (!this.isConnected || !this.imap) {
      console.log("Email service not connected");
      return;
    }
    return new Promise((resolve, reject) => {
      this.imap.openBox("INBOX", false, (err, box) => {
        if (err) {
          console.error("Error opening inbox:", err.message);
          reject(err);
          return;
        }
        const searchCriteria = ["UNSEEN", ["SINCE", new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3)]];
        this.imap.search(searchCriteria, (err2, results) => {
          if (err2) {
            console.error("Error searching emails:", err2.message);
            reject(err2);
            return;
          }
          if (results.length === 0) {
            console.log("No new emails found");
            resolve();
            return;
          }
          console.log(`Found ${results.length} new emails`);
          const fetch2 = this.imap.fetch(results, { bodies: "" });
          fetch2.on("message", (msg) => {
            msg.on("body", (stream) => {
              simpleParser(stream, async (err3, parsed) => {
                if (err3) {
                  console.error("Error parsing email:", err3.message);
                  return;
                }
                try {
                  await this.saveEmail(parsed);
                } catch (saveErr) {
                  console.error("Error saving email:", saveErr);
                }
              });
            });
          });
          fetch2.once("error", (err3) => {
            console.error("Fetch error:", err3.message);
            reject(err3);
          });
          fetch2.once("end", () => {
            console.log("Finished processing emails");
            resolve();
          });
        });
      });
    });
  }
  async saveEmail(parsed) {
    try {
      const emailData = {
        messageId: parsed.messageId || `${Date.now()}-${Math.random()}`,
        from: parsed.from?.value?.[0]?.address || parsed.from?.text || "unknown",
        fromName: parsed.from?.value?.[0]?.name || null,
        to: this.config?.user || "unknown",
        subject: parsed.subject || "No Subject",
        textContent: parsed.text || null,
        htmlContent: parsed.html || null,
        receivedAt: parsed.date || /* @__PURE__ */ new Date(),
        priority: this.determinePriority(parsed.subject || ""),
        attachments: parsed.attachments ? parsed.attachments.map((att) => ({
          filename: att.filename,
          contentType: att.contentType,
          size: att.size
        })) : null
      };
      await storage.createEmail(emailData);
      console.log(`Saved email: ${emailData.subject}`);
    } catch (error) {
      console.error("Error saving email to database:", error);
    }
  }
  determinePriority(subject) {
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes("urgent") || lowerSubject.includes("asap") || lowerSubject.includes("emergency")) {
      return "high";
    }
    if (lowerSubject.includes("inquiry") || lowerSubject.includes("booking") || lowerSubject.includes("visit")) {
      return "normal";
    }
    return "normal";
  }
  async startMonitoring() {
    if (!this.config) {
      console.log("Email monitoring not started - no configuration");
      return;
    }
    const connected = await this.connect();
    if (!connected) {
      console.log("Email monitoring not started - connection failed");
      return;
    }
    this.checkInterval = setInterval(async () => {
      try {
        await this.checkForNewEmails();
      } catch (error) {
        console.error("Error during email check:", error);
      }
    }, 5 * 60 * 1e3);
    try {
      await this.checkForNewEmails();
    } catch (error) {
      console.error("Error during initial email check:", error);
    }
    console.log("Email monitoring started - checking every 5 minutes");
  }
  async stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    await this.disconnect();
    console.log("Email monitoring stopped");
  }
  getStatus() {
    return {
      configured: !!this.config,
      connected: this.isConnected,
      monitoring: !!this.checkInterval
    };
  }
};
var emailService = new EmailService();

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || "terrawise-admin-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
    emailService.startMonitoring().catch((err) => {
      console.error("Failed to start email monitoring:", err);
    });
  });
})();
