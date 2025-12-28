import type { Project, Testimonial } from "@shared/schema";

export const fallbackProjects: Project[] = [
  {
    id: 1,
    name: "Terrawise Gardens",
    location: "Electronic City Phase 2, Bangalore",
    price: "₹52L+",
    status: "ready",
    plotsAvailable: 85,
    plotSize: "30x40 to 40x60 sq ft",
    description: "Premium gated plotted development with complete infrastructure including roads, water supply, electricity, and drainage. Located in Electronic City Phase 2 with excellent connectivity to IT hubs and proposed metro extension.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    amenities: ["24/7 Security with CCTV", "Underground Drainage", "Metro Connectivity", "Children's Play Area", "Landscaped Gardens", "Club House", "Wide Internal Roads"],
    features: ["DTCP Approved", "RERA Registered", "Clear Title", "Ready Infrastructure", "IT Hub Proximity", "Bank Loan Approved"],
  },
  {
    id: 2,
    name: "Emerald Meadows",
    location: "Sarjapur-Attibele Road, Bangalore",
    price: "₹68L+",
    status: "under-development",
    plotsAvailable: 120,
    plotSize: "30x50 to 50x80 sq ft",
    description: "Luxury plotted community spread across 45 acres with modern infrastructure and premium amenities. Strategic location on Sarjapur-Attibele Road with proximity to major IT parks and excellent appreciation potential.",
    imageUrl: "https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    amenities: ["Swimming Pool", "Clubhouse & Gym", "Jogging Track", "Sewage Treatment Plant", "Rain Water Harvesting", "Multi-tier Security", "Shopping Complex"],
    features: ["Gated Community", "RERA Approved", "Premium Location", "30+ Amenities", "Corner Plots Available", "Investment Grade"],
  },
  {
    id: 3,
    name: "Heritage Hills",
    location: "Devanahalli, Near Bangalore Airport",
    price: "₹75L+",
    status: "upcoming",
    plotsAvailable: 200,
    plotSize: "40x60 to 60x100 sq ft",
    description: "Ultra-premium plotted development near Bangalore International Airport with world-class infrastructure. Spread across 80 acres with comprehensive amenities and excellent connectivity to the airport and emerging business districts.",
    imageUrl: "https://images.unsplash.com/photo-1571087680163-de4ae3a3c0a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    amenities: ["Airport Connectivity", "International School", "Medical Center", "Sports Complex", "Adventure Park", "Retail Outlets", "Business Center"],
    features: ["Launch Q2 2024", "Airport Proximity", "International Standards", "Master Planned Community", "High ROI Potential", "Limited Plots"],
  },
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    customerName: "Rajesh Kumar",
    customerLocation: "Electronics City Plot Owner",
    rating: 5,
    testimonial: "Excellent infrastructure development and transparent dealings. The plot was delivered exactly as promised with all amenities. Highly recommended for anyone looking for premium plots in Bangalore.",
  },
  {
    id: 2,
    customerName: "Priya Sharma",
    customerLocation: "Green Valley Estates",
    rating: 5,
    testimonial: "The team's professionalism and attention to detail impressed us. From site visits to documentation, everything was handled smoothly. We're happy to have invested in our dream plot.",
  },
  {
    id: 3,
    customerName: "Amit Patel",
    customerLocation: "Sarjapur Road Investor",
    rating: 5,
    testimonial: "Great investment opportunity with excellent returns. The location selection and development quality exceeded our expectations. Terrawise truly delivers on their promise of building futures.",
  },
];

export const getFallbackProject = (id: number) =>
  fallbackProjects.find((project) => project.id === id);
