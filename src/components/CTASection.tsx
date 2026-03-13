import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--gold)) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold text-[hsl(220,15%,90%)] mb-6">
            Ready to Go <span className="text-gold">Global?</span>
          </h2>
          <p className="font-body text-lg text-[hsl(220,10%,50%)] mb-10 max-w-xl mx-auto">
            Your next big commission might come from an agent in Dubai, London, or Miami. 
            The right connection is worth more than any marketing budget.
          </p>

          <Button
            size="lg"
            className="bg-gold hover:bg-gold-dark text-navy font-body font-semibold px-10 py-6 text-lg rounded-lg transition-all hover:shadow-[0_0_40px_hsl(var(--gold)/0.3)]"
            asChild
          >
            <a href="https://the-realty-network.circle.so/join?invitation_token=773b1957a12cdf5285c06327abca343cdcd3fd04-f9c234b8-0582-4b4f-abf1-ab8087dc5f0a" target="_blank" rel="noopener noreferrer">
              Join The Realty Network <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>

          <p className="font-body text-sm text-[hsl(220,10%,40%)] mt-6">
            Free to join • Engage to earn referrals • Zero tolerance for bad actors
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
