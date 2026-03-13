import { motion } from "framer-motion";
import { ArrowRight, Globe, Users, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--gold) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold) / 0.5) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="container relative z-10 px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 mb-8"
          >
            <Globe className="w-4 h-4 text-gold" />
            <span className="text-sm font-body text-gold-light tracking-wide uppercase">Global Agent Network</span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.95]">
            <span className="text-gold">Your Network</span>
            <br />
            <span className="text-[hsl(220,15%,85%)]">Determines Your</span>
            <br />
            <span className="text-gold">Net Worth</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-[hsl(220,10%,55%)] max-w-2xl mx-auto mb-10 leading-relaxed">
            The global referral and collaboration network for real estate professionals
            who think beyond borders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold-dark text-navy font-body font-semibold px-8 py-6 text-base rounded-lg transition-all hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)]"
              asChild
            >
              <a href="https://the-realty-network.circle.so/join?invitation_token=773b1957a12cdf5285c06327abca343cdcd3fd04-f9c234b8-0582-4b4f-abf1-ab8087dc5f0a" target="_blank" rel="noopener noreferrer">
                Join The Network <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[hsl(220,15%,30%)] text-[hsl(220,10%,70%)] hover:bg-navy-light font-body px-8 py-6 text-base rounded-lg"
              asChild
            >
              <a href="#about">Learn More</a>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { icon: Globe, label: "Global Markets", value: "250+" },
              { icon: Users, label: "Active Agents", value: "Growing" },
              { icon: Handshake, label: "Deals Closed", value: "250+" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon className="w-5 h-5 text-gold mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-[hsl(220,15%,85%)]">{value}</div>
                <div className="font-body text-xs text-[hsl(220,10%,45%)] uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
