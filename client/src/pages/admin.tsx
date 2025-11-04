import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Phone, Mail, MapPin, MessageSquare, Filter, Download, User, Building2, IndianRupee, ArrowLeft, Home, LogOut, Shield, FileText, Wrench, Users, Inbox, MailOpen, Clock } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Inquiry, Project, SiteVisitEnquiry, ConstructionServiceEnquiry, GeneralEnquiry, Email } from "@shared/schema";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [filterBudget, setFilterBudget] = useState("all");

  // Check admin authentication
  const { data: adminUser, isLoading: authLoading, error: authError } = useQuery<{id: string, email: string}>({
    queryKey: ["/api/admin/me"],
    retry: false
  });

  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries"],
    enabled: !!adminUser, // Only fetch if authenticated
  });

  const { data: siteVisitEnquiries = [], isLoading: siteVisitLoading } = useQuery<SiteVisitEnquiry[]>({
    queryKey: ["/api/site-visit-enquiries"],
    enabled: !!adminUser,
  });

  const { data: constructionEnquiries = [], isLoading: constructionLoading } = useQuery<ConstructionServiceEnquiry[]>({
    queryKey: ["/api/construction-service-enquiries"],
    enabled: !!adminUser,
  });

  const { data: generalEnquiries = [], isLoading: generalLoading } = useQuery<GeneralEnquiry[]>({
    queryKey: ["/api/general-enquiries"],
    enabled: !!adminUser,
  });

  const { data: emails = [], isLoading: emailsLoading } = useQuery<Email[]>({
    queryKey: ["/api/emails"],
    enabled: !!adminUser,
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: !!adminUser, // Only fetch if authenticated
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/admin/logout", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      setLocation("/admin-login");
    },
    onError: () => {
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && (authError || !adminUser)) {
      setLocation("/admin-login");
    }
  }, [adminUser, authLoading, authError, setLocation]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!adminUser) {
    return null;
  }

  // Filter inquiries based on search and filters
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inquiry.email && inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inquiry.phone.includes(searchTerm);

    const matchesProject = filterProject === "all" || 
      (filterProject === "0" && !inquiry.projectId) ||
      inquiry.projectId?.toString() === filterProject;

    const matchesBudget = filterBudget === "all" || inquiry.budget === filterBudget;

    return matchesSearch && matchesProject && matchesBudget;
  });

  const getProjectName = (projectId: number | null) => {
    if (!projectId) return "General Inquiry";
    const project = projects.find(p => p.id === projectId);
    return project?.name || "Unknown Project";
  };

  const getBudgetBadgeColor = (budget: string | null) => {
    if (!budget) return "secondary";
    const budgetValue = budget.split("-")[0];
    const value = parseInt(budgetValue);
    if (value >= 100) return "default";
    if (value >= 75) return "destructive";
    if (value >= 50) return "secondary";
    return "outline";
  };

  const formatDate = (date: Date | string | null): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case "new": return "default";
      case "contacted": return "secondary";
      case "qualified": return "outline";
      case "converted": return "destructive";
      case "lost": return "secondary";
      default: return "default";
    }
  };

  const getLeadStatusLabel = (status: string) => {
    switch (status) {
      case "new": return "New Lead";
      case "contacted": return "Contacted";
      case "qualified": return "Qualified";
      case "converted": return "Converted";
      case "lost": return "Lost";
      default: return "Unknown";
    }
  };

  if (inquiriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg">Loading inquiries...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage customer inquiries and leads</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-600">Welcome,</p>
                <p className="text-sm font-medium text-gray-900">{adminUser.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Building2 className="mr-3 h-8 w-8 text-primary" />
                Terrawise Admin Panel
              </h1>
              <p className="text-muted-foreground mt-1">Manage customer inquiries and leads</p>
            </div>
            <Button className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">General Enquiries</p>
                  <p className="text-3xl font-bold text-gray-900">{generalEnquiries.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Site Visit Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{siteVisitEnquiries.length}</p>
                </div>
                <Users className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Construction Services</p>
                  <p className="text-3xl font-bold text-gray-900">{constructionEnquiries.length}</p>
                </div>
                <Wrench className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900">{inquiries.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Contacts - General Enquiries ({generalEnquiries.length})
            </TabsTrigger>
            <TabsTrigger value="site-visits" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Site Visits ({siteVisitEnquiries.length})
            </TabsTrigger>
            <TabsTrigger value="construction" className="flex items-center">
              <Wrench className="mr-2 h-4 w-4" />
              Construction Services ({constructionEnquiries.length})
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center">
              <Inbox className="mr-2 h-4 w-4" />
              Emails ({emails.filter(e => !e.isRead).length})
            </TabsTrigger>
          </TabsList>

          {/* General Enquiries Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Contacts - General Enquiries</CardTitle>
                <CardDescription>
                  General enquiries and contact requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generalLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : generalEnquiries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No contacts yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generalEnquiries.map((enquiry) => (
                      <div key={enquiry.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{enquiry.name}</h3>
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {enquiry.phone}
                            </div>
                            {enquiry.purpose && (
                              <div className="flex items-start text-gray-600">
                                <MessageSquare className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                                <span className="text-sm"><strong>Purpose:</strong> {enquiry.purpose}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(enquiry.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Visits Tab */}
          <TabsContent value="site-visits">
            <Card>
              <CardHeader>
                <CardTitle>Site Visit Requests</CardTitle>
                <CardDescription>
                  Customers who requested site visits
                </CardDescription>
              </CardHeader>
              <CardContent>
                {siteVisitLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : siteVisitEnquiries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No site visit requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {siteVisitEnquiries.map((enquiry) => (
                      <div key={enquiry.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{enquiry.name}</h3>
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {enquiry.phone}
                            </div>
                            {enquiry.email && (
                              <div className="flex items-center text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                {enquiry.email}
                              </div>
                            )}
                            {enquiry.projectName && (
                              <div className="flex items-center text-gray-600">
                                <Building2 className="h-4 w-4 mr-2" />
                                <span className="text-sm">Project: <strong>{enquiry.projectName}</strong></span>
                              </div>
                            )}
                            {enquiry.marketingAgentName && (
                              <div className="flex items-center text-gray-600">
                                <User className="h-4 w-4 mr-2" />
                                <span className="text-sm">Agent: {enquiry.marketingAgentName}</span>
                              </div>
                            )}
                            {enquiry.message && (
                              <div className="flex items-start text-gray-600">
                                <MessageSquare className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                                <span className="text-sm">Message: {enquiry.message}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(enquiry.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Construction Services Tab */}
          <TabsContent value="construction">
            <Card>
              <CardHeader>
                <CardTitle>Construction Service Enquiries</CardTitle>
                <CardDescription>
                  Customers interested in construction services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {constructionLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : constructionEnquiries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No construction service enquiries yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {constructionEnquiries.map((enquiry) => (
                      <div key={enquiry.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{enquiry.name}</h3>
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {enquiry.phone}
                            </div>
                            {enquiry.email && (
                              <div className="flex items-center text-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                {enquiry.email}
                              </div>
                            )}
                            <div className="flex items-center text-gray-600">
                              <Badge variant="secondary" className="text-xs">
                                Service: {enquiry.serviceType}
                              </Badge>
                            </div>
                            {enquiry.projectDetails && (
                              <div className="flex items-start text-gray-600">
                                <MessageSquare className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                                <span className="text-sm"><strong>Project Details:</strong> {enquiry.projectDetails}</span>
                              </div>
                            )}
                            {enquiry.budget && (
                              <div className="flex items-center text-gray-600">
                                <IndianRupee className="h-4 w-4 mr-2" />
                                <span className="text-sm"><strong>Budget:</strong> {enquiry.budget}</span>
                              </div>
                            )}
                            {enquiry.timeline && (
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-2" />
                                <span className="text-sm"><strong>Timeline:</strong> {enquiry.timeline}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(enquiry.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emails Tab */}
          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Inbox className="mr-2 h-5 w-5" />
                  Email Inbox
                </CardTitle>
                <CardDescription>
                  Incoming emails to your domain
                </CardDescription>
              </CardHeader>
              <CardContent>
                {emailsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : emails.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No emails yet</p>
                    <p className="text-sm">
                      Configure email monitoring with EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASSWORD environment variables
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emails.map((email) => (
                      <div 
                        key={email.id} 
                        className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                          !email.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              {!email.isRead && <MailOpen className="h-4 w-4 text-blue-600" />}
                              <h3 className={`font-semibold ${!email.isRead ? 'text-blue-900' : ''}`}>
                                {email.subject}
                              </h3>
                              {email.priority === 'high' && (
                                <Badge variant="destructive" className="text-xs">High Priority</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                <span className="font-medium">{email.fromName || email.from}</span>
                                {email.fromName && (
                                  <span className="ml-1 text-gray-500">({email.from})</span>
                                )}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(email.receivedAt)}</span>
                              </div>
                            </div>
                            {email.textContent ? (
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {email.textContent.substring(0, 150)}
                                {email.textContent.length > 150 ? '...' : ''}
                              </p>
                            ) : null}
                            {email.attachments && Array.isArray(email.attachments) && email.attachments.length > 0 ? (
                              <div className="flex items-center text-xs text-gray-500">
                                <FileText className="h-3 w-3 mr-1" />
                                <span>{(email.attachments as any[]).length} attachment(s)</span>
                              </div>
                            ) : null}
                          </div>
                          <div className="flex flex-col gap-2">
                            {!email.isRead && (
                              <Badge variant="secondary" className="text-xs">Unread</Badge>
                            )}
                            <Badge 
                              variant={email.priority === 'high' ? 'destructive' : 'outline'} 
                              className="text-xs"
                            >
                              {email.priority || 'Normal'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}