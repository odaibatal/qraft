import { useRef, useState, useEffect } from "react";
import { useLenis } from "./hooks/useLenis";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./hooks/useTheme";
import { BrandKitProvider } from "./contexts/BrandKitContext";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/hero/Hero";
import Studio from "./components/studio/Studio";
import Templates from "./components/templates/Templates";
import BulkGenerator from "./components/bulk/BulkGenerator";
import BrandKit from "./components/brand-kit/BrandKit";
import HowItWorks from "./components/layout/HowItWorks";
import Footer from "./components/layout/Footer";
import type { QrSettings } from "./hooks/useQrSettings";

function AppContent() {
  const lenisRef = useLenis();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const studioRef = useRef<HTMLDivElement>(null);
  const [templateSettings, setTemplateSettings] = useState<Partial<QrSettings> | undefined>(undefined);

  const scrollToStudio = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo("#studio");
    }
  };

  const handleSelectTemplate = (settings: Partial<QrSettings>) => {
    setTemplateSettings(settings);
    scrollToStudio();
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      <Navbar onOpenStudio={scrollToStudio} />
      <Hero />

      <div ref={studioRef} id="studio">
        <Studio initialSettings={templateSettings} />
      </div>

      <Templates onSelectTemplate={handleSelectTemplate} />
      <BrandKit />
      <BulkGenerator />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrandKitProvider>
          <AppContent />
        </BrandKitProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
