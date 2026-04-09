export default function PrivacyPolicyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-white pt-20 px-4">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="h-page text-primary">Privacy Policy</h1>
        
        <div className="prose prose-sm space-y-6 text-on-surface">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Introduction</h2>
            <p className="text-on-surface-variant">
              Academic Curator ("we," "us," or "our") operates the Academic Curator application. This Privacy Policy explains our practices regarding data collection, use, and protection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Third-Party Services</h2>
            <p className="text-on-surface-variant mb-2">
              Our application utilizes the following third-party services:
            </p>
            <ul className="list-disc list-inside text-on-surface-variant space-y-2 ml-2">
              <li>
                <strong>Google Fonts (Material Symbols)</strong> - We use the Material Symbols Outlined font from Google Fonts CDN. When you load our application, your browser requests font files from Google's servers. This may result in Google collecting your IP address and other standard HTTP headers. Please review{" "}
                <a 
                  href="https://policies.google.com/privacy" 
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google's Privacy Policy
                </a>{" "}
                to understand how they handle this data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Security</h2>
            <p className="text-on-surface-variant">
              We implement appropriate technical measures to protect your information. External resource requests (such as Google Fonts) are made using secure CORS policies to ensure cross-origin requests are properly validated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Your Rights</h2>
            <p className="text-on-surface-variant">
              You have the right to access, correct, and delete your personal information. For any privacy-related requests, please contact our support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Changes to This Policy</h2>
            <p className="text-on-surface-variant">
              We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Contact Us</h2>
            <p className="text-on-surface-variant">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at support@academiccurator.edu
            </p>
          </section>

          <p className="text-xs text-on-surface-variant border-t border-outline-variant pt-4 mt-8">
            Last Updated: {currentYear}-{String((new Date().getMonth() + 1)).padStart(2, "0")}-{String(new Date().getDate()).padStart(2, "0")}
          </p>
        </div>
      </div>
    </main>
  );
}
