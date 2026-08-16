import { motion } from "motion/react";
import { ease } from "../../lib/motion";
import { useLanguage } from "../../contexts/LanguageContext";

const QrPixelDecor = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    aria-hidden="true"
    style={{ opacity: 0.15 }}
  >
    <rect x="2" y="2" width="28" height="28" rx="4" stroke="#B7F04A" strokeWidth="4" />
    <rect x="10" y="10" width="12" height="12" rx="1" fill="#B7F04A" />
    <rect x="50" y="2" width="28" height="28" rx="4" stroke="#B7F04A" strokeWidth="4" />
    <rect x="58" y="10" width="12" height="12" rx="1" fill="#B7F04A" />
    <rect x="2" y="50" width="28" height="28" rx="4" stroke="#B7F04A" strokeWidth="4" />
    <rect x="10" y="58" width="12" height="12" rx="1" fill="#B7F04A" />
    <rect x="50" y="50" width="7" height="7" fill="#B7F04A" />
    <rect x="61" y="50" width="7" height="7" fill="#B7F04A" />
    <rect x="50" y="61" width="7" height="7" fill="#B7F04A" />
    <rect x="61" y="61" width="7" height="7" fill="#B7F04A" />
    <rect x="71" y="71" width="7" height="7" fill="#B7F04A" />
  </svg>
);

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: ["Studio", "Templates", "How it works", "Changelog"],
  },
  {
    heading: "Resources",
    links: ["Documentation", "API", "Open-source", "Status"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Careers", "Press"],
  },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      style={{
        background: "var(--ink)",
        color: "var(--surface)",
        padding: "80px 0 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* QR pixel decorative motifs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 40,
          right: 40,
        }}
      >
        <QrPixelDecor />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          transform: "rotate(180deg)",
        }}
      >
        <QrPixelDecor />
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Top row: logo + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: ease.outExpo }}
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 60,
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 28,
                letterSpacing: "-0.03em",
                color: "var(--surface)",
                marginBottom: 8,
              }}
            >
              Qraft
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--footer-text)",
                maxWidth: 320,
                lineHeight: 1.6,
              }}
            >
              {t("Premium QR code generation. Brand-perfect, export-ready, instant.")}
            </p>
          </div>

          <motion.a
            href="#studio"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              display: "inline-block",
              background: "var(--accent)",
              color: "var(--ink)",
              borderRadius: 10,
              padding: "12px 24px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              flexShrink: 0,
            }}
          >
            {t("Open Studio")} →
          </motion.a>
        </motion.div>

        {/* Link columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: ease.outExpo }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
            marginBottom: 60,
          }}
        >
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {t(col.heading)}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--footer-text)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--footer-text-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--footer-text)")}
                    >
                      {t(link)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--footer-border)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--footer-text-muted)",
            }}
          >
            {t("© 2026 Qraft Studio. All rights reserved.")}
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--footer-text-muted)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--footer-text-strong)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--footer-text-muted)")}
              >
                {t(item)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
