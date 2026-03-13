import { motion } from "framer-motion";
import { Globe, Send, BookOpen, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Connections",
    description: "Agents in every major market and niche, ready to collaborate across borders.",
  },
  {
    icon: Send,
    title: "Referral Exchange",
    description: "Send your clients to trusted partners. Receive referrals in your market.",
  },
  {
    icon: BookOpen,
    title: "Training & Resources",
    description: "Templates, scripts, masterminds, and strategies that actually work.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Integrity",
    description: "Every member upholds strict professional standards. Zero tolerance for violations.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="font-body text-sm text-gold uppercase tracking-widest mb-4 block">What We Do</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            A Referral Network Built on <span className="text-gold">Real Relationships</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground leading-relaxed">
            Real estate at its best isn't about beating the competition. It's about building 
            a network that multiplies your reach, your reputation, and your results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-8 rounded-xl border border-border bg-card hover:border-gold/30 transition-all duration-300 hover:shadow-[0_8px_30px_hsl(var(--gold)/0.08)]"
            >
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                <feature.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
