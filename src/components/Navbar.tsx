import { useState } from "react";
import { Globe, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-xl border-b border-[hsl(220,15%,18%)]">
      <div className="container px-6 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gold" />
          <span className="font-display text-lg font-bold text-[hsl(220,15%,85%)]">The Realty Network</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="font-body text-sm text-[hsl(220,10%,55%)] hover:text-gold transition-colors">About</a>
          <a href="#resources" className="font-body text-sm text-[hsl(220,10%,55%)] hover:text-gold transition-colors">Resources</a>
          <Button
            size="sm"
            className="bg-gold hover:bg-gold-dark text-navy font-body font-semibold rounded-lg"
            asChild
          >
            <a href="https://the-realty-network.circle.so/join?invitation_token=773b1957a12cdf5285c06327abca343cdcd3fd04-f9c234b8-0582-4b4f-abf1-ab8087dc5f0a" target="_blank" rel="noopener noreferrer">
              Join Now <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-[hsl(220,10%,70%)]">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy border-t border-[hsl(220,15%,18%)] px-6 py-6 space-y-4">
          <a href="#about" onClick={() => setOpen(false)} className="block font-body text-sm text-[hsl(220,10%,55%)] hover:text-gold">About</a>
          <a href="#resources" onClick={() => setOpen(false)} className="block font-body text-sm text-[hsl(220,10%,55%)] hover:text-gold">Resources</a>
          <Button
            size="sm"
            className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold"
            asChild
          >
            <a href="https://the-realty-network.circle.so/join?invitation_token=773b1957a12cdf5285c06327abca343cdcd3fd04-f9c234b8-0582-4b4f-abf1-ab8087dc5f0a" target="_blank" rel="noopener noreferrer">
              Join Now
            </a>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
