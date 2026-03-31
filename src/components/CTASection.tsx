import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-28 md:py-36 relative overflow-hidden bg-navy">

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="font-body text-xs text-gold uppercase tracking-[0.4em] mb-6 block">Take The Next Step</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-[hsl(220,15%,92%)] mb-4 leading-tight">
            Ready to Go <span className="text-gold italic">Global?</span>
          </h2>
          <div className="w-20 h-[1px] bg-gold/50 mx-auto mb-6" />
          <p className="font-body text-lg text-[hsl(220,10%,55%)] mb-12 max-w-xl mx-auto leading-relaxed">
            Your next big commission might come from an agent in Dubai, London, or Miami.
            The right connection is worth more than any marketing budget.
          </p>

          <Button
            size="lg"
            className="bg-gold hover:bg-gold-dark text-navy font-body font-semibold px-12 py-7 text-lg rounded-lg transition-all hover:shadow-[0_0_50px_hsl(var(--gold)/0.3)]"
            asChild
          >
            <a href="https://trnportal.vercel.app/join" target="_blank" rel="noopener noreferrer">
              Join The Realty Network <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>

          <p className="font-body text-sm text-[hsl(220,10%,40%)] mt-8 tracking-wide">
            Free to join · Engage to earn referrals · Zero tolerance for bad actors
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
