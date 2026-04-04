interface FooterProps {
  variant?: "default" | "minimal";
}

export default function Footer({ variant = "default" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === "minimal") {
    return (
      <footer className="ml-0 md:ml-72 bg-surface-container-low border-t border-outline-variant py-4">
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-on-surface-variant">
            <p>© {currentYear} Academic Curator. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="ml-0 md:ml-72 bg-surface-container-low border-t border-outline-variant">
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-2xl">school</span>
              <span className="font-black text-primary text-sm tracking-tight">Academic Curator</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Learning Data Interoperability Framework for Higher Education Analytics
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-primary text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li><a href="#" className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Reports</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Settings</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-primary text-sm mb-3">Resources</h3>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">System Status</a></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="font-bold text-primary text-sm mb-3">Legal & Compliance</h3>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FERPA Compliance</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">HEC Standards</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-on-surface-variant">
            © {currentYear} Academic Curator Framework. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-on-surface-variant">Powered by</span>
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <span className="material-symbols-outlined text-sm">cloud</span>
              AWS Education
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
