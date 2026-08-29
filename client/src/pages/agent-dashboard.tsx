import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck, Phone, Building2, Mail, Calendar, TrendingUp, Users, Eye, MessageSquare, Home, LogOut } from "lucide-react";
import { agentLoginSchema, type MarketingAgent, type InquiryWithProject } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AgentDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<MarketingAgent | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(agentLoginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { phone: string; password: string }) => {
      const response = await apiRequest("/api/marketing-agents/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (agent: MarketingAgent) => {
      setCurrentAgent(agent);
      setIsLoggedIn(true);
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
      toast({
        title: "Login Successful",
        description: `Welcome back, ${agent.fullName}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: leads = [] } = useQuery<InquiryWithProject[]>({
    queryKey: ["/api/inquiries", "agent", currentAgent?.id],
    enabled: !!currentAgent?.id,
  });

  const onLogin = (data: { phone: string; password: string }) => {
    loginMutation.mutate(data);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentAgent(null);
    form.reset();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      site_visit_scheduled: "bg-purple-100 text-purple-800",
      site_visit_completed: "bg-orange-100 text-orange-800",
      negotiating: "bg-indigo-100 text-indigo-800",
      deal_closed: "bg-green-100 text-green-800",
      deal_lost: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Marketing Agent Login</CardTitle>
              <CardDescription>
                Access your dashboard and manage your leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+91 98765 43210" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter your password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
              <div className="mt-6 text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Not registered yet?{" "}
                  <Link href="/agent-register" className="text-primary hover:underline">
                    Register here
                  </Link>
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="w-full">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const agentLeads = leads.filter(lead => lead.marketingAgentId === currentAgent?.id);
  const totalLeads = agentLeads.length;
  const closedDeals = agentLeads.filter(lead => lead.leadStatus === "deal_closed").length;
  const conversionRate = totalLeads > 0 ? Math.round((closedDeals / totalLeads) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Agent Dashboard
                </h1>

              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome, {currentAgent?.fullName}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Manage your leads and track your progress</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total Leads
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">{totalLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Closed Deals
                  </h3>
                  <p className="text-3xl font-bold text-green-600">{closedDeals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Conversion Rate
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">{conversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              My Leads
            </CardTitle>
            <CardDescription>
              Manage and track your customer leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            {agentLeads.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No leads yet
                </h3>
                <p className="text-gray-500">
                  Your customer leads will appear here when customers reference your name
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.fullName}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {lead.phone}
                            </div>
                            {lead.email && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail className="h-3 w-3 mr-1" />
                                {lead.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{lead.projectName || "General Inquiry"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.leadStatus)}>
                            {lead.leadStatus.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}