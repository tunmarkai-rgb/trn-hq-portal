import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeading = ({ title, subtitle, className }: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn("flex items-start gap-3", className)}
    >
      <div className="w-[3px] h-5 bg-gold rounded-full mt-0.5 shrink-0" />
      <div>
        <h3 className="font-display text-base font-semibold text-foreground leading-tight">{title}</h3>
        {subtitle && (
          <p className="font-body text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

export default SectionHeading;
