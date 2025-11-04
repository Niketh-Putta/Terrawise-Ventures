import { 
  projects, 
  inquiries, 
  testimonials, 
  marketingAgents, 
  adminUsers, 
  otpSessions,
  siteVisitEnquiries,
  constructionServiceEnquiries,
  generalEnquiries,
  emails,
  type Project, 
  type InsertProject, 
  type Inquiry, 
  type InsertInquiry, 
  type InquiryWithProject, 
  type Testimonial, 
  type InsertTestimonial, 
  type MarketingAgent, 
  type InsertMarketingAgent, 
  type AdminUser, 
  type InsertAdminUser, 
  type OtpSession, 
  type InsertOtpSession,
  type SiteVisitEnquiry,
  type InsertSiteVisitEnquiry,
  type ConstructionServiceEnquiry,
  type InsertConstructionServiceEnquiry,
  type GeneralEnquiry,
  type InsertGeneralEnquiry,
  type Email,
  type InsertEmail,
} from "@shared/schema";
import { db } from "./db";
import { eq, or, ilike, sql, and } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { smsService } from "./sms-service";

const scryptAsync = promisify(scrypt);

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Marketing Agents
  createMarketingAgent(agent: InsertMarketingAgent): Promise<MarketingAgent>;
  getMarketingAgents(): Promise<MarketingAgent[]>;
  getMarketingAgentById(id: number): Promise<MarketingAgent | undefined>;
  getMarketingAgentByPhone(phone: string): Promise<MarketingAgent | undefined>;
  updateMarketingAgentStatus(id: number, status: string): Promise<MarketingAgent>;
  authenticateAgent(phone: string, password: string): Promise<MarketingAgent | null>;
  
  // OTP Authentication
  createOtpSession(phone: string): Promise<OtpSession>;
  verifyOtpSession(phone: string, otp: string): Promise<MarketingAgent | null>;
  cleanupExpiredOtpSessions(): Promise<void>;
  
  // Inquiries
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  getInquiriesByMarketingAgent(agentId: number): Promise<InquiryWithProject[]>;
  updateInquiryStatus(id: number, status: string): Promise<Inquiry>;
  addAgentComment(inquiryId: number, comment: string): Promise<Inquiry>;
  
  // New Enquiry Types
  createSiteVisitEnquiry(enquiry: InsertSiteVisitEnquiry): Promise<SiteVisitEnquiry>;
  getSiteVisitEnquiries(): Promise<SiteVisitEnquiry[]>;
  createConstructionServiceEnquiry(enquiry: InsertConstructionServiceEnquiry): Promise<ConstructionServiceEnquiry>;
  getConstructionServiceEnquiries(): Promise<ConstructionServiceEnquiry[]>;
  createGeneralEnquiry(enquiry: InsertGeneralEnquiry): Promise<GeneralEnquiry>;
  getGeneralEnquiries(): Promise<GeneralEnquiry[]>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Admin Users
  createAdminUser(userData: InsertAdminUser): Promise<AdminUser>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  authenticateAdmin(email: string, password: string): Promise<AdminUser | null>;
  
  // Emails
  createEmail(email: InsertEmail): Promise<Email>;
  getEmails(): Promise<Email[]>;
  getUnreadEmails(): Promise<Email[]>;
  markEmailAsRead(id: number): Promise<Email>;
  getEmailById(id: number): Promise<Email | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async createMarketingAgent(agent: InsertMarketingAgent): Promise<MarketingAgent> {
    // Hash the password before storing
    const hashedPassword = await this.hashPassword(agent.password);
    const [marketingAgent] = await db
      .insert(marketingAgents)
      .values({
        ...agent,
        password: hashedPassword,
      })
      .returning();
    return marketingAgent;
  }

  async authenticateAgent(phone: string, password: string): Promise<MarketingAgent | null> {
    const [agent] = await db
      .select()
      .from(marketingAgents)
      .where(eq(marketingAgents.phone, phone));
    
    if (!agent) {
      return null;
    }
    
    const isValid = await this.comparePasswords(password, agent.password);
    return isValid ? agent : null;
  }

  async getMarketingAgents(): Promise<MarketingAgent[]> {
    return await db.select().from(marketingAgents);
  }

  async getMarketingAgentById(id: number): Promise<MarketingAgent | undefined> {
    const [agent] = await db.select().from(marketingAgents).where(eq(marketingAgents.id, id));
    return agent || undefined;
  }

  async getMarketingAgentByPhone(phone: string): Promise<MarketingAgent | undefined> {
    const [agent] = await db.select().from(marketingAgents).where(eq(marketingAgents.phone, phone));
    return agent || undefined;
  }

  async updateMarketingAgentStatus(id: number, status: string): Promise<MarketingAgent> {
    const [agent] = await db
      .update(marketingAgents)
      .set({ status })
      .where(eq(marketingAgents.id, id))
      .returning();
    return agent;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db
      .insert(inquiries)
      .values({
        ...insertInquiry,
        marketingAgentId: insertInquiry.marketingAgentId || null,
        marketingAgentName: insertInquiry.marketingAgentName || null,
      })
      .returning();
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries);
  }

  async getInquiriesByMarketingAgent(agentId: number): Promise<InquiryWithProject[]> {
    // First get the agent's name to also search by name
    const agent = await this.getMarketingAgentById(agentId);
    const agentName = agent?.fullName;

    return await db
      .select({
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
      })
      .from(inquiries)
      .leftJoin(projects, eq(inquiries.projectId, projects.id))
      .where(
        agentName 
          ? or(
              eq(inquiries.marketingAgentId, agentId),
              eq(inquiries.marketingAgentName, agentName)
            )
          : eq(inquiries.marketingAgentId, agentId)
      );
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry> {
    const [inquiry] = await db
      .update(inquiries)
      .set({ leadStatus: status })
      .where(eq(inquiries.id, id))
      .returning();
    return inquiry;
  }

  async addAgentComment(inquiryId: number, comment: string): Promise<Inquiry> {
    const [inquiry] = await db
      .update(inquiries)
      .set({ 
        agentComment: comment,
        agentCommentDate: new Date()
      })
      .where(eq(inquiries.id, inquiryId))
      .returning();
    return inquiry;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  // Admin User Management
  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  async comparePasswords(supplied: string, stored: string): Promise<boolean> {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  }

  async createAdminUser(userData: InsertAdminUser): Promise<AdminUser> {
    const passwordHash = await this.hashPassword(userData.password);
    const [user] = await db
      .insert(adminUsers)
      .values({
        email: userData.email,
        fullName: userData.fullName,
        passwordHash,
      })
      .returning();
    return user;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email));
    return user;
  }

  async authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
    const user = await this.getAdminUserByEmail(email);
    if (!user) return null;
    
    const isValid = await this.comparePasswords(password, user.passwordHash);
    return isValid ? user : null;
  }

  // OTP Authentication Methods
  async createOtpSession(phone: string): Promise<OtpSession> {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    // Clean up old OTP sessions for this phone
    await db.delete(otpSessions).where(eq(otpSessions.phone, phone));
    
    const [otpSession] = await db
      .insert(otpSessions)
      .values({
        phone,
        otp,
        expiresAt,
      })
      .returning();
    
    // Send SMS using Twilio service
    await smsService.sendOTP(phone, otp);
    
    return otpSession;
  }

  async verifyOtpSession(phone: string, otp: string): Promise<MarketingAgent | null> {
    // Find valid OTP session
    const [otpSession] = await db
      .select()
      .from(otpSessions)
      .where(
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
    
    // Mark OTP as verified
    await db
      .update(otpSessions)
      .set({ verified: true })
      .where(eq(otpSessions.id, otpSession.id));
    
    // Get the marketing agent
    const agent = await this.getMarketingAgentByPhone(phone);
    return agent || null;
  }

  async cleanupExpiredOtpSessions(): Promise<void> {
    await db.delete(otpSessions).where(sql`${otpSessions.expiresAt} <= NOW()`);
  }

  // New Enquiry Types Implementation
  async createSiteVisitEnquiry(enquiry: InsertSiteVisitEnquiry): Promise<SiteVisitEnquiry> {
    const [siteVisitEnquiry] = await db
      .insert(siteVisitEnquiries)
      .values({
        ...enquiry,
        email: enquiry.email || null,
        projectId: enquiry.projectId || null,
        projectName: enquiry.projectName || null,
        marketingAgentName: enquiry.marketingAgentName || null,
        message: enquiry.message || null,
        purpose: enquiry.purpose || null,
      })
      .returning();
    return siteVisitEnquiry;
  }

  async getSiteVisitEnquiries(): Promise<SiteVisitEnquiry[]> {
    return await db.select().from(siteVisitEnquiries).orderBy(sql`created_at DESC`);
  }

  async createConstructionServiceEnquiry(enquiry: InsertConstructionServiceEnquiry): Promise<ConstructionServiceEnquiry> {
    const [constructionEnquiry] = await db
      .insert(constructionServiceEnquiries)
      .values({
        ...enquiry,
        email: enquiry.email || null,
        budget: enquiry.budget || null,
        projectDetails: enquiry.projectDetails || null, 
        timeline: enquiry.timeline || null,
      })
      .returning();
    return constructionEnquiry;
  }

  async getConstructionServiceEnquiries(): Promise<ConstructionServiceEnquiry[]> {
    return await db.select().from(constructionServiceEnquiries).orderBy(sql`created_at DESC`);
  }

  async createGeneralEnquiry(enquiry: InsertGeneralEnquiry): Promise<GeneralEnquiry> {
    const [generalEnquiry] = await db
      .insert(generalEnquiries)
      .values({
        ...enquiry,
        purpose: enquiry.purpose || null,
      })
      .returning();
    return generalEnquiry;
  }

  async getGeneralEnquiries(): Promise<GeneralEnquiry[]> {
    return await db.select().from(generalEnquiries).orderBy(sql`created_at DESC`);
  }

  // Email methods
  async createEmail(emailData: InsertEmail): Promise<Email> {
    const [email] = await db
      .insert(emails)
      .values({
        ...emailData,
        fromName: emailData.fromName || null,
        textContent: emailData.textContent || null,
        htmlContent: emailData.htmlContent || null,
        attachments: emailData.attachments || null,
      })
      .returning();
    return email;
  }

  async getEmails(): Promise<Email[]> {
    return await db.select().from(emails).orderBy(sql`received_at DESC`);
  }

  async getUnreadEmails(): Promise<Email[]> {
    return await db.select().from(emails).where(eq(emails.isRead, false)).orderBy(sql`received_at DESC`);
  }

  async markEmailAsRead(id: number): Promise<Email> {
    const [email] = await db
      .update(emails)
      .set({ isRead: true })
      .where(eq(emails.id, id))
      .returning();
    return email;
  }

  async getEmailById(id: number): Promise<Email | undefined> {
    const [email] = await db.select().from(emails).where(eq(emails.id, id));
    return email || undefined;
  }
}

