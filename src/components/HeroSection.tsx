import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpeg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy">
      {/* World map background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy" />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="container relative z-10 px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-body text-sm text-gold uppercase tracking-[0.4em] mb-8"
          >
            The Global Agent Network
          </motion.p>

          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-4 leading-[0.95]">
            <span className="text-[hsl(220,15%,92%)]">Real Estate Is Global.</span>
          </h1>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[0.95]">
            <span className="text-gold">Your Network Should Be Too.</span>
          </h1>

          <div className="w-24 h-[1px] bg-gold/60 mx-auto mb-8" />

          <p className="font-body text-lg md:text-xl text-[hsl(220,10%,60%)] max-w-2xl mx-auto mb-12 leading-relaxed">
            Connect with trusted agents across every continent. Exchange referrals, close cross-border deals, and grow your business beyond borders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold-dark text-navy font-body font-semibold px-10 py-7 text-base rounded-lg transition-all hover:shadow-[0_0_40px_hsl(var(--gold)/0.25)]"
              asChild
            >
              <a href="https://the-realty-network.circle.so/join?invitation_token=773b1957a12cdf5285c06327abca343cdcd3fd04-f9c234b8-0582-4b4f-abf1-ab8087dc5f0a" target="_blank" rel="noopener noreferrer">
                Join The Network <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold font-body px-10 py-7 text-base rounded-lg"
              asChild
            >
              <a href="#about">Discover More</a>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-3 gap-12 max-w-md mx-auto"
          >
            {[
              { label: "Markets", value: "250+" },
              { label: "Active Agents", value: "Growing" },
              { label: "Deals Closed", value: "250+" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl font-bold text-gold">{value}</div>
                <div className="font-body text-xs text-[hsl(220,10%,45%)] uppercase tracking-[0.2em] mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
