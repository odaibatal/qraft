import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface Translations {
  [key: string]: string;
}

const ar: Translations = {
  "Open Studio": "افتح الاستوديو",
  "Studio": "الاستوديو",
  "Templates": "القوالب",
  "How it works": "كيف يعمل",
  "Start building": "ابدأ البناء",
  "See how it works": "شاهد كيف يعمل",
  "QR Studio": "استوديو QR",
  "The Studio": "الاستوديو",
  "Your QR code, your rules.": "رمز QR الخاص بك، بقواعدك.",
  "Live Preview": "معاينة حية",
  "Pick your type": "اختر النوع",
  "Style it": "صممه",
  "Download": "تنزيل",
  "URL": "رابط",
  "Wi-Fi": "واي فاي",
  "vCard": "بطاقة اتصال",
  "Text": "نص",
  "Foreground color": "لون الواجهة",
  "Background color": "لون الخلفية",
  "Corner style": "نمط الزاوية",
  "Error correction": "تصحيح الأخطاء",
  "Download PNG": "تنزيل PNG",
  "Download SVG": "تنزيل SVG",
  "Size": "الحجم",
  "Start from a preset.": "ابدأ من قالب جاهز.",
  "Pick a template and instantly load it into the Studio — fully customizable from there.": "اختر قالباً وقم بتحميله فوراً في الاستوديو — قابل للتخصيص بالكامل من هناك.",
  "Load in Studio": "تحميل في الاستوديو",
  "Three steps to done.": "ثلاث خطوات للانتهاء.",
  "URL, Wi-Fi credentials, vCard contact, or raw text — choose what your QR code should encode.": "رابط، بيانات واي فاي، جهة اتصال، أو نص خام — اختر ما يجب أن يرمزه رمز QR.",
  "Set foreground and background colors from presets or custom pickers. Choose corner style and error correction level.": "تعيين ألوان الواجهة والخلفية من الإعدادات المسبقة أو منتقي الألوان المخصص. اختر نمط الزاوية ومستوى تصحيح الأخطاء.",
  "Export as high-res PNG or crisp vector SVG — ready for print, web, or signage at any scale.": "تصدير ك PNG عالي الدقة أو SVG متجه واضح — جاهز للطباعة، الويب، أو اللافتات بأي حجم.",
  "Premium QR code generation. Brand-perfect, export-ready, instant.": "توليد رموز QR عالية الجودة. متوافقة مع العلامة التجارية، جاهزة للتصدير، فورية.",
  "Product": "المنتج",
  "Resources": "الموارد",
  "Company": "الشركة",
  "Documentation": "التوثيق",
  "API": "واجهة برمجة التطبيقات",
  "Open-source": "مفتوح المصدر",
  "Status": "الحالة",
  "About": "عن الشركة",
  "Blog": "المدونة",
  "Careers": "الوظائف",
  "Press": "الصحافة",
  "Changelog": "سجل التغييرات",
  "Privacy": "الخصوصية",
  "Terms": "الشروط",
  "Cookies": "ملفات تعريف الارتباط",
  "© 2026 Qraft Studio. All rights reserved.": "© 2026 استوديو كرافت. جميع الحقوق محفوظة.",
  "Craft QR codes that match your brand.": "اصنع رموز QR تطابق علامتك التجارية.",
  "Generate, style, and download production-ready QR codes — URL, Wi-Fi, vCard, and more — in seconds. Your brand, pixel-perfect.": "توليد وتصميم وتنزيل رموز QR جاهزة للإنتاج — رابط، واي فاي، بطاقة اتصال، والمزيد — في ثوانٍ. علامتك التجارية، بكسل مثالي.",
  "Dark mode": "الوضع الداكن",
  "Light mode": "الوضع الفاتح",
  "Wi-Fi — Café": "واي فاي — مقهى",
  "Let guests connect without asking.": "اسمح للضيوف بالاتصال دون سؤال.",
  "Restaurant Menu": "قائمة المطعم",
  "Scan to browse today's specials.": "امسح لاستعراض عروض اليوم.",
  "Instagram Profile": "ملف إنستغرام",
  "Drive followers straight to your grid.": "وجه المتابعين مباشرة إلى شبكتك.",
  "Portfolio": "معرض الأعمال",
  "Your work — one scan away.": "عملك — على بعد مسحة واحدة.",
  "Event": "فعالية",
  "Share event details and RSVP.": "شارك تفاصيل الفعالية وأكد حضورك.",
  "PNG · SVG": "PNG · SVG",
  "Logo overlay": "شعار",
  "Brand colors": "ألوان العلامة التجارية",
  "Type": "النوع",
  "Enter values (one per line)": "أدخل القيم (واحد في كل سطر)",
  "Generate QR Codes": "توليد رموز QR",
  "Network Name (SSID)": "اسم الشبكة",
  "Password": "كلمة المرور",
  "Encryption": "التشفير",
  "WPA/WPA2": "WPA/WPA2",
  "WEP": "WEP",
  "None": "بدون",
  "Full Name": "الاسم الكامل",
  "Phone": "الهاتف",
  "Email": "البريد الإلكتروني",
  "Text Content": "محتوى النص",
  "Enter any text...": "أدخل أي نص...",
  "Foreground": "الواجهة",
  "Background": "الخلفية",
  "Corner Style": "نمط الزاوية",
  "square": "مربع",
  "rounded": "مدور",
  "dots": "نقاط",
  "Size — {n}px": "الحجم — {n} بكسل",
  "Error Correction": "تصحيح الأخطاء",
  "https://yoursite.com": "https://موقعك.com",
  "My Network": "شبكتي",
  "Jane Smith": "أحمد محمد",
  "+1 (555) 000-0000": "+966 55 000 0000",
  "jane@example.com": "ahmed@example.com",
  "Brand Kit": "مجموعة العلامة التجارية",
  "Brand name": "اسم العلامة التجارية",
  "Primary color": "اللون الأساسي",
  "Secondary color": "اللون الثانوي",
  "Logo URL": "رابط الشعار",
  "Save brand": "حفظ العلامة",
  "Apply brand": "تطبيق العلامة",
  "Delete brand": "حذف العلامة",
  "No brands saved yet": "لا توجد علامات محفوظة بعد",
  "Enabled": "مفعل",
  "Disabled": "معطل",
  "Change logo": "تغيير الشعار",
  "Upload logo": "رفع شعار",
  "Share": "مشاركة",
  "Copy shareable link": "نسخ رابط قابل للمشاركة",
  "Auto-saved": "تم الحفظ تلقائياً",
};

