interface SectionRuleProps {
  className?: string;
}

export default function SectionRule({ className = "" }: SectionRuleProps) {
  return <div className={`rule-gold ${className}`} />;
}
