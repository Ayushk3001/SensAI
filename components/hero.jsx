"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section style={s.root}>
      <div style={s.container}>
        <div style={s.textContent}>
          <h1 style={s.title}>
            Your AI Career Coach for
            <br />
            <span style={s.titleAccent}>Professional Success</span>
          </h1>

          <p style={s.subtitle}>
            Advance your career with personalized guidance, ATS-optimized resumes,
            custom learning roadmaps, and live AI voice interviews.
          </p>

          <div style={s.buttonGroup}>
            <Link href="/dashboard" style={s.link}>
              <button style={s.primaryBtn}>Get Started</button>
            </Link>
            <button
              style={s.secondaryBtn}
              onClick={() => setShowVideo((v) => !v)}
            >
              {showVideo ? "✕ Close Demo" : "▶ Watch Demo"}
            </button>
          </div>
        </div>

        {/* YouTube Video Embed — shown when Watch Demo is clicked */}
        {showVideo && (
          <div style={s.videoWrapper}>
            <div style={s.videoContainer}>
              <iframe
                src="https://www.youtube.com/embed/CZu3ANlo2d8?autoplay=1"
                title="Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={s.iframe}
              />
            </div>
          </div>
        )}

        {/* Full-screen fitting banner — hidden when video is shown */}
        {!showVideo && (
          <div style={s.imageWrapper}>
            <div ref={imageRef} style={s.imageContainer} className="hero-image">
              <Image
                src="/banner.jpeg"
                width={1920}
                height={1080}
                alt="Dashboard Preview"
                style={s.image}
                priority
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .hero-image {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hero-image.scrolled {
          transform: scale(0.97) translateY(20px);
          filter: brightness(0.95);
        }
        * { box-sizing: border-box; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    minHeight: "100vh",
    background: "#080808",
    color: "#e5e5e5",
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
    paddingTop: "110px",
    paddingBottom: "60px",
    position: "relative",
    overflow: "hidden",
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "48px",
  },
  textContent: {
    maxWidth: "780px",
  },
  title: {
    fontSize: "clamp(42px, 6vw, 68px)",
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: "24px",
    color: "#fff",
  },
  titleAccent: {
    color: "#7c3aed",
  },
  subtitle: {
    fontSize: "18px",
    color: "#6b7280",
    lineHeight: 1.6,
    maxWidth: "580px",
    margin: "0 auto 40px",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  link: {
    textDecoration: "none",
  },
  primaryBtn: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "16px 36px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 10px 25px -5px rgb(124 58 237)",
  },
  secondaryBtn: {
    background: "transparent",
    color: "#e5e5e5",
    border: "1px solid #2a2a2a",
    borderRadius: 14,
    padding: "16px 36px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s",
  },

  // ── Video ──
  videoWrapper: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px",
    animation: "fadeInUp 0.5s ease forwards",
  },
  videoContainer: {
    position: "relative",
    paddingBottom: "56.25%", // 16:9
    height: 0,
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 25px 60px -15px rgba(124, 58, 237, 0.4)",
    border: "1px solid #2a2a2a",
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },

  // ── Banner ──
  imageWrapper: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
  },
  imageContainer: {
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 25px 60px -15px rgba(124, 58, 237, 0.3)",
    border: "1px solid #1a1a1a",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
    objectFit: "cover",
  },
};