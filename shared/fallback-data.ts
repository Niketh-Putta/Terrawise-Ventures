import type { InsertProject, InsertTestimonial, Project, Testimonial } from "./schema";

/** Canonical project catalog used by both the live client fallback and local MemStorage. */
export const catalogProjects: InsertProject[] = [
  {
    name: "Naturaleza",
    location: "Malur Whitefield Rd, Yeswanthapura, Karnataka 563130",
    price: "₹3,400/sq ft",
    status: "completed",
    plotsAvailable: 92,
    plotSize: "30x40, 30x50, 40x60",
    description:
      "Trayee Constructions brings to you Naturaleza, a 4.5-acre gated community, burrowed in an expanse of lush greenery. The villa plots in the layout are designed to have 45% of open and breathable space. Naturaleza offers you affordable options for investment and/or residence. With an asset in Naturaleza, you can expect a high appreciation value in the next couple of years.",
    imageUrl: "/images/naturaleza-2.jpg",
    amenities: [
      "24/7 Security",
      "Underground Drainage",
      "Wide Roads",
      "Gated Community",
      "Power Backup",
      "Water Supply",
      "Parks",
      "Plantation",
    ],
    features: [
      "4.5-acre Gated Community",
      "45% Open Space",
      "Villa Plots",
      "High Appreciation Value",
      "Investment Ready",
      "Lush Greenery",
      "Affordable Options",
      "Ready to Move",
    ],
  },
  {
    name: "Mirana",
    location: "SKH Echium, Aneeta's Marasandra, Marasandra Plantation, Karnataka 560089",
    price: "₹3,200/sq ft",
    status: "completed",
    plotsAvailable: 0,
    plotSize: "30x40, 30x50",
    description:
      "Premium Villa Plots in a 1-Acre Enclave, Seamlessly Integrated into a Thriving 23-Acre Gated Community with Ready Villas and Vibrant Residency.",
    imageUrl: "/images/mirana-1.jpg",
    amenities: [
      "24/7 Security",
      "Underground Drainage",
      "CC Roads",
      "Parks",
      "CA Space",
      "Plantation",
      "Walking Footpaths",
      "Underground RCC Drains",
    ],
    features: [
      "Sold Out",
      "MPA Approved Layout",
      "24-Acre Gated Community",
      "Developed in 3 Phases",
      "40-Feet Wide Internal Roads",
      "45% Open Space with Landscaping and Parks",
      "Adjacent to 800 Acres of Reserved Forest",
      "Near Malur Industrial Area",
      "Just 900 meters from STRR (Satellite Town Ring Road)",
      "Clear Titles with E-Khata",
      "15 km from Hopefarm",
      "16 km from ITPL, Whitefield",
      "Excellent Connectivity to STRR Sarjapur and Hoskote",
    ],
  },
  {
    name: "Vanam",
    location: "Marasandra, Malur Taluk – Whitefield Growth Corridor, Bengaluru East",
    price: "₹2,799/sq ft",
    status: "ongoing",
    plotsAvailable: 40,
    plotSize: "Villa plots",
    description:
      "More than a plot — a complete lifestyle. Vanam is a 2.5-acre premium plotted development and the initial phase of a 50-acre integrated township. Nestled beside an 800-acre forest with 30 ft CC roads, 45% open spaces, and villa-community amenity access, it offers MPA-approved plots with clear titles and bank loans available along the Whitefield growth corridor near STRR.",
    imageUrl: "/images/vanam-hero.jpg",
    amenities: [
      "30 Ft. CC Roads",
      "45% Open Spaces",
      "Gated Security",
      "Underground Utilities",
      "Street Lighting",
      "Rainwater Harvesting",
      "5,000 Sq. Ft. Clubhouse Access",
      "Swimming Pool & Kids’ Pool",
      "Fully Equipped Gym",
      "Children’s Play Zone",
    ],
    features: [
      "Initial Phase of a 50-Acre Integrated Township",
      "800-Acre Forest Adjacency",
      "MPA Approved",
      "Bank Loans Available",
      "Clear Titles",
      "Whitefield Growth Corridor",
      "Near STRR",
      "Access to Bengaluru–Chennai Expressway",
      "Villa-Community Amenity Access",
      "Premium Brochure Available",
    ],
  },
  {
    name: "TerraBloom",
    location: "Whitefield Extension, Bangalore East",
    price: "Price on Request",
    status: "upcoming",
    plotsAvailable: 150,
    plotSize: "Various sizes available",
    description:
      "Get ready for an extraordinary villa project spanning 15 acres in the prestigious Whitefield Extension! This upcoming development promises to redefine luxury living with spacious villa plots designed for discerning homeowners. Located in one of Bangalore's most sought-after corridors, this project will offer the perfect blend of tranquility and connectivity. Stay tuned as we unveil architectural plans, premium amenities, and exclusive pricing that will make this your dream investment destination.",
    imageUrl: "/images/terrabloom-hero.jpg",
    amenities: ["Upcoming Amenities", "Premium Infrastructure", "Gated Community"],
    features: ["Premium Location", "15 Acres Development", "Villa Plots"],
  },
  {
    name: "Aranya",
    location: "Bangalore East — Forest-side · 1 KM from STRR · 15 KM to Whitefield · 10 KM to Malur",
    price: "Price on Request",
    status: "upcoming",
    plotsAvailable: 60,
    plotSize: "1200 sqft plots · 1800–2200 sqft built-up",
    description:
      "Aranya is a featured 9-acre premium villa community in Bangalore East — a boutique development of 3 and 4 BHK duplex villas designed for modern families seeking space, greenery, and long-term appreciation. Forest-side setting with clubhouse and pool, indoor and outdoor sports, parks and open spaces, underground utilities, and cement roads, plus strong connectivity to STRR, Whitefield, and Malur.",
    imageUrl: "/images/aranya-hero.jpg",
    amenities: [
      "Clubhouse with Pool",
      "Indoor & Outdoor Sports",
      "Parks & Open Spaces",
      "Underground Utilities",
      "Cement Roads",
      "Forest-side Location",
      "Gated Community",
    ],
    features: [
      "9-Acre Premium Villa Community",
      "3 and 4 BHK Duplex Villas",
      "1800 to 2200 SQFT Built-up",
      "1200 sqft Plot Size",
      "1 KM from STRR",
      "15 KM to Whitefield",
      "10 KM to Malur",
      "Zero Land Acquisition Cost",
      "High-demand Micro-market",
      "Strong Rental & Resale Potential",
      "Post-sale Support by PropertyPath LTD",
    ],
  },
];

