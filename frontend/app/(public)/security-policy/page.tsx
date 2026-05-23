export default function SecurityPolicyPage() {
  return (
    <div className="min-h-screen bg-parchment">
      {/* Header */}
      <section className="border-b border-warm-border px-6 py-14 sm:px-10 md:px-16">
        <p className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">Security</p>
        <h1 className="mt-2 font-display text-5xl tracking-tight text-ink sm:text-6xl">
          Security Policy
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
          How to report vulnerabilities and what to expect in response.
        </p>
      </section>

      {/* Content */}
      <section className="px-6 py-12 sm:px-10 md:px-16">
        <div className="max-w-2xl space-y-12">

          {/* Reporting */}
          <div className="grid gap-px border border-warm-border bg-warm-border">
            <div className="card-cell bg-parchment p-7">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">01</p>
              <h2 className="mt-2 font-display text-2xl text-ink">Reporting a Vulnerability</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                If you discover a security vulnerability, please report it privately. Do not open
                a public GitHub issue.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                Email:{" "}
                <a
                  href="mailto:codewithishant.work@gmail.com"
                  className="text-gold-dark underline underline-offset-2 hover:text-gold transition-colors"
                >
                  codewithishant.work@gmail.com
                </a>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Include a clear description of the issue, steps to reproduce, and potential
                impact. Proof-of-concept code is welcome but not required.
              </p>
            </div>
          </div>

          {/* Response */}
          <div className="grid gap-px border border-warm-border bg-warm-border">
            <div className="card-cell bg-parchment p-7">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">02</p>
              <h2 className="mt-2 font-display text-2xl text-ink">What to Expect</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-muted">
                <div className="flex gap-3">
                  <span className="shrink-0 text-gold">→</span>
                  <p>Acknowledgement within <span className="text-ink">48 hours</span>.</p>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 text-gold">→</span>
                  <p>Assessment and status update within <span className="text-ink">7 days</span>.</p>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 text-gold">→</span>
                  <p>Fix or mitigation for confirmed issues within <span className="text-ink">30 days</span> where possible.</p>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 text-gold">→</span>
                  <p>Credit in release notes if you wish to be named.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scope */}
          <div className="grid gap-px border border-warm-border bg-warm-border">
            <div className="card-cell bg-parchment p-7">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">03</p>
              <h2 className="mt-2 font-display text-2xl text-ink">Scope</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-muted">
                <div className="flex gap-3">
                  <span className="shrink-0 text-gold">✓</span>
                  <p>codewithishant.com and all subdomains</p>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 text-gold">✓</span>
                  <p>Authentication, session, and authorization flaws</p>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 text-gold">✓</span>
                  <p>Injection vulnerabilities (SQL, XSS, CSRF)</p>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 text-gold">✗</span>
                  <p>Spam, social engineering, or physical attacks</p>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 text-gold">✗</span>
                  <p>Denial of service attacks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclosure */}
          <div className="grid gap-px border border-warm-border bg-warm-border">
            <div className="card-cell bg-parchment p-7">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">04</p>
              <h2 className="mt-2 font-display text-2xl text-ink">Responsible Disclosure</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Please allow reasonable time to investigate and patch before public disclosure.
                Good-faith researchers who follow this policy will not face legal action.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}