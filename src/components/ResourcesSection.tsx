import { motion } from "framer-motion";
import { BookOpen, Video, FileText, DollarSign, Globe, Users } from "lucide-react";

const resources = [
  { icon: DollarSign, title: "Referral Systems & Commission Mastery", description: "Structure deals, protect yourself legally, and maximize referral income." },
  { icon: Globe, title: "Cross-Border Deal Strategies", description: "Navigate international transactions and multi-market collaborations." },
  { icon: Users, title: "Networking & Relationship Building", description: "Master the soft skills that turn cold contacts into trusted partners." },
  { icon: BookOpen, title: "Real Estate Mastery", description: "Learn from real deals, proven strategies, and battle-tested frameworks." },
  { icon: Video, title: "Private Masterminds Vault", description: "Access recordings of past training sessions with industry experts." },
  { icon: FileText, title: "Templates & Scripts", description: "Ready-to-use guides, scripts, and frameworks for every situation." },
];

const ResourcesSection = () => {
  return (
    <section id="resources" className="py-24 md:py-32 bg-background">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="font-body text-xs text-gold uppercase tracking-[0.4em] mb-6 block">Resources</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Training & <span className="text-gold italic">Resources</span>
          </h2>
          <div className="w-16 h-[1px] bg-gold/40 mx-auto mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="flex gap-4 p-7 rounded-2xl border border-border bg-card hover:border-gold/20 transition-all duration-300 hover:shadow-[0_8px_40px_hsl(var(--gold)/0.05)]"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <resource.icon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2">{resource.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
