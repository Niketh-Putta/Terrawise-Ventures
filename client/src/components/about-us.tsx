import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Award, Target, Shield, Heart } from "lucide-react";

export default function AboutUs() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We maintain complete transparency in all our dealings, ensuring customers have full visibility into every aspect of their investment.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Every development meets the highest standards of quality infrastructure, from roads and utilities to landscaping and amenities.",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Target,
      title: "Customer Focus",
      description: "Our success is measured by customer satisfaction. We go above and beyond to ensure every family finds their perfect plot or villa.",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  const milestones = [
    { year: "2009", title: "Foundation", description: "Terrawise established with a vision to transform Bangalore's land development" },
    { year: "2015", title: "Growth Phase", description: "Expanded operations across multiple zones in Bangalore with 20+ completed projects" },
    { year: "2020", title: "Innovation", description: "Introduced smart infrastructure and sustainable development practices" },
    { year: "2024", title: "Leadership", description: "50+ projects completed, 2000+ happy families, industry leader in land development" }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Terrawise</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building futures for over 15 years, we're Bangalore's trusted partner in land development and residential communities.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-0">
              <div className="flex items-center mb-6">
                <Building2 className="h-8 w-8 text-primary mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To transform raw land into thriving, sustainable communities where families can build their dreams. We're committed to delivering infrastructure excellence, legal compliance, and transparent dealings in every project we undertake.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardContent className="p-0">
              <div className="flex items-center mb-6">
                <Heart className="h-8 w-8 text-secondary mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To be Bangalore's most trusted real estate development company, known for creating communities that enhance quality of life while preserving environmental sustainability and fostering social connections.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className={`p-6 ${value.bgColor} text-center`}>
                <CardContent className="p-0">
                  <div className={`${value.color} w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-4 text-xl">{value.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>



        {/* Leadership Team */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Terrawise?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Expert Team</h4>
              <p className="text-muted-foreground">15+ years of combined experience in land development and real estate</p>
            </div>
            <div className="text-center p-6">
              <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Legal Compliance</h4>
              <p className="text-muted-foreground">100% RERA approved projects with clear titles and proper documentation</p>
            </div>
            <div className="text-center p-6">
              <Award className="h-12 w-12 text-accent mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Quality Assurance</h4>
              <p className="text-muted-foreground">Premium infrastructure with modern amenities and sustainable practices</p>
            </div>
            <div className="text-center p-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Customer First</h4>
              <p className="text-muted-foreground">Dedicated support team ensuring satisfaction throughout your journey</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}