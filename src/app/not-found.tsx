import Link from "next/link";
import { FontCycle } from "@/components/Type";

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-8 px-4 text-center">
      <FontCycle text="404" className="text-[32vw] leading-none text-ink" interval={120} chance={0.3} />
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-mute">This frame was never rendered.</p>
      <Link href="/" className="rounded-full bg-acid px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-void">
        Back to the start
      </Link>
    </section>
  );
}
