import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DevelopmentProcess() {
  const processSteps = [
    {
      number: 1,
      title: "Land Acquisition & Analysis",
      description: "Strategic selection of prime locations with growth potential, conducting thorough feasibility studies and legal due diligence.",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      number: 2,
      title: "Master Planning & Design",
      description: "Creating comprehensive development plans with optimal plot layouts, infrastructure planning, and amenity integration.",
      bgColor: "bg-secondary/10",
      textColor: "text-secondary",
    },
    {
      number: 3,
      title: "Infrastructure Development",
      description: "Building world-class infrastructure including roads, utilities, drainage, water supply, and electrical connections.",
      bgColor: "bg-accent/10",
      textColor: "text-accent",
    },
    {
      number: 4,
      title: "Quality Handover",
      description: "Delivering fully developed plots with all approvals, amenities, and infrastructure ready for construction.",
      bgColor: "bg-muted",
      textColor: "text-muted-foreground",
    },
  ];

  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Development Process</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From raw land acquisition to fully developed communities, we transform landscapes with precision and care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Before/After Comparison */}
          <div className="space-y-8">
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Land Transformation</h3>
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                  alt="Raw undeveloped land before transformation" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <Badge variant="destructive">Before</Badge>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl text-primary">↓</div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                  alt="Developed residential community with modern infrastructure" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-secondary text-secondary-foreground">After</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="space-y-6">
            {processSteps.map((step) => (
              <Card key={step.number} className={`p-6 ${step.bgColor}`}>
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className={`${step.textColor} w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold flex-shrink-0 shadow-md`}>
                      {step.number}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
