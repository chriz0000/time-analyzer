"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useCallback, Suspense } from "react";
import { analyzeProtocols, type QuizAnswers, type ScoredProtocol } from "@/lib/scoring";
import type { Goal, FitnessLevel } from "@/data/protocols";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();

  const answers: QuizAnswers = useMemo(
    () => ({
      timeAvailable: Number(searchParams.get("timeAvailable")) || 30,
      fitnessLevel: (searchParams.get("fitnessLevel") || "beginner") as FitnessLevel,
      budget: Number(searchParams.get("budget")) || 0,
      goal: (searchParams.get("goal") || "lifespan") as Goal,
      name: searchParams.get("name") || "",
      email: "",
    }),
    [searchParams]
  );

  const result = useMemo(() => analyzeProtocols(answers), [answers]);

  const goalLabels: Record<string, string> = {
    lifespan: "Longevity",
    energy: "Energy",
    sleep: "Sleep",
    body_composition: "Body Composition",
    mental_clarity: "Mental Clarity",
  };

  return (
    <div className="min-h-screen bg-primary text-secondary">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-[1080px] mx-auto">
        <Link href="/" className="text-xl font-bold text-accent tracking-tight">
          New Age Longevity
        </Link>
      </nav>

      {/* Hero Result */}
      <section className="max-w-[1080px] mx-auto px-6 pt-12 pb-8">
        <p className="font-mono text-sm font-medium uppercase tracking-[3px] text-accent mb-4">
          Your Personalized Protocol
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight mb-4">
          {answers.name ? `${answers.name}, here's` : "Here's"} your optimized routine
        </h1>
        <p className="text-dim max-w-xl mb-8">
          Based on your {answers.timeAvailable}-minute daily window, {goalLabels[answers.goal]?.toLowerCase()} goal,
          and {answers.budget === 0 ? "free" : `$${answers.budget}/mo`} budget — these are your highest-impact interventions.
        </p>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-card rounded-2xl p-5 border border-border">
            <p className="font-mono text-2xl font-bold text-accent">
              {result.totalTimeUsed} min
            </p>
            <p className="text-xs text-dim uppercase tracking-wider mt-1">Daily Time</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border">
            <p className="font-mono text-2xl font-bold text-accent">
              {result.totalMonthlyCost === 0 ? "$0" : `$${result.totalMonthlyCost}`}
            </p>
            <p className="text-xs text-dim uppercase tracking-wider mt-1">Monthly Cost</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border">
            <p className="font-mono text-2xl font-bold text-accent">
              {result.protocols.length}
            </p>
            <p className="text-xs text-dim uppercase tracking-wider mt-1">Protocols</p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Daily Schedule */}
      <section className="max-w-[1080px] mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-secondary tracking-tight mb-8">
          Your Daily Schedule
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <ScheduleBlock title="Morning" protocols={result.schedule.morning} />
          <ScheduleBlock title="Afternoon" protocols={result.schedule.afternoon} />
          <ScheduleBlock title="Evening" protocols={result.schedule.evening} />
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Protocol Cards */}
      <section className="max-w-[1080px] mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-secondary tracking-tight mb-8">
          Your Top Protocols — In Detail
        </h2>

        <div className="grid gap-4">
          {result.protocols.map((protocol, i) => (
            <ProtocolCard key={protocol.id} protocol={protocol} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* What's Next */}
      <section className="bg-card border-y border-border">
        <div className="max-w-[1080px] mx-auto px-6 py-16 md:py-20">
          <div className="max-w-xl">
            <p className="font-mono text-sm font-medium uppercase tracking-[3px] text-accent mb-4">
              What&apos;s Next
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight mb-4">
              Start Today. Optimize Over Time.
            </h2>
            <p className="text-dim mb-8 leading-relaxed">
              Your protocol is ready. Implement one habit at a time — don&apos;t try to do everything
              at once. Follow us for daily science-backed tips, myth-busting threads, and
              protocol deep dives.
            </p>
            <div className="grid gap-3 mb-8">
              {[
                { platform: "X / Twitter", handle: "@NewAgeLongevity", href: "https://x.com/NewAgeLongevity", desc: "Daily threads & study breakdowns" },
                { platform: "Instagram", handle: "@NewAgeLongevity", href: "https://instagram.com/NewAgeLongevity", desc: "Carousels, reels & protocol guides" },
                { platform: "TikTok", handle: "@NewAgeLongevity", href: "https://tiktok.com/@NewAgeLongevity", desc: "Quick tips & myth busting" },
              ].map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-5 py-4 rounded-xl border border-border bg-primary hover:border-accent/30 transition-colors group"
                >
                  <div>
                    <span className="block font-semibold text-secondary text-sm group-hover:text-accent transition-colors">
                      {social.platform}
                    </span>
                    <span className="block text-xs text-dim mt-0.5">{social.desc}</span>
                  </div>
                  <span className="font-mono text-xs text-dim group-hover:text-accent transition-colors">
                    {social.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Share */}
      <ShareSection />

      {/* Footer */}
      <footer className="max-w-[1080px] mx-auto px-6 py-12">
        <div className="h-px bg-border mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold text-accent tracking-tight">New Age Longevity</span>
          <p className="text-xs text-dim">
            For educational purposes only. Not medical advice. Always consult a healthcare provider.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ScheduleBlock({
  title,
  protocols,
}: {
  title: string;
  protocols: ScoredProtocol[];
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="font-mono font-medium text-accent text-xs uppercase tracking-[3px] mb-4">
        {title}
      </h3>
      {protocols.length === 0 ? (
        <p className="text-xs text-dim/40">No protocols scheduled</p>
      ) : (
        <ul className="space-y-3">
          {protocols.map((p) => (
            <li key={p.id} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-secondary">{p.name}</p>
                <p className="text-xs text-dim">
                  {p.timeRequired > 0 ? `${p.timeRequired} min` : "No extra time"}{" "}
                  {p.costPerMonth > 0 ? `· $${p.costPerMonth}/mo` : "· Free"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProtocolCard({
  protocol,
  rank,
}: {
  protocol: ScoredProtocol;
  rank: number;
}) {
  const evidenceLabel =
    protocol.evidenceStrength >= 9
      ? "Strong"
      : protocol.evidenceStrength >= 7
        ? "Moderate"
        : "Emerging";

  const evidenceColor =
    protocol.evidenceStrength >= 9
      ? "text-accent bg-accent/10"
      : protocol.evidenceStrength >= 7
        ? "text-neutral bg-neutral/10"
        : "text-dim bg-dim/10";

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-4">
          <span className="font-mono text-2xl font-bold text-accent/30">
            {String(rank).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-semibold text-secondary">{protocol.name}</h3>
            <p className="text-xs text-dim mt-0.5">
              {protocol.category}{" "}
              {protocol.timeRequired > 0 ? `· ${protocol.timeRequired} min/day` : ""}{" "}
              {protocol.costPerMonth > 0 ? `· $${protocol.costPerMonth}/mo` : "· Free"}
            </p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${evidenceColor}`}>
          {evidenceLabel}
        </span>
      </div>

      <p className="text-sm text-dim leading-relaxed mb-4">
        {protocol.description}
      </p>

      {/* Outcomes */}
      <div className="flex flex-wrap gap-2 mb-3">
        {protocol.outcomes.map((outcome) => (
          <span
            key={outcome}
            className="text-xs bg-border text-dim px-2.5 py-1 rounded-full"
          >
            {outcome}
          </span>
        ))}
      </div>

      {/* Match reasons */}
      {protocol.matchReasons.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {protocol.matchReasons.map((reason) => (
            <span key={reason} className="text-xs text-accent font-medium">
              &#10003; {reason}
            </span>
          ))}
        </div>
      )}

      {/* Citation */}
      <p className="font-mono text-[10px] text-dim/40 mt-3">{protocol.citation}</p>
    </div>
  );
}

function ShareSection() {
  const [copied, setCopied] = useState(false);
  const siteUrl = "https://newage-longevity.vercel.app";

  const handleShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "New Age Longevity — Time Analyzer",
          text: "Get your free personalized longevity protocol in 2 minutes.",
          url: siteUrl,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }, []);

  return (
    <section className="max-w-[1080px] mx-auto px-6 py-12 text-center">
      <p className="text-dim text-sm mb-2">
        Know someone who could use a personalized longevity protocol?
      </p>
      <p className="text-dim/40 text-xs mb-5">It&apos;s free. It takes 2 minutes. Send them the link.</p>
      <button
        onClick={handleShare}
        className="inline-block border-2 border-accent text-accent hover:bg-accent hover:text-primary font-bold text-sm px-8 py-3 rounded-2xl transition-colors tracking-tight"
      >
        {copied ? "Link Copied!" : "Share the Quiz"}
      </button>
    </section>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-primary flex items-center justify-center">
          <p className="text-dim text-xl">Analyzing your protocol...</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
