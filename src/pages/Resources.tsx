import { BookOpen, Video, FileText, Users, Globe, DollarSign } from "lucide-react";

const categories = [
  {
    icon: DollarSign,
    title: "Referral Systems & Commission Mastery",
    desc: "Structure deals, protect yourself legally, and maximize referral income.",
  },
  {
    icon: Globe,
    title: "Cross-Border Deal Strategies",
    desc: "Navigate international transactions and multi-market collaborations.",
  },
  {
    icon: Users,
    title: "Networking & Relationship Building",
    desc: "Master the soft skills that turn contacts into trusted partners.",
  },
  {
    icon: BookOpen,
    title: "Real Estate Mastery & Deal Strategies",
    desc: "Learn from real deals, proven strategies, and battle-tested frameworks.",
  },
  {
    icon: Video,
    title: "Private Masterminds Vault",
    desc: "Access recordings of past training sessions with industry experts.",
  },
  {
    icon: FileText,
    title: "Templates & Quick Start Guides",
    desc: "Ready-to-use templates and scripts for connecting and collaborating.",
  },
];

const Resources = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[hsl(220,15%,90%)]">Training & Resources</h2>
        <p className="font-body text-sm text-[hsl(220,10%,50%)]">
          Everything you need to grow your network and close more deals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.title} className="bg-[hsl(220,25%,10%)] border border-[hsl(220,20%,18%)] rounded-xl p-6 hover:border-gold/30 transition-colors cursor-pointer">
            <cat.icon className="w-6 h-6 text-gold mb-3" />
            <h3 className="font-display text-base font-semibold text-[hsl(220,15%,85%)] mb-1">{cat.title}</h3>
            <p className="font-body text-sm text-[hsl(220,10%,50%)]">{cat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
