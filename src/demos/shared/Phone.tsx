export function Phone({ children, className = "", screen = "#0b0b0f" }: { children: React.ReactNode; className?: string; screen?: string }) {
  return (
    <div
      className={`relative aspect-[9/19] h-[88cqh] rounded-[5.5cqh] bg-[#1b1b20] p-[1cqh] shadow-[0_40px_80px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/10 ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[4.6cqh]" style={{ background: screen }}>
        {children}
      </div>
    </div>
  );
}
