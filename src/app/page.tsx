import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-primary text-secondary">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-[1080px] mx-auto">
        <span className="text-xl font-bold text-accent tracking-tight">
          New Age Longevity
        </span>
        <Link
          href="/quiz"
          className="text-sm font-medium text-dim hover:text-accent transition-colors tracking-wide"
        >
          Take the Quiz
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-[1080px] mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-36">
        <div className="max-w-2xl">
          <p className="font-mono text-sm font-medium uppercase tracking-[3px] text-accent mb-6">
            Free Longevity Assessment
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-secondary leading-tight tracking-tight mb-6">
            How Much Time Do You{" "}
            <span className="text-accent">Actually</span> Need for Longevity?
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-xl mb-10">
            Most people think healthy aging requires hours of daily effort. The science
            says otherwise. Discover your personalized protocol in 2 minutes — matched
            to the time you actually have.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-primary font-bold text-sm px-8 py-4 rounded-2xl transition-colors tracking-tight"
          >
            Find Your Protocol
            <span className="text-lg">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Problem / Solution */}
      <section className="max-w-[1080px] mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-secondary tracking-tight mb-6">
              The Problem
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              The longevity space is overwhelming. Hundreds of protocols, conflicting
              advice, and expensive interventions that assume unlimited time and money.
            </p>
            <p className="text-dim leading-relaxed">
              You know health matters, but between work, family, and life — you need
              something that fits <em className="text-secondary">your</em> schedule, not a biohacker&apos;s.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-secondary tracking-tight mb-6">
              The Solution
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              We cross-referenced 2,400+ peer-reviewed studies to find what actually
              moves the needle — then built an algorithm that matches protocols to your
              available time.
            </p>
            <p className="text-dim leading-relaxed">
              Whether you have 5 minutes or 2 hours, you&apos;ll get a science-backed
              daily routine with the highest return on your time investment.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* How It Works */}
      <section className="max-w-[1080px] mx-auto px-6 py-20 md:py-28">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center tracking-tight mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "Answer 5 Questions",
              desc: "Tell us your available time, fitness level, budget, and primary health goal.",
            },
            {
              step: "02",
              title: "Get Matched",
              desc: "Our algorithm scores 20+ evidence-based protocols against your constraints.",
            },
            {
              step: "03",
              title: "Start Your Protocol",
              desc: "Receive a personalized daily schedule with your top 5 interventions.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center md:text-left">
              <span className="inline-block font-mono text-5xl font-bold text-accent mb-4">
                {item.step}
              </span>
              <h3 className="text-lg font-semibold text-secondary mb-3">
                {item.title}
              </h3>
              <p className="text-dim leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-primary font-bold text-sm px-8 py-4 rounded-2xl transition-colors tracking-tight"
          >
            Take the Free Quiz
            <span className="text-lg">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-card">
        <div className="max-w-[1080px] mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-mono text-4xl font-bold text-accent mb-2">2,400+</p>
              <p className="text-sm text-dim uppercase tracking-wider">Studies Referenced</p>
            </div>
            <div>
              <p className="font-mono text-4xl font-bold text-accent mb-2">20</p>
              <p className="text-sm text-dim uppercase tracking-wider">Evidence-Based Protocols</p>
            </div>
            <div>
              <p className="font-mono text-4xl font-bold text-accent mb-2">2 min</p>
              <p className="text-sm text-dim uppercase tracking-wider">To Get Your Results</p>
            </div>
          </div>
        </div>
      </section>

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
