# Geomagnetic Monitor

A real-time geomagnetic storm dashboard built with React and TypeScript. It pulls live space weather data from [NOAA SWPC](https://www.swpc.noaa.gov/) and presents Kp indices, storm severity, forecasts, solar activity, aurora visibility, and plain-language impact summaries — including notes on physical and mental effects on people.

![Geomagnetic Monitor](src/assets/hero.png)

## Features

- **Live Kp gauge** — 1-minute estimated planetary K-index with storm level and color coding
- **NOAA G-scale bar** — G0 (quiet) through G5 (extreme) severity at a glance
- **Impact summaries** — infrastructure effects plus separate **physical** and **mental/mood** notes for people
- **Stats row** — current Kp, 24h peak, forecast peak, official 3-hour Kp + A-index, F10.7 solar flux, last updated
- **1-minute sparkline** — geomagnetic trend over the past hour
- **Aurora panel** — estimated visibility latitude and regional guidance
- **Solar activity** — F10.7 flux, M/X flare probabilities, proton event risk, polar cap absorption, 3-day storm outlook
- **Charts** — 3-day 3-hour Kp history and Kp forecast (estimated vs predicted)
- **NOAA alerts** — geomagnetic bulletins prioritized
- **Bilingual UI** — English and Traditional Chinese (zh-TW), with locale persisted in `localStorage`
- **Contextual tooltips** — hover `?` icons for detailed explanations and possible impacts
- **Auto-refresh** — data reloads every 60 seconds

## Data source

All data comes from NOAA Space Weather Prediction Center public JSON endpoints. No API key is required.

| Data | Endpoint |
|------|----------|
| 1-minute Kp | `planetary_k_index_1m.json` |
| 3-hour Kp | `noaa-planetary-k-index.json` |
| Kp forecast | `noaa-planetary-k-index-forecast.json` |
| Alerts | `alerts.json` |
| Solar probabilities | `solar_probabilities.json` |
| F10.7 flux | `f107_cm_flux.json` |

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/)
- Plain CSS (no UI framework)
- NOAA SWPC public REST APIs

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- npm

### Install

```bash
git clone https://github.com/redjackfred/Geomagnetic-Monitor.git
cd Geomagnetic-Monitor
npm install
```

### Development

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Project structure

```
src/
├── App.tsx                 # Main layout
├── components/             # UI panels, charts, gauge, tooltips
├── hooks/
│   └── useSpaceWeather.ts  # Fetch + 60s auto-refresh
├── i18n/
│   ├── en.ts, zh.ts        # UI strings and storm descriptions
│   ├── glossaryEn.ts       # English tooltip content
│   └── glossaryZh.ts       # Chinese tooltip content
└── lib/
    ├── noaa.ts             # API client and helpers
    ├── storm.ts            # Kp → G-scale logic
    └── stormI18n.ts        # Localized storm info
```

## Language switching

Use the language toggle in the top-right corner. The choice is saved in `localStorage` and applies to all labels, storm text, chart captions, and glossary tooltips. NOAA alert message bodies remain in English as provided by the API.

## Disclaimer

This dashboard is for informational and educational purposes. Storm classifications and impact text are based on NOAA guidance and common operational experience. Human health notes distinguish established effects (e.g. radiation exposure for aviation and spaceflight) from reported but inconclusive associations (e.g. sleep or mood changes). Do not use this app as a substitute for official NOAA bulletins, medical advice, or aviation radiation planning.

## License

This project is open source. See the repository for license details.

## Acknowledgments

- [NOAA Space Weather Prediction Center](https://www.swpc.noaa.gov/) for public space weather data
- Planetary K-index and G-scale definitions per NOAA operational standards
