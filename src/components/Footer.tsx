import { Globe, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 bg-navy border-t border-[hsl(220,15%,18%)]">
      <div className="container px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-gold" />
              <span className="font-display text-xl font-bold text-[hsl(220,15%,85%)]">The Realty Network</span>
            </div>
            <p className="font-body text-sm text-[hsl(220,10%,45%)] leading-relaxed">
              The global referral and collaboration network for real estate professionals who think beyond borders.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-[hsl(220,15%,70%)] uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-3 font-body text-sm text-[hsl(220,10%,45%)]">
              <li><a href="#about" className="hover:text-gold transition-colors">About</a></li>
              <li><a href="#resources" className="hover:text-gold transition-colors">Resources</a></li>
              <li><a href="https://the-realty-network.circle.so/join?invitation_token=773b1957a12cdf5285c06327abca343cdcd3fd04-f9c234b8-0582-4b4f-abf1-ab8087dc5f0a" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Join Circle</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-[hsl(220,15%,70%)] uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 font-body text-sm text-[hsl(220,10%,45%)]">
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
            Founded by Jake Engerer · 📊 250+ deals · 🌍 Based in Malta
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
