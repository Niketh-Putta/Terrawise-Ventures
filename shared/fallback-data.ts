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
    name: "TerraGenesis",
    location: "SKH Economic Hub, Chikkabanavara, Bangalore North",
    price: "₹2,499/sq ft",
    status: "ongoing",
    plotsAvailable: 44,
    plotSize: "30x40, 40x50, 40x30, 30x30",
    description:
      "Set within 2.5 acres of prime land at the heart of a 30+ acre upcoming private township, this exclusive enclave offers just 44 premium villa plots - designed for privacy, space, and a close-knit community. Crafted for discerning buyers, the project features luxury amenities such as landscaped gardens, wide internal roads, a grand entrance, 24/7 security, and modern utility infrastructure. Whether for your dream home or a smart investment, this development blends tranquility with upscale living.",
    imageUrl: "/images/avasa-blueprint.jpg",
    amenities: ["24/7 Security", "Underground Drainage", "CC Roads"],
    features: ["Gated Community", "45% Open Space"],
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
    name: "TerraGrid",
    location: "Near Malur - Whitefield, STRR Road Corridor",
    price: "Price on Request",
    status: "upcoming",
    plotsAvailable: 100,
    plotSize: "Various configurations",
    description:
      "Experience the future of premium living with our upcoming 10-acre villa plots development near the bustling Malur-Whitefield corridor! Strategically positioned along the high-growth STRR Road, this project is set to become a landmark destination for luxury villa living. With excellent connectivity to major IT hubs and upcoming infrastructure developments, this is your opportunity to be part of Bangalore's next growth story. Watch this space for exciting updates on plot sizes, world-class amenities, and early bird offers!",
    imageUrl: "/images/terragrid-hero.jpg",
    amenities: ["Future Amenities", "Premium Development", "Investment Opportunity"],
    features: ["STRR Road Connectivity", "10 Acres Premium Land", "Strategic Location"],
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
