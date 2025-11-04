import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Info, Calendar, Heart } from "lucide-react";
import type { Project } from "@shared/schema";
import { SiteVisitPopup } from "@/components/site-visit-popup";

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

  const filteredProjects = projects.filter(project => 
    project.status === activeFilter
  );

  const getStatusBadge = (status: string) => {
    const statusMap = {
      "upcoming": { label: "Upcoming", variant: "outline" as const, className: "border-blue-500 text-blue-700 bg-blue-50" },
      "ongoing": { label: "Ongoing", variant: "secondary" as const, className: "bg-orange-100 text-orange-800 border-orange-200" },
      "completed": { label: "Completed", variant: "default" as const, className: "bg-green-100 text-green-800 border-green-200" },
    };
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "outline" as const, className: "border-gray-500 text-gray-700 bg-gray-50" };
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
            const statusBadge = getStatusBadge(project.status);
            return (
              <Card key={project.id} className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 w-full max-w-sm">
                <div className="relative h-64">
                  <img 
                    src={project.name === "TerraBloom" ? "/images/terrabloom-hero.jpg" : 
                         project.name === "TerraGrid" ? "/images/terragrid-hero.jpg" : 
                         project.imageUrl} 
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
                    {project.status !== "upcoming" && (
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
                  {project.status !== "upcoming" && (
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
