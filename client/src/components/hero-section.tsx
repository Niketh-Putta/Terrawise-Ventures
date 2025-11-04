import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Aerial View of Plot Development Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="/images/hero-aerial-plots.jpg"
          alt="Aerial view of premium residential plot development"
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
        />
        {/* Animated overlay effect for development visualization */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-transparent to-blue-900/30 animate-gradient-shift"></div>
      </div>
      <div className="absolute inset-0 bg-black opacity-40" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Building Futures
          <span className="block text-accent">One Plot at a Time</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
          Transform raw land into thriving residential communities. From landscaping to infrastructure development, we create premium plotted layouts that form the foundation of tomorrow's neighborhoods.
        </p>
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={scrollToContact}
            className="flex items-center justify-center text-lg px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white"
          >
            <Calendar className="mr-3 h-5 w-5" />
            Schedule Site Visit
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  );
}