export const catalogTestimonials: InsertTestimonial[] = [
  {
    customerName: "Rajesh Kumar",
    customerLocation: "Electronics City Plot Owner",
    rating: 5,
    testimonial:
      "Excellent infrastructure development and transparent dealings. The plot was delivered exactly as promised with all amenities. Highly recommended for anyone looking for premium plots in Bangalore.",
  },
  {
    customerName: "Priya Sharma",
    customerLocation: "Green Valley Estates",
    rating: 5,
    testimonial:
      "The team's professionalism and attention to detail impressed us. From site visits to documentation, everything was handled smoothly. We're happy to have invested in our dream plot.",
  },
  {
    customerName: "Amit Patel",
    customerLocation: "Sarjapur Road Investor",
    rating: 5,
    testimonial:
      "Great investment opportunity with excellent returns. The location selection and development quality exceeded our expectations. Terrawise truly delivers on their promise of building futures.",
  },
];

export const fallbackProjects: Project[] = catalogProjects.map((project, index) => ({
  id: index + 1,
  ...project,
}));

export const fallbackTestimonials: Testimonial[] = catalogTestimonials.map((testimonial, index) => ({
  id: index + 1,
  ...testimonial,
}));

export const getFallbackProject = (id: number) =>
  fallbackProjects.find((project) => project.id === id);
