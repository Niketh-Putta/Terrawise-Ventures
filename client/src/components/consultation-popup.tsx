import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";

const consultationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  siteArea: z.string().min(1, "Site area is required"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  constructionGrade: z.enum(["standard", "premium"], {
    required_error: "Please select a construction grade",
  }),
});

type ConsultationForm = z.infer<typeof consultationSchema>;

interface ConsultationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationPopup({ isOpen, onClose }: ConsultationPopupProps) {
  const { toast } = useToast();
  
  const form = useForm<ConsultationForm>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: "",
      phone: "",
      siteArea: "",
      location: "",
      email: "",
      constructionGrade: undefined,
    },
  });

  const consultationMutation = useMutation({
    mutationFn: async (data: ConsultationForm) => {
      const response = await fetch("/api/construction-service-enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || "",
          serviceType: "consultation",
          projectDetails: `Site Area: ${data.siteArea} sq ft, Location: ${data.location}, Grade: ${data.constructionGrade}`,
          budget: data.constructionGrade === "premium" ? "Premium Construction" : "Standard Construction",
          timeline: "To be discussed during consultation"
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to schedule consultation");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Consultation Scheduled",
        description: "Thank you! Our construction team will contact you within 4 hours to discuss your project.",
      });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule consultation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ConsultationForm) => {
    consultationMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Consultation</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
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
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="siteArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area of Site (Square Feet) *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1200, 2400, 3000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location of Site *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Whitefield, Electronic City, Hebbal" {...field} />
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
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="constructionGrade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Construction Grade *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select construction grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={consultationMutation.isPending}
              >
                {consultationMutation.isPending ? "Scheduling..." : "Schedule Consultation"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={consultationMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}