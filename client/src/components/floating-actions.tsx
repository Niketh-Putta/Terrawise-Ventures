import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Calendar, Share2 } from "lucide-react";

export default function FloatingActions() {
  const handleShare = async () => {
    const shareData = {
      title: "Terrawise - Premium Land Development in Bangalore",
      text: "Discover premium residential plots with complete infrastructure in Bangalore. Building Futures...",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        // Use native Web Share API if available
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Website link copied to clipboard!");
      }
    } catch (error) {
      // Fallback if both methods fail
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Website link copied to clipboard!");
    }
  };

  const actions = [
    {
      icon: Share2,
      bgColor: "bg-purple-500 hover:bg-purple-600",
      action: handleShare,
    },
    {
      icon: MessageSquare,
      bgColor: "bg-green-500 hover:bg-green-600",
      action: () => {
        // WhatsApp action
        window.open("https://wa.me/919876543210", "_blank");
      },
    },
    {
      icon: Phone,
      bgColor: "bg-primary hover:bg-primary/90",
      action: () => {
        // Phone action
        window.location.href = "tel:+919876543210";
      },
    },
    {
      icon: Calendar,
      bgColor: "bg-gray-800 hover:bg-gray-900",
      action: () => {
        // Calendar action - scroll to contact
        const element = document.getElementById("contact");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-40">
      {actions.map((action, index) => (
        <Button
          key={index}
          size="sm"
          className={`${action.bgColor} text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 w-12 h-12`}
          onClick={action.action}
        >
          <action.icon className="h-5 w-5" />
        </Button>
      ))}
    </div>
  );
}
