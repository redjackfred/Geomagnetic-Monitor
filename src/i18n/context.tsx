import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { en } from './en'
import { zh } from './zh'
import type { Locale, Translations } from './types'

const STORAGE_KEY = 'geomagnetic-dashboard-locale'

const locales: Record<Locale, Translations> = {
  en,
  zh: zh as unknown as Translations,
}

interface I18nContextValue {
  locale: Locale
  t: Translations
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
  } catch {
    /* ignore */
  }
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)
  const t = locales[locale]

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-TW' : 'en'
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
  }, [locale])

  const setLocale = (next: Locale) => setLocaleState(next)
  const toggleLocale = () => setLocaleState((l) => (l === 'en' ? 'zh' : 'en'))

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

/** Replace `{key}` placeholders in a template string. */
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(vars[key] ?? `{${key}}`),
  )
}

export function formatDateTime(
  date: Date | string,
  localeTag: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString(localeTag, options)
}
