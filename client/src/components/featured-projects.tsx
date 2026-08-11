import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Info, Calendar, Heart, Download } from "lucide-react";
import type { Project } from "@shared/schema";
import { SiteVisitPopup } from "@/components/site-visit-popup";
import { downloadProjectBrochure } from "@/lib/brochures";

export default function FeaturedProjects() {
  const [activeFilter, setActiveFilter] = useState("ongoing");
  const [showSiteVisitPopup, setShowSiteVisitPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filters = [
    { id: "upcoming", label: "Upcoming" },
    { id: "ongoing", label: "Ongoing" },
    { id: "completed", label: "Completed" },
  ];

  const normalizeStatus = (status: string) => {
    if (status === "ready" || status === "under-development") {
      return "ongoing";
    }
    return status;
  };

  const filteredProjects = projects
    .filter((project) => normalizeStatus(project.status) === activeFilter)
    .sort((a, b) => {
      // Keep Vanam first when browsing ongoing projects
      if (a.name === "Vanam") return -1;
      if (b.name === "Vanam") return 1;
      return 0;
    });

  const vanamProject = projects.find((project) => project.name === "Vanam");

  const getStatusBadge = (status: string) => {
    const normalizedStatus = normalizeStatus(status);
    const statusMap = {
      "upcoming": { label: "Upcoming", variant: "outline" as const, className: "border-blue-500 text-blue-700 bg-blue-50" },
      "ongoing": { label: "Ongoing", variant: "secondary" as const, className: "bg-orange-100 text-orange-800 border-orange-200" },
      "completed": { label: "Completed", variant: "default" as const, className: "bg-green-100 text-green-800 border-green-200" },
    };
    return statusMap[normalizedStatus as keyof typeof statusMap] || { label: status, variant: "outline" as const, className: "border-gray-500 text-gray-700 bg-gray-50" };
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Premium Developments</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover thoughtfully planned communities with world-class infrastructure, amenities, and connectivity.
          </p>
        </div>

        {vanamProject && (
          <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative min-h-[380px] lg:min-h-[460px]">
                <img
                  src={vanamProject.imageUrl}
                  alt="Vanam premium plotted development"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 to-transparent lg:hidden" />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <Badge className="mb-4 w-fit border-amber-300/40 bg-amber-400/20 text-amber-100 hover:bg-amber-400/30">
                  Latest Offering
                </Badge>
                <h3 className="text-3xl font-bold tracking-tight mb-2">Vanam</h3>
                <p className="text-emerald-100/90 mb-2">
                  2.5-acre premium plotted phase of a 50-acre integrated township
                </p>
                <p className="text-sm text-emerald-100/70 mb-6">
                  {vanamProject.location} · Plots from {vanamProject.price}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="bg-amber-400 text-emerald-950 hover:bg-amber-300"
                    onClick={() => downloadProjectBrochure("Vanam")}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Brochure
                  </Button>
                  <Link href={`/projects/${vanamProject.id}`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      <Info className="mr-2 h-5 w-5" />
                      View Project
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className="rounded-full"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {filteredProjects.map((project) => {
            const normalizedStatus = normalizeStatus(project.status);
            const statusBadge = getStatusBadge(project.status);
            return (
              <Card key={project.id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 w-full max-w-sm">
                <div className="relative h-64">
                  <img 
                    src={project.imageUrl} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant={statusBadge.variant} className={statusBadge.className}>{statusBadge.label}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button variant="ghost" size="sm" className="bg-white/90 backdrop-blur hover:bg-white">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    {normalizedStatus !== "upcoming" && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{project.price}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  
                  {/* Plot Info - Only for non-upcoming projects */}
                  {normalizedStatus !== "upcoming" && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-gray-900">{project.plotsAvailable}</div>
                        <div className="text-sm text-muted-foreground">Plots Available</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-gray-900">{project.plotSize}</div>
                        <div className="text-sm text-muted-foreground">Plot Sizes</div>
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(project.amenities as string[]).slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <Link href={`/projects/${project.id}`} className="flex-1">
                        <Button className="w-full">
                          <Info className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                      {project.status !== "upcoming" && (
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedProject(project.name);
                            setShowSiteVisitPopup(true);
                          }}
                          data-testid={`button-book-visit-${project.id}`}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Visit
                        </Button>
                      )}
                    </div>
                    {project.name === "Vanam" && (
                      <Button
                        variant="outline"
                        className="w-full border-emerald-700 text-emerald-800 hover:bg-emerald-50"
                        onClick={() => downloadProjectBrochure("Vanam")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Brochure
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <Link href="/projects">
            <Button size="lg" className="px-8 py-4 text-lg">
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Site Visit Popup */}
      <SiteVisitPopup 
        isOpen={showSiteVisitPopup}
        onClose={() => {
          setShowSiteVisitPopup(false);
          setSelectedProject(null);
        }}
        projectName={selectedProject || undefined}
      />
    </section>
  );
}
