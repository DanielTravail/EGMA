function LegalPage({ title, sections }: { title: string; sections: { h: string; p: string }[] }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-white/50 text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="text-white font-semibold text-lg">{s.h}</h2>
            <p className="text-white/70 text-sm mt-2 leading-relaxed">{s.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      sections={[
        { h: "1. Acceptance of Terms", p: "By accessing Enextrade Global Market you agree to these Terms. If you do not agree, do not use the platform." },
        { h: "2. Services", p: "We provide subscription-based access to forex signals, education, copy/bot trading interfaces, mentorship and investment plans. Services are independently subscribable." },
        { h: "3. Payments & Refunds", p: "All subscriptions are pre-paid via Paystack, bank transfer or crypto. Subscriptions are non-refundable once activated. Manual payments require proof of payment and admin verification." },
        { h: "4. User Conduct", p: "You agree not to abuse, resell, or redistribute platform content. Multiple-account abuse will result in suspension." },
        { h: "5. Limitation of Liability", p: "Enextrade is not liable for losses arising from trading decisions. All services are educational and informational in nature." },
        { h: "6. Modifications", p: "We may update these Terms periodically. Continued use constitutes acceptance of updates." },
      ]}
    />
  );
}

export function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
        { h: "Data we collect", p: "Account info (name, email), payment metadata (no card numbers), uploaded proofs, and usage telemetry to improve the platform." },
        { h: "How we use it", p: "To deliver subscription services, verify payments, send transactional alerts, and improve product quality." },
        { h: "Sharing", p: "We never sell user data. We share data only with processors strictly required to operate the service (Paystack, hosting, email)." },
        { h: "Storage & Security", p: "Data is stored in encrypted databases with role-based access and full audit logs. Backups are encrypted at rest." },
        { h: "Your rights", p: "You may request export or deletion of your data at any time by emailing privacy@enextrade.com." },
      ]}
    />
  );
}

export function Risk() {
  return (
    <LegalPage
      title="Risk Disclaimer"
      sections={[
        { h: "Trading involves risk", p: "Forex and CFD trading carries a high level of risk and may not be suitable for every investor. Past performance is not indicative of future results." },
        { h: "No financial advice", p: "Signals, analyses, education and mentorship are educational tools. They do not constitute personalized financial advice." },
        { h: "Investment plans", p: "Managed investment plans display target ROI of 6% monthly. Returns are not guaranteed and depend on market conditions and platform performance." },
        { h: "Do your own research", p: "You are solely responsible for your trading and investment decisions. Only invest capital you can afford to lose." },
      ]}
    />
  );
}
