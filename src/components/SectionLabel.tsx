/** Consistent numbered eyebrow for landing sections, e.g. "(02) Featured reel". */
export function SectionLabel({ n, children, tone = "text-mute" }: { n: number; children: React.ReactNode; tone?: string }) {
  return (
    <div className={`flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] sm:text-xs ${tone}`}>
      <span>({String(n).padStart(2, "0")})</span>
      <span className="h-px w-10 bg-current opacity-50" />
      <span>{children}</span>
    </div>
  );
}
