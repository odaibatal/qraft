import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Wand2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const QrTypes = ["url", "wifi", "vcard", "text"] as const;
type QrType = (typeof QrTypes)[number];

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 500,
        color: "var(--muted)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        display: "block",
        marginBottom: 8,
      }}
    >
      {children}
    </label>
  );
}

function QrCard({ value, type, index }: { value: string; type: QrType; index: number }) {
  const { t } = useLanguage();
  const [downloading, setDownloading] = useState(false);

  const downloadPng = useCallback(async () => {
    setDownloading(true);
    try {
      const svgEl = document.getElementById(`bulk-qr-svg-${index}`);
      if (!svgEl) return;

      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 600;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          const link = document.createElement("a");
          link.download = `qraft-qr-${index + 1}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
        URL.revokeObjectURL(url);
        setDownloading(false);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        setDownloading(false);
      };
      img.src = url;
    } catch {
      setDownloading(false);
    }
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          alignSelf: "flex-start",
        }}
      >
        {type.toUpperCase()} · #{index + 1}
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 12,
          padding: 12,
          border: "1px solid var(--border)",
        }}
      >
        <QRCodeSVG
          id={`bulk-qr-svg-${index}`}
          value={value}
          size={180}
          fgColor="#0E1420"
          bgColor="#FFFFFF"
          level="M"
          marginSize={2}
        />
      </div>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--ink)",
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
        }}
        title={value}
      >
        {value}
      </div>

      <motion.button
        onClick={downloadPng}
        disabled={downloading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: "100%",
          background: "var(--accent)",
          color: "var(--ink)",
          border: "none",
          borderRadius: 8,
          padding: "10px",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 13,
          cursor: downloading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          opacity: downloading ? 0.7 : 1,
        }}
      >
        <Download size={14} />
        {downloading ? "..." : t("Download")}
      </motion.button>
    </motion.div>
  );
}

export default function BulkGenerator() {
  const { t } = useLanguage();
  const [type, setType] = useState<QrType>("url");
  const [input, setInput] = useState("");
  const [generated, setGenerated] = useState<{ value: string; type: QrType }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    const lines = input.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) return;

    setIsGenerating(true);
    const items = lines.map((line) => ({
      value: line.trim(),
      type,
    }));
    setGenerated(items);

    setTimeout(() => setIsGenerating(false), 100);
  };

  return (
    <section
      id="bulk-generator"
      style={{
        padding: "100px 0",
        background: "var(--bg)",
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
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ marginBottom: 40 }}
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
            {t("Bulk Generator")}
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
            {t("Bulk Generator")}
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 32,
            alignItems: "start",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background: "var(--surface)",
              borderRadius: 20,
              padding: 24,
              border: "1px solid var(--border)",
            }}
          >
            <MonoLabel>Type</MonoLabel>
            <div
              style={{
                display: "flex",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 3,
                gap: 2,
                marginBottom: 20,
              }}
            >
              {QrTypes.map((qt) => {
                const labelMap: Record<QrType, string> = {
                  url: "URL",
                  wifi: "Wi-Fi",
                  vcard: "vCard",
                  text: "Text",
                };
                return (
                  <button
                    key={qt}
                    onClick={() => setType(qt)}
                    style={{
                      position: "relative",
                      flex: 1,
                      border: "none",
                      background: type === qt ? "var(--accent)" : "transparent",
                      borderRadius: 8,
                      padding: "8px 4px",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: type === qt ? "var(--ink)" : "var(--muted)",
                      transition: "color 0.2s, background 0.2s",
                    }}
                  >
                    {t(labelMap[qt])}
                  </button>
                );
              })}
            </div>

            <MonoLabel>{t("Enter values (one per line)")}</MonoLabel>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                type === "url"
                  ? "https://example.com\nhttps://yoursite.com"
                  : type === "wifi"
                  ? "WIFI:T:WPA;S:MyNetwork;P:password;;"
                  : type === "vcard"
                  ? "BEGIN:VCARD\nVERSION:3.0\nFN:Name\nTEL:+1234567890\nEMAIL:name@example.com\nEND:VCARD"
                  : "Line 1\nLine 2\nLine 3"
              }
              rows={8}
              aria-label={t("Enter values (one per line)")}
              style={{
                width: "100%",
                background: "var(--bg)",
                border: "1.5px solid var(--border)",
                borderRadius: 10,
                padding: "12px",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--ink)",
                outline: "none",
                resize: "vertical",
                transition: "border-color 0.2s",
                marginBottom: 16,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />

            <motion.button
              onClick={handleGenerate}
              disabled={isGenerating || input.trim().length === 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                background: "var(--accent)",
                color: "var(--ink)",
                border: "none",
                borderRadius: 10,
                padding: "14px",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 15,
                cursor: isGenerating || input.trim().length === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: isGenerating || input.trim().length === 0 ? 0.6 : 1,
              }}
            >
              <Wand2 size={16} />
              {t("Generate QR Codes")}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background: "var(--surface)",
              borderRadius: 20,
              padding: 24,
              border: "1px solid var(--border)",
              minHeight: 400,
            }}
          >
            {generated.length === 0 ? (
              <div
                style={{
                  height: "100%",
                  minHeight: 340,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  textAlign: "center",
                  gap: 12,
                }}
              >
                <Wand2 size={32} style={{ opacity: 0.4 }} />
                <div>Enter values and generate QR codes.</div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--muted)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  {generated.length} {generated.length === 1 ? "code" : "codes"} generated
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 16,
                  }}
                >
                  {generated.map((item, i) => (
                    <QrCard key={i} value={item.value} type={item.type} index={i} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