export class MemStorage implements IStorage {
  async authenticateAgent(phone: string, password: string): Promise<MarketingAgent | null> {
    const agent = await this.getMarketingAgentByPhone(phone);
    if (!agent) {
      return null;
    }
    
    const isValid = await this.comparePasswords(password, agent.password);
    return isValid ? agent : null;
  }
  private projects: Map<number, Project>;
  private inquiries: Map<number, Inquiry>;
  private testimonials: Map<number, Testimonial>;
  private marketingAgents: Map<number, MarketingAgent>;
  private adminUsers: Map<number, AdminUser>;
  private otpSessions: Map<number, OtpSession>;
  private currentProjectId: number;
  private currentInquiryId: number;
  private currentTestimonialId: number;
  private currentMarketingAgentId: number;
  private currentAdminUserId: number;
  private currentOtpSessionId: number;

  constructor() {
    this.projects = new Map();
    this.inquiries = new Map();
    this.testimonials = new Map();
    this.marketingAgents = new Map();
    this.adminUsers = new Map();
    this.otpSessions = new Map();
    this.currentProjectId = 1;
    this.currentInquiryId = 1;
    this.currentTestimonialId = 1;
    this.currentMarketingAgentId = 1;
    this.currentAdminUserId = 1;
    this.currentOtpSessionId = 1;
    
    // Initialize with sample projects
    this.initializeProjects();
    this.initializeTestimonials();
    this.initializeSampleInquiries();
  }

