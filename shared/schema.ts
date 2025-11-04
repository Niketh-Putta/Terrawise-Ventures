import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  price: text("price").notNull(),
  status: text("status").notNull(), // "ready", "under-development", "upcoming"
  plotsAvailable: integer("plots_available").notNull(),
  plotSize: text("plot_size").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  amenities: jsonb("amenities").notNull(), // array of strings
  features: jsonb("features").notNull(), // array of strings
});

export const marketingAgents = pgTable("marketing_agents", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  password: text("password").notNull(),
  address: text("address"),
  experience: text("experience"),
  status: text("status").notNull().default("approved"), // "pending", "approved", "rejected"
  createdAt: timestamp("created_at").defaultNow(),
});

// OTP sessions table for phone-based authentication
export const otpSessions = pgTable("otp_sessions", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
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
  leadStatus: text("lead_status").notNull().default("new"), // "new", "contacted", "site_visit_scheduled", "site_visit_completed", "negotiating", "deal_closed", "deal_lost"
  agentComment: text("agent_comment"), // Agent's comment/suggestion about lead status
  agentCommentDate: timestamp("agent_comment_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Site visit enquiries (from the popup)
export const siteVisitEnquiries = pgTable("site_visit_enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  projectId: integer("project_id"),
  projectName: text("project_name"), // Store the actual project name
  marketingAgentName: text("marketing_agent_name"),
  message: text("message"),
  purpose: text("purpose"), // Optional field
  createdAt: timestamp("created_at").defaultNow(),
});

// Construction services enquiries
export const constructionServiceEnquiries = pgTable("construction_service_enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  serviceType: text("service_type").notNull(), // "construction", "planning", "design", etc.
  projectDetails: text("project_details"),
  budget: text("budget"),
  timeline: text("timeline"),
  createdAt: timestamp("created_at").defaultNow(),
});

// General enquiries (from enquire now popup)
export const generalEnquiries = pgTable("general_enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  purpose: text("purpose"), // Optional field
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerLocation: text("customer_location").notNull(),
  rating: integer("rating").notNull(),
  testimonial: text("testimonial").notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Emails table for incoming emails
export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  messageId: text("message_id").unique().notNull(), // Unique email message ID to prevent duplicates
  from: text("from").notNull(), // Sender email address
  fromName: text("from_name"), // Sender display name
  to: text("to").notNull(), // Recipient email address
  subject: text("subject").notNull(),
  textContent: text("text_content"), // Plain text content
  htmlContent: text("html_content"), // HTML content
  receivedAt: timestamp("received_at").notNull(), // When email was received
  isRead: boolean("is_read").notNull().default(false), // Track if admin has read it
  priority: text("priority").default("normal"), // "high", "normal", "low"
  attachments: jsonb("attachments"), // Array of attachment info
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema exports
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertMarketingAgentSchema = createInsertSchema(marketingAgents).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().optional(),
  experience: z.string().optional(),
});

export const insertOtpSessionSchema = createInsertSchema(otpSessions).omit({
  id: true,
  createdAt: true,
  verified: true,
});

// Agent login schema
export const agentLoginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  leadStatus: true,
  budget: true,
}).extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  passwordHash: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type MarketingAgent = typeof marketingAgents.$inferSelect;
export type InsertMarketingAgent = z.infer<typeof insertMarketingAgentSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type InquiryWithProject = Inquiry & {
  projectName?: string;
  projectLocation?: string;
};
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type OtpSession = typeof otpSessions.$inferSelect;
export type InsertOtpSession = z.infer<typeof insertOtpSessionSchema>;

// New schemas for enquiry types
export const insertSiteVisitEnquirySchema = createInsertSchema(siteVisitEnquiries).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  projectId: z.number().optional(),
  projectName: z.string().optional(),
  marketingAgentName: z.string().optional(),
  message: z.string().optional(),
  purpose: z.string().optional(),
});

export const insertConstructionServiceEnquirySchema = createInsertSchema(constructionServiceEnquiries).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  serviceType: z.string().min(1, "Service type is required"),
});

export const insertGeneralEnquirySchema = createInsertSchema(generalEnquiries).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  purpose: z.string().optional(),
});

// Types for new tables
export type SiteVisitEnquiry = typeof siteVisitEnquiries.$inferSelect;
export type InsertSiteVisitEnquiry = z.infer<typeof insertSiteVisitEnquirySchema>;
export type ConstructionServiceEnquiry = typeof constructionServiceEnquiries.$inferSelect;
export type InsertConstructionServiceEnquiry = z.infer<typeof insertConstructionServiceEnquirySchema>;
export type GeneralEnquiry = typeof generalEnquiries.$inferSelect;
export type InsertGeneralEnquiry = z.infer<typeof insertGeneralEnquirySchema>;
export type AgentLogin = z.infer<typeof agentLoginSchema>;

// Email types and schema
export const insertEmailSchema = createInsertSchema(emails).omit({
  id: true,
  createdAt: true,
  isRead: true,
}).extend({
  messageId: z.string().min(1, "Message ID is required"),
  from: z.string().email("Valid sender email is required"),
  to: z.string().email("Valid recipient email is required"),
  subject: z.string().min(1, "Subject is required"),
  receivedAt: z.date(),
});

export type Email = typeof emails.$inferSelect;
export type InsertEmail = z.infer<typeof insertEmailSchema>;
