"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, TranslationType } from "@/constants/translations";

type Locale = "ar" | "en";
type Direction = "rtl" | "ltr";

interface LanguageContextType {
  locale: Locale;
  t: TranslationType;
  dir: Direction;
  toggleLanguage: () => void;
  setLanguage: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar"); // Arabic as default
  const [dir, setDir] = useState<Direction>("rtl");

  useEffect(() => {
    setDir(locale === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", locale);
  }, [locale]);

  const toggleLanguage = () => {
    setLocale((prev: Locale) => (prev === "ar" ? "en" : "ar"));
  };

  const setLanguage = (lang: Locale) => {
    setLocale(lang);
  };

  // Explicitly cast translations to avoid indexing error
  const t = (translations as Record<Locale, TranslationType>)[locale];

  return (
    <LanguageContext.Provider value={{ locale, t, dir, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context as LanguageContextType;
}