const en: Translations = {
  "Open Studio": "Open Studio",
  "Studio": "Studio",
  "Templates": "Templates",
  "How it works": "How it works",
  "Start building": "Start building",
  "See how it works": "See how it works",
  "QR Studio": "QR Studio",
  "The Studio": "The Studio",
  "Your QR code, your rules.": "Your QR code, your rules.",
  "Live Preview": "Live Preview",
  "Pick your type": "Pick your type",
  "Style it": "Style it",
  "Download": "Download",
  "URL": "URL",
  "Wi-Fi": "Wi-Fi",
  "vCard": "vCard",
  "Text": "Text",
  "Foreground color": "Foreground color",
  "Background color": "Background color",
  "Corner style": "Corner style",
  "Error correction": "Error correction",
  "Download PNG": "Download PNG",
  "Download SVG": "Download SVG",
  "Size": "Size",
  "Start from a preset.": "Start from a preset.",
  "Pick a template and instantly load it into the Studio — fully customizable from there.": "Pick a template and instantly load it into the Studio — fully customizable from there.",
  "Load in Studio": "Load in Studio",
  "Three steps to done.": "Three steps to done.",
  "URL, Wi-Fi credentials, vCard contact, or raw text — choose what your QR code should encode.": "URL, Wi-Fi credentials, vCard contact, or raw text — choose what your QR code should encode.",
  "Set foreground and background colors from presets or custom pickers. Choose corner style and error correction level.": "Set foreground and background colors from presets or custom pickers. Choose corner style and error correction level.",
  "Export as high-res PNG or crisp vector SVG — ready for print, web, or signage at any scale.": "Export as high-res PNG or crisp vector SVG — ready for print, web, or signage at any scale.",
  "Premium QR code generation. Brand-perfect, export-ready, instant.": "Premium QR code generation. Brand-perfect, export-ready, instant.",
  "Product": "Product",
  "Resources": "Resources",
  "Company": "Company",
  "Documentation": "Documentation",
  "API": "API",
  "Open-source": "Open-source",
  "Status": "Status",
  "About": "About",
  "Blog": "Blog",
  "Careers": "Careers",
  "Press": "Press",
  "Changelog": "Changelog",
  "Privacy": "Privacy",
  "Terms": "Terms",
  "Cookies": "Cookies",
  "© 2026 Qraft Studio. All rights reserved.": "© 2026 Qraft Studio. All rights reserved.",
  "Craft QR codes that match your brand.": "Craft QR codes that match your brand.",
  "Generate, style, and download production-ready QR codes — URL, Wi-Fi, vCard, and more — in seconds. Your brand, pixel-perfect.": "Generate, style, and download production-ready QR codes — URL, Wi-Fi, vCard, and more — in seconds. Your brand, pixel-perfect.",
  "Dark mode": "Dark mode",
  "Light mode": "Light mode",
  "Wi-Fi — Café": "Wi-Fi — Café",
  "Let guests connect without asking.": "Let guests connect without asking.",
  "Restaurant Menu": "Restaurant Menu",
  "Scan to browse today's specials.": "Scan to browse today's specials.",
  "Instagram Profile": "Instagram Profile",
  "Drive followers straight to your grid.": "Drive followers straight to your grid.",
  "Portfolio": "Portfolio",
  "Your work — one scan away.": "Your work — one scan away.",
  "Event": "Event",
  "Share event details and RSVP.": "Share event details and RSVP.",
  "PNG · SVG": "PNG · SVG",
  "Logo overlay": "Logo overlay",
  "Brand colors": "Brand colors",
  "Type": "Type",
  "WPA/WPA2": "WPA/WPA2",
  "WEP": "WEP",
  "None": "None",
  "Full Name": "Full Name",
  "Phone": "Phone",
  "Email": "Email",
  "Text Content": "Text Content",
  "Enter any text...": "Enter any text...",
  "Foreground": "Foreground",
  "Background": "Background",
  "Corner Style": "Corner Style",
  "Error Correction": "Error Correction",
  "Bulk Generator": "Bulk Generator",
  "Enter values (one per line)": "Enter values (one per line)",
  "Generate QR Codes": "Generate QR Codes",
  "Network Name (SSID)": "Network Name (SSID)",
  "Password": "Password",
  "Encryption": "Encryption",
  "Brand Kit": "Brand Kit",
  "Brand name": "Brand name",
  "Primary color": "Primary color",
  "Secondary color": "Secondary color",
  "Logo URL": "Logo URL",
  "Save brand": "Save brand",
  "Apply brand": "Apply brand",
  "Delete brand": "Delete brand",
  "No brands saved yet": "No brands saved yet",
  "Enabled": "Enabled",
  "Disabled": "Disabled",
  "Change logo": "Change logo",
  "Upload logo": "Upload logo",
  "Share": "Share",
  "Copy shareable link": "Copy shareable link",
  "Auto-saved": "Auto-saved",
};

type Language = "en" | "ar";

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved === "ar" ? "ar" : "en") as Language;
  });

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const t = (key: string): string => {
    const translations = language === "ar" ? ar : en;
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
