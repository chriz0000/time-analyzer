"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ConfirmedPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("error=")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const desc = params.get("error_description");
      if (desc) setError(desc);
    }
  }, []);

  return (
    <div className="min-h-screen bg-primary text-secondary">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-[1080px] mx-auto">
        <Link href="/" className="text-xl font-bold text-accent tracking-tight">
          New Age Longevity
        </Link>
      </nav>

      {/* Content */}
      <section className="max-w-[1080px] mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-36">
        <div className="max-w-lg mx-auto text-center">
          {error ? (
            <>
              <div className="w-20 h-20 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-8">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>

              <p className="font-mono text-sm font-medium uppercase tracking-[3px] text-red-400 mb-6">
                Link Expired
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-secondary leading-tight tracking-tight mb-4">
                Confirmation Failed
              </h1>
              <p className="text-lg text-dim leading-relaxed mb-10">
                This confirmation link has expired or is invalid. Open the Prova app and sign up again to receive a new link.
              </p>

              <div className="flex flex-col items-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-primary font-bold text-sm px-8 py-4 rounded-2xl transition-colors tracking-tight"
                >
                  Visit New Age Longevity
                  <span className="text-lg">&rarr;</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-8">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00E5A0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <p className="font-mono text-sm font-medium uppercase tracking-[3px] text-accent mb-6">
                Verified
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-secondary leading-tight tracking-tight mb-4">
                Email Confirmed
              </h1>
              <p className="text-lg text-dim leading-relaxed mb-10">
                Your account is verified. Open the Prova app and log in to get your personalized longevity protocol.
              </p>

              <div className="flex flex-col items-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-primary font-bold text-sm px-8 py-4 rounded-2xl transition-colors tracking-tight"
                >
                  Visit New Age Longevity
                  <span className="text-lg">&rarr;</span>
                </Link>
                <p className="text-sm text-dim">
                  You can close this page and return to the app.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
