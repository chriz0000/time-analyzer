import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Prova by New Age Longevity",
  description:
    "Privacy Policy for Prova, the AI-powered health and longevity budget optimizer by New Age Longevity.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-primary text-secondary">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-[1080px] mx-auto">
        <span className="text-xl font-bold text-accent tracking-tight">
          New Age Longevity
        </span>
        <Link
          href="/"
          className="text-sm font-medium text-dim hover:text-accent transition-colors tracking-wide"
        >
          &larr; Back to Home
        </Link>
      </nav>

      {/* Header */}
      <section className="max-w-[1080px] mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <p className="font-mono text-sm font-medium uppercase tracking-[3px] text-accent mb-6">
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-secondary leading-tight tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-dim text-lg leading-relaxed max-w-2xl">
          Prova by New Age Longevity &mdash; how we collect, use, and protect
          your information.
        </p>
        <p className="text-dim text-sm mt-4">
          Last updated: February 2026
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Policy Content */}
      <section className="max-w-[1080px] mx-auto px-6 py-16 md:py-20">
        <div className="max-w-3xl space-y-16">
          {/* 1. Introduction */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-2">01.</span>
              Introduction
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              Welcome to <strong className="text-secondary">Prova</strong>,
              a health and longevity budget optimization app developed and
              operated by New Age Longevity (&ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;). Prova uses artificial
              intelligence to help you make informed decisions about your health
              and longevity investments.
            </p>
            <p className="text-dim leading-relaxed">
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use the Prova mobile
              application and associated web services (collectively, the
              &ldquo;Service&rdquo;). Please read this policy carefully. By
              accessing or using the Service, you acknowledge that you have
              read, understood, and agree to be bound by the terms of this
              Privacy Policy.
            </p>
          </div>

          {/* 2. Information We Collect */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-2">02.</span>
              Information We Collect
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              We collect information that you provide directly to us when you
              create an account and use the Service. This may include:
            </p>
            <ul className="space-y-3 text-dim leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  <strong className="text-secondary">Account information</strong>{" "}
                  &mdash; your email address and name, collected during
                  registration.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  <strong className="text-secondary">Health goals</strong>{" "}
                  &mdash; your stated health and longevity objectives (e.g.,
                  improved sleep, cardiovascular health, cognitive performance).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  <strong className="text-secondary">Budget preferences</strong>{" "}
                  &mdash; your monthly or annual budget range for health
                  investments.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  <strong className="text-secondary">Age range</strong>{" "}
                  &mdash; your approximate age bracket, used to tailor
                  recommendations.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  <strong className="text-secondary">Current spending habits</strong>{" "}
                  &mdash; information about your existing health and wellness
                  spending, used to optimize recommendations around your
                  current investments.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  <strong className="text-secondary">Analysis results</strong>{" "}
                  &mdash; the personalized recommendations and rankings
                  generated by our AI-powered analysis.
                </span>
              </li>
            </ul>
          </div>

          {/* 3. How We Use Your Information */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-2">03.</span>
              How We Use Your Information
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="space-y-3 text-dim leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  To provide personalized, AI-powered health budget analysis and
                  longevity investment recommendations tailored to your goals,
                  budget, and age range.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  To create, maintain, and secure your account.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  To improve, develop, and optimize the Service, including the
                  accuracy and relevance of our recommendations.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  To communicate with you about your account, updates to the
                  Service, and (with your consent) promotional content.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  To comply with legal obligations and enforce our terms of
                  service.
                </span>
              </li>
            </ul>
          </div>

          {/* 4. AI Processing */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-2">04.</span>
              AI Processing
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              Prova uses Anthropic&apos;s Claude AI to generate personalized
              health and longevity investment recommendations. When you request
              an analysis, your inputs &mdash; including your health goals,
              budget preferences, and age range &mdash; are sent to
              Anthropic&apos;s Claude API for processing.
            </p>
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-secondary font-semibold mb-2">
                Important:
              </p>
              <p className="text-dim leading-relaxed">
                Your health data is <strong className="text-secondary">not</strong>{" "}
                used to train AI models. Anthropic&apos;s API processes your
                inputs solely to generate your personalized recommendations and
                does not retain your data for model training purposes. For more
                information, please refer to{" "}
                <a
                  href="https://www.anthropic.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover transition-colors underline underline-offset-2"
                >
                  Anthropic&apos;s Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>

          {/* 5. Data Storage */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-2">05.</span>
              Data Storage
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              Your data is stored securely using{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover transition-colors underline underline-offset-2"
              >
                Supabase
              </a>
              , a cloud database platform hosted on Amazon Web Services (AWS)
              infrastructure. Supabase provides enterprise-grade security
              including encryption at rest and in transit.
            </p>
            <p className="text-dim leading-relaxed">
              Analysis results generated by our AI are saved to your account so
              you can revisit your recommendations at any time. All data
              transmission between your device and our servers is encrypted
              using industry-standard TLS protocols.
            </p>
          </div>

          {/* 6. Third-Party Services */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-2">06.</span>
              Third-Party Services
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              We integrate with the following third-party services to operate
              the Service. Each provider has its own privacy policy governing
              the data they process:
            </p>
            <div className="space-y-4">
              {[
                {
                  name: "Supabase",
                  role: "Authentication and database hosting. Manages your account credentials and stores your data securely.",
                },
                {
                  name: "Anthropic",
                  role: "AI-powered analysis. Processes your inputs via the Claude API to generate personalized health investment recommendations.",
                },
{
                  name: "ConvertKit",
                  role: "Email communications. If you opt in to receive emails, your email address is shared with ConvertKit to deliver newsletters and updates.",
                },
                {
                  name: "Affiliate Partners",
                  role: "Product recommendations. If you click on \"buy\" links within the app, you may be directed to third-party retailer websites. These partners may collect data in accordance with their own privacy policies.",
                },
              ].map((service) => (
                <div
                  key={service.name}
                  className="bg-card border border-border rounded-xl px-5 py-4"
                >
                  <p className="text-secondary font-semibold text-sm mb-1">
                    {service.name}
                  </p>
                  <p className="text-dim text-sm leading-relaxed">
                    {service.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Your Rights */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-2">07.</span>
              Your Rights
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="space-y-3 text-dim leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  <strong className="text-secondary">Access</strong> &mdash;
                  You may request a copy of the personal data we hold about you.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  <strong className="text-secondary">Deletion</strong> &mdash;
                  You may request that we delete your account and all associated
                  personal data.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9654;</span>
                <span>
                  <strong className="text-secondary">Export</strong> &mdash;
                  You may request a portable copy of your data in a
                  machine-readable format.
                </span>
              </li>
            </ul>
            <p className="text-dim leading-relaxed mt-4">
              To exercise any of these rights, please contact us at{" "}
              <a
                href="mailto:support@newage-longevity.com"
                className="text-accent hover:text-accent-hover transition-colors underline underline-offset-2"
              >
                support@newage-longevity.com
              </a>
              . We will respond to your request within 30 days.
            </p>
          </div>

          {/* 8. Data Retention */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-2">08.</span>
              Data Retention
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              We retain your personal information for as long as your account
              remains active and as needed to provide you with the Service. If
              you wish to have your data deleted, you may request account
              deletion at any time by contacting us at{" "}
              <a
                href="mailto:support@newage-longevity.com"
                className="text-accent hover:text-accent-hover transition-colors underline underline-offset-2"
              >
                support@newage-longevity.com
              </a>
              .
            </p>
            <p className="text-dim leading-relaxed">
              Upon receiving a deletion request, we will remove your personal
              data from our active systems within 30 days. Some data may be
              retained in encrypted backups for a limited period as required by
              law or for legitimate business purposes, after which it will be
              permanently deleted.
            </p>
          </div>

          {/* 10. Children */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-2">09.</span>
              Children&apos;s Privacy
            </h2>
            <p className="text-dim leading-relaxed">
              The Service is not intended for individuals under the age of 18.
              We do not knowingly collect personal information from children
              under 13, in compliance with the Children&apos;s Online Privacy
              Protection Act (COPPA). If we become aware that we have
              collected personal data from a child under 13, we will take
              steps to delete that information promptly. If you believe that
              a child under 13 has provided us with personal information,
              please contact us at{" "}
              <a
                href="mailto:support@newage-longevity.com"
                className="text-accent hover:text-accent-hover transition-colors underline underline-offset-2"
              >
                support@newage-longevity.com
              </a>
              .
            </p>
          </div>

          {/* 11. Changes */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-2">10.</span>
              Changes to This Policy
            </h2>
            <p className="text-dim leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, technology, legal requirements, or other
              factors. When we make material changes, we will notify you by
              updating the &ldquo;Last updated&rdquo; date at the top of this
              page and, where appropriate, providing additional notice through
              the app or via email. We encourage you to review this Privacy
              Policy periodically to stay informed about how we are protecting
              your information.
            </p>
          </div>

          {/* 12. Contact */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-2">11.</span>
              Contact Us
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-secondary font-semibold mb-1">
                New Age Longevity
              </p>
              <p className="text-dim leading-relaxed">
                Email:{" "}
                <a
                  href="mailto:support@newage-longevity.com"
                  className="text-accent hover:text-accent-hover transition-colors underline underline-offset-2"
                >
                  support@newage-longevity.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-[1080px] mx-auto px-6 py-12">
        <div className="h-px bg-border mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold text-accent tracking-tight">
            New Age Longevity
          </span>
          <p className="text-xs text-dim">
            For educational purposes only. Not medical advice. Always consult a
            healthcare provider.
          </p>
        </div>
      </footer>
    </div>
  );
}
