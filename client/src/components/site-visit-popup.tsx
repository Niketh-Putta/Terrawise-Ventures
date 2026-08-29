import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, type InsertInquiry, type Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Calendar, User, Phone, MessageSquare, Mail, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SiteVisitPopupProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export function SiteVisitPopup({ isOpen, onClose, projectName }: SiteVisitPopupProps) {
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

  const submitSiteVisit = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      // Find the selected project name
      const selectedProject = projects.find(p => p.id === data.projectId);
      const projectName = selectedProject ? selectedProject.name : (data.projectId === 0 ? "General Inquiry" : "Unknown Project");
      
      // Convert to site visit enquiry format
      const siteVisitData = {
        name: data.fullName,
        phone: data.phone,
        email: data.email,
        projectId: data.projectId,
        projectName: projectName,
        marketingAgentName: data.marketingAgentName,
        message: data.message,
        purpose: `Site visit for ${projectName}`
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
        title: "Site Visit Scheduled!",
        description: "Our team will contact you within 2 hours to confirm your visit.",
      });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Schedule Visit",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInquiry) => {
    submitSiteVisit.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule Site Visit
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to schedule your site visit. Our team will contact you within 2 hours.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value={field.value || ""}
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
                        rows={3} 
                        placeholder="Tell us about your requirements, preferred location, or any questions you have..." 
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
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1"
                  data-testid="button-cancel-site-visit"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={submitSiteVisit.isPending}
                  data-testid="button-submit-site-visit"
                >
                  {submitSiteVisit.isPending ? "Scheduling..." : "Schedule Visit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}