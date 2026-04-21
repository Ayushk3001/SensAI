import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeroSection from "@/components/hero";
import {
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

export default function LandingPage() {
  return (
    <>
      <div className="grid-background" />

      <HeroSection />

      {/* Features Section */}
      <section style={s.section}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>Powerful Features for Your Career Growth</h2>
          <div style={s.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} style={s.featureCard} className="glass-card">
                <div style={s.featureIconWrap}>{feature.icon}</div>
                <h3 style={s.featureTitle}>{feature.title}</h3>
                <p style={s.featureDesc}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Glassmorphism */}
      <section style={s.statsSection}>
        <div style={s.container}>
          <div style={s.statsGrid} className="glass-stats">
            <div style={s.statItem}>
              <h3 style={s.statNumber}>50+</h3>
              <p style={s.statLabel}>Industries Covered</p>
            </div>
            <div style={s.statItem}>
              <h3 style={s.statNumber}>1000+</h3>
              <p style={s.statLabel}>Interview Questions</p>
            </div>
            <div style={s.statItem}>
              <h3 style={s.statNumber}>95%</h3>
              <p style={s.statLabel}>Success Rate</p>
            </div>
            <div style={s.statItem}>
              <h3 style={s.statNumber}>24/7</h3>
              <p style={s.statLabel}>AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>How It Works</h2>
            <p style={s.sectionSubtitle}>
              Four simple steps to accelerate your career growth
            </p>
          </div>
          <div style={s.howGrid}>
            {howItWorks.map((item, index) => (
              <div key={index} style={s.howItem} className="hover-lift">
                <div style={s.howIcon} className="icon-glow">{item.icon}</div>
                <h3 style={s.howTitle}>{item.title}</h3>
                <p style={s.howDesc}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={s.section}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>What Our Users Say</h2>
          <div style={s.testimonialGrid}>
            {testimonial.map((t, index) => (
              <div key={index} style={s.testimonialCard} className="glass-card">
                <div style={s.testimonialHeader}>
                  <Image
                    src={t.image}
                    alt={t.author}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-[#7c3aed]/50 shadow-lg"
                  />
                  <div>
                    <p style={s.testimonialName}>{t.author}</p>
                    <p style={s.testimonialRole}>
                      {t.role} • {t.company}
                    </p>
                  </div>
                </div>
                <p style={s.testimonialQuote}>{t.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>Frequently Asked Questions</h2>
            <p style={s.sectionSubtitle}>
              Find answers to common questions about our platform
            </p>
          </div>
          <div style={s.faqContainer}>
            <Accordion type="single" collapsible style={{ width: "100%" }}>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="glass-accordion">
                  <AccordionTrigger style={s.accordionTrigger}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent style={s.accordionContent}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={s.ctaSection} className="cta-gradient-animate">
        <div style={s.ctaContent}>
          <h2 style={s.ctaTitle}>Ready to Accelerate Your Career?</h2>
          <p style={s.ctaSubtitle}>
            Join thousands of professionals who are advancing their careers with
            AI-powered guidance.
          </p>
          <Link href="/dashboard" style={s.link}>
            <button style={s.ctaBtn} className="btn-glow">
              Start Your Journey Today <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </section>

      <style>{`
        .grid-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, #1a1a1a 1px, transparent 1px),
                      linear-gradient(to bottom, #1a1a1a 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.08;
          pointer-events: none;
          z-index: -1;
        }

        .glass-card {
          background: rgba(17, 17, 17, 0.6) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .glass-card:hover {
          transform: translateY(-10px);
          background: rgba(124, 58, 237, 0.05) !important;
          border-color: rgba(124, 58, 237, 0.4) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .glass-stats {
          background: rgba(124, 58, 237, 0.03);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(124, 58, 237, 0.1);
          padding: 40px;
          border-radius: 24px;
        }

        .glass-accordion {
          background: rgba(17, 17, 17, 0.4);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .hover-lift {
          transition: transform 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
        }

        .icon-glow {
          transition: all 0.3s ease;
          box-shadow: 0 0 0 rgba(124, 58, 237, 0);
        }
        .hover-lift:hover .icon-glow {
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
          transform: scale(1.1);
        }

        .btn-glow {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-glow:hover {
          box-shadow: 0 0 25px rgba(124, 58, 237, 0.6);
          transform: scale(1.02);
        }

        .cta-gradient-animate {
          background-size: 200% 200% !important;
          animation: gradientShift 8s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        * { box-sizing: border-box; }
      `}</style>
    </>
  );
}

const s = {
  section: {
    width: "100%",
    padding: "60px 0", // Reduced from 100px
    background: "#080808",
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 48px",
  },
  sectionTitle: {
    fontSize: "42px",
    fontWeight: 800,
    textAlign: "center",
    marginBottom: "32px", // Reduced from 48px
    color: "#fff",
    letterSpacing: "-0.02em",
  },
  sectionSubtitle: {
    fontSize: "19px",
    color: "#9ca3af",
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 32px", // Reduced from 48px
    lineHeight: 1.6,
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "40px", // Reduced from 60px
  },

  // Features
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "32px",
  },
  featureCard: {
    background: "#111",
    borderRadius: "24px",
    padding: "40px 32px",
    textAlign: "left",
  },
  featureIconWrap: {
    fontSize: "42px",
    marginBottom: "24px",
    color: "#a78bfa",
    display: "inline-block",
  },
  featureTitle: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "16px",
    color: "#fff",
  },
  featureDesc: {
    fontSize: "16px",
    color: "#9ca3af",
    lineHeight: 1.6,
  },

  // Stats
  statsSection: {
    width: "100%",
    padding: "40px 0", // Reduced from 100px
    background: "#080808",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "32px",
    textAlign: "center",
  },
  statItem: {},
  statNumber: {
    fontSize: "56px",
    fontWeight: 800,
    color: "#7c3aed",
    marginBottom: "8px",
    textShadow: "0 0 20px rgba(124, 58, 237, 0.3)",
  },
  statLabel: {
    fontSize: "16px",
    color: "#9ca3af",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  // How It Works
  howGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "48px",
  },
  howItem: {
    textAlign: "center",
  },
  howIcon: {
    width: "80px",
    height: "80px",
    background: "rgba(124, 58, 237, 0.1)",
    border: "1px solid rgba(124, 58, 237, 0.2)",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    fontSize: "32px",
    color: "#a78bfa",
  },
  howTitle: {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "12px",
    color: "#fff",
  },
  howDesc: {
    fontSize: "16px",
    color: "#9ca3af",
    lineHeight: 1.6,
  },

  // Testimonials
  testimonialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "32px",
  },
  testimonialCard: {
    borderRadius: "24px",
    padding: "40px",
  },
  testimonialHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "24px",
  },
  testimonialName: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#fff",
  },
  testimonialRole: {
    fontSize: "14px",
    color: "#7c3aed",
    fontWeight: 500,
  },
  testimonialQuote: {
    fontSize: "17px",
    lineHeight: 1.8,
    color: "#d1d5db",
    fontStyle: "italic",
    opacity: 0.9,
  },

  // FAQ
  faqContainer: {
    maxWidth: "850px",
    margin: "0 auto",
  },
  accordionTrigger: {
    fontSize: "18px",
    fontWeight: 600,
    padding: "24px",
    textAlign: "left",
    color: "#f3f4f6",
    border: "none",
  },
  accordionContent: {
    fontSize: "16px",
    color: "#9ca3af",
    padding: "0 24px 24px",
    lineHeight: 1.6,
  },

  // CTA
  ctaSection: {
    width: "100%",
    padding: "80px 48px", // Reduced from 120px
    background: "linear-gradient(135deg, #0f0720 0%, #1a0f35 50%, #0f0720 100%)",
    margin: "20px 0", // Reduced from 40px
    borderTop: "1px solid rgba(124, 58, 237, 0.2)",
    borderBottom: "1px solid rgba(124, 58, 237, 0.2)",
  },
  ctaContent: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: "48px",
    fontWeight: 800,
    color: "#fff",
    marginBottom: "24px",
    letterSpacing: "-0.03em",
  },
  ctaSubtitle: {
    fontSize: "20px",
    color: "#c4b5fd",
    marginBottom: "40px",
    lineHeight: 1.6,
    opacity: 0.9,
  },
  ctaBtn: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "16px",
    padding: "20px 48px",
    fontSize: "18px",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
  },
};