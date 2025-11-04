import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry, type Project } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MapPin, 
  Calendar, 
  Phone, 
  MessageSquare, 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Building2, 
  Car, 
  Shield, 
  Wifi, 
  Zap,
  Eye,
  Download,
  Share2,
  Heart,
  Info,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SiteVisitPopup } from "@/components/site-visit-popup";

export default function ProjectDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showSiteVisitPopup, setShowSiteVisitPopup] = useState(false);
  
  // EMI Calculator states
  const [emiData, setEmiData] = useState({
    plotPrice: "",
    downPayment: "20",
    interestRate: "8.5",
    loanTenure: "15"
  });
  const [calculatedEMI, setCalculatedEMI] = useState<number | null>(null);

  // EMI Calculation Function
  const calculateEMI = () => {
    const plotPrice = parseFloat(emiData.plotPrice.replace(/[₹,]/g, ''));
    const downPaymentPercent = parseFloat(emiData.downPayment);
    const interestRate = parseFloat(emiData.interestRate);
    const loanTenureYears = parseFloat(emiData.loanTenure);

    if (!plotPrice || !downPaymentPercent || !interestRate || !loanTenureYears) {
      toast({
        title: "Invalid Input",
        description: "Please fill all fields with valid numbers",
        variant: "destructive",
      });
      return;
    }

    // Calculate loan amount after down payment
    const downPaymentAmount = (plotPrice * downPaymentPercent) / 100;
    const loanAmount = plotPrice - downPaymentAmount;

    // EMI calculation using standard formula
    const monthlyInterestRate = interestRate / (12 * 100);
    const numberOfMonths = loanTenureYears * 12;

    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);

    setCalculatedEMI(Math.round(emi));
  };

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) throw new Error("Project not found");
      return response.json();
    },
  });

  const form = useForm<InsertInquiry>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      projectId: parseInt(id || "0"),
      message: "",
      privacyAccepted: false,
    },
  });

  const submitInquiry = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      // Convert to site visit enquiry format
      const siteVisitData = {
        name: data.fullName,
        phone: data.phone,
        purpose: `Site visit for project ID: ${data.projectId}`
      };
      const response = await fetch("/api/site-visit-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteVisitData),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to submit");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted Successfully!",
        description: "Our team will contact you within 2 hours to schedule your site visit.",
      });
      form.reset();
      setShowInquiryForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Submit Inquiry",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Use ALL the actual project images provided by user
  const projectImages = project?.name === "Naturaleza" ? [
    "/images/naturaleza-2.jpg", // Gate with Naturaleza sign
    "/images/naturaleza-gate.jpg", // Road with trees
    "/images/naturaleza-3.jpg", // Wide road view
    "/images/naturaleza-4.jpg", // Another road view
    "/images/naturaleza-5.jpg", // Final road view
  ] : project?.name === "Mirana" ? [
    "/images/mirana-1.jpg", // Main Mirana image
    "/images/mirana-2.jpg", // Second Mirana image  
    "/images/mirana-3.jpg", // Third Mirana image
  ] : [
    project?.imageUrl || "",
  ].filter(Boolean);

  const onSubmitInquiry = (data: InsertInquiry) => {
    submitInquiry.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      "upcoming": { label: "Upcoming", variant: "outline" as const, color: "bg-blue-500" },
      "ongoing": { label: "Ongoing", variant: "secondary" as const, color: "bg-yellow-500" },
      "completed": { label: "Completed", variant: "default" as const, color: "bg-green-500" },
    };
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "outline" as const, color: "bg-gray-500" };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg">Loading project details...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(project.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant={statusBadge.variant} className={`mb-2 ${project.status === 'upcoming' ? 'bg-orange-500 text-white' : ''}`}>
                  {statusBadge.label}
                </Badge>
                {project.status !== "upcoming" && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{project.price}</div>
                    <div className="text-sm text-muted-foreground">Starting Price</div>
                  </div>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="mr-2 h-5 w-5" />
                <span className="text-lg">{project.location}</span>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>
            </div>

            {/* Upcoming Projects Simple Layout */}
            {project.status === "upcoming" ? (
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={project.name === "TerraBloom" ? "/images/terrabloom-hero.jpg" : 
                           project.name === "TerraGrid" ? "/images/terragrid-hero.jpg" : 
                           projectImages[0]}
                      alt={`${project.name} - Coming Soon`}
                      className="w-full h-96 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-orange-500 text-white font-medium px-3 py-1">
                        Upcoming
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{project.name}</h2>
                    <div className="flex items-start text-muted-foreground mb-4">
                      <MapPin className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span className="text-base">{project.location}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{project.description}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Image Gallery */}
                <Card>
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={projectImages[activeImageIndex]} 
                        alt={`${project.name} - Image ${activeImageIndex + 1}`}
                        className="w-full h-96 object-cover rounded-t-lg"
                      />
                      <div className="absolute bottom-4 left-4 flex space-x-2">
                        {projectImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button variant="secondary" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View All ({projectImages.length})
                    </Button>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-4 gap-4">
                  {projectImages.slice(1, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${project.name} thumbnail`}
                      className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setActiveImageIndex(index + 1)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Details Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Plot Specifications</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <div className="text-2xl font-bold text-primary">{project.plotsAvailable}</div>
                              <div className="text-sm text-muted-foreground">Plots Available</div>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <div className="text-2xl font-bold text-primary">{project.plotSize}</div>
                              <div className="text-sm text-muted-foreground">Plot Sizes</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                          <div className="space-y-2">
                            {(project.features as string[]).map((feature, index) => (
                              <div key={index} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Investment Benefits</h4>
                        <div className="space-y-3">
                          <div className="p-4 bg-primary/5 rounded-lg">
                            <div className="font-medium text-primary">High Appreciation Potential</div>
                            <div className="text-sm text-muted-foreground">Located in rapidly developing area with excellent connectivity</div>
                          </div>
                          <div className="p-4 bg-secondary/5 rounded-lg">
                            <div className="font-medium text-secondary">Ready Infrastructure</div>
                            <div className="text-sm text-muted-foreground">Complete road, water, electricity, and drainage connections</div>
                          </div>
                          <div className="p-4 bg-accent/5 rounded-lg">
                            <div className="font-medium text-accent">Strategic Location</div>
                            <div className="text-sm text-muted-foreground">Close proximity to IT hubs, schools, and healthcare facilities</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>World-Class Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(project.amenities as string[]).map((amenity, index) => (
                        <div key={index} className="flex items-center p-4 bg-muted rounded-lg">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            <CheckCircle className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium text-gray-900">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Location Advantages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="h-64 bg-muted rounded-lg overflow-hidden">
                        <iframe
                          src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodeURIComponent("TRAYEE-Naturaleza " + project.location)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`${project.name} Location Map`}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {project?.name === "Naturaleza" ? (
                          <>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Key Infrastructure</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Located in SEZ (Special Economic Zone)</span>
                                  <span className="text-muted-foreground">✓</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Devangondhi Railway Station</span>
                                  <span className="text-muted-foreground">10 mins</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>HopeFarm Junction (Metro station)</span>
                                  <span className="text-muted-foreground">30 mins</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Kolar District Court</span>
                                  <span className="text-muted-foreground">5 mins</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Bangalore Satellite Town Ring Road</span>
                                  <span className="text-muted-foreground">10 mins</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Chennai Express Highway</span>
                                  <span className="text-muted-foreground">6 mins</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Educational & Commercial</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>MVJ College of Engineering</span>
                                  <span className="text-muted-foreground">25 mins</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Delhi Public School</span>
                                  <span className="text-muted-foreground">22 mins</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Bangalore International Academy</span>
                                  <span className="text-muted-foreground">20 mins</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Indo Sunrise International School</span>
                                  <span className="text-muted-foreground">15 mins</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>ITPL (IT Park)</span>
                                  <span className="text-muted-foreground">35 mins</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Forum Mall</span>
                                  <span className="text-muted-foreground">35 mins</span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : project?.name === "Mirana" ? (
                          <>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Infrastructure & Connectivity</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>STRR (Satellite Town Ring Road)</span>
                                  <span className="text-muted-foreground">900m</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Malur Industrial Area</span>
                                  <span className="text-muted-foreground">Nearby</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>800 Acres of Reserved Forest</span>
                                  <span className="text-muted-foreground">Adjacent</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Excellent Connectivity to STRR</span>
                                  <span className="text-muted-foreground">✓</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Sarjapur Connection</span>
                                  <span className="text-muted-foreground">Via STRR</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Hoskote Connection</span>
                                  <span className="text-muted-foreground">Via STRR</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">IT Hubs & Facilities</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Hopefarm</span>
                                  <span className="text-muted-foreground">15 km</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>ITPL, Whitefield</span>
                                  <span className="text-muted-foreground">16 km</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Leading Banks (Loan Facility)</span>
                                  <span className="text-muted-foreground">Available</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Clear Titles with E-Khata</span>
                                  <span className="text-muted-foreground">✓</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Ready-to-Build Plots</span>
                                  <span className="text-muted-foreground">✓</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>MPA Approved Layout</span>
                                  <span className="text-muted-foreground">✓</span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Location Information</h4>
                            <p className="text-muted-foreground">Location details will be updated soon.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>


            </Tabs>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Get More Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => setShowSiteVisitPopup(true)}
                  data-testid="button-schedule-site-visit"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Site Visit
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now: +91 98765 43210
                </Button>
                <Button variant="outline" className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp Inquiry
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    if (project?.name === "Naturaleza") {
                      const link = document.createElement('a');
                      link.href = '/brochures/naturaleza-brochure.pdf';
                      link.download = 'TRAYEE-Naturaleza-Brochure.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } else if (project?.name === "Mirana") {
                      const link = document.createElement('a');
                      link.href = '/brochures/mirana-brochure.pdf';
                      link.download = 'Mirana-Project-Brochure.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } else if (project?.name === "TerraGenesis") {
                      const link = document.createElement('a');
                      link.href = '/images/avasa-blueprint.jpg';
                      link.download = 'Avasa-Site-Layout.jpg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                  disabled={project?.name !== "Naturaleza" && project?.name !== "Mirana" && project?.name !== "TerraGenesis"}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Brochure
                </Button>
              </CardContent>
            </Card>

            {/* Contact Form */}
            {showInquiryForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Book Your Site Visit</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitInquiry)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 98765 43210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address (Optional)</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />



                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any specific requirements..." 
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="privacyAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm">
                                I agree to be contacted by Terrawise
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={submitInquiry.isPending}
                      >
                        {submitInquiry.isPending ? "Submitting..." : "Submit Inquiry"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* EMI Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>EMI Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Plot Price (₹)</label>
                    <Input 
                      placeholder="₹52,00,000" 
                      value={emiData.plotPrice}
                      onChange={(e) => setEmiData({...emiData, plotPrice: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Down Payment (%)</label>
                    <Input 
                      placeholder="20" 
                      value={emiData.downPayment}
                      onChange={(e) => setEmiData({...emiData, downPayment: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Interest Rate (% per annum)</label>
                    <Input 
                      placeholder="8.5" 
                      value={emiData.interestRate}
                      onChange={(e) => setEmiData({...emiData, interestRate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Loan Tenure (Years)</label>
                    <Input 
                      placeholder="15" 
                      value={emiData.loanTenure}
                      onChange={(e) => setEmiData({...emiData, loanTenure: e.target.value})}
                    />
                  </div>
                  <Button variant="outline" className="w-full" onClick={calculateEMI}>
                    Calculate EMI
                  </Button>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {calculatedEMI ? `₹${calculatedEMI.toLocaleString('en-IN')}` : "₹--,---"}
                    </div>
                    <div className="text-sm text-muted-foreground">Estimated Monthly EMI</div>
                  </div>
                  {calculatedEMI && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Loan Amount:</span>
                        <span>₹{(parseFloat(emiData.plotPrice.replace(/[₹,]/g, '')) * (100 - parseFloat(emiData.downPayment)) / 100).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest:</span>
                        <span>₹{((calculatedEMI * parseFloat(emiData.loanTenure) * 12) - (parseFloat(emiData.plotPrice.replace(/[₹,]/g, '')) * (100 - parseFloat(emiData.downPayment)) / 100)).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total Amount:</span>
                        <span>₹{(calculatedEMI * parseFloat(emiData.loanTenure) * 12).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Site Visit Popup */}
      <SiteVisitPopup 
        isOpen={showSiteVisitPopup} 
        onClose={() => setShowSiteVisitPopup(false)}
        projectName={project?.name}
      />
    </div>
  );
}