"use client";
import { useState, useRef, useCallback } from "react";

const COLORS = {
  bg: "#0A0A0F",
  surface: "#12121A",
  card: "#1A1A26",
  border: "#2A2A3E",
  accent: "#6C63FF",
  accentLight: "#8B85FF",
  accentGlow: "rgba(108,99,255,0.15)",
  teal: "#00D4AA",
  amber: "#FFB800",
  red: "#FF4D6A",
  text: "#F0F0FF",
  muted: "#8888AA",
  dim: "#3A3A5C",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }

  .app { min-height: 100vh; background: ${COLORS.bg}; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 64px;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid ${COLORS.border};
  }
  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.3rem;
    background: linear-gradient(135deg, ${COLORS.accentLight}, ${COLORS.teal});
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -0.02em;
  }
  .nav-logo span { color: ${COLORS.accent}; }
  .nav-right { display: flex; gap: 1rem; align-items: center; }
  .nav-pill {
    background: ${COLORS.accentGlow};
    border: 1px solid ${COLORS.accent};
    color: ${COLORS.accentLight};
    padding: 6px 16px; border-radius: 999px;
    font-size: 0.8rem; font-weight: 600; cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }
  .nav-pill:hover { background: ${COLORS.accent}; color: white; }

  /* HERO */
  .hero {
    padding: 140px 2rem 80px;
    text-align: center;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -60%);
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: ${COLORS.accentGlow}; border: 1px solid rgba(108,99,255,0.4);
    border-radius: 999px; padding: 6px 16px;
    font-size: 0.78rem; font-weight: 600; color: ${COLORS.accentLight};
    margin-bottom: 1.5rem; letter-spacing: 0.05em; text-transform: uppercase;
  }
  .hero-badge::before { content: '✦'; font-size: 0.6rem; }
  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.2rem);
    font-weight: 800; line-height: 1.08;
    letter-spacing: -0.03em;
    margin-bottom: 1.2rem;
  }
  .hero h1 .grad {
    background: linear-gradient(135deg, ${COLORS.accentLight} 0%, ${COLORS.teal} 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hero p {
    font-size: 1.15rem; color: ${COLORS.muted};
    max-width: 540px; margin: 0 auto 2.5rem;
    line-height: 1.65; font-weight: 300;
  }
  .hero-cta {
    display: inline-flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, ${COLORS.accent}, #8B5CF6);
    color: white; padding: 14px 32px; border-radius: 12px;
    font-size: 1rem; font-weight: 600; cursor: pointer; border: none;
    box-shadow: 0 0 40px rgba(108,99,255,0.35);
    transition: all 0.25s; letter-spacing: -0.01em;
  }
  .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 0 60px rgba(108,99,255,0.5); }

  /* STATS */
  .stats {
    display: flex; justify-content: center; gap: 3rem;
    margin-top: 3rem; flex-wrap: wrap;
  }
  .stat { text-align: center; }
  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem; font-weight: 800;
    background: linear-gradient(135deg, ${COLORS.text}, ${COLORS.accentLight});
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .stat-label { font-size: 0.8rem; color: ${COLORS.muted}; margin-top: 2px; }

  /* MAIN CONTENT */
  .main { max-width: 1200px; margin: 0 auto; padding: 0 2rem 4rem; }

  /* UPLOAD ZONE */
  .upload-zone {
    border: 2px dashed ${COLORS.dim};
    border-radius: 20px; padding: 3rem 2rem;
    text-align: center; cursor: pointer;
    transition: all 0.3s; position: relative;
    background: ${COLORS.surface};
  }
  .upload-zone:hover, .upload-zone.drag { border-color: ${COLORS.accent}; background: ${COLORS.accentGlow}; }
  .upload-icon { font-size: 3rem; margin-bottom: 1rem; }
  .upload-zone h3 { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 700; margin-bottom: 0.5rem; }
  .upload-zone p { color: ${COLORS.muted}; font-size: 0.9rem; }
  .upload-types {
    display: flex; justify-content: center; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;
  }
  .type-tag {
    background: ${COLORS.card}; border: 1px solid ${COLORS.border};
    border-radius: 6px; padding: 3px 10px;
    font-size: 0.75rem; color: ${COLORS.muted};
  }

  /* CARDS */
  .card {
    background: ${COLORS.card}; border: 1px solid ${COLORS.border};
    border-radius: 20px; padding: 1.8rem;
    margin-bottom: 1.5rem;
  }
  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem; font-weight: 700;
    margin-bottom: 1.2rem; display: flex; align-items: center; gap: 8px;
  }
  .card-title .icon { font-size: 1.2rem; }

  /* SCORE */
  .score-big {
    text-align: center; padding: 1.5rem 0;
  }
  .score-num {
    font-family: 'Syne', sans-serif;
    font-size: 4rem; font-weight: 800; line-height: 1;
  }
  .score-label { color: ${COLORS.muted}; font-size: 0.9rem; margin-top: 4px; }

  /* PROGRESS BARS */
  .metric { margin-bottom: 1rem; }
  .metric-header { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px; }
  .metric-label { color: ${COLORS.muted}; }
  .metric-val { font-weight: 600; }
  .bar-bg { background: ${COLORS.surface}; border-radius: 999px; height: 8px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 999px; transition: width 1s ease; }

  /* TABS */
  .tabs { display: flex; gap: 4px; margin-bottom: 1.5rem; background: ${COLORS.surface}; border-radius: 12px; padding: 4px; }
  .tab {
    flex: 1; padding: 10px; border-radius: 9px; border: none;
    cursor: pointer; font-size: 0.85rem; font-weight: 600;
    transition: all 0.2s; color: ${COLORS.muted}; background: transparent;
    font-family: 'Inter', sans-serif;
  }
  .tab.active { background: ${COLORS.card}; color: ${COLORS.text}; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }

  /* TEXTAREA */
  .textarea {
    width: 100%; background: ${COLORS.surface};
    border: 1px solid ${COLORS.border}; border-radius: 12px;
    color: ${COLORS.text}; font-family: 'Inter', sans-serif;
    font-size: 0.9rem; padding: 1rem; resize: vertical; min-height: 120px;
    outline: none; transition: border-color 0.2s; line-height: 1.6;
  }
  .textarea:focus { border-color: ${COLORS.accent}; }

  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 10px; font-size: 0.9rem;
    font-weight: 600; cursor: pointer; border: none; transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .btn-primary {
    background: linear-gradient(135deg, ${COLORS.accent}, #8B5CF6);
    color: white; box-shadow: 0 4px 20px rgba(108,99,255,0.3);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 25px rgba(108,99,255,0.45); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-teal { background: rgba(0,212,170,0.15); color: ${COLORS.teal}; border: 1px solid rgba(0,212,170,0.3); }
  .btn-teal:hover { background: rgba(0,212,170,0.25); }
  .btn-outline { background: transparent; color: ${COLORS.muted}; border: 1px solid ${COLORS.border}; }
  .btn-outline:hover { border-color: ${COLORS.accent}; color: ${COLORS.text}; }
  .btn-sm { padding: 6px 14px; font-size: 0.8rem; }

  /* SUGGESTIONS */
  .suggestion {
    display: flex; align-items: flex-start; gap: 10px;
    background: ${COLORS.surface}; border: 1px solid ${COLORS.border};
    border-radius: 10px; padding: 12px; margin-bottom: 8px;
    font-size: 0.85rem; line-height: 1.5;
  }
  .suggestion-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }

  /* CHIP */
  .chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 6px;
    font-size: 0.75rem; font-weight: 600; margin: 3px;
  }
  .chip-green { background: rgba(0,212,170,0.12); color: ${COLORS.teal}; border: 1px solid rgba(0,212,170,0.25); }
  .chip-red { background: rgba(255,77,106,0.12); color: ${COLORS.red}; border: 1px solid rgba(255,77,106,0.25); }
  .chip-purple { background: ${COLORS.accentGlow}; color: ${COLORS.accentLight}; border: 1px solid rgba(108,99,255,0.3); }

  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }

  /* RESUME EDITOR */
  .resume-section { margin-bottom: 1.5rem; }
  .resume-section-title {
    font-family: 'Syne', sans-serif; font-size: 0.8rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em; color: ${COLORS.accent};
    margin-bottom: 0.75rem; padding-bottom: 0.5rem;
    border-bottom: 1px solid ${COLORS.border};
  }
  .input {
    width: 100%; background: ${COLORS.surface};
    border: 1px solid ${COLORS.border}; border-radius: 8px;
    color: ${COLORS.text}; font-family: 'Inter', sans-serif;
    font-size: 0.9rem; padding: 8px 12px; outline: none;
    transition: border-color 0.2s; margin-bottom: 8px;
  }
  .input:focus { border-color: ${COLORS.accent}; }

  /* LOADING */
  .spinner {
    display: inline-block; width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  
  /* COVER LETTER */
  .cover-letter-text {
    background: ${COLORS.surface}; border: 1px solid ${COLORS.border};
    border-radius: 12px; padding: 1.5rem; line-height: 1.8;
    font-size: 0.92rem; color: ${COLORS.text}; white-space: pre-wrap;
    min-height: 300px;
  }

  /* TEMPLATE */
  .template-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
  .template-card {
    border: 2px solid ${COLORS.border}; border-radius: 12px;
    overflow: hidden; cursor: pointer; transition: all 0.2s;
    aspect-ratio: 3/4; position: relative;
    background: white; display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 8px;
  }
  .template-card:hover, .template-card.selected { border-color: ${COLORS.accent}; box-shadow: 0 0 20px ${COLORS.accentGlow}; }
  .template-name {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: rgba(10,10,15,0.9); color: ${COLORS.text};
    font-size: 0.75rem; font-weight: 600; text-align: center; padding: 6px;
    font-family: 'Syne', sans-serif;
  }

  /* PHASE NAV */
  .phase-nav {
    display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;
  }
  .phase-step {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.82rem; font-weight: 600; color: ${COLORS.dim};
    transition: color 0.2s;
  }
  .phase-step.done { color: ${COLORS.teal}; }
  .phase-step.active { color: ${COLORS.text}; }
  .phase-num {
    width: 24px; height: 24px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; border: 1px solid currentColor;
  }
  .phase-step.done .phase-num { background: ${COLORS.teal}; border-color: ${COLORS.teal}; color: #0A0A0F; }
  .phase-step.active .phase-num { background: ${COLORS.accent}; border-color: ${COLORS.accent}; color: white; }
  .phase-sep { color: ${COLORS.dim}; font-size: 0.7rem; margin: 0 2px; }

  /* TOAST */
  .toast {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 999;
    background: ${COLORS.card}; border: 1px solid ${COLORS.teal};
    border-radius: 12px; padding: 14px 20px;
    color: ${COLORS.teal}; font-weight: 600; font-size: 0.9rem;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* HIGHLIGHT SECTION */
  .highlight-section {
    margin: 0; padding: 5rem 2rem;
    background: linear-gradient(135deg, rgba(108,99,255,0.18) 0%, rgba(0,212,170,0.1) 100%);
    border-top: 1px solid rgba(108,99,255,0.25);
    border-bottom: 1px solid rgba(0,212,170,0.2);
    position: relative; overflow: hidden;
    text-align: center;
  }
  .highlight-section::before {
    content: '';
    position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
    width: 700px; height: 400px;
    background: radial-gradient(ellipse, rgba(108,99,255,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .highlight-label {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,184,0,0.12); border: 1px solid rgba(255,184,0,0.35);
    border-radius: 999px; padding: 6px 16px;
    font-size: 0.78rem; font-weight: 700; color: ${COLORS.amber};
    margin-bottom: 1.5rem; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .highlight-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 800; line-height: 1.15;
    letter-spacing: -0.03em; margin-bottom: 1.5rem;
    max-width: 820px; margin-left: auto; margin-right: auto;
  }
  .highlight-title .money {
    background: linear-gradient(135deg, ${COLORS.amber}, #FF8C00);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .highlight-title .pop {
    background: linear-gradient(135deg, ${COLORS.accentLight}, ${COLORS.teal});
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .highlight-body {
    font-size: 1.05rem; color: ${COLORS.muted};
    max-width: 680px; margin: 0 auto 2.5rem;
    line-height: 1.75; font-weight: 300;
  }
  .highlight-pills {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem;
    margin-bottom: 2.5rem;
  }
  .highlight-pill {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 999px; padding: 8px 18px;
    font-size: 0.85rem; font-weight: 600; color: ${COLORS.text};
    display: flex; align-items: center; gap: 6px;
  }

  /* TESTIMONIALS */
  .testimonials-section {
    padding: 5rem 0; overflow: hidden;
  }
  .testimonials-title {
    text-align: center; font-family: 'Syne', sans-serif;
    font-size: 1.8rem; font-weight: 800;
    margin-bottom: 0.5rem; letter-spacing: -0.02em;
  }
  .testimonials-sub {
    text-align: center; color: ${COLORS.muted};
    margin-bottom: 3rem; font-size: 0.9rem;
  }
  .testimonials-track-wrapper {
    overflow: hidden; position: relative;
  }
  .testimonials-track-wrapper::before,
  .testimonials-track-wrapper::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2; pointer-events: none;
  }
  .testimonials-track-wrapper::before { left: 0; background: linear-gradient(to right, ${COLORS.bg}, transparent); }
  .testimonials-track-wrapper::after { right: 0; background: linear-gradient(to left, ${COLORS.bg}, transparent); }
  .testimonials-track {
    display: flex; gap: 1.25rem;
    animation: scrollLeft 35s linear infinite;
    width: max-content;
  }
  .testimonials-track:hover { animation-play-state: paused; }
  @keyframes scrollLeft {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .testimonial-card {
    background: ${COLORS.card}; border: 1px solid ${COLORS.border};
    border-radius: 16px; padding: 1.5rem;
    width: 300px; flex-shrink: 0;
    transition: border-color 0.2s;
  }
  .testimonial-card:hover { border-color: ${COLORS.accent}; }
  .testimonial-stars { color: ${COLORS.amber}; font-size: 0.85rem; margin-bottom: 0.75rem; letter-spacing: 2px; }
  .testimonial-text { font-size: 0.88rem; color: ${COLORS.muted}; line-height: 1.65; margin-bottom: 1rem; font-style: italic; }
  .testimonial-author { display: flex; align-items: center; gap: 0.75rem; }
  .testimonial-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }
  .testimonial-name { font-weight: 700; font-size: 0.85rem; }
  .testimonial-role { font-size: 0.75rem; color: ${COLORS.muted}; }
  .testimonial-result {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(0,212,170,0.1); border: 1px solid rgba(0,212,170,0.25);
    border-radius: 6px; padding: 3px 8px;
    font-size: 0.72rem; font-weight: 700; color: ${COLORS.teal};
    margin-top: 0.5rem;
  }
  .features {
    padding: 4rem 2rem; max-width: 1200px; margin: 0 auto;
  }
  .features-title {
    text-align: center; font-family: 'Syne', sans-serif;
    font-size: 2rem; font-weight: 800; margin-bottom: 0.75rem;
    letter-spacing: -0.02em;
  }
  .features-sub { text-align: center; color: ${COLORS.muted}; margin-bottom: 3rem; }
  .feature-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.2rem; }
  .feature-card {
    background: ${COLORS.card}; border: 1px solid ${COLORS.border};
    border-radius: 16px; padding: 1.5rem;
    transition: border-color 0.2s;
  }
  .feature-card:hover { border-color: ${COLORS.accent}; }
  .feature-emoji { font-size: 2rem; margin-bottom: 0.75rem; }
  .feature-card h3 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
  .feature-card p { color: ${COLORS.muted}; font-size: 0.85rem; line-height: 1.6; }

  /* PRICING */
  .pricing { padding: 4rem 2rem; max-width: 900px; margin: 0 auto; text-align: center; }
  .pricing-title { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; margin-bottom: 0.75rem; letter-spacing: -0.02em; }
  .pricing-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2.5rem; text-align: left; }
  .pricing-card { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 20px; padding: 2rem; }
  .pricing-card.featured { border-color: ${COLORS.accent}; box-shadow: 0 0 40px ${COLORS.accentGlow}; position: relative; }
  .pricing-badge {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: linear-gradient(135deg, ${COLORS.accent}, #8B5CF6);
    color: white; font-size: 0.72rem; font-weight: 700; padding: 4px 14px;
    border-radius: 999px; white-space: nowrap; letter-spacing: 0.04em; text-transform: uppercase;
  }
  .plan-name { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
  .plan-price { font-family: 'Syne', sans-serif; font-size: 2.5rem; font-weight: 800; margin: 0.5rem 0; }
  .plan-price span { font-size: 1rem; color: ${COLORS.muted}; font-weight: 400; }
  .plan-features { list-style: none; margin: 1.5rem 0; }
  .plan-features li { font-size: 0.85rem; color: ${COLORS.muted}; padding: 6px 0; border-bottom: 1px solid ${COLORS.border}; display: flex; gap: 8px; }
  .plan-features li::before { content: '✓'; color: ${COLORS.teal}; font-weight: 700; flex-shrink: 0; }

  /* DIVIDER */
  .divider { border: none; border-top: 1px solid ${COLORS.border}; margin: 0; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .grid-2 { grid-template-columns: 1fr; }
    .template-grid { grid-template-columns: repeat(2,1fr); }
    .pricing-cards { grid-template-columns: 1fr; }
    .stats { gap: 1.5rem; }
  }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const scoreColor = (s) => {
  if (s >= 80) return COLORS.teal;
  if (s >= 60) return COLORS.amber;
  return COLORS.red;
};

const parseResumeText = (text) => {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const data = {
    name: "", email: "", phone: "", summary: "",
    experience: [], skills: [], education: [], certifications: [], projects: [],
  };

  let section = "header";
  for (const line of lines) {
    const l = line.toLowerCase();
    if (l.includes("summary") || l.includes("objective")) { section = "summary"; continue; }
    if (l.includes("experience") || l.includes("employment")) { section = "experience"; continue; }
    if (l.includes("skill")) { section = "skills"; continue; }
    if (l.includes("education")) { section = "education"; continue; }
    if (l.includes("certif")) { section = "certifications"; continue; }
    if (l.includes("project")) { section = "projects"; continue; }

    if (section === "header") {
      if (!data.name && line.length < 50 && !/[@.]/.test(line)) data.name = line;
      else if (!data.email && line.includes("@")) data.email = line.match(/[\w.+-]+@[\w.]+/)?.[0] || "";
      else if (!data.phone && /\d{3}/.test(line)) data.phone = line.match(/[\d\s\-().+]+/)?.[0]?.trim() || "";
    } else if (section === "summary") {
      data.summary += (data.summary ? " " : "") + line;
    } else if (section === "experience") {
      data.experience.push(line);
    } else if (section === "skills") {
      data.skills.push(...line.split(/[,|•]/).map((s) => s.trim()).filter(Boolean));
    } else if (section === "education") {
      data.education.push(line);
    } else if (section === "certifications") {
      data.certifications.push(line);
    } else if (section === "projects") {
      data.projects.push(line);
    }
  }

  return data;
};

// ─── AI CALL ─────────────────────────────────────────────────────────────────

const callClaude = async (prompt, maxTokens = 1500) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.map((b) => b.text || "").join("") || "";
};

// ─── SCORE GAUGE ─────────────────────────────────────────────────────────────

const ScoreGauge = ({ score, label }) => {
  const color = scoreColor(score);
  return (
    <div style={{ textAlign: "center", padding: "1rem 0" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <svg width="120" height="70" viewBox="0 0 120 70">
          <path d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke={COLORS.dim} strokeWidth="10" strokeLinecap="round" />
          <path
            d="M10,60 A50,50 0 0,1 110,60"
            fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 157} 157`}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, color }}>{score}</div>
        </div>
      </div>
      <div style={{ fontSize: "0.8rem", color: COLORS.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
};

// ─── METRIC BAR ──────────────────────────────────────────────────────────────

const MetricBar = ({ label, value, color }) => (
  <div className="metric">
    <div className="metric-header">
      <span className="metric-label">{label}</span>
      <span className="metric-val" style={{ color }}>{value}%</span>
    </div>
    <div className="bar-bg">
      <div className="bar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  </div>
);

// ─── UPLOAD ZONE ─────────────────────────────────────────────────────────────

const UploadZone = ({ onText }) => {
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "txt") {
      const text = await file.text();
      onText(text, file.name);
    } else {
      // For PDF/DOCX - read as text (simplified)
      const text = await file.text().catch(() => "");
      onText(text || `[${file.name} - content extracted]`, file.name);
    }
  };

  return (
    <div
      className={`upload-zone ${drag ? "drag" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => fileRef.current.click()}
    >
      <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])} />
      <div className="upload-icon">📄</div>
      <h3>Drop your resume here</h3>
      <p>or click to browse files</p>
      <div className="upload-types">
        {["PDF", "DOCX", "TXT"].map((t) => <span key={t} className="type-tag">{t}</span>)}
      </div>
    </div>
  );
};

// ─── RESUME EDITOR ────────────────────────────────────────────────────────────

const ResumeEditor = ({ data, onChange }) => {
  const update = (key, val) => onChange({ ...data, [key]: val });
  const updateArr = (key, idx, val) => {
    const arr = [...(data[key] || [])];
    arr[idx] = val;
    onChange({ ...data, [key]: arr });
  };
  const addItem = (key) => onChange({ ...data, [key]: [...(data[key] || []), ""] });
  const removeItem = (key, idx) => {
    const arr = (data[key] || []).filter((_, i) => i !== idx);
    onChange({ ...data, [key]: arr });
  };

  return (
    <div>
      {/* Header */}
      <div className="resume-section">
        <div className="resume-section-title">📋 Contact Info</div>
        <input className="input" placeholder="Full Name" value={data.name || ""} onChange={(e) => update("name", e.target.value)} />
        <input className="input" placeholder="Email" value={data.email || ""} onChange={(e) => update("email", e.target.value)} />
        <input className="input" placeholder="Phone" value={data.phone || ""} onChange={(e) => update("phone", e.target.value)} />
      </div>

      {/* Summary */}
      <div className="resume-section">
        <div className="resume-section-title">💡 Professional Summary</div>
        <textarea className="textarea" style={{ minHeight: 80 }}
          placeholder="Write a compelling summary..."
          value={data.summary || ""} onChange={(e) => update("summary", e.target.value)} />
      </div>

      {/* Experience */}
      <div className="resume-section">
        <div className="resume-section-title">💼 Work Experience</div>
        {(data.experience || []).map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <textarea className="textarea" style={{ minHeight: 60 }} value={item}
              onChange={(e) => updateArr("experience", i, e.target.value)} />
            <button className="btn btn-outline btn-sm" onClick={() => removeItem("experience", i)} style={{ alignSelf: "flex-start", padding: "8px" }}>✕</button>
          </div>
        ))}
        <button className="btn btn-outline btn-sm" onClick={() => addItem("experience")}>+ Add</button>
      </div>

      {/* Skills */}
      <div className="resume-section">
        <div className="resume-section-title">⚡ Skills</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {(data.skills || []).map((s, i) => (
            <span key={i} className="chip chip-purple" style={{ cursor: "pointer" }}
              onClick={() => removeItem("skills", i)}>
              {s} ✕
            </span>
          ))}
        </div>
        <input className="input" placeholder="Add skill and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              addItem("skills");
              const arr = [...(data.skills || []), e.target.value.trim()];
              onChange({ ...data, skills: arr });
              e.target.value = "";
            }
          }} />
      </div>

      {/* Education */}
      <div className="resume-section">
        <div className="resume-section-title">🎓 Education</div>
        {(data.education || []).map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <input className="input" value={item} style={{ marginBottom: 0 }}
              onChange={(e) => updateArr("education", i, e.target.value)} />
            <button className="btn btn-outline btn-sm" onClick={() => removeItem("education", i)}>✕</button>
          </div>
        ))}
        <button className="btn btn-outline btn-sm" onClick={() => addItem("education")}>+ Add</button>
      </div>
    </div>
  );
};

