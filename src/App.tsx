import { useSpaceWeather } from './hooks/useSpaceWeather'
import {
  get24hMaxKp,
  getForecastMaxKp,
  getLatest3hReading,
} from './lib/noaa'
import { useI18n } from './i18n/context'
import { StormGauge } from './components/StormGauge'
import { GScaleBar } from './components/GScaleBar'
import { KpChart } from './components/KpChart'
import { KpForecastChart } from './components/KpForecastChart'
import { KpSparkline } from './components/KpSparkline'
import { ImpactsPanel } from './components/ImpactsPanel'
import { StatsGrid } from './components/StatsGrid'
import { AlertsPanel, AuroraPanel } from './components/AlertsPanel'
import { SolarPanel } from './components/SolarPanel'
import { LanguageToggle } from './components/LanguageToggle'
import { TermTip } from './components/Hint'

function App() {
  const { t } = useI18n()
  const { data, loading, error, refresh } = useSpaceWeather()

  const currentKp = data?.latest1m.kp_index ?? 0
  const max24h = data ? get24hMaxKp(data.history3h) : 0
  const forecastMax = data ? getForecastMaxKp(data.forecast) : 0
  const latest3h = data ? getLatest3hReading(data.history3h) : null

  return (
    <div className="app">
      <div className="aurora-bg" aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />

      <header className="header">
        <div className="header-brand">
          <span className="header-icon">◎</span>
          <div>
            <h1 className="header-title">{t.app.title}</h1>
            <p className="header-sub">
              {t.app.subtitle}
              <TermTip entry={t.glossary.swpc} />
            </p>
          </div>
        </div>
        <div className="header-actions">
          <LanguageToggle />
          <button
            type="button"
            className="refresh-btn"
            onClick={() => void refresh()}
            disabled={loading && !data}
          >
            {loading && !data ? t.app.loading : t.app.refresh}
          </button>
        </div>
      </header>

      <main className="main">
        {error && (
          <div className="error-banner" role="alert">
            <strong>{t.app.dataUnavailable}</strong>
            <span>{error}</span>
          </div>
        )}

        {data && (
          <>
            <StatsGrid
              currentKp={currentKp}
              max24h={max24h}
              forecastMax={forecastMax}
              f107={data.f107?.flux ?? null}
              latest3h={latest3h}
              lastUpdated={data.fetchedAt}
            />

            <section className="hero-row">
              <StormGauge kp={currentKp} />
              <div className="side-panels">
                <GScaleBar currentKp={currentKp} />
                <ImpactsPanel kp={currentKp} />
              </div>
            </section>

            <section className="secondary-row">
              <KpSparkline data={data.recent1m} />
              <AuroraPanel kp={currentKp} />
            </section>

            <SolarPanel
              solar={data.solar}
              f107={data.f107}
              forecast={data.forecast}
            />

            <KpChart data={data.history3h} />
            <KpForecastChart data={data.forecast} />

            <AlertsPanel alerts={data.alerts} />
          </>
        )}

        {loading && !data && !error && (
          <div className="loading-state">
            <div className="loading-pulse" />
            <p>{t.app.fetching}</p>
          </div>
        )}
      </main>

      <footer className="footer">
        {t.app.footerSource}{' '}
        <a
          href="https://www.swpc.noaa.gov/products/planetary-k-index"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.app.footerOrg}
        </a>
        · {t.app.footerRefresh}
      </footer>
    </div>
  )
}

export default App
