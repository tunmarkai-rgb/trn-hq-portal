import { BookOpen, Video, FileText, Users, Globe, DollarSign, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    icon: DollarSign,
    title: "Referral Systems & Commission Mastery",
    desc: "Structure deals, protect yourself legally, and maximize referral income across borders.",
    color: "from-gold/20 to-gold/5",
  },
  {
    icon: Globe,
    title: "Cross-Border Deal Strategies",
    desc: "Navigate international transactions, multi-market collaborations, and compliance requirements.",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: Users,
    title: "Networking & Relationship Building",
    desc: "Master the soft skills that turn contacts into trusted, revenue-generating partners.",
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: BookOpen,
    title: "Real Estate Mastery & Deal Strategies",
    desc: "Learn from real deals, proven strategies, and battle-tested frameworks from top agents.",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: Video,
    title: "Private Masterminds Vault",
    desc: "Access recordings of past training sessions with industry experts and market leaders.",
    color: "from-pink-500/20 to-pink-500/5",
  },
  {
    icon: FileText,
    title: "Templates & Quick Start Guides",
    desc: "Ready-to-use templates, scripts, and checklists for connecting and collaborating globally.",
    color: "from-sky-500/20 to-sky-500/5",
  },
];

const partnerTools = [
  { name: "CRM Integration Guide", desc: "Connect your favorite CRM with TRN workflows" },
  { name: "International Wire Transfer Guide", desc: "Navigate cross-border payment processing" },
  { name: "Legal Referral Templates", desc: "Customizable agreements for international referrals" },
  { name: "Market Analysis Tools", desc: "Free and premium tools for market research" },
  { name: "Virtual Tour Software", desc: "Recommended platforms for remote property showings" },
  { name: "Translation Services", desc: "Verified services for multilingual transactions" },
];

const Resources = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Resources</h2>
        <p className="font-body text-sm text-muted-foreground">Tools, templates, and services for international real estate professionals</p>
      </div>

      {/* Training Categories */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Training Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border rounded-2xl p-6 hover:border-gold/20 transition-all duration-300 cursor-pointer group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
                <cat.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                {cat.title}
                <ArrowUpRight className="w-3.5 h-3.5 text-gold/0 group-hover:text-gold/60 transition-all" />
              </h3>
              <p className="font-body text-sm text-muted-foreground">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Partner Tools */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Tools & Partner Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {partnerTools.map((tool, i) => (
            <motion.div key={tool.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.04 }} className="bg-card border border-border rounded-xl p-4 hover:border-gold/20 transition-colors">
              <h4 className="font-body text-sm font-medium text-foreground">{tool.name}</h4>
              <p className="font-body text-xs text-muted-foreground mt-1">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
