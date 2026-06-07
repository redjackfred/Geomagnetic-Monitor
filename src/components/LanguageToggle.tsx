import { useI18n } from '../i18n/context'

export function LanguageToggle() {
  const { t, toggleLocale } = useI18n()

  return (
    <button
      type="button"
      className="lang-btn"
      onClick={toggleLocale}
      aria-label={t.lang.label}
    >
      {t.lang.switchTo}
    </button>
  )
}
