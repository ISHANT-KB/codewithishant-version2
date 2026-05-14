interface SectionDividerProps {
  className?: string;
}

export default function SectionDivider({ className = "" }: SectionDividerProps) {
  return <div className={`rule-gold ${className}`} />;
}
