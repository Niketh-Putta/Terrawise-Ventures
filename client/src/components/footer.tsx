import { Building2, Facebook, Instagram, Linkedin, Youtube, MessageSquare, Star } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const quickLinks = [
    { label: "Current Projects", href: "#projects" },
    { label: "About Terrawise", href: "#about" },
    { label: "Our Process", href: "#process" },
    { label: "Investment Guide", href: "#" },
    { label: "Legal Documents", href: "#" },
    { label: "Customer Support", href: "#" },
  ];

  const supportLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "RERA Information", href: "#" },
    { label: "EMI Calculator", href: "#" },
    { label: "Site Visit Booking", href: "#" },
    { label: "Contact Us", href: "#contact" },
  ];

  const partnerLinks = [
    { label: "Agent Registration", href: "/agent-register" },
    { label: "Agent Dashboard", href: "/agent-dashboard" },
    { label: "Partner Benefits", href: "#" },
    { label: "Commission Portal", href: "/admin" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", bgColor: "hover:bg-primary" },
    { icon: Instagram, href: "#", bgColor: "hover:bg-primary" },
    { icon: Linkedin, href: "#", bgColor: "hover:bg-primary" },
    { icon: Youtube, href: "#", bgColor: "hover:bg-primary" },
    { icon: MessageSquare, href: "#", bgColor: "hover:bg-green-600" },
  ];

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith("#")) {
      const element = document.getElementById(sectionId.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2 flex items-center">
                <Building2 className="mr-2 h-6 w-6 text-primary" />
                Terrawise
              </h3>
              <p className="text-xl text-accent font-medium mb-4">Building Futures</p>
              <p className="text-gray-300 leading-relaxed">
                Terrawise is a premier real estate development company specializing in transforming raw land into thriving residential communities. With over 15 years of experience and 50+ successful projects, we're committed to creating sustainable, well-planned developments that enhance communities and build lasting value.
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-bold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`bg-gray-800 ${social.bgColor} p-3 rounded-lg transition-colors`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-bold mb-6">Support & Legal</h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketing Partners */}
          <div>
            <h4 className="font-bold mb-6">Partners</h4>
            <ul className="space-y-3">
              {partnerLinks.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/') ? (
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-300 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Terrawise Real Estate Development. All rights reserved. | RERA Reg: KAR/RERA/123456789
              <span className="ml-4">
                <Link href="/admin" className="text-gray-500 hover:text-white text-xs">Admin</Link>
              </span>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm text-gray-400">Trusted by 2000+ families</span>
              <div className="flex items-center space-x-2">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-400">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
