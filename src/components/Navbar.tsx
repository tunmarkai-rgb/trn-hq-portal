import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import trnLogo from "@/assets/trn-logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur-xl border-b border-gold/10">
      <div className="container px-6 flex items-center justify-between h-18 py-3">
        <a href="/" className="flex items-center gap-3">
          <img src={trnLogo} alt="The Realty Network" className="h-10 w-10 object-contain" />
          <div className="flex flex-col">
            <span className="font-display text-base font-bold text-[hsl(220,15%,90%)] leading-tight tracking-wide">THE REALTY NETWORK</span>
            <span className="font-body text-[10px] text-gold uppercase tracking-[0.3em]">Global Agent Network</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="font-body text-sm text-[hsl(220,10%,55%)] hover:text-gold transition-colors">About</a>
          <a href="#how-it-works" className="font-body text-sm text-[hsl(220,10%,55%)] hover:text-gold transition-colors">How It Works</a>
          <a href="#resources" className="font-body text-sm text-[hsl(220,10%,55%)] hover:text-gold transition-colors">Resources</a>
          <a href="/login" className="font-body text-sm text-gold hover:text-gold-light transition-colors">Member Login</a>
          <Button
            size="sm"
            className="bg-gold hover:bg-gold-dark text-navy font-body font-semibold rounded-lg px-6"
            asChild
          >
            <a href="https://the-realty-network.circle.so/join?invitation_token=773b1957a12cdf5285c06327abca343cdcd3fd04-f9c234b8-0582-4b4f-abf1-ab8087dc5f0a" target="_blank" rel="noopener noreferrer">
              Join Now <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </Button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-[hsl(220,10%,70%)]">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-navy/95 backdrop-blur-xl border-t border-gold/10 px-6 py-6 space-y-4">
          <a href="#about" onClick={() => setOpen(false)} className="block font-body text-sm text-[hsl(220,10%,55%)] hover:text-gold">About</a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block font-body text-sm text-[hsl(220,10%,55%)] hover:text-gold">How It Works</a>
          <a href="#resources" onClick={() => setOpen(false)} className="block font-body text-sm text-[hsl(220,10%,55%)] hover:text-gold">Resources</a>
          <a href="/login" onClick={() => setOpen(false)} className="block font-body text-sm text-gold">Member Login</a>
          <Button size="sm" className="w-full bg-gold hover:bg-gold-dark text-navy font-body font-semibold" asChild>
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
