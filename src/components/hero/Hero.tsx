import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { QRCodeSVG } from "qrcode.react";
import { staggerContainer, staggerItem, ease } from "../../lib/motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { useLenis } from "../../hooks/useLenis";

gsap.registerPlugin(ScrollTrigger);

const SAMPLE_QR = "https://qraft.studio";

const chips = [
  { label: "PNG · SVG", icon: "↓" },
  { label: "Logo overlay", icon: "◈" },
  { label: "Brand colors", icon: "◉" },
];

function QrAssembly() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [assembled, setAssembled] = useState(false);
  const [scanline, setScanline] = useState(false);
  const prefersReduced = useRef(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (prefersReduced.current) {
      setAssembled(true);
      return;
    }

    const tl = gsap.timeline({ delay: 0.8 });
    tl.call(() => setAssembled(true));
    tl.call(() => setScanline(true), undefined, "+=0.3");

    return () => { tl.kill(); };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: 320,
        height: 320,
        borderRadius: 20,
        background: "var(--surface)",
        boxShadow: "0 24px 64px rgba(14, 20, 32, 0.12), 0 4px 16px rgba(14, 20, 32, 0.08)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* QR Code */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={assembled ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: ease.outExpo }}
      >
        <QRCodeSVG
          value={SAMPLE_QR}
          size={260}
          fgColor="#0E1420"
          bgColor="#FFFFFF"
          level="M"
        />
      </motion.div>

      {/* Scanline effect */}
      {scanline && !prefersReduced.current && (
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent, var(--accent) 40%, var(--accent) 60%, transparent)",
            opacity: 0.7,
          }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{
            duration: 2.5,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      )}

      {/* Corner accent lines */}
      {[
        { top: 12, left: 12, rotate: 0 },
        { top: 12, right: 12, rotate: 90 },
        { bottom: 12, left: 12, rotate: -90 },
        { bottom: 12, right: 12, rotate: 180 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0 }}
          animate={assembled ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.06, ease: ease.outExpo }}
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            borderTop: "2px solid var(--accent)",
            borderLeft: "2px solid var(--accent)",
            transform: `rotate(${pos.rotate}deg)`,
            ...pos,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const { t } = useLanguage();
  const lenisRef = useLenis();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target);
    }
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !headlineRef.current) return;

    const words = headlineRef.current.querySelectorAll(".word");
    gsap.fromTo(
      words,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.3,
      }
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width * 30);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height * 20);
  };

  const headline = t("Craft QR codes that match your brand.");
  const words = headline.split(" ");

  return (
    <section
      ref={heroRef}
      id="hero"
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 80,
        position: "relative",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Dot grid backdrop */}
      <div
        aria-hidden="true"
        className="dot-grid"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.6,
        }}
      />

      {/* Decorative QR finder squares */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 80,
          right: "5%",
          opacity: 0.04,
          x: springX,
          y: springY,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="4" y="4" width="48" height="48" rx="6" stroke="var(--ink)" strokeWidth="6" />
          <rect x="16" y="16" width="24" height="24" rx="2" fill="var(--ink)" />
          <rect x="68" y="4" width="48" height="48" rx="6" stroke="var(--ink)" strokeWidth="6" />
          <rect x="80" y="16" width="24" height="24" rx="2" fill="var(--ink)" />
          <rect x="4" y="68" width="48" height="48" rx="6" stroke="var(--ink)" strokeWidth="6" />
          <rect x="16" y="80" width="24" height="24" rx="2" fill="var(--ink)" />
        </svg>
      </motion.div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        {/* Left: Headline + CTAs */}
        <div>
          <h1
            ref={headlineRef}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(36px, 5vw, 60px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              marginBottom: 20,
            }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="word"
                style={{
                  display: "inline-block",
                  marginRight: "0.25em",
                  opacity: 0,
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: ease.outExpo }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: 36,
              maxWidth: 440,
            }}
          >
            {t("Generate, style, and download production-ready QR codes — URL, Wi-Fi, vCard, and more — in seconds. Your brand, pixel-perfect.")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: ease.outExpo }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <a
              href="#templates"
              onClick={(e) => handleNavClick(e, "#templates")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "var(--accent)",
                color: "var(--ink)",
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                letterSpacing: "-0.01em",
                textDecoration: "none",
                transition: "transform 0.2s ease, opacity 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.96)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
              }}
            >
              {t("Start building")} →
            </a>

            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, "#how-it-works")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "transparent",
                color: "var(--ink)",
                border: "1.5px solid var(--border)",
                borderRadius: 10,
                padding: "14px 28px",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                letterSpacing: "-0.01em",
                textDecoration: "none",
                transition: "transform 0.2s ease, opacity 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
            >
              {t("See how it works")}
            </a>
          </motion.div>

          {/* Spec chips */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            transition={{ delayChildren: 1.1, staggerChildren: 0.1 }}
            style={{
              display: "flex",
              gap: 8,
              marginTop: 32,
              flexWrap: "wrap",
            }}
          >
            {chips.map((chip) => (
              <motion.div
                key={chip.label}
                variants={staggerItem}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 100,
                  padding: "6px 12px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                <span style={{ color: "var(--accent)", fontWeight: 700 }}>{chip.icon}</span>
                {t(chip.label)}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: Live QR assembly */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: ease.outExpo }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Floating parallax background ring */}
          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 380,
              height: 380,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              x: springX,
              y: springY,
            }}
          />
          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 460,
              height: 460,
              borderRadius: "50%",
              border: "1px dashed var(--border)",
              x: springX,
              y: springY,
              opacity: 0.5,
            }}
          />

          <QrAssembly />
        </motion.div>
      </div>
    </section>
  );
}
