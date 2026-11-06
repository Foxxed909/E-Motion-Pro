"use client";

export type MockPageData = { name: string; bg: string; fg: string; title: string; font: string; accent: string };

export const MOCK_PAGES: MockPageData[] = [
  { name: "Home", bg: "#0e0e12", fg: "#f3efe7", title: "Studio Nº7", font: "orbit", accent: "#d4ff3a" },
  { name: "Work", bg: "#ff4f2e", fg: "#120a08", title: "Selected Work", font: "monolith", accent: "#120a08" },
  { name: "About", bg: "#e9e5dd", fg: "#14141a", title: "Quiet Craft", font: "opera", accent: "#7a5cff" },
  { name: "Lab", bg: "#7a5cff", fg: "#f3efe7", title: "Night Lab", font: "neon", accent: "#33e1ff" },
  { name: "Contact", bg: "#d4ff3a", fg: "#0b0b0b", title: "Say Hello", font: "bubblegum", accent: "#0b0b0b" },
];

/** A tiny fake website used as the subject of transition demos. */
export function MockPage({ page }: { page: MockPageData }) {
  return (
    <div className="absolute inset-0 flex flex-col p-[4cqw]" style={{ background: page.bg, color: page.fg }}>
      <div className="flex items-center justify-between font-mono text-[max(9px,1.2cqw)] uppercase tracking-[0.2em]">
        <span className="font-orbit text-[max(11px,1.8cqw)] tracking-normal">◐ nº7</span>
        <div className="hidden gap-[2cqw] sm:flex">
          {MOCK_PAGES.map((p) => (
            <span key={p.name} style={{ opacity: p.name === page.name ? 1 : 0.45 }}>
              {p.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <div className="font-mono text-[max(9px,1.2cqw)] uppercase tracking-[0.3em] opacity-60">( {page.name} )</div>
        <div className={`font-${page.font} mt-[1cqh] uppercase`} style={{ fontSize: "min(10cqw, 20cqh)", lineHeight: 0.95 }}>
          {page.title}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[1.5cqw]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[14cqh] rounded-[1cqw]" style={{ background: i === 1 ? page.accent : "currentColor", opacity: i === 1 ? 0.9 : 0.1 }} />
        ))}
      </div>
    </div>
  );
}
