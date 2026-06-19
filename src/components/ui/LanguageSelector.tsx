import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => void;
      };
    } | undefined;
    googleTranslateElementInit: () => void;
  }
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir?: "ltr" | "rtl";
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "gb", dir: "ltr" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "et", dir: "ltr" },
  { code: "om", name: "Oromiffa", nativeName: "Afaan Oromo", flag: "et", dir: "ltr" },
  { code: "ti", name: "Tigrinya", nativeName: "ትግርኛ", flag: "et", dir: "ltr" },
  { code: "so", name: "Somali", nativeName: "Soomaali", flag: "so", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "sa", dir: "rtl" },
  { code: "fr", name: "French", nativeName: "Français", flag: "fr", dir: "ltr" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "ke", dir: "ltr" },
];

const setCookie = (name: string, value: string, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? (match[2] ?? null) : null;
};

export const LanguageSelector: React.FC<{ variant?: "default" | "topbar" }> = ({ variant = "default" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]!);
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadScript = () => {
      if (window.google?.translate) {
        return;
      }
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
      window.googleTranslateElementInit = () => {
        if (!window.google?.translate?.TranslateElement) return;
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: languages.map((l) => l.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    };

    loadScript();

    const savedLang = getCookie("GOOGLE_TRANSLATE_LANG");
    if (savedLang) {
      const lang = languages.find((l) => l.code === savedLang);
      if (lang) {
        setCurrentLang(lang);
        // Apply text direction dynamically on body
        if (lang.dir === "rtl") {
          document.body.classList.add("translated-rtl");
          document.body.classList.remove("translated-ltr");
        } else {
          document.body.classList.add("translated-ltr");
          document.body.classList.remove("translated-rtl");
        }
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    if (lang.code === currentLang.code) {
      setIsOpen(false);
      return;
    }
    setIsTranslating(true);
    setIsOpen(false);
    setCookie("GOOGLE_TRANSLATE_LANG", lang.code);
    const domains = [window.location.hostname, "." + window.location.hostname, ""];
    if (lang.code === "en") {
      domains.forEach((d) => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${d ? ` domain=${d};` : ""}`;
      });
    } else {
      domains.forEach((d) => {
        document.cookie = `googtrans=/en/${lang.code}; path=/;${d ? ` domain=${d};` : ""}`;
      });
    }
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="relative notranslate flex items-center" ref={dropdownRef}>
      <div id="google_translate_element" className="hidden"></div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className={`group flex items-center gap-2 h-9 px-3 rounded-full border transition-all duration-200 cursor-pointer ${
          variant === "topbar"
            ? "border-teal/30 bg-teal/5 text-teal hover:bg-teal/10"
            : "border-rule bg-paper hover:bg-paper-warm text-ink-mid"
        } ${isTranslating ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="relative w-4 h-3 overflow-hidden rounded-sm ring-1 ring-black/10 shrink-0">
          <img
            src={`https://flagcdn.com/w40/${currentLang.flag}.png`}
            alt={currentLang.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[11px] font-mono tracking-wider font-bold">
          {currentLang.code.toUpperCase()}
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""} ${
            variant === "topbar" ? "text-teal/70" : "text-ink-muted"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 min-w-[180px] bg-paper-card rounded border border-rule shadow-lg z-[200] p-1 flex flex-col"
          >
            <div className="max-h-[240px] overflow-y-auto scrollbar-none flex flex-col gap-0.5">
              {languages.map((lang) => (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-sans tracking-wide rounded transition-colors text-left group cursor-pointer ${
                    currentLang.code === lang.code
                      ? "bg-teal-light/50 text-teal font-medium"
                      : "text-ink-mid hover:text-teal hover:bg-paper-warm"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative w-4 h-3 overflow-hidden rounded-sm ring-1 ring-black/5 shrink-0">
                      <img
                        src={`https://flagcdn.com/w40/${lang.flag}.png`}
                        alt={lang.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{lang.nativeName}</span>
                  </div>
                  {currentLang.code === lang.code && (
                    <Check size={12} className="text-teal" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
