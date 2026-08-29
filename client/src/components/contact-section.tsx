import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry, type Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Phone, MapPin, Mail, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ContactSection() {
  const { toast } = useToast();
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const form = useForm<InsertInquiry>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      projectId: undefined,
      message: "",
      marketingAgentName: "",
      privacyAccepted: false,
    },
  });

  const submitInquiry = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      // Convert to site visit enquiry format
      const siteVisitData = {
        name: data.fullName,
        phone: data.phone,
        purpose: `Site visit for ${data.projectId ? 'project' : 'general inquiry'}`
      };
      const response = await apiRequest("POST", "/api/site-visit-enquiries", siteVisitData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted Successfully!",
        description: "Our team will contact you within 2 hours to schedule your site visit.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Submit Inquiry",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInquiry) => {
    submitInquiry.mutate(data);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Consultation",
      description: "Speak directly with our property experts",
      details: ["+91 98765 43210", "+91 98765 43211"],
      availability: "Available: Mon-Sat, 9 AM - 7 PM",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: MapPin,
      title: "Office Visit",
      description: "Visit our experience center",
      details: ["H.No: 200, 2nd floor, 2nd main Belathur", "Sri Nivas Residency"],
      availability: "",
      bgColor: "bg-secondary/10",
      iconColor: "text-secondary",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed information via email",
      details: ["Terrawiseventures@gmail.com"],
      availability: "",
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Support",
      description: "Quick responses and plot updates",
      details: ["+91 98765 43210"],
      availability: "",
      bgColor: "bg-muted",
      iconColor: "text-muted-foreground",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to secure your plot? Contact our expert team for site visits, investment guidance, and personalized assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Multiple Ways to Connect</h3>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <Card key={index} className={`p-6 ${method.bgColor}`}>
                    <CardContent className="p-0">
                      <div className="flex items-start space-x-4">
                        <div className={`${method.iconColor} w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-md`}>
                          <method.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">{method.title}</h4>
                          <p className="text-muted-foreground mb-2">{method.description}</p>
                          <div className="space-y-1">
                            {method.details.map((detail, idx) => (
                              <div key={idx} className={`font-semibold ${method.iconColor}`}>
                                {detail}
                              </div>
                            ))}
                          </div>
                          {method.availability && (
                            <div className="text-sm text-muted-foreground mt-2">
                              {method.availability}
                            </div>
                          )}
                          {method.title === "WhatsApp Support" && (
                            <Button size="sm" className="mt-2 bg-green-500 hover:bg-green-600">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Start Chat
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-8">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule a Site Visit</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
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
                  </div>

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
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interested Project</FormLabel>
                        <Select onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.id.toString()}>
                                {project.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="0">Other/General Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />



                  <FormField
                    control={form.control}
                    name="marketingAgentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marketing Agent (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter marketing agent name (if referred by one)" 
                            {...field} 
                          />
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
                            rows={4} 
                            placeholder="Tell us about your requirements, preferred location, or any questions you have..." 
                            {...field} 
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
                          <FormLabel className="text-sm text-muted-foreground leading-relaxed">
                            I agree to be contacted by Terrawise for property updates and marketing communications. I understand my data will be processed as per the privacy policy.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-4" 
                    disabled={submitInquiry.isPending}
                  >
                    <Send className="mr-3 h-5 w-5" />
                    {submitInquiry.isPending ? "Submitting..." : "Schedule Site Visit"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Our team will contact you within 2 hours to confirm your site visit appointment.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
