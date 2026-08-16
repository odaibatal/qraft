import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ease } from "../../lib/motion";
import { useLanguage } from "../../contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    title: "Pick your type",
    body: "URL, Wi-Fi credentials, vCard contact, or raw text — choose what your QR code should encode.",
  },
  {
    num: "02",
    title: "Style it",
    body: "Set foreground and background colors from presets or custom pickers. Choose corner style and error correction level.",
  },
  {
    num: "03",
    title: "Download",
    body: "Export as high-res PNG or crisp vector SVG — ready for print, web, or signage at any scale.",
  },
];

export default function HowItWorks() {
  const lineRef = useRef<SVGLineElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !lineRef.current || !sectionRef.current) return;

    const line = lineRef.current;
    const length = line.getTotalLength ? line.getTotalLength() : 600;
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      end: "bottom 60%",
      scrub: 1,
      onUpdate: (self) => {
        const draw = length - length * self.progress;
        gsap.set(line, { strokeDashoffset: draw });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      style={{
        padding: "100px 0",
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: ease.outExpo }}
          style={{ marginBottom: 64 }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {t("How it works")}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 44px)",
              letterSpacing: "-0.03em",
              color: "var(--ink)",
            }}
          >
            {t("Three steps to done.")}
          </h2>
        </motion.div>

        {/* Steps with connecting line */}
        <div style={{ position: "relative" }}>
          {/* Connecting SVG line (desktop) */}
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 36,
              left: "calc(16.66% - 0px)",
              width: "66.66%",
              height: 2,
              overflow: "visible",
            }}
          >
            <line
              ref={lineRef}
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="var(--border)"
              strokeWidth={2}
              strokeDasharray="6 6"
            />
          </svg>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: ease.outExpo }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {/* Step number bubble */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: i === 0 ? "var(--accent)" : "var(--bg)",
                    border: i === 0 ? "none" : "1.5px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 20,
                    color: i === 0 ? "var(--ink)" : "var(--muted)",
                    marginBottom: 24,
                    position: "relative",
                    zIndex: 1,
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 22,
                    letterSpacing: "-0.02em",
                    color: "var(--ink)",
                    marginBottom: 10,
                  }}
                >
                  {t(step.title)}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    color: "var(--muted)",
                    lineHeight: 1.65,
                  }}
                >
                  {t(step.body)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
