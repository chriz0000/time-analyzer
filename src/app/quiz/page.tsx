"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Step = 1 | 2 | 3 | 4 | 5;

interface Answers {
  timeAvailable: number;
  fitnessLevel: string;
  budget: number;
  goal: string;
  name: string;
  email: string;
}

const timeOptions = [
  { value: 5, label: "5 minutes", desc: "Just the essentials" },
  { value: 15, label: "15 minutes", desc: "Quick but effective" },
  { value: 30, label: "30 minutes", desc: "Solid foundation" },
  { value: 60, label: "1 hour", desc: "Comprehensive routine" },
  { value: 120, label: "2+ hours", desc: "Full optimization" },
];

const fitnessOptions = [
  { value: "beginner", label: "Beginner", desc: "New to health routines or getting back into it" },
  { value: "intermediate", label: "Intermediate", desc: "Regular exercise, some health habits in place" },
  { value: "advanced", label: "Advanced", desc: "Consistent training, tracking biomarkers" },
];

const budgetOptions = [
  { value: 0, label: "$0", desc: "Free protocols only" },
  { value: 50, label: "Under $50/mo", desc: "Basic supplements + tools" },
  { value: 200, label: "$50 — $200/mo", desc: "Supplements, testing, services" },
  { value: 500, label: "$200+/mo", desc: "Full optimization stack" },
];

const goalOptions = [
  { value: "lifespan", label: "Longevity", desc: "Add years to your life" },
  { value: "energy", label: "Energy", desc: "More vitality, less fatigue" },
  { value: "sleep", label: "Sleep", desc: "Better rest, faster recovery" },
  { value: "body_composition", label: "Body Composition", desc: "Build muscle, reduce fat" },
  { value: "mental_clarity", label: "Mental Clarity", desc: "Focus, mood, cognitive function" },
];

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Answers>({
    timeAvailable: 0,
    fitnessLevel: "",
    budget: -1,
    goal: "",
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 1: return answers.timeAvailable > 0;
      case 2: return answers.fitnessLevel !== "";
      case 3: return answers.budget >= 0;
      case 4: return answers.goal !== "";
      case 5: return answers.email.includes("@") && answers.name.trim().length > 0;
    }
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep((s) => (s + 1) as Step);
    } else {
      setLoading(true);
      try {
        await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answers),
        });

        const params = new URLSearchParams({
          timeAvailable: String(answers.timeAvailable),
          fitnessLevel: answers.fitnessLevel,
          budget: String(answers.budget),
          goal: answers.goal,
          name: answers.name,
        });
        router.push(`/results?${params.toString()}`);
      } catch {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  return (
    <div className="min-h-screen bg-primary text-secondary flex flex-col">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-[1080px] mx-auto w-full">
        <span className="text-xl font-bold text-accent tracking-tight">
          New Age Longevity
        </span>
        <span className="font-mono text-sm text-dim">
          {step} / 5
        </span>
      </nav>

      {/* Progress Bar */}
      <div className="max-w-[1080px] mx-auto w-full px-6">
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Quiz Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <StepLayout
                  title="How much time can you dedicate to your health each day?"
                  subtitle="Be honest — we'll optimize for what actually fits your life."
                >
                  <div className="grid gap-3">
                    {timeOptions.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        selected={answers.timeAvailable === opt.value}
                        onClick={() => setAnswers({ ...answers, timeAvailable: opt.value })}
                        label={opt.label}
                        desc={opt.desc}
                      />
                    ))}
                  </div>
                </StepLayout>
              )}

              {step === 2 && (
                <StepLayout
                  title="What's your current fitness level?"
                  subtitle="This helps us match protocol difficulty to where you are now."
                >
                  <div className="grid gap-3">
                    {fitnessOptions.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        selected={answers.fitnessLevel === opt.value}
                        onClick={() => setAnswers({ ...answers, fitnessLevel: opt.value })}
                        label={opt.label}
                        desc={opt.desc}
                      />
                    ))}
                  </div>
                </StepLayout>
              )}

              {step === 3 && (
                <StepLayout
                  title="What's your monthly health budget?"
                  subtitle="Many of the best protocols are free. We'll start there."
                >
                  <div className="grid gap-3">
                    {budgetOptions.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        selected={answers.budget === opt.value}
                        onClick={() => setAnswers({ ...answers, budget: opt.value })}
                        label={opt.label}
                        desc={opt.desc}
                      />
                    ))}
                  </div>
                </StepLayout>
              )}

              {step === 4 && (
                <StepLayout
                  title="What's your primary health goal?"
                  subtitle="We'll weight your protocol recommendations toward this goal."
                >
                  <div className="grid gap-3">
                    {goalOptions.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        selected={answers.goal === opt.value}
                        onClick={() => setAnswers({ ...answers, goal: opt.value })}
                        label={opt.label}
                        desc={opt.desc}
                      />
                    ))}
                  </div>
                </StepLayout>
              )}

              {step === 5 && (
                <StepLayout
                  title="One last thing before your results."
                  subtitle="Join 2,400+ people getting weekly longevity insights backed by science, not hype."
                >
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dim mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={answers.name}
                        onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                        placeholder="Your first name"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-card text-secondary placeholder:text-dim/40 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dim mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={answers.email}
                        onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-card text-secondary placeholder:text-dim/40 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                      />
                    </div>
                    <p className="text-xs text-dim/60 leading-relaxed">
                      We respect your inbox. Unsubscribe anytime. No spam, ever.
                    </p>
                  </div>
                </StepLayout>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="text-sm font-medium text-dim hover:text-secondary transition-colors disabled:opacity-0"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-primary font-bold text-sm px-8 py-3 rounded-2xl transition-colors tracking-tight"
            >
              {loading ? "Analyzing..." : step === 5 ? "See My Protocol" : "Continue"}
              {!loading && <span>&rarr;</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-secondary tracking-tight mb-2">
        {title}
      </h2>
      <p className="text-sm text-dim mb-8">{subtitle}</p>
      {children}
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  label,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
        selected
          ? "border-accent bg-accent/5"
          : "border-border bg-card hover:border-dim/30"
      }`}
    >
      <span className="block font-semibold text-secondary text-sm">
        {label}
      </span>
      <span className="block text-xs text-dim mt-0.5">{desc}</span>
    </button>
  );
}
