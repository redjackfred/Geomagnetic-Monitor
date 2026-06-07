import type { KpForecastReading } from '../lib/noaa'
import { getStormInfo, useFormatTime } from '../lib/stormI18n'
import { useI18n, interpolate } from '../i18n/context'
import { PanelHeading, TermTip } from './Hint'

interface KpForecastChartProps {
  data: KpForecastReading[]
}

const CHART_HEIGHT = 200
const CHART_WIDTH = 640
const PADDING = { top: 20, right: 16, bottom: 64, left: 52 }
const MAX_KP = 9
const MAX_X_LABELS = 5

function pickXLabelIndices(count: number, maxLabels: number): Set<number> {
  if (count <= maxLabels) {
    return new Set(Array.from({ length: count }, (_, i) => i))
  }
  const step = Math.ceil((count - 1) / (maxLabels - 1))
  const indices = new Set<number>()
  for (let i = 0; i < count; i += step) indices.add(i)
  indices.add(count - 1)
  return indices
}

export function KpForecastChart({ data }: KpForecastChartProps) {
  const { t, locale } = useI18n()
  const formatTime = useFormatTime()

  if (data.length === 0) return null

  const localeTag = locale === 'zh' ? 'zh-TW' : 'en-US'

  function formatAxisTime(iso: string): string {
    const d = new Date(iso)
    const date = d.toLocaleDateString(localeTag, { month: 'numeric', day: 'numeric' })
    const time = d.toLocaleTimeString(localeTag, { hour: '2-digit', minute: '2-digit' })
    return `${date} ${time}`
  }

  function observedLabel(observed: string): string {
    if (observed === 'predicted') return t.charts.predicted
    if (observed === 'estimated') return t.charts.estimated
    return observed
  }

  const innerW = CHART_WIDTH - PADDING.left - PADDING.right
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom
  const barW = innerW / data.length - 4
  const xLabelIndices = pickXLabelIndices(data.length, MAX_X_LABELS)
  const stormThresholds = [5, 6, 7, 8]

  return (
    <div className="kp-chart forecast-chart">
      <PanelHeading
        title={t.charts.forecast}
        caption={t.charts.forecastCaption}
      />

      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-swatch estimated" />
          {t.charts.estimated}
          <TermTip entry={t.glossary.estimated} />
        </span>
        <span className="legend-item">
          <span className="legend-swatch predicted" />
          {t.charts.predicted}
          <TermTip entry={t.glossary.predicted} />
        </span>
      </div>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="chart-svg"
        role="img"
        aria-label={t.charts.forecastAria}
      >
        <text
          x={14}
          y={PADDING.top + innerH / 2}
          className="chart-axis-title"
          textAnchor="middle"
          transform={`rotate(-90, 14, ${PADDING.top + innerH / 2})`}
        >
          {t.charts.kpIndex}
        </text>

        <line
          x1={PADDING.left}
          y1={PADDING.top}
          x2={PADDING.left}
          y2={PADDING.top + innerH}
          className="chart-axis-line"
        />
        <line
          x1={PADDING.left}
          y1={PADDING.top + innerH}
          x2={CHART_WIDTH - PADDING.right}
          y2={PADDING.top + innerH}
          className="chart-axis-line"
        />

        {stormThresholds.map((threshold) => {
          const y = PADDING.top + innerH - (threshold / MAX_KP) * innerH
          return (
            <line
              key={threshold}
              x1={PADDING.left}
              y1={y}
              x2={CHART_WIDTH - PADDING.right}
              y2={y}
              className="chart-threshold"
            />
          )
        })}

        {[0, 3, 5, 6, 7, 8, 9].map((tick) => {
          const y = PADDING.top + innerH - (tick / MAX_KP) * innerH
          return (
            <text key={tick} x={PADDING.left - 8} y={y + 4} className="chart-y-label" textAnchor="end">
              {tick}
            </text>
          )
        })}

        {data.map((reading, i) => {
          const barH = (reading.kp / MAX_KP) * innerH
          const x = PADDING.left + i * (innerW / data.length) + 2
          const y = PADDING.top + innerH - barH
          const color = getStormInfo(reading.kp, t.storm).color
          const isPredicted = reading.observed === 'predicted'

          return (
            <g key={reading.time_tag}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={2}
                fill={color}
                opacity={isPredicted ? 0.55 : 0.85}
                stroke={isPredicted ? color : 'none'}
                strokeWidth={isPredicted ? 1.5 : 0}
                strokeDasharray={isPredicted ? '3 2' : undefined}
                className="chart-bar"
              />
              {reading.noaa_scale && (
                <text
                  x={x + barW / 2}
                  y={y - 4}
                  className="chart-bar-label"
                  textAnchor="middle"
                >
                  {reading.noaa_scale}
                </text>
              )}
              {xLabelIndices.has(i) && (
                <text
                  x={x + barW / 2}
                  y={PADDING.top + innerH + 16}
                  className="chart-x-label"
                  textAnchor="end"
                  transform={`rotate(-35, ${x + barW / 2}, ${PADDING.top + innerH + 16})`}
                >
                  {formatAxisTime(reading.time_tag)}
                </text>
              )}
              <title>
                {interpolate(t.charts.tooltipForecast, {
                  time: formatTime(reading.time_tag),
                  kp: reading.kp.toFixed(1),
                  type: observedLabel(reading.observed),
                })}
                {reading.noaa_scale ? ` · ${reading.noaa_scale}` : ''}
              </title>
            </g>
          )
        })}

        <text
          x={PADDING.left + innerW / 2}
          y={CHART_HEIGHT - 2}
          className="chart-axis-title"
          textAnchor="middle"
        >
          {t.charts.timeAxis}
        </text>
      </svg>
    </div>
  )
}