  private initializeProjects() {
    const sampleProjects: InsertProject[] = [
      {
        name: "Terrawise Gardens",
        location: "Electronic City Phase 2, Bangalore",
        price: "₹52L+",
        status: "ready",
        plotsAvailable: 85,
        plotSize: "30x40 to 40x60 sq ft",
        description: "Premium gated plotted development with complete infrastructure including roads, water supply, electricity, and drainage. Located in Electronic City Phase 2 with excellent connectivity to IT hubs and proposed metro extension.",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["24/7 Security with CCTV", "Underground Drainage", "Metro Connectivity", "Children's Play Area", "Landscaped Gardens", "Club House", "Wide Internal Roads"],
        features: ["DTCP Approved", "RERA Registered", "Clear Title", "Ready Infrastructure", "IT Hub Proximity", "Bank Loan Approved"]
      },
      {
        name: "Emerald Meadows",
        location: "Sarjapur-Attibele Road, Bangalore",
        price: "₹68L+",
        status: "under-development",
        plotsAvailable: 120,
        plotSize: "30x50 to 50x80 sq ft",
        description: "Luxury plotted community spread across 45 acres with modern infrastructure and premium amenities. Strategic location on Sarjapur-Attibele Road with proximity to major IT parks and excellent appreciation potential.",
        imageUrl: "https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Swimming Pool", "Clubhouse & Gym", "Jogging Track", "Sewage Treatment Plant", "Rain Water Harvesting", "Multi-tier Security", "Shopping Complex"],
        features: ["Gated Community", "RERA Approved", "Premium Location", "30+ Amenities", "Corner Plots Available", "Investment Grade"]
      },
      {
        name: "Heritage Hills",
        location: "Devanahalli, Near Bangalore Airport",
        price: "₹75L+",
        status: "upcoming",
        plotsAvailable: 200,
        plotSize: "40x60 to 60x100 sq ft",
        description: "Ultra-premium plotted development near Bangalore International Airport with world-class infrastructure. Spread across 80 acres with comprehensive amenities and excellent connectivity to the airport and emerging business districts.",
        imageUrl: "https://images.unsplash.com/photo-1571087680163-de4ae3a3c0a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Airport Connectivity", "International School", "Medical Center", "Sports Complex", "Adventure Park", "Retail Outlets", "Business Center"],
        features: ["Launch Q2 2024", "Airport Proximity", "International Standards", "Master Planned Community", "High ROI Potential", "Limited Plots"]
      }
    ];

    sampleProjects.forEach(project => {
      this.createProject(project);
    });
  }

  private initializeTestimonials() {
    const sampleTestimonials: InsertTestimonial[] = [
      {
        customerName: "Rajesh Kumar",
        customerLocation: "Electronics City Plot Owner",
        rating: 5,
        testimonial: "Excellent infrastructure development and transparent dealings. The plot was delivered exactly as promised with all amenities. Highly recommended for anyone looking for premium plots in Bangalore."
      },
      {
        customerName: "Priya Sharma",
        customerLocation: "Green Valley Estates",
        rating: 5,
        testimonial: "The team's professionalism and attention to detail impressed us. From site visits to documentation, everything was handled smoothly. We're happy to have invested in our dream plot."
      },
      {
        customerName: "Amit Patel",
        customerLocation: "Sarjapur Road Investor",
        rating: 5,
        testimonial: "Great investment opportunity with excellent returns. The location selection and development quality exceeded our expectations. Terrawise truly delivers on their promise of building futures."
      }
    ];

    sampleTestimonials.forEach(testimonial => {
      this.createTestimonial(testimonial);
    });
  }

  private initializeSampleInquiries() {
    const sampleInquiries: InsertInquiry[] = [
      {
        fullName: "Anita Mehta",
        phone: "+91 98765 43201",
        email: "anita.mehta@email.com",
        projectId: 1,
        budget: "50-75",
        message: "I'm interested in visiting the Terrawise Gardens project this weekend. Could you please arrange a site visit?",
        privacyAccepted: true
      },
      {
        fullName: "Suresh Reddy",
        phone: "+91 98765 43202",
        email: "suresh.reddy@email.com",
        projectId: 2,
        budget: "75-100",
        message: "Looking for a premium plot in Green Valley Estates. Would like to know about financing options and possession timeline.",
        privacyAccepted: true
      },
      {
        fullName: "Kavitha Nair",
        phone: "+91 98765 43203",
        email: "kavitha.nair@email.com",
        projectId: 3,
        budget: "100+",
        message: "Interested in the upcoming Skyline Residency project. Please share the master plan and amenities details.",
        privacyAccepted: true
      },
      {
        fullName: "Vikram Singh",
        phone: "+91 98765 43204",
        email: "vikram.singh@email.com",
        projectId: null,
        budget: "30-50",
        message: "Looking for affordable plots in Bangalore. Please suggest suitable projects within my budget.",
        privacyAccepted: true
      },
      {
        fullName: "Deepika Sharma",
        phone: "+91 98765 43205",
        email: "deepika.sharma@email.com",
        projectId: 1,
        budget: "50-75",
        message: "Planning to invest for my daughter's future. Need detailed information about Terrawise Gardens.",
        privacyAccepted: true
      }
    ];

    sampleInquiries.forEach(inquiry => {
      this.createInquiry(inquiry);
    });
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id, 
      projectId: insertInquiry.projectId || null,
      budget: insertInquiry.budget || null,
      message: insertInquiry.message || null,
      marketingAgentId: insertInquiry.marketingAgentId || null,
      marketingAgentName: insertInquiry.marketingAgentName || null,
      leadStatus: "new",
      privacyAccepted: insertInquiry.privacyAccepted || false,
      createdAt: new Date()
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  // Marketing Agent methods
  async createMarketingAgent(agent: InsertMarketingAgent): Promise<MarketingAgent> {
    const id = this.currentMarketingAgentId++;
    const marketingAgent: MarketingAgent = {
      ...agent,
      id,
      status: "approved", // Auto-approve all new agents
      createdAt: new Date(),
    };
    this.marketingAgents.set(id, marketingAgent);
    return marketingAgent;
  }

  async getMarketingAgents(): Promise<MarketingAgent[]> {
    return Array.from(this.marketingAgents.values());
  }

  async getMarketingAgentById(id: number): Promise<MarketingAgent | undefined> {
    return this.marketingAgents.get(id);
  }

  async getMarketingAgentByPhone(phone: string): Promise<MarketingAgent | undefined> {
    for (const agent of this.marketingAgents.values()) {
      if (agent.phone === phone) {
        return agent;
      }
    }
    return undefined;
  }

  async updateMarketingAgentStatus(id: number, status: string): Promise<MarketingAgent> {
    const agent = this.marketingAgents.get(id);
    if (!agent) {
      throw new Error("Marketing agent not found");
    }
    agent.status = status;
    this.marketingAgents.set(id, agent);
    return agent;
  }

  // OTP Authentication Methods
  async createOtpSession(phone: string): Promise<OtpSession> {
    const id = this.currentOtpSessionId++;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    const otpSession: OtpSession = {
      id,
      phone,
      otp,
      expiresAt,
      verified: false,
      createdAt: new Date(),
    };
    
    // Clean up old sessions for this phone
    for (const [sessionId, session] of this.otpSessions.entries()) {
      if (session.phone === phone) {
        this.otpSessions.delete(sessionId);
      }
    }
    
    this.otpSessions.set(id, otpSession);
    
    // Send SMS using Twilio service
    await smsService.sendOTP(phone, otp);
    
    return otpSession;
  }

  async verifyOtpSession(phone: string, otp: string): Promise<MarketingAgent | null> {
    const now = new Date();
    
    for (const session of this.otpSessions.values()) {
      if (session.phone === phone && session.otp === otp && !session.verified && session.expiresAt > now) {
        session.verified = true;
        this.otpSessions.set(session.id, session);
        
        const agent = await this.getMarketingAgentByPhone(phone);
        return agent || null;
      }
    }
    return null;
  }

  async cleanupExpiredOtpSessions(): Promise<void> {
    const now = new Date();
    for (const [id, session] of this.otpSessions.entries()) {
      if (session.expiresAt <= now) {
        this.otpSessions.delete(id);
      }
    }
  }

  async getInquiriesByMarketingAgent(agentId: number): Promise<InquiryWithProject[]> {
    const inquiries = Array.from(this.inquiries.values())
      .filter(inquiry => inquiry.marketingAgentId === agentId)
      .map(inquiry => {
        const project = this.projects.get(inquiry.projectId || 0);
        return {
          ...inquiry,
          projectName: project?.name,
          projectLocation: project?.location,
        };
      });
    return inquiries;
  }

  async updateInquiryStatus(id: number, status: string): Promise<Inquiry> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) {
      throw new Error("Inquiry not found");
    }
    inquiry.leadStatus = status;
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async addAgentComment(inquiryId: number, comment: string): Promise<Inquiry> {
    const inquiry = this.inquiries.get(inquiryId);
    if (!inquiry) {
      throw new Error("Inquiry not found");
    }
    inquiry.agentComment = comment;
    inquiry.agentCommentDate = new Date();
    this.inquiries.set(inquiryId, inquiry);
    return inquiry;
  }

  // Admin methods
  async hashPassword(password: string): Promise<string> {
    // Simple hash for memory storage - in production use proper hashing
    return password + "_hashed";
  }

  async comparePasswords(supplied: string, stored: string): Promise<boolean> {
    return supplied + "_hashed" === stored;
  }

  async createAdminUser(userData: InsertAdminUser): Promise<AdminUser> {
    const id = this.currentAdminUserId++;
    const passwordHash = await this.hashPassword(userData.password);
    const adminUser: AdminUser = {
      id,
      email: userData.email,
      fullName: userData.fullName,
      passwordHash,
      createdAt: new Date(),
    };
    this.adminUsers.set(id, adminUser);
    return adminUser;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    for (const user of this.adminUsers.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
    const user = await this.getAdminUserByEmail(email);
    if (!user) return null;
    
    const isValid = await this.comparePasswords(password, user.passwordHash);
    return isValid ? user : null;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // New Enquiry Types Implementation for MemStorage
  async createSiteVisitEnquiry(enquiry: InsertSiteVisitEnquiry): Promise<SiteVisitEnquiry> {
    // For MemStorage, we'll use the general enquiry structure
    const id = this.currentInquiryId++;
    const siteVisitEnquiry: SiteVisitEnquiry = {
      ...enquiry,
      id,
      createdAt: new Date(),
    };
    return siteVisitEnquiry;
  }

  async getSiteVisitEnquiries(): Promise<SiteVisitEnquiry[]> {
    return [];
  }

  async createConstructionServiceEnquiry(enquiry: InsertConstructionServiceEnquiry): Promise<ConstructionServiceEnquiry> {
    const id = this.currentInquiryId++;
    const constructionEnquiry: ConstructionServiceEnquiry = {
      ...enquiry,
      id,
      createdAt: new Date(),
    };
    return constructionEnquiry;
  }

  async getConstructionServiceEnquiries(): Promise<ConstructionServiceEnquiry[]> {
    return [];
  }

  async createGeneralEnquiry(enquiry: InsertGeneralEnquiry): Promise<GeneralEnquiry> {
    const id = this.currentInquiryId++;
    const generalEnquiry: GeneralEnquiry = {
      ...enquiry,
      id,
      createdAt: new Date(),
    };
    return generalEnquiry;
  }

  async getGeneralEnquiries(): Promise<GeneralEnquiry[]> {
    return [];
  }

  // Email methods for MemStorage
  async createEmail(emailData: InsertEmail): Promise<Email> {
    // For MemStorage, just return a mock email since we don't store emails in memory
    const id = this.currentInquiryId++;
    const email: Email = {
      ...emailData,
      id,
      fromName: emailData.fromName || null,
      textContent: emailData.textContent || null,
      htmlContent: emailData.htmlContent || null,
      attachments: emailData.attachments || null,
      isRead: false,
      priority: emailData.priority || 'normal',
      createdAt: new Date(),
    };
    return email;
  }

  async getEmails(): Promise<Email[]> {
    return [];
  }

  async getUnreadEmails(): Promise<Email[]> {
    return [];
  }

  async markEmailAsRead(id: number): Promise<Email> {
    throw new Error("Email not found in MemStorage");
  }

  async getEmailById(id: number): Promise<Email | undefined> {
    return undefined;
  }
}

// Using DatabaseStorage for production with PostgreSQL
export const storage = new DatabaseStorage();
