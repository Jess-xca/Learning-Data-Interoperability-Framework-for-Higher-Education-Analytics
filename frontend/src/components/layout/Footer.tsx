

interface FooterProps {
  variant?: "default" | "minimal";
  className?: string;
}

export default function Footer({ variant = "default", className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === "minimal") {
    return (
      <footer className={`bg-surface-container-lowest/30 border-t border-outline-variant/10 py-8 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-black/5">
                  <span className="material-symbols-outlined text-lg">school</span>
               </div>
               <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 leading-none">
                 © {currentYear} Academic Curator // Quantum Compliance
               </p>
            </div>
            <div className="flex gap-8">
              {[
                { label: "Privacy Protocol", href: "/privacy" },
                { label: "Terms of Synthesis", href: "#" },
                { label: "Logic Support", href: "#" }
              ].map(link => (
                <a key={link.label} href={link.href} className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest hover:text-primary transition-all opacity-40 hover:opacity-100">
                   {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`bg-surface-container-lowest/40 border-t border-outline-variant/10 py-8 overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand */}
          <div className="space-y-3">
            <div>
              <span className="text-sm font-black text-on-surface tracking-tight block">Academic Curator</span>
              <span className="text-[9px] font-black text-primary uppercase tracking-widest opacity-60">LDIF v2.0</span>
            </div>
            <p className="text-[12px] font-medium text-on-surface-variant leading-snug opacity-70 max-w-xs">
              Learning Data Interoperability Framework for Higher Education.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-[9px] font-black text-primary uppercase tracking-widest opacity-60 mb-3">Resources</h3>
            <ul className="space-y-2">
              {['Documentation', 'API Guide', 'Support', 'Status'].map(link => (
                <li key={link}>
                  <a href="#" className="text-[11px] font-medium text-on-surface-variant hover:text-primary transition-all opacity-70 hover:opacity-100">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance */}
          <div className="space-y-2">
            <h3 className="text-[9px] font-black text-primary uppercase tracking-widest opacity-60 mb-3">Governance</h3>
            <ul className="space-y-2">
              {['Privacy', 'Terms', 'FERPA', 'HEC'].map(link => (
                <li key={link}>
                  <a href="#" className="text-[11px] font-medium text-on-surface-variant hover:text-primary transition-all opacity-70 hover:opacity-100">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-2">
            <h3 className="text-[9px] font-black text-primary uppercase tracking-widest opacity-60 mb-3">Support</h3>
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-on-surface-variant opacity-70">📧 support@ac.edu</p>
              <p className="text-[11px] font-medium text-on-surface-variant opacity-70">📞 +1 (555) 0100</p>
              <p className="text-[11px] font-medium text-on-surface-variant opacity-70">🌐 Help Center</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-outline-variant/10 pt-4">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50 mb-2">
            © {currentYear} Academic Curator • LDIF Framework
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Accessibility'].map(link => (
              <a key={link} href="#" className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50 hover:opacity-100 transition-all">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
