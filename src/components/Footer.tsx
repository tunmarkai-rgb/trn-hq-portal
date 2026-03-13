import { Mail, Phone } from "lucide-react";
import trnLogo from "@/assets/trn-logo.png";

const Footer = () => {
  return (
    <footer className="py-16 bg-navy border-t border-gold/10">
      <div className="container px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={trnLogo} alt="TRN" className="h-8 w-8 object-contain" />
              <span className="font-display text-lg font-bold text-[hsl(220,15%,90%)] tracking-wide">THE REALTY NETWORK</span>
            </div>
            <p className="font-body text-sm text-[hsl(220,10%,45%)] leading-relaxed italic">
              "Connecting the world of real estate."
            </p>
          </div>

          <div>
            <h4 className="font-body text-xs font-semibold text-gold uppercase tracking-[0.3em] mb-5">Quick Links</h4>
            <ul className="space-y-3 font-body text-sm text-[hsl(220,10%,50%)]">
              <li><a href="#about" className="hover:text-gold transition-colors">About</a></li>
              <li><a href="#resources" className="hover:text-gold transition-colors">Resources</a></li>
              <li><a href="/login" className="hover:text-gold transition-colors">Member Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-body text-xs font-semibold text-gold uppercase tracking-[0.3em] mb-5">Contact</h4>
            <ul className="space-y-3 font-body text-sm text-[hsl(220,10%,50%)]">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <a href="mailto:jake@therealty-network.com" className="hover:text-gold transition-colors">jake@therealty-network.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>+356 99122628</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[hsl(220,15%,15%)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-[hsl(220,10%,35%)]">
            © {new Date().getFullYear()} The Realty Network. All rights reserved.
          </p>
          <p className="font-body text-xs text-[hsl(220,10%,35%)]">
            Founded by Jake Engerer · Based in Malta · 250+ Deals Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
