import { useState } from "react";
import { Alert } from "../common";
import { HelpCircle, Mail, ChevronDown, CheckCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  email: string;
  priority: "low" | "medium" | "high";
  category: string;
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    category: "Getting Started",
    question: "How do I create my first data connection?",
    answer:
      "To create a data connection, navigate to Data Sources, click 'Add New Connection', select your data source type, and follow the authentication steps specific to your system.",
  },
  {
    id: "2",
    category: "Data Management",
    question: "What data formats are supported?",
    answer:
      "We support CSV, Excel, JSON, XML, and direct connections to LMS systems (Canvas, Blackboard, Moodle), SIS platforms (Banner, Colleague), and other enterprise systems.",
  },
  {
    id: "3",
    category: "Security",
    question: "Is my institution data encrypted?",
    answer:
      "Yes. All data in transit is encrypted using TLS 1.3, and data at rest is encrypted using AES-256. We maintain ISO 27001 certification.",
  },
  {
    id: "4",
    category: "Reporting",
    question: "Can I schedule automated reports?",
    answer:
      "Yes. Use the Reporting section to create custom reports and schedule them daily, weekly, or monthly. Reports can be emailed to stakeholders automatically.",
  },
  {
    id: "5",
    category: "Integration",
    question: "How long does data synchronization take?",
    answer:
      "Initial sync depends on data volume (typically 15 minutes to 2 hours). Incremental syncs happen every 6 hours and take 5-15 minutes.",
  },
  {
    id: "6",
    category: "Troubleshooting",
    question: "What should I do if my data sync fails?",
    answer:
      "Check your connection credentials, ensure firewalls allow API access, and verify the source system is online. Contact support if issues persist.",
  },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"faq" | "ticket">("faq");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [formData, setFormData] = useState<SupportTicket>({
    id: "",
    subject: "",
    description: "",
    email: "",
    priority: "medium",
    category: "general",
  });
  const [submitted, setSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = Array.from(new Set(faqItems.map((item) => item.category)));

  const filteredFAQ =
    selectedCategory === "all"
      ? faqItems
      : faqItems.filter((item) => item.category === selectedCategory);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.description || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        id: "",
        subject: "",
        description: "",
        email: "",
        priority: "medium",
        category: "general",
      });
      setSubmitted(false);
      setActiveTab("faq");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-surface p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-on-surface">Help & Support</h1>
          <p className="text-on-surface-variant mt-2">
            Find answers to common questions or submit a support ticket
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-outline-variant">
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "faq"
                ? "border-secondary text-secondary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            FAQ
          </button>
          <button
            onClick={() => setActiveTab("ticket")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "ticket"
                ? "border-secondary text-secondary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Mail className="w-4 h-4" />
            Submit Ticket
          </button>
        </div>

        {/* FAQ Section */}
        {activeTab === "faq" && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-secondary text-on-secondary"
                    : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                All Topics
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {filteredFAQ.map((item) => (
                <div
                  key={item.id}
                  className="border border-outline-variant rounded-lg bg-surface-container-lowest hover:border-outline transition-colors"
                >
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === item.id ? null : item.id)
                    }
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex-grow">
                      <h3 className="font-semibold text-on-surface mb-1">
                        {item.question}
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        {item.category}
                      </p>
                    </div>
                    <span
                      className={`transition-transform ${
                        expandedFAQ === item.id ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                    </span>
                  </button>

                  {expandedFAQ === item.id && (
                    <div className="px-5 pb-5 pt-0 border-t border-outline-variant bg-surface-container-low">
                      <p className="text-on-surface-variant leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support Ticket Form */}
        {activeTab === "ticket" && (
          <div className="max-w-2xl">
            {submitted && (
              <Alert variant="success" className="mb-6">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Support ticket submitted successfully. We'll respond within 24
                hours.
              </Alert>
            )}

            <form
              onSubmit={handleSubmitTicket}
              className="space-y-6 bg-surface-container-lowest rounded-lg p-8 border border-outline-variant"
            >
              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Category <span className="text-error">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border-b-2 border-outline-variant bg-surface-container-low rounded-t-lg focus:border-secondary outline-none transition-colors"
                >
                  <option value="general">General Question</option>
                  <option value="technical">Technical Issue</option>
                  <option value="data">Data Problem</option>
                  <option value="integration">Integration Question</option>
                  <option value="security">Security Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Priority <span className="text-error">*</span>
                </label>
                <div className="flex gap-3">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={level}
                        checked={formData.priority === level}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priority: e.target.value as
                              | "low"
                              | "medium"
                              | "high",
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-on-surface capitalize">
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Subject <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2 border-b-2 border-outline-variant bg-surface-container-low rounded-t-lg focus:border-secondary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Description <span className="text-error">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  className="w-full px-4 py-2 border border-outline-variant bg-surface-container-low rounded-lg focus:border-secondary outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your@institution.edu"
                  className="w-full px-4 py-2 border-b-2 border-outline-variant bg-surface-container-low rounded-t-lg focus:border-secondary outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-secondary text-on-secondary rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-secondary/20"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
