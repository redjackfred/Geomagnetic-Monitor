import type { KpReading3h } from '../lib/noaa'
import { getStormInfo, useFormatTime } from '../lib/stormI18n'
import { useI18n, interpolate } from '../i18n/context'
import { PanelHeading } from './Hint'

interface KpChartProps {
  data: KpReading3h[]
}

const CHART_HEIGHT = 220
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

export function KpChart({ data }: KpChartProps) {
  const { t, locale } = useI18n()
  const formatTime = useFormatTime()
  const recent = data.slice(-24)
  if (recent.length === 0) return null

  const localeTag = locale === 'zh' ? 'zh-TW' : 'en-US'

  function formatAxisTime(iso: string): string {
    const d = new Date(iso)
    const date = d.toLocaleDateString(localeTag, { month: 'numeric', day: 'numeric' })
    const time = d.toLocaleTimeString(localeTag, { hour: '2-digit', minute: '2-digit' })
    return `${date} ${time}`
  }

  function formatRangeTime(iso: string): string {
    return new Date(iso).toLocaleString(localeTag, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const innerW = CHART_WIDTH - PADDING.left - PADDING.right
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom
  const barW = innerW / recent.length - 4
  const yTicks = [0, 3, 5, 6, 7, 8, 9]
  const stormThresholds = [5, 6, 7, 8]

  const firstTime = recent[0].time_tag
  const lastTime = recent[recent.length - 1].time_tag
  const xLabelIndices = pickXLabelIndices(recent.length, MAX_X_LABELS)

  return (
    <div className="kp-chart">
      <PanelHeading
        title={t.charts.history}
        hint={t.glossary.kp3h}
        caption={`${formatRangeTime(firstTime)} → ${formatRangeTime(lastTime)} · NOAA SWPC`}
      />

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="chart-svg"
        role="img"
        aria-label={t.charts.historyAria}
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
            <g key={`threshold-${threshold}`}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={CHART_WIDTH - PADDING.right}
                y2={y}
                className="chart-threshold"
              />
              <text
                x={CHART_WIDTH - PADDING.right + 4}
                y={y + 3}
                className="chart-threshold-label"
                textAnchor="start"
              >
                G{threshold - 4}+
              </text>
            </g>
          )
        })}

        {yTicks.map((tick) => {
          const y = PADDING.top + innerH - (tick / MAX_KP) * innerH
          return (
            <g key={`ytick-${tick}`}>
              <line
                x1={PADDING.left - 4}
                y1={y}
                x2={PADDING.left}
                y2={y}
                className="chart-tick-mark"
              />
              <text x={PADDING.left - 8} y={y + 4} className="chart-y-label" textAnchor="end">
                {tick}
              </text>
            </g>
          )
        })}

        {recent.map((reading, i) => {
          const barH = (reading.Kp / MAX_KP) * innerH
          const x = PADDING.left + i * (innerW / recent.length) + 2
          const y = PADDING.top + innerH - barH
          const color = getStormInfo(reading.Kp, t.storm).color
          const showLabel = xLabelIndices.has(i)

          return (
            <g key={reading.time_tag}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={2}
                fill={color}
                opacity={0.85}
                className="chart-bar"
              />
              {showLabel && (
                <g className="chart-x-tick">
                  <line
                    x1={x + barW / 2}
                    y1={PADDING.top + innerH}
                    x2={x + barW / 2}
                    y2={PADDING.top + innerH + 5}
                    className="chart-tick-mark"
                  />
                  <text
                    x={x + barW / 2}
                    y={PADDING.top + innerH + 16}
                    className="chart-x-label"
                    textAnchor="end"
                    transform={`rotate(-35, ${x + barW / 2}, ${PADDING.top + innerH + 16})`}
                  >
                    {formatAxisTime(reading.time_tag)}
                  </text>
                </g>
              )}
              <title>
                {interpolate(t.charts.tooltipKp, {
                  time: formatTime(reading.time_tag),
                  kp: reading.Kp.toFixed(1),
                })}
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