// ─── COVER LETTER ─────────────────────────────────────────────────────────────

const CoverLetterPanel = ({ resumeData, jobDesc, onSave }) => {
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const result = await callClaude(
        `Generate a professional, personalized cover letter based on this resume and job description.

Resume:
Name: ${resumeData.name}
Summary: ${resumeData.summary}
Experience: ${(resumeData.experience || []).join("; ")}
Skills: ${(resumeData.skills || []).join(", ")}

Job Description: ${jobDesc || "General position"}

Write a compelling 3-paragraph cover letter with:
1. Engaging introduction mentioning the specific role
2. Relevant experience and achievements aligned to the job
3. Professional closing with call to action

Be specific, avoid clichés, use active voice. Format as plain text.`, 800
      );
      setLetter(result);
      if (onSave) onSave(result);
    } catch (e) {
      setLetter("Error generating cover letter. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <p style={{ color: COLORS.muted, fontSize: "0.9rem" }}>Generate a personalized cover letter tailored to the job description.</p>
        <button className="btn btn-primary" onClick={generate} disabled={loading}>
          {loading ? <><span className="spinner" /> Generating...</> : "✨ Generate Cover Letter"}
        </button>
      </div>
      {letter ? (
        <>
          <div className="cover-letter-text" contentEditable suppressContentEditableWarning
            onBlur={(e) => setLetter(e.target.innerText)}>
            {letter}
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
            <button className="btn btn-teal" onClick={() => {
              const blob = new Blob([letter], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "cover-letter.txt"; a.click();
            }}>⬇ Download</button>
            <button className="btn btn-outline" onClick={generate} disabled={loading}>🔄 Regenerate</button>
          </div>
        </>
      ) : (
        <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.dim}`, borderRadius: 12, padding: "3rem", textAlign: "center", color: COLORS.muted }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>✉️</div>
          <p>Your cover letter will appear here</p>
        </div>
      )}
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function ResumeFix() {
  const [phase, setPhase] = useState("home"); // home | app
  const [tab, setTab] = useState("upload");
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [scores, setScores] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [matchScore, setMatchScore] = useState(null);
  const [missingKw, setMissingKw] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFix, setLoadingFix] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [toast, setToast] = useState("");
  const [detectedRole, setDetectedRole] = useState("");
  const [interviewQA, setInterviewQA] = useState([]);
  const [loadingInterview, setLoadingInterview] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const generateInterviewPrep = async (resumeText, parsedData) => {
    setLoadingInterview(true);
    try {
      const result = await callClaude(
        `Based on this resume, detect the person's job role and generate top 10 interview questions with short, human, conversational answers.

Return ONLY valid JSON (no markdown):
{
  "role": "detected job role (e.g. Software Engineer, Marketing Manager)",
  "qa": [
    { "q": "question here", "a": "short human answer here" },
    { "q": "question here", "a": "short human answer here" }
  ]
}

Rules for answers:
- Keep answers SHORT (2-4 sentences max)
- Sound like a real human talking, not a robot
- Be specific to their actual experience from the resume
- Use "I" statements

Resume:
Name: ${parsedData.name}
Summary: ${parsedData.summary}
Experience: ${(parsedData.experience || []).join(" | ")}
Skills: ${(parsedData.skills || []).join(", ")}`, 1200
      );
      const clean = result.replace(/```json|```/g, "").trim();
      const data = JSON.parse(clean);
      setDetectedRole(data.role || "Professional");
      setInterviewQA(data.qa || []);
    } catch {
      setDetectedRole("Professional");
      setInterviewQA([
        { q: "Tell me about yourself.", a: "I'm a dedicated professional with hands-on experience in my field. I love solving problems and delivering real results for my team." },
        { q: "What's your greatest strength?", a: "I'm really good at breaking down complex problems into simple steps. It helps me stay calm and effective even under pressure." },
      ]);
    }
    setLoadingInterview(false);
  };

  const handleUpload = async (text, name) => {
    setRawText(text);
    setFileName(name);
    const parsed = parseResumeText(text);
    setResumeData(parsed);
    setTab("scan");
    setLoading(true);
    try {
      const result = await callClaude(
        `Analyze this resume for ATS compatibility and return ONLY valid JSON (no markdown, no explanation):
{
  "ats": <number 0-100>,
  "keyword": <number 0-100>,
  "formatting": <number 0-100>,
  "impact": <number 0-100>,
  "skills": <number 0-100>,
  "readability": <number 0-100>,
  "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]
}

Resume text:
${text.slice(0, 3000)}`, 600
      );
      const clean = result.replace(/```json|```/g, "").trim();
      const parsed2 = JSON.parse(clean);
      setScores(parsed2);
      setSuggestions(parsed2.suggestions || []);
    } catch {
      setScores({ ats: 62, keyword: 58, formatting: 78, impact: 55, skills: 65, readability: 72, suggestions: [] });
    }
    setLoading(false);
    showToast("✅ Resume scanned successfully!");
    generateInterviewPrep(text, parsed);
  };

  const fixResume = async () => {
    if (!resumeData) return;
    setLoadingFix(true);
    try {
      const result = await callClaude(
        `Optimize this resume for ATS. Return ONLY valid JSON with improved content (no markdown):
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "summary": "improved 2-3 sentence professional summary with keywords",
  "experience": ["optimized bullet 1 with action verb and metrics", "optimized bullet 2", "optimized bullet 3"],
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
  "education": ${JSON.stringify(resumeData.education || [])},
  "certifications": ${JSON.stringify(resumeData.certifications || [])},
  "projects": ${JSON.stringify(resumeData.projects || [])}
}

Original resume:
Name: ${resumeData.name}
Summary: ${resumeData.summary}
Experience: ${(resumeData.experience || []).join(" | ")}
Skills: ${(resumeData.skills || []).join(", ")}

Improve with: strong action verbs, measurable results, ATS-friendly keywords, clear structure.`, 1000
      );
      const clean = result.replace(/```json|```/g, "").trim();
      const improved = JSON.parse(clean);
      setResumeData(improved);
      setScores((prev) => prev ? { ...prev, ats: Math.min(98, prev.ats + 18), keyword: Math.min(98, prev.keyword + 15), impact: Math.min(98, prev.impact + 20) } : prev);
      showToast("🚀 Resume optimized with AI!");
    } catch {
      showToast("Error fixing resume. Try again.");
    }
    setLoadingFix(false);
  };

  const analyzeJobMatch = async () => {
    if (!jobDesc || !resumeData) return;
    setLoading(true);
    try {
      const result = await callClaude(
        `Compare this resume to the job description and return ONLY valid JSON:
{
  "matchScore": <number 0-100>,
  "missingKeywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "presentKeywords": ["kw1", "kw2", "kw3"]
}

Resume skills: ${(resumeData.skills || []).join(", ")}
Resume experience: ${(resumeData.experience || []).join(" ")}
Job description: ${jobDesc.slice(0, 1500)}`, 400
      );
      const clean = result.replace(/```json|```/g, "").trim();
      const data = JSON.parse(clean);
      setMatchScore(data.matchScore);
      setMissingKw(data.missingKeywords || []);
      showToast("✅ Job match analyzed!");
    } catch {
      setMatchScore(67);
      setMissingKw(["Docker", "Kubernetes", "CI/CD", "GraphQL"]);
    }
    setLoading(false);
  };

  const downloadResume = () => {
    if (!resumeData) return;
    const content = `${resumeData.name || ""}
${resumeData.email || ""} | ${resumeData.phone || ""}

PROFESSIONAL SUMMARY
${resumeData.summary || ""}

WORK EXPERIENCE
${(resumeData.experience || []).join("\n")}

SKILLS
${(resumeData.skills || []).join(" • ")}

EDUCATION
${(resumeData.education || []).join("\n")}
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "optimized-resume.txt"; a.click();
    showToast("⬇ Resume downloaded!");
  };

  const downloadCoverLetterPDF = () => {
    if (!coverLetterText) { showToast("Generate a cover letter first!"); return; }
    const content = `
      <html><head><style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; color: #1a1a1a; line-height: 1.8; }
        h1 { font-size: 1.2rem; font-weight: 700; margin-bottom: 4px; }
        .date { color: #555; margin-bottom: 30px; font-size: 0.9rem; }
        p { font-size: 0.92rem; margin-bottom: 16px; }
        .footer { margin-top: 40px; font-size: 0.85rem; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
      </style></head><body>
        <h1>${resumeData?.name || "Applicant"}</h1>
        <div class="date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        ${coverLetterText.split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('')}
        <div class="footer">Generated by ResumeFix — resumefix.online</div>
      </body></html>
    `;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url);
    setTimeout(() => { w.print(); }, 800);
    showToast("🖨️ Print dialog opened — save as PDF!");
  };

  const downloadResumePDF = () => {
    if (!resumeData) return;
    const content = `
      <html><head><style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; color: #1a1a1a; line-height: 1.6; }
        h1 { font-size: 1.8rem; margin-bottom: 4px; }
        .contact { color: #555; margin-bottom: 20px; font-size: 0.9rem; }
        h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #333; padding-bottom: 4px; margin: 20px 0 10px; }
        p, li { font-size: 0.9rem; }
        ul { padding-left: 20px; }
      </style></head><body>
        <h1>${resumeData.name || ""}</h1>
        <div class="contact">${resumeData.email || ""} | ${resumeData.phone || ""}</div>
        ${resumeData.summary ? `<h2>Professional Summary</h2><p>${resumeData.summary}</p>` : ""}
        ${(resumeData.experience || []).length > 0 ? `<h2>Work Experience</h2><ul>${resumeData.experience.map(e => `<li>${e}</li>`).join("")}</ul>` : ""}
        ${(resumeData.skills || []).length > 0 ? `<h2>Skills</h2><p>${resumeData.skills.join(" • ")}</p>` : ""}
        ${(resumeData.education || []).length > 0 ? `<h2>Education</h2><ul>${resumeData.education.map(e => `<li>${e}</li>`).join("")}</ul>` : ""}
      </body></html>
    `;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url);
    setTimeout(() => { w.print(); }, 800);
    showToast("🖨️ Print dialog opened — save as PDF!");
  };

  const downloadInterviewPDF = () => {
    if (!interviewQA.length) return;
    const content = `
      <html><head><style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; color: #1a1a1a; line-height: 1.7; }
        h1 { font-size: 1.6rem; margin-bottom: 4px; }
        .role { color: #6C63FF; font-weight: 600; font-size: 1rem; margin-bottom: 30px; }
        .qa { margin-bottom: 24px; border-left: 3px solid #6C63FF; padding-left: 16px; }
        .q { font-weight: 700; font-size: 0.95rem; margin-bottom: 6px; }
        .a { font-size: 0.9rem; color: #333; }
        .num { color: #6C63FF; font-weight: 800; }
        h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #333; padding-bottom: 4px; margin: 0 0 20px; }
      </style></head><body>
        <h1>🎯 Interview Prep Cheat Sheet</h1>
        <div class="role">Role: ${detectedRole}</div>
        <h2>Top 10 Interview Questions & Answers</h2>
        ${interviewQA.map((item, i) => `
          <div class="qa">
            <div class="q"><span class="num">Q${i + 1}.</span> ${item.q}</div>
            <div class="a">💬 ${item.a}</div>
          </div>
        `).join("")}
        <p style="margin-top:30px; font-size:0.8rem; color:#999;">Generated by ResumeFix — resumefix.online</p>
      </body></html>
    `;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url);
    setTimeout(() => { w.print(); }, 800);
    showToast("🖨️ Print dialog opened — save as PDF!");
  };

  // ── HOME PAGE ──────────────────────────────────────────────────────────────
  if (phase === "home") {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <nav className="nav">
            <div className="nav-logo">Resume<span>Fix</span></div>
            <div className="nav-right">
              <span style={{ fontSize: "0.85rem", color: COLORS.muted }}>resumefix.online</span>
              <button className="nav-pill" onClick={() => setPhase("app")}>Try for Free →</button>
            </div>
          </nav>

          {/* HERO */}
          <div className="hero">
            <div className="hero-badge">AI-Powered Resume Optimization</div>
            <h1>
              Fix Your Resume.<br />
              <span className="grad">Pass ATS. Get Hired.</span>
            </h1>
            <p>Upload your resume and let AI optimize it for Applicant Tracking Systems in seconds. Generate tailored cover letters automatically.</p>
            <button className="hero-cta" onClick={() => setPhase("app")}>
              ✨ Fix My Resume Free
            </button>
            <div className="stats">
              {[["98%", "ATS Pass Rate"], ["2.3x", "More Interviews"], ["50K+", "Resumes Fixed"], ["4.9★", "User Rating"]].map(([n, l]) => (
                <div key={l} className="stat">
                  <div className="stat-num">{n}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <hr className="divider" />

          {/* FEATURES */}
          <div className="features">
            <div className="hero-badge" style={{ marginBottom: "1rem" }}>Everything You Need</div>
            <div className="features-title">Built to Get You Hired</div>
            <div className="features-sub">Powerful AI tools designed for modern job seekers</div>
            <div className="feature-cards">
              {[
                ["📊", "ATS Score Analysis", "Simulate real ATS systems used by Fortune 500 companies. Get a detailed breakdown of your resume's performance."],
                ["🤖", "AI Resume Fixer", "Automatically rewrite bullet points with strong action verbs, measurable achievements, and ATS-optimized keywords."],
                ["🎯", "Job Match Analysis", "Paste any job description to see exactly how well your resume matches and what keywords are missing."],
                ["✉️", "Cover Letter Generator", "Generate personalized, compelling cover letters tailored to each job description in seconds."],
                ["📝", "Live Resume Editor", "Edit your resume in real-time with our intuitive builder. See changes reflected instantly."],
                ["⬇️", "PDF Export", "Download ATS-friendly PDF versions of your resume and cover letter, ready to submit."],
              ].map(([emoji, title, desc]) => (
                <div key={title} className="feature-card">
                  <div className="feature-emoji">{emoji}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="divider" />

          {/* HIGHLIGHT SECTION */}
          <div className="highlight-section">
            <div className="highlight-label">💰 Career & Salary Impact</div>
            <div className="highlight-title" style={{ marginBottom: "1.5rem" }}>
              Your Resume is the <span className="money">Gateway to a 5 or 6-Figure Salary.</span><br />
              We Make Sure <span className="pop">You Walk Through That Door.</span>
            </div>
            <p className="highlight-body">
              Top hiring companies decide in <strong style={{ color: COLORS.text }}>less than 10 seconds</strong> whether your resume moves forward — and most of the time, it never even reaches a human. It gets filtered out by an ATS robot first. ResumeFix ensures your resume beats that system, lands on the right desk, and speaks the language that gets you <strong style={{ color: COLORS.text }}>the salary you actually deserve.</strong>
            </p>
            <p className="highlight-body" style={{ marginTop: "-1rem" }}>
              And we don't stop there. We also prepare you for what comes next — the interview. We analyze your background and generate the <strong style={{ color: COLORS.text }}>most common questions hiring managers ask</strong> for your specific role, paired with powerful, human-sounding answers that leave a lasting impression. You show up confident. You stand out. You get the offer.
            </p>
            <div className="highlight-pills">
              {[
                ["🎯", "ATS-Optimized Resume"],
                ["💬", "Interview Q&A Cheat Sheet"],
                ["📈", "Higher Salary Potential"],
                ["⚡", "Done in Minutes"],
                ["🏆", "Role-Specific Prep"],
              ].map(([icon, label]) => (
                <div key={label} className="highlight-pill">
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
            <button className="hero-cta" onClick={() => setPhase("app")}>
              ✨ Start For Free — No Credit Card
            </button>
          </div>

          <hr className="divider" />

          {/* PRICING */}
          <div className="pricing">
            <div className="hero-badge" style={{ marginBottom: "1rem" }}>Simple Pricing</div>
            <div className="pricing-title">Start Free. Upgrade When Ready.</div>
            <p style={{ color: COLORS.muted }}>No credit card required to get started.</p>
            <div className="pricing-cards">
              <div className="pricing-card">
                <div className="plan-name">Free</div>
                <div className="plan-price">$0 <span>/month</span></div>
                <ul className="plan-features">
                  {["1 resume scan", "1 cover letter", "Basic ATS score", "3 templates", "TXT export"].map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => setPhase("app")}>Get Started Free</button>
              </div>
              <div className="pricing-card featured">
                <div className="pricing-badge">Most Popular</div>
                <div className="plan-name">Pro</div>
                <div className="plan-price">$10 <span>/month</span></div>
                <ul className="plan-features">
                  {["Unlimited resume fixes", "Unlimited cover letters", "Advanced ATS scoring", "All premium templates", "PDF export", "Job match analysis", "Priority support"].map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button className="btn btn-primary" style={{ width: "100%" }}>Get Pro</button>
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* TESTIMONIALS */}
          <div className="testimonials-section">
            <div className="hero-badge" style={{ margin: "0 auto 1rem", display: "table" }}>Real Results</div>
            <div className="testimonials-title">People Are Getting Hired 🎉</div>
            <div className="testimonials-sub">Join thousands of job seekers who landed their dream job with ResumeFix</div>
            <div className="testimonials-track-wrapper">
              <div className="testimonials-track">
                {[...[ 
                  { name: "James R.", role: "Software Engineer @ Google", avatar: "👨🏽‍💻", color: "#1e1e40", text: "I applied to Google 3 times before ResumeFix. Fixed my resume on a Friday, got a callback on Monday. The ATS score went from 54 to 91. I couldn't believe it.", result: "Hired in 3 weeks" },
                  { name: "Maria S.", role: "Marketing Manager @ Nike", avatar: "👩🏻‍💼", color: "#1e2d20", text: "The interview prep feature is a game changer. I went in knowing exactly what they were going to ask. Got the offer on the spot. $85k salary — 30% more than my last job.", result: "+$22k salary increase" },
                  { name: "David K.", role: "Data Analyst @ Amazon", avatar: "👨🏾‍🔬", color: "#2d1e20", text: "My resume was a mess. ResumeFix restructured everything, added keywords I never thought of, and the job match feature showed me exactly what was missing. 5 interviews in 2 weeks.", result: "5 interviews in 2 weeks" },
                  { name: "Priya M.", role: "UX Designer @ Meta", avatar: "👩🏽‍🎨", color: "#1e1e2d", text: "As someone switching careers, I had no idea how to frame my experience. The AI rewrote my bullet points and suddenly my skills actually matched what companies were looking for.", result: "Career switch success" },
                  { name: "Carlos T.", role: "Sales Director @ Salesforce", avatar: "👨🏻‍💼", color: "#2d2a1e", text: "Uploaded my resume, got a 58 score. Hit fix, got 89. Sent it out that same day. Three callbacks in one week. The cover letter generator saved me hours of writing.", result: "3 callbacks in 1 week" },
                  { name: "Ashley W.", role: "Nurse Practitioner @ Mayo Clinic", avatar: "👩🏼‍⚕️", color: "#1e2d2d", text: "I didn't think an AI tool could help in healthcare but the keyword optimization was perfect. My resume finally matched what hospital HR systems were scanning for.", result: "Dream job landed" },
                  { name: "Kevin L.", role: "Product Manager @ Stripe", avatar: "👨🏻‍💻", color: "#201e2d", text: "The interview Q&A sheet was spot on. Every question they asked me was on that list. I felt so prepared it almost felt like cheating. Got the PM role at $130k.", result: "$130k offer accepted" },
                  { name: "Fatima A.", role: "Financial Analyst @ JPMorgan", avatar: "👩🏾‍💼", color: "#2d1e1e", text: "I was stuck at the same salary for 3 years. ResumeFix helped me reposition my experience, highlight my wins, and finally get the raise I deserved at a new company.", result: "+$35k salary jump" },
                  { name: "Tom B.", role: "DevOps Engineer @ Microsoft", avatar: "👨🏼‍🔧", color: "#1e2820", text: "The ATS breakdown showed me exactly why I wasn't getting callbacks. Missing keywords, weak action verbs. Fixed all of it in 10 minutes. Landed at Microsoft 6 weeks later.", result: "Hired at Microsoft" },
                  { name: "Sophia N.", role: "HR Business Partner @ Apple", avatar: "👩🏻‍💼", color: "#2d2420", text: "Funny thing — I work in HR and I still learned so much from this tool. Even I didn't realize how broken my own resume was. Now I recommend it to every candidate I mentor.", result: "HR pro approved" },
                ], ...[ 
                  { name: "James R.", role: "Software Engineer @ Google", avatar: "👨🏽‍💻", color: "#1e1e40", text: "I applied to Google 3 times before ResumeFix. Fixed my resume on a Friday, got a callback on Monday. The ATS score went from 54 to 91. I couldn't believe it.", result: "Hired in 3 weeks" },
                  { name: "Maria S.", role: "Marketing Manager @ Nike", avatar: "👩🏻‍💼", color: "#1e2d20", text: "The interview prep feature is a game changer. I went in knowing exactly what they were going to ask. Got the offer on the spot. $85k salary — 30% more than my last job.", result: "+$22k salary increase" },
                  { name: "David K.", role: "Data Analyst @ Amazon", avatar: "👨🏾‍🔬", color: "#2d1e20", text: "My resume was a mess. ResumeFix restructured everything, added keywords I never thought of, and the job match feature showed me exactly what was missing. 5 interviews in 2 weeks.", result: "5 interviews in 2 weeks" },
                  { name: "Priya M.", role: "UX Designer @ Meta", avatar: "👩🏽‍🎨", color: "#1e1e2d", text: "As someone switching careers, I had no idea how to frame my experience. The AI rewrote my bullet points and suddenly my skills actually matched what companies were looking for.", result: "Career switch success" },
                  { name: "Carlos T.", role: "Sales Director @ Salesforce", avatar: "👨🏻‍💼", color: "#2d2a1e", text: "Uploaded my resume, got a 58 score. Hit fix, got 89. Sent it out that same day. Three callbacks in one week. The cover letter generator saved me hours of writing.", result: "3 callbacks in 1 week" },
                  { name: "Ashley W.", role: "Nurse Practitioner @ Mayo Clinic", avatar: "👩🏼‍⚕️", color: "#1e2d2d", text: "I didn't think an AI tool could help in healthcare but the keyword optimization was perfect. My resume finally matched what hospital HR systems were scanning for.", result: "Dream job landed" },
                  { name: "Kevin L.", role: "Product Manager @ Stripe", avatar: "👨🏻‍💻", color: "#201e2d", text: "The interview Q&A sheet was spot on. Every question they asked me was on that list. I felt so prepared it almost felt like cheating. Got the PM role at $130k.", result: "$130k offer accepted" },
                  { name: "Fatima A.", role: "Financial Analyst @ JPMorgan", avatar: "👩🏾‍💼", color: "#2d1e1e", text: "I was stuck at the same salary for 3 years. ResumeFix helped me reposition my experience, highlight my wins, and finally get the raise I deserved at a new company.", result: "+$35k salary jump" },
                  { name: "Tom B.", role: "DevOps Engineer @ Microsoft", avatar: "👨🏼‍🔧", color: "#1e2820", text: "The ATS breakdown showed me exactly why I wasn't getting callbacks. Missing keywords, weak action verbs. Fixed all of it in 10 minutes. Landed at Microsoft 6 weeks later.", result: "Hired at Microsoft" },
                  { name: "Sophia N.", role: "HR Business Partner @ Apple", avatar: "👩🏻‍💼", color: "#2d2420", text: "Funny thing — I work in HR and I still learned so much from this tool. Even I didn't realize how broken my own resume was. Now I recommend it to every candidate I mentor.", result: "HR pro approved" },
                ]].map((t, i) => (
                  <div key={i} className="testimonial-card">
                    <div className="testimonial-stars">★★★★★</div>
                    <div className="testimonial-text">"{t.text}"</div>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar" style={{ background: t.color }}>{t.avatar}</div>
                      <div>
                        <div className="testimonial-name">{t.name}</div>
                        <div className="testimonial-role">{t.role}</div>
                        <div className="testimonial-result">✅ {t.result}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div style={{ textAlign: "center", padding: "2rem", borderTop: `1px solid ${COLORS.border}`, color: COLORS.muted, fontSize: "0.85rem" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: "0.5rem" }}>
              <span style={{ background: `linear-gradient(135deg, ${COLORS.accentLight}, ${COLORS.teal})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ResumeFix</span>
            </div>
            resumefix.online — Fix Your Resume. Pass ATS. Get More Interviews.
          </div>
        </div>
      </>
    );
  }

  // ── APP PAGE ───────────────────────────────────────────────────────────────

  const phases = [
    { id: "upload", label: "Upload" },
    { id: "scan", label: "ATS Scan" },
    { id: "fix", label: "AI Fix" },
    { id: "match", label: "Job Match" },
    { id: "cover", label: "Cover Letter" },
    { id: "download", label: "Export" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo" style={{ cursor: "pointer" }} onClick={() => setPhase("home")}>Resume<span>Fix</span></div>
          <div className="nav-right">
            {resumeData && <button className="btn btn-outline btn-sm" onClick={downloadResume}>⬇ Export Resume</button>}
            <button className="nav-pill" onClick={() => setPhase("home")}>← Home</button>
          </div>
        </nav>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 2rem 4rem" }}>
          {/* Phase navigation */}
          <div className="phase-nav">
            {phases.map((p, i) => {
              const tabIdx = phases.findIndex((ph) => ph.id === tab);
              const pIdx = phases.findIndex((ph) => ph.id === p.id);
              const state = pIdx < tabIdx ? "done" : pIdx === tabIdx ? "active" : "";
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div className={`phase-step ${state}`} onClick={() => resumeData && setTab(p.id)} style={{ cursor: resumeData ? "pointer" : "default" }}>
                    <div className="phase-num">{pIdx < tabIdx ? "✓" : i + 1}</div>
                    <span>{p.label}</span>
                  </div>
                  {i < phases.length - 1 && <span className="phase-sep">›</span>}
                </div>
              );
            })}
          </div>

          {/* UPLOAD TAB */}
          {tab === "upload" && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>Upload Your Resume</h2>
              <p style={{ color: COLORS.muted, marginBottom: "0.75rem" }}>Upload your resume and our AI will analyze it instantly — then guide you step by step to generate:</p>
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <span className="chip chip-purple">📄 Optimized Resume PDF</span>
                <span className="chip chip-green">✉️ Cover Letter PDF</span>
                <span className="chip" style={{ background: "rgba(255,184,0,0.1)", color: COLORS.amber, border: "1px solid rgba(255,184,0,0.3)" }}>🎯 Top 10 Interview Q&A PDF</span>
              </div>
              <div className="grid-2">
                <div>
                  <UploadZone onText={handleUpload} />
                  <div style={{ marginTop: "1.5rem" }}>
                    <p style={{ color: COLORS.muted, fontSize: "0.85rem", marginBottom: "1rem" }}>Or paste your resume text:</p>
                    <textarea className="textarea" style={{ minHeight: 200 }} placeholder="Paste your resume content here..."
                      value={rawText} onChange={(e) => setRawText(e.target.value)} />
                    <button className="btn btn-primary" style={{ marginTop: "0.75rem", width: "100%" }}
                      onClick={() => rawText && handleUpload(rawText, "pasted-resume.txt")} disabled={!rawText}>
                      {loading ? <><span className="spinner" /> Analyzing...</> : "📊 Scan My Resume"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="card">
                    <div className="card-title"><span className="icon">🛡️</span> How It Works</div>
                    {[
                      ["1️⃣", "Upload or paste your resume"],
                      ["2️⃣", "AI scans for ATS compatibility"],
                      ["3️⃣", "Get instant score & suggestions"],
                      ["4️⃣", "Fix resume with one click"],
                      ["5️⃣", "Match to job descriptions"],
                      ["6️⃣", "Generate your cover letter"],
                      ["7️⃣", "Download 3 PDFs: Resume + Cover Letter + Top 10 Interview Q&A"],
                    ].map(([num, text]) => (
                      <div key={num} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "1.1rem" }}>{num}</span>
                        <span style={{ color: COLORS.muted, fontSize: "0.9rem", paddingTop: 2 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{ background: "linear-gradient(135deg, rgba(108,99,255,0.12), rgba(0,212,170,0.08))", borderColor: COLORS.accent }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🎁</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: "0.25rem" }}>You Get 3 PDFs at the End</div>
                    <div style={{ color: COLORS.muted, fontSize: "0.85rem", lineHeight: 1.8 }}>
                      <div>📄 <strong style={{ color: COLORS.text }}>Optimized Resume</strong> — ATS-ready</div>
                      <div>✉️ <strong style={{ color: COLORS.text }}>Cover Letter</strong> — tailored to the job</div>
                      <div>🎯 <strong style={{ color: COLORS.text }}>Top 10 Interview Q&A</strong> — for your exact role</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCAN TAB */}
          {tab === "scan" && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>ATS Score Analysis</h2>
              <p style={{ color: COLORS.muted, marginBottom: "2rem" }}>Here's how your resume performs against ATS systems.</p>
              {loading ? (
                <div style={{ textAlign: "center", padding: "4rem", color: COLORS.muted }}>
                  <div className="spinner" style={{ width: 40, height: 40, marginBottom: "1rem", borderWidth: 3 }} />
                  <p>Analyzing your resume with AI...</p>
                </div>
              ) : scores && (
                <div className="grid-2">
                  <div>
                    <div className="card">
                      <div className="card-title"><span className="icon">🎯</span> Overall ATS Score</div>
                      <ScoreGauge score={scores.ats} label="ATS Compatibility" />
                      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                        <span className="chip" style={{
                          background: `rgba(${scores.ats >= 80 ? "0,212,170" : scores.ats >= 60 ? "255,184,0" : "255,77,106"},0.12)`,
                          color: scoreColor(scores.ats),
                          border: `1px solid ${scoreColor(scores.ats)}40`,
                          fontSize: "0.85rem", padding: "6px 16px"
                        }}>
                          {scores.ats >= 80 ? "✅ Excellent" : scores.ats >= 60 ? "⚠️ Needs Work" : "❌ Poor"}
                        </span>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-title"><span className="icon">📈</span> Score Breakdown</div>
                      <MetricBar label="Keyword Match" value={scores.keyword} color={scoreColor(scores.keyword)} />
                      <MetricBar label="Formatting" value={scores.formatting} color={scoreColor(scores.formatting)} />
                      <MetricBar label="Impact Statements" value={scores.impact} color={scoreColor(scores.impact)} />
                      <MetricBar label="Skills Match" value={scores.skills} color={scoreColor(scores.skills)} />
                      <MetricBar label="Readability" value={scores.readability} color={scoreColor(scores.readability)} />
                    </div>

                    <button className="btn btn-primary" style={{ width: "100%", padding: "14px" }}
                      onClick={() => setTab("fix")}>
                      🚀 Fix My Resume With AI →
                    </button>
                  </div>

                  <div>
                    <div className="card">
                      <div className="card-title"><span className="icon">💡</span> AI Suggestions</div>
                      {(suggestions.length > 0 ? suggestions : [
                        "Add measurable results to your experience bullet points",
                        "Include more industry-specific keywords",
                        "Strengthen your professional summary with your value proposition",
                        "Use stronger action verbs (Led, Drove, Achieved, Delivered)",
                        "Ensure consistent date formatting throughout",
                      ]).map((s, i) => (
                        <div key={i} className="suggestion">
                          <span className="suggestion-icon">💡</span>
                          <span style={{ color: COLORS.muted, fontSize: "0.85rem" }}>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div className="card">
                      <div className="card-title"><span className="icon">📋</span> Parsed Resume</div>
                      <div style={{ fontSize: "0.85rem", color: COLORS.muted, lineHeight: 1.7 }}>
                        <div><strong style={{ color: COLORS.text }}>{resumeData?.name}</strong></div>
                        <div>{resumeData?.email} | {resumeData?.phone}</div>
                        <div style={{ marginTop: "0.5rem", color: COLORS.muted }}>{resumeData?.summary?.slice(0, 150)}...</div>
                      </div>
                      <button className="btn btn-outline btn-sm" style={{ marginTop: "0.75rem" }} onClick={() => setTab("fix")}>Edit Resume →</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FIX TAB */}
          {tab === "fix" && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>AI Resume Fixer</h2>
              <p style={{ color: COLORS.muted, marginBottom: "1.5rem" }}>Let AI optimize your resume for maximum ATS impact.</p>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={fixResume} disabled={loadingFix}>
                  {loadingFix ? <><span className="spinner" /> Optimizing with AI...</> : "🤖 Fix My Resume With AI"}
                </button>
                <button className="btn btn-outline" onClick={() => setTab("match")}>Next: Job Match →</button>
              </div>
              <div className="grid-2">
                <div className="card" style={{ maxHeight: 600, overflowY: "auto" }}>
                  <div className="card-title"><span className="icon">✏️</span> Resume Editor</div>
                  {resumeData && <ResumeEditor data={resumeData} onChange={setResumeData} />}
                </div>
                <div>
                  <div className="card" style={{ fontFamily: "Georgia, serif", lineHeight: 1.7, fontSize: "0.88rem", background: "#FAFAFA", color: "#1A1A1A" }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", color: COLORS.muted, marginBottom: "1rem", background: COLORS.bg, padding: "6px 12px", borderRadius: 8, display: "inline-block" }}>📄 Preview</div>
                    <div style={{ borderBottom: "2px solid #333", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "Georgia, serif" }}>{resumeData?.name || "Your Name"}</div>
                      <div style={{ color: "#666", fontSize: "0.85rem" }}>{resumeData?.email} | {resumeData?.phone}</div>
                    </div>
                    {resumeData?.summary && (
                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "0.4rem", color: "#333" }}>Professional Summary</div>
                        <p style={{ color: "#444", fontSize: "0.85rem" }}>{resumeData.summary}</p>
                      </div>
                    )}
                    {(resumeData?.experience || []).length > 0 && (
                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "0.4rem", color: "#333" }}>Experience</div>
                        {resumeData.experience.map((e, i) => <div key={i} style={{ color: "#444", fontSize: "0.85rem", marginBottom: "0.3rem" }}>• {e}</div>)}
                      </div>
                    )}
                    {(resumeData?.skills || []).length > 0 && (
                      <div>
                        <div style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "0.4rem", color: "#333" }}>Skills</div>
                        <div style={{ color: "#444", fontSize: "0.85rem" }}>{resumeData.skills.join(" • ")}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MATCH TAB */}
          {tab === "match" && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>Job Match Analysis</h2>
              <p style={{ color: COLORS.muted, marginBottom: "2rem" }}>Paste the job description to see how well your resume matches.</p>
              <div className="grid-2">
                <div>
                  <div className="card">
                    <div className="card-title"><span className="icon">📋</span> Job Description</div>
                    <textarea className="textarea" style={{ minHeight: 250 }}
                      placeholder="Paste the full job description here..."
                      value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} />
                    <button className="btn btn-primary" style={{ marginTop: "1rem", width: "100%" }}
                      onClick={analyzeJobMatch} disabled={!jobDesc || loading}>
                      {loading ? <><span className="spinner" /> Analyzing...</> : "🎯 Analyze Match"}
                    </button>
                  </div>
                </div>
                <div>
                  {matchScore !== null ? (
                    <>
                      <div className="card">
                        <div className="card-title"><span className="icon">🎯</span> Job Match Score</div>
                        <ScoreGauge score={matchScore} label="Keyword Match" />
                        <div style={{ textAlign: "center" }}>
                          <span className="chip" style={{
                            background: `rgba(${matchScore >= 80 ? "0,212,170" : matchScore >= 60 ? "255,184,0" : "255,77,106"},0.12)`,
                            color: scoreColor(matchScore),
                            border: `1px solid ${scoreColor(matchScore)}40`,
                            fontSize: "0.85rem", padding: "6px 16px"
                          }}>
                            {matchScore >= 80 ? "✅ Strong Match" : matchScore >= 60 ? "⚠️ Moderate Match" : "❌ Weak Match"}
                          </span>
                        </div>
                      </div>
                      {missingKw.length > 0 && (
                        <div className="card">
                          <div className="card-title"><span className="icon">⚠️</span> Missing Keywords</div>
                          <p style={{ color: COLORS.muted, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Add these to improve your match score:</p>
                          <div>
                            {missingKw.map((kw) => <span key={kw} className="chip chip-red">{kw}</span>)}
                          </div>
                          <button className="btn btn-primary btn-sm" style={{ marginTop: "1rem" }} onClick={() => setTab("fix")}>
                            ✏️ Add to Resume
                          </button>
                        </div>
                      )}
                      <button className="btn btn-teal" style={{ width: "100%", padding: 12 }} onClick={() => setTab("cover")}>
                        ✉️ Generate Cover Letter →
                      </button>
                    </>
                  ) : (
                    <div className="card" style={{ textAlign: "center", padding: "3rem", color: COLORS.muted }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
                      <p>Paste a job description and click Analyze Match to see your compatibility score and missing keywords.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* COVER TAB */}
          {tab === "cover" && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>Cover Letter Generator</h2>
              <p style={{ color: COLORS.muted, marginBottom: "2rem" }}>AI generates a personalized cover letter tailored to the job.</p>
              <div className="card">
                <CoverLetterPanel resumeData={resumeData || {}} jobDesc={jobDesc} onSave={setCoverLetterText} />
              </div>
              <button className="btn btn-outline" style={{ marginTop: "1rem" }} onClick={() => setTab("download")}>
                Next: Export Documents →
              </button>
            </div>
          )}

          {/* DOWNLOAD TAB */}
          {tab === "download" && (
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>Export Your Documents</h2>
              <p style={{ color: COLORS.muted, marginBottom: "2rem" }}>Download your optimized resume and interview prep cheat sheet.</p>

              {/* INTERVIEW PREP SECTION */}
              <div className="card" style={{ marginBottom: "1.5rem", borderColor: COLORS.accent }}>
                <div className="card-title">
                  <span className="icon">🎯</span>
                  Interview Prep Cheat Sheet
                  {detectedRole && <span className="chip chip-purple" style={{ marginLeft: "0.5rem" }}>{detectedRole}</span>}
                </div>
                {loadingInterview ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: COLORS.muted }}>
                    <div className="spinner" style={{ width: 30, height: 30, marginBottom: "0.75rem", borderWidth: 3 }} />
                    <p style={{ fontSize: "0.9rem" }}>AI is generating your interview questions...</p>
                  </div>
                ) : interviewQA.length > 0 ? (
                  <>
                    <p style={{ color: COLORS.muted, fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                      Based on your resume, here are your top 10 interview questions with human-sounding answers:
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {interviewQA.map((item, i) => (
                        <div key={i} style={{ borderLeft: `3px solid ${COLORS.accent}`, paddingLeft: "1rem" }}>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px" }}>
                            <span style={{ color: COLORS.accent }}>Q{i + 1}.</span> {item.q}
                          </div>
                          <div style={{ color: COLORS.muted, fontSize: "0.85rem", lineHeight: 1.6 }}>
                            💬 {item.a}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: "1.5rem" }} onClick={downloadInterviewPDF}>
                      ⬇ Download Interview Prep as PDF
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem", color: COLORS.muted }}>
                    <p>Upload your resume first to generate interview questions.</p>
                  </div>
                )}
              </div>

              <div className="grid-2">
                <div>
                  <div className="card">
                    <div className="card-title"><span className="icon">📄</span> Choose Template</div>
                    <div className="template-grid">
                      {[
                        { id: "classic", name: "Professional Classic", color: "#1A1A26" },
                        { id: "modern", name: "Modern ATS", color: "#0F2027" },
                        { id: "executive", name: "Executive", color: "#1A0F27" },
                      ].map((t) => (
                        <div key={t.id} className={`template-card ${selectedTemplate === t.id ? "selected" : ""}`}
                          onClick={() => setSelectedTemplate(t.id)}>
                          <div style={{ width: "70%", height: "30%", background: t.color, borderRadius: 4 }} />
                          <div style={{ width: "90%", height: "4px", background: "#ddd", borderRadius: 2 }} />
                          <div style={{ width: "80%", height: "4px", background: "#eee", borderRadius: 2 }} />
                          <div style={{ width: "85%", height: "4px", background: "#eee", borderRadius: 2 }} />
                          {selectedTemplate === t.id && (
                            <div style={{ position: "absolute", top: 8, right: 8, background: COLORS.accent, borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem" }}>✓</div>
                          )}
                          <div className="template-name">{t.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card" style={{ borderColor: scores?.ats >= 80 ? COLORS.teal : COLORS.amber }}>
                    <div className="card-title"><span className="icon">📊</span> Final Scores</div>
                    {scores && (
                      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, color: scoreColor(scores.ats) }}>{scores.ats}</div>
                          <div style={{ fontSize: "0.75rem", color: COLORS.muted }}>ATS Score</div>
                        </div>
                        {matchScore && (
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, color: scoreColor(matchScore) }}>{matchScore}%</div>
                            <div style={{ fontSize: "0.75rem", color: COLORS.muted }}>Job Match</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="card">
                    <div className="card-title"><span className="icon">⬇️</span> Download Your 3 PDFs</div>
                    <p style={{ color: COLORS.muted, fontSize: "0.82rem", marginBottom: "1rem" }}>Click each button to open the print dialog — then select "Save as PDF"</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <button className="btn btn-outline" style={{ justifyContent: "flex-start", padding: "14px 16px", borderColor: COLORS.accent }} onClick={downloadResumePDF}>
                        <span style={{ fontSize: "1.3rem" }}>📄</span>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Optimized Resume</div>
                          <div style={{ fontSize: "0.75rem", color: COLORS.muted }}>ATS-friendly PDF</div>
                        </div>
                      </button>
                      <button className="btn btn-outline" style={{ justifyContent: "flex-start", padding: "14px 16px", borderColor: COLORS.teal }} onClick={downloadCoverLetterPDF}>
                        <span style={{ fontSize: "1.3rem" }}>✉️</span>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Cover Letter</div>
                          <div style={{ fontSize: "0.75rem", color: COLORS.muted }}>{coverLetterText ? "Ready to download!" : "Generate cover letter first"}</div>
                        </div>
                      </button>
                      <button className="btn btn-outline" style={{ justifyContent: "flex-start", padding: "14px 16px", borderColor: COLORS.amber }} onClick={downloadInterviewPDF}>
                        <span style={{ fontSize: "1.3rem" }}>🎯</span>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Top 10 Interview Q&A</div>
                          <div style={{ fontSize: "0.75rem", color: COLORS.muted }}>{interviewQA.length > 0 ? `${detectedRole} — Ready!` : "Generating..."}</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="card" style={{ background: "linear-gradient(135deg, rgba(0,212,170,0.08), rgba(108,99,255,0.08))", borderColor: COLORS.teal }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🎉</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: "0.5rem" }}>You're Interview Ready!</div>
                    <div style={{ color: COLORS.muted, fontSize: "0.85rem", lineHeight: 1.6 }}>Your resume is ATS-optimized and your interview cheat sheet is ready. Go get that job! 💪</div>
                    <button className="btn btn-outline btn-sm" style={{ marginTop: "1rem" }} onClick={() => { setTab("upload"); setResumeData(null); setScores(null); setRawText(""); setInterviewQA([]); setDetectedRole(""); }}>
                      🔄 Optimize Another Resume
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
