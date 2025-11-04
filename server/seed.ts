import { db } from "./db";
import { projects, testimonials, inquiries, marketingAgents } from "../shared/schema";

async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Check if data already exists
    const existingProjects = await db.select().from(projects).limit(1);
    if (existingProjects.length > 0) {
      console.log("✅ Database already seeded");
      return;
    }

    // Seed projects
    const sampleProjects = [
      {
        name: "Terrawise Gardens",
        location: "Electronic City Phase 2, Bangalore",
        price: "₹52L+",
        status: "ready" as const,
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
        status: "under-development" as const,
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
        status: "upcoming" as const,
        plotsAvailable: 200,
        plotSize: "40x60 to 60x100 sq ft",
        description: "Ultra-premium plotted development near Bangalore International Airport with world-class infrastructure. Spread across 80 acres with comprehensive amenities and excellent connectivity to the airport and emerging business districts.",
        imageUrl: "https://images.unsplash.com/photo-1571087680163-de4ae3a3c0a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        amenities: ["Airport Connectivity", "International School", "Medical Center", "Sports Complex", "Adventure Park", "Retail Outlets", "Business Center"],
        features: ["Launch Q2 2024", "Airport Proximity", "International Standards", "Master Planned Community", "High ROI Potential", "Limited Plots"]
      }
    ];

    await db.insert(projects).values(sampleProjects);
    console.log("✅ Projects seeded");

    // Seed testimonials
    const sampleTestimonials = [
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

    await db.insert(testimonials).values(sampleTestimonials);
    console.log("✅ Testimonials seeded");

    // Seed marketing agents
    const sampleMarketingAgents = [
      {
        fullName: "Ravi Kumar",
        email: "ravi.kumar@email.com",
        phone: "+91 98765 55001",
        experience: "5+ years in real estate marketing",
        specialization: "Residential plots and villa projects",
        status: "active"
      },
      {
        fullName: "Sneha Patel",
        email: "sneha.patel@email.com", 
        phone: "+91 98765 55002",
        experience: "3 years in property consulting",
        specialization: "Investment advisory and premium developments",
        status: "active"
      },
      {
        fullName: "Manoj Reddy",
        email: "manoj.reddy@email.com",
        phone: "+91 98765 55003", 
        experience: "7+ years in Bangalore real estate",
        specialization: "East Bangalore and IT corridor projects",
        status: "pending"
      }
    ];

    await db.insert(marketingAgents).values(sampleMarketingAgents);
    console.log("✅ Marketing agents seeded");

    // Seed sample inquiries
    const sampleInquiries = [
      {
        fullName: "Anita Mehta",
        phone: "+91 98765 43201",
        email: "anita.mehta@email.com",
        projectId: 1,
        budget: "50-75",
        message: "I'm interested in visiting the Terrawise Gardens project this weekend. Could you please arrange a site visit?",
        marketingAgentId: 1,
        marketingAgentName: "Ravi Kumar",
        leadStatus: "contacted",
        privacyAccepted: true
      },
      {
        fullName: "Suresh Reddy",
        phone: "+91 98765 43202",
        email: "suresh.reddy@email.com",
        projectId: 2,
        budget: "75-100",
        message: "Looking for a premium plot in Emerald Meadows. Would like to know about financing options and possession timeline.",
        marketingAgentId: 2,
        marketingAgentName: "Sneha Patel",
        leadStatus: "qualified",
        privacyAccepted: true
      },
      {
        fullName: "Kavitha Nair",
        phone: "+91 98765 43203",
        email: "kavitha.nair@email.com",
        projectId: 3,
        budget: "100+",
        message: "Interested in the upcoming Heritage Hills project. Please share the master plan and amenities details.",
        marketingAgentId: 1,
        marketingAgentName: "Ravi Kumar",
        leadStatus: "new",
        privacyAccepted: true
      },
      {
        fullName: "Vikram Singh",
        phone: "+91 98765 43204",
        email: "vikram.singh@email.com",
        projectId: null,
        budget: "30-50",
        message: "Looking for affordable plots in Bangalore. Please suggest suitable projects within my budget.",
        marketingAgentId: null,
        marketingAgentName: null,
        leadStatus: "new",
        privacyAccepted: true
      },
      {
        fullName: "Deepika Sharma",
        phone: "+91 98765 43205",
        email: "deepika.sharma@email.com",
        projectId: 1,
        budget: "50-75",
        message: "Planning to invest for my daughter's future. Need detailed information about Terrawise Gardens.",
        marketingAgentId: 2,
        marketingAgentName: "Sneha Patel",
        leadStatus: "converted",
        privacyAccepted: true
      }
    ];

    await db.insert(inquiries).values(sampleInquiries);
    console.log("✅ Inquiries seeded");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.main) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedDatabase };