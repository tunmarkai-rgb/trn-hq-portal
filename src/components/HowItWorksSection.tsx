import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Join & Set Up Your Profile",
    description: "Complete your member profile with your location, niche, and expertise. The more specific, the more referrals you'll attract.",
  },
  {
    number: "02",
    title: "Connect & Build Rapport",
    description: "Browse the directory. Message agents in your target markets. Build real connections before asking for anything.",
  },
  {
    number: "03",
    title: "Exchange Referrals",
    description: "When you have a client who needs help in another market, post it. When you see an opportunity, respond fast.",
  },
  {
    number: "04",
    title: "Close Deals Together",
    description: "Agree on terms upfront, honor your commitments, and watch your global business grow.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 md:py-32 bg-navy relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-body text-sm text-gold uppercase tracking-widest mb-4 block">The Process</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[hsl(220,15%,90%)]">
            How It <span className="text-gold">Works</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              className="relative"
            >
              <span className="font-display text-6xl font-bold text-gold/10 absolute -top-4 -left-2">{step.number}</span>
              <div className="relative pt-8">
                <h3 className="font-display text-xl font-semibold text-[hsl(220,15%,85%)] mb-3">{step.title}</h3>
                <p className="font-body text-sm text-[hsl(220,10%,50%)] leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-px bg-gold/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
};

export default HowItWorksSection;
