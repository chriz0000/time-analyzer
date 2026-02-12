import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Prova by New Age Longevity",
  description:
    "Terms of Service for Prova, the AI-powered health and longevity budget optimizer by New Age Longevity.",
};

export default function TermsOfService() {
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
      <section className="max-w-[1080px] mx-auto px-6 pt-16 pb-12">
        <p className="font-mono text-sm font-medium uppercase tracking-[3px] text-accent mb-4">
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-secondary leading-tight tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-dim text-sm">
          Last updated: February 2026
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Content */}
      <section className="max-w-[1080px] mx-auto px-6 py-16">
        <div className="max-w-3xl space-y-14">
          {/* 1. Introduction */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">01.</span>
              Introduction
            </h2>
            <p className="text-dim leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) govern your access to and
              use of Prova (&quot;the App&quot;), a product of New Age Longevity
              (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). Prova is an
              AI-powered health and longevity budget optimization tool that helps
              users evaluate and prioritize health investments based on scientific
              evidence. By accessing or using Prova, you agree to be bound by these
              Terms. If you do not agree, do not use the App.
            </p>
          </div>

          {/* 2. Acceptance of Terms */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">02.</span>
              Acceptance of Terms
            </h2>
            <p className="text-dim leading-relaxed">
              By creating an account, accessing, or using Prova in any manner, you
              acknowledge that you have read, understood, and agree to be bound by
              these Terms, as well as our Privacy Policy. Your continued use of the
              App constitutes ongoing acceptance of these Terms and any updates
              thereto. If you are using Prova on behalf of an organization, you
              represent and warrant that you have the authority to bind that
              organization to these Terms.
            </p>
          </div>

          {/* 3. Description of Service */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">03.</span>
              Description of Service
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              Prova is an AI-powered health and longevity budget optimization
              platform. The App uses artificial intelligence, including Claude by
              Anthropic, to analyze and rank health investments by their scientific
              return on investment. Our service includes, but is not limited to:
            </p>
            <ul className="space-y-2 text-dim leading-relaxed list-none">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Ranking supplements, equipment, protocols, and services by
                scientific evidence and cost-effectiveness
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Personalized budget allocation recommendations based on your health
                goals, constraints, and available resources
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Access to a curated database of health investments with supporting
                research references
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                AI-generated analysis of health protocols, supplements, and
                longevity interventions
              </li>
            </ul>
          </div>

          {/* 4. Medical Disclaimer */}
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-8">
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-amber-400 mr-3">04.</span>
              Medical Disclaimer
            </h2>
            <div className="space-y-4">
              <p className="text-secondary font-semibold leading-relaxed uppercase tracking-wide text-sm">
                Prova is for educational and informational purposes only. The App
                does not provide medical advice, diagnosis, or treatment.
              </p>
              <p className="text-dim leading-relaxed">
                The content, recommendations, and analyses provided by Prova,
                including all AI-generated outputs, are not intended to be a
                substitute for professional medical advice, diagnosis, or treatment.
                Always seek the advice of a qualified healthcare provider with any
                questions you may have regarding a medical condition, supplement
                regimen, health protocol, or wellness program.
              </p>
              <p className="text-dim leading-relaxed">
                Never disregard professional medical advice or delay in seeking it
                because of information you have received through Prova. If you think
                you may have a medical emergency, call your doctor or emergency
                services immediately.
              </p>
              <p className="text-dim leading-relaxed">
                Our recommendations are derived from published, peer-reviewed
                research; however, individual results may vary significantly.
                Factors including but not limited to genetics, pre-existing
                conditions, medications, and lifestyle can influence outcomes. New
                Age Longevity is not responsible for any health outcomes resulting
                from the use of information provided by the App.
              </p>
              <p className="text-dim leading-relaxed">
                You assume full responsibility for any decisions you make regarding
                your health based on information obtained through Prova. Always
                consult a qualified healthcare provider before starting any new
                supplement, protocol, or health program.
              </p>
            </div>
          </div>

          {/* 5. Accounts */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">05.</span>
              Accounts
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              To access certain features of Prova, you must create an account. When
              creating an account, you agree to the following:
            </p>
            <ul className="space-y-2 text-dim leading-relaxed list-none">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                You must be at least 18 years of age to create an account and use
                the App
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                You are responsible for maintaining the confidentiality and security
                of your account credentials
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                You are responsible for all activity that occurs under your account
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                You agree to provide accurate, current, and complete information
                during the registration process
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                You will receive one free analysis upon account creation;
                thereafter, a subscription is required for continued access to
                analysis features
              </li>
            </ul>
            <p className="text-dim leading-relaxed mt-4">
              You must notify us immediately of any unauthorized use of your
              account or any other breach of security.
            </p>
          </div>

          {/* 6. Subscriptions */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">06.</span>
              Subscriptions &amp; Billing
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              Prova offers a subscription plan at{" "}
              <span className="text-secondary font-semibold">$9.99 per month</span>,
              billed through the Apple App Store or Google Play Store. By
              subscribing, you agree to the following:
            </p>
            <ul className="space-y-2 text-dim leading-relaxed list-none">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                New subscribers are eligible for a 7-day free trial. You will not
                be charged during the trial period
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                After the trial period, your subscription will automatically renew
                at $9.99/month unless cancelled before the end of the current
                billing period
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                You may cancel your subscription at any time through your Apple App
                Store or Google Play Store account settings
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Refunds are handled by Apple or Google in accordance with their
                respective refund policies. New Age Longevity does not process
                refunds directly
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                We reserve the right to change subscription pricing with reasonable
                notice. Existing subscribers will be notified of any price changes
                before their next billing cycle
              </li>
            </ul>
          </div>

          {/* 7. Acceptable Use */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">07.</span>
              Acceptable Use
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              You agree to use Prova only for lawful purposes and in accordance
              with these Terms. You agree not to:
            </p>
            <ul className="space-y-2 text-dim leading-relaxed list-none">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Abuse, disrupt, or interfere with the operation of the App or its
                underlying infrastructure
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Reverse engineer, decompile, disassemble, or otherwise attempt to
                derive the source code of the App
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Scrape, harvest, or extract data from the App through automated
                means, including bots, crawlers, or similar tools
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Share your account credentials with third parties or allow others
                to access the App through your account
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Use the App or its content for commercial purposes, including
                reselling, republishing, or redistributing analyses, without prior
                written permission from New Age Longevity
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Use the App to generate or distribute misleading health claims or
                misinformation
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Attempt to circumvent any access controls, security measures, or
                usage limitations of the App
              </li>
            </ul>
          </div>

          {/* 8. Intellectual Property */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">08.</span>
              Intellectual Property
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              All content, features, and functionality of Prova, including but not
              limited to the health investment database, AI prompts, analysis
              algorithms, ranking methodologies, user interface design, text,
              graphics, logos, and analysis outputs, are the exclusive property of
              New Age Longevity and are protected by United States and international
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-dim leading-relaxed">
              You are granted a limited, non-exclusive, non-transferable,
              revocable license to access and use Prova for your personal,
              non-commercial use in accordance with these Terms. This license does
              not include the right to copy, modify, distribute, sell, or lease any
              part of the App or its content, nor to reverse engineer or attempt to
              extract the source code of the App.
            </p>
          </div>

          {/* 9. Affiliate Links */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">09.</span>
              Affiliate Links &amp; Commissions
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              Some product recommendations within Prova may include affiliate
              links. When you purchase a product through an affiliate link, New Age
              Longevity may earn a commission on the sale at no additional cost to
              you.
            </p>
            <p className="text-dim leading-relaxed">
              The presence of affiliate links does not affect our rankings or
              recommendations. All health investment rankings within Prova are
              determined solely by scientific evidence, cost-effectiveness analysis,
              and our proprietary ranking methodology. Affiliate relationships are
              never a factor in how investments are scored or presented to users.
            </p>
          </div>

          {/* 10. Limitation of Liability */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">10.</span>
              Limitation of Liability
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              Prova and all content, analyses, and recommendations are provided on
              an &quot;as is&quot; and &quot;as available&quot; basis without
              warranties of any kind, whether express or implied, including but not
              limited to implied warranties of merchantability, fitness for a
              particular purpose, and non-infringement.
            </p>
            <p className="text-dim leading-relaxed mb-4">
              To the fullest extent permitted by applicable law, New Age Longevity
              shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="space-y-2 text-dim leading-relaxed list-none">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Any health outcomes, adverse reactions, or medical complications
                arising from your use of information provided by the App
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Financial losses related to health investment decisions made based
                on App recommendations
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                The quality, safety, or efficacy of any third-party products,
                supplements, or services referenced within the App
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1.5 text-xs">&#9670;</span>
                Loss of data, unauthorized access, or service interruptions
              </li>
            </ul>
          </div>

          {/* 11. Termination */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">11.</span>
              Termination
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              We reserve the right to suspend or terminate your account and access
              to Prova, with or without notice, for conduct that we determine, in
              our sole discretion, violates these Terms, is harmful to other users,
              or is otherwise objectionable.
            </p>
            <p className="text-dim leading-relaxed">
              You may delete your account at any time through the App settings. Upon
              account deletion, your personal data will be handled in accordance
              with our Privacy Policy. Please note that cancelling your account does
              not automatically cancel an active subscription; you must cancel your
              subscription through the Apple App Store or Google Play Store
              separately.
            </p>
          </div>

          {/* 12. Changes to Terms */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">12.</span>
              Changes to These Terms
            </h2>
            <p className="text-dim leading-relaxed">
              New Age Longevity reserves the right to modify or replace these Terms
              at any time. If a revision is material, we will make reasonable
              efforts to provide at least 30 days&apos; notice before the new terms
              take effect. What constitutes a material change will be determined at
              our sole discretion. Your continued use of Prova after the effective
              date of any changes constitutes your acceptance of the revised Terms.
              These Terms were last updated in February 2026.
            </p>
          </div>

          {/* 13. Governing Law */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">13.</span>
              Governing Law
            </h2>
            <p className="text-dim leading-relaxed">
              These Terms shall be governed by and construed in accordance with the
              laws of the United States, without regard to its conflict of law
              provisions. Any disputes arising under or in connection with these
              Terms shall be subject to the exclusive jurisdiction of the courts
              located within the United States. You agree to submit to the personal
              jurisdiction of such courts.
            </p>
          </div>

          {/* 14. Contact */}
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight mb-4">
              <span className="font-mono text-accent mr-3">14.</span>
              Contact Us
            </h2>
            <p className="text-dim leading-relaxed mb-4">
              If you have any questions, concerns, or feedback regarding these Terms
              of Service, please contact us at:
            </p>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <p className="text-secondary font-semibold mb-1">
                New Age Longevity
              </p>
              <a
                href="mailto:support@newage-longevity.com"
                className="text-accent hover:text-accent-hover transition-colors font-medium"
              >
                support@newage-longevity.com
              </a>
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
