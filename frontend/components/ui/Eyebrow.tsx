interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export default function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <p className={`text-[10px] tracking-[0.3em] uppercase text-gold mb-3 ${className}`}>
      {children}
    </p>
  );
}
