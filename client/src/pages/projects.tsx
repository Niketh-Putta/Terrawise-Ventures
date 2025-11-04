import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Info, 
  Calendar, 
  Heart, 
  ArrowLeft, 
  Building2, 
  Filter,
  Search
} from "lucide-react";
import type { Project } from "@shared/schema";

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("ongoing");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filters = [
    { id: "upcoming", label: "Upcoming" },
    { id: "ongoing", label: "Ongoing" },
    { id: "completed", label: "Completed" },
  ];

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "price-low", label: "Price (Low to High)" },
    { value: "price-high", label: "Price (High to Low)" },
    { value: "location", label: "Location" },
  ];

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesFilter = project.status === activeFilter;
      const matchesSearch = 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return parseFloat(a.price.replace(/[₹L+]/g, "")) - parseFloat(b.price.replace(/[₹L+]/g, ""));
        case "price-high":
          return parseFloat(b.price.replace(/[₹L+]/g, "")) - parseFloat(a.price.replace(/[₹L+]/g, ""));
        case "location":
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <div className="text-lg">Loading projects...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Building2 className="mr-3 h-8 w-8 text-primary" />
                All Projects
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover our premium plotted developments across Bangalore
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Filter className="mr-2 h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Filter & Search Projects</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {filters.map((filter) => (
                    <SelectItem key={filter.id} value={filter.id}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Button */}
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("ongoing");
                  setSortBy("name");
                }}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedProjects.length} of {projects.length} projects
          </p>
        </div>

        {/* Projects Grid */}
        {filteredAndSortedProjects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No projects found</p>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          </Card>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {filteredAndSortedProjects.map((project) => {
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
                          <div className="text-sm text-muted-foreground">Starting Price</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span className="text-sm">{project.location}</span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
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

                    {/* Amenities Preview */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(project.amenities as string[]).slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {(project.amenities as string[]).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(project.amenities as string[]).length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Link href={`/projects/${project.id}`} className="flex-1">
                        <Button className="w-full">
                          <Info className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Load More or Pagination could go here */}
        {filteredAndSortedProjects.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Interested in investing? Our experts are here to help you choose the perfect plot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Site Visit
              </Button>
              <Button variant="outline" size="lg">
                <Building2 className="mr-2 h-5 w-5" />
                Download Brochures
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}