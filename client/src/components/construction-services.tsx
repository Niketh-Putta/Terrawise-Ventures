import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConsultationPopup } from "@/components/consultation-popup";
import { 
  Users, 
  Home, 
  CheckCircle, 
  Clock, 
  Phone, 
  Wrench,
  Building2,
  Shield,
  Award,
  Calendar,
  MapPin,
  IndianRupee
} from "lucide-react";

export default function ConstructionServices() {
  const [showConsultationPopup, setShowConsultationPopup] = useState(false);
  const constructionSteps = [
    {
      step: "1",
      title: "Let's Get Started",
      description: "Discuss requirements and receive an estimate",
      icon: Users,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      details: "Initial consultation to understand your vision, budget, and timeline"
    },
    {
      step: "2", 
      title: "Design Specification",
      description: "Tailor designs to your needs",
      icon: Home,
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      details: "Architectural planning, 3D visualization, and technical drawings"
    },
    {
      step: "3",
      title: "Client Agreement", 
      description: "Confirm terms and begin construction",
      icon: CheckCircle,
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      details: "Contract finalization, permits, and project timeline approval"
    },
    {
      step: "4",
      title: "Construction & Updates",
      description: "Real-time project updates",
      icon: Clock,
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      details: "Foundation to finish with weekly progress reports and photos"
    },
    {
      step: "5",
      title: "Site Visits",
      description: "Monitor progress directly",
      icon: Phone,
      image: "/images/naturaleza-gate.jpg",
      details: "Scheduled inspections and quality checks at key milestones"
    },
    {
      step: "6",
      title: "Completion & Handover",
      description: "Deliver your dream home",
      icon: Wrench,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      details: "Final inspection, documentation, and keys to your new home"
    }
  ];

  const whyChooseUs = [
    {
      icon: Building2,
      title: "15+ Years Experience",
      description: "Proven track record in residential construction with over 200 completed homes"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Premium materials, skilled craftsmen, and rigorous quality control at every stage"
    },
    {
      icon: Award,
      title: "Licensed & Insured",
      description: "Fully licensed contractors with comprehensive insurance coverage"
    },
    {
      icon: Calendar,
      title: "On-Time Delivery",
      description: "98% of our projects completed on schedule with transparent timeline management"
    },
    {
      icon: MapPin,
      title: "Local Expertise",
      description: "Deep understanding of Bangalore regulations, climate, and construction practices"
    },
    {
      icon: IndianRupee,
      title: "Transparent Pricing",
      description: "No hidden costs, detailed estimates, and flexible payment options"
    }
  ];

  return (
    <section id="construction-services" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Construction Services...
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            From concept to completion, we guide you through every step of creating your perfect home with transparency, quality, and expertise.
          </p>
        </div>

        {/* Construction Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {constructionSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 transform hover:-translate-y-2 shadow-xl">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 left-4 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-blue-600 font-medium mb-3">{step.description}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.details}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Why Choose Our Construction Services */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Terrawise Construction Services?
            </h3>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We don't just build houses, we create homes that last generations with uncompromising quality and service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {whyChooseUs.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-blue-100 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h4 className="text-2xl font-bold text-white mb-4">Ready to Build Your Dream Home?</h4>
            <p className="text-blue-100 mb-6">
              Get a free consultation and detailed estimate for your construction project
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                onClick={() => setShowConsultationPopup(true)}
              >
                <Phone className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <ConsultationPopup 
        isOpen={showConsultationPopup} 
        onClose={() => setShowConsultationPopup(false)} 
      />
    </section>
  );
}