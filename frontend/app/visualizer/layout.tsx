export default function VisualizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-parchment">
      <main>{children}</main>
    </div>
  );
}
