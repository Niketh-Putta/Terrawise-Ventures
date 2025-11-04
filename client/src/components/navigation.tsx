import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Building2, Menu, Phone, UserPlus, LogIn, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navItems = [
    { label: "Projects", id: "projects" },
    { label: "Construction Services", id: "construction-services" },
    { label: "About Us", id: "about" },
    { label: "Our Process", id: "process" },
  ];

  return (
    <nav className="shadow-lg sticky top-0 z-50" style={{
      background: 'linear-gradient(90deg, #dbeafe 0%, #f1f5f9 20%, #ffffff 50%, #f1f5f9 80%, #dbeafe 100%)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary flex items-center">
                <Building2 className="mr-2 h-6 w-6" />
                Terrawise
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Building Futures...</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Marketing Agent Buttons */}
              <Link href="/agent-register">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Become Agent
                </Button>
              </Link>
              
              <Link href="/agent-dashboard">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Agent Login
                </Button>
              </Link>
              
              <Link href="/admin-login">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Login
                </Button>
              </Link>
              
              <Button 
                onClick={() => scrollToSection("contact")}
                className="flex items-center"
              >
                <Phone className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  
                  {/* Mobile Marketing Agent Buttons */}
                  <Link href="/agent-register" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="flex items-center justify-center w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Become Agent
                    </Button>
                  </Link>
                  
                  <Link href="/agent-dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="flex items-center justify-center w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Agent Login
                    </Button>
                  </Link>
                  
                  <Link href="/admin-login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="flex items-center justify-center w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Login
                    </Button>
                  </Link>
                  
                  <Button 
                    onClick={() => scrollToSection("contact")}
                    className="flex items-center justify-center"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
