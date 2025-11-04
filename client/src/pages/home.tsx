import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import TrustIndicators from "@/components/trust-indicators";
import FeaturedProjects from "@/components/featured-projects";
import ConstructionServices from "@/components/construction-services";
import AboutUs from "@/components/about-us";
import DevelopmentProcess from "@/components/development-process";
import Testimonials from "@/components/testimonials";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import FloatingActions from "@/components/floating-actions";
import { EnquiryPopup } from "@/components/enquiry-popup";

export default function Home() {
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);

  useEffect(() => {
    // Check if the popup has been shown before in this session
    const hasShownPopup = sessionStorage.getItem('enquiry-popup-shown');
    
    if (!hasShownPopup) {
      // Show popup after a short delay when the page loads
      const timer = setTimeout(() => {
        setShowEnquiryPopup(true);
        sessionStorage.setItem('enquiry-popup-shown', 'true');
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <FeaturedProjects />
      <ConstructionServices />
      <AboutUs />
      <DevelopmentProcess />
      <Testimonials />
      <ContactSection />
      <Footer />
      <FloatingActions />
      
      <EnquiryPopup 
        isOpen={showEnquiryPopup} 
        onClose={() => setShowEnquiryPopup(false)} 
      />
    </div>
  );
}
