import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import type { GlossaryEntry } from '../i18n/glossaryTypes'
import { useI18n } from '../i18n/context'

const GAP = 10
const VIEWPORT_MARGIN = 8
const CLOSE_DELAY_MS = 120

interface PopupPosition {
  top: number
  left: number
  arrowLeft: number
  placement: 'above' | 'below'
}

function measurePopup(el: HTMLElement) {
  const prev = {
    visibility: el.style.visibility,
    top: el.style.top,
    left: el.style.left,
  }
  el.style.visibility = 'hidden'
  el.style.top = '-9999px'
  el.style.left = '0'
  const height = el.offsetHeight
  const width = el.offsetWidth
  el.style.visibility = prev.visibility
  el.style.top = prev.top
  el.style.left = prev.left
  return { height, width }
}

function computePosition(trigger: HTMLElement, popup: HTMLElement): PopupPosition {
  const { height: ph, width: pw } = measurePopup(popup)
  const tr = trigger.getBoundingClientRect()

  const showBelow = tr.top - VIEWPORT_MARGIN < ph + GAP
  const top = showBelow ? tr.bottom + GAP : tr.top - ph - GAP

  let left = tr.left + tr.width / 2 - pw / 2
  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, window.innerWidth - pw - VIEWPORT_MARGIN),
  )

  return {
    top,
    left,
    arrowLeft: tr.left + tr.width / 2 - left,
    placement: showBelow ? 'below' : 'above',
  }
}

/** Hover tooltip with detailed explanation and impacts, triggered by ? icon. */
export function TermTip({ entry }: { entry: GlossaryEntry }) {
  const { t } = useI18n()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLSpanElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<PopupPosition | null>(null)

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => {
      setOpen(false)
      setPos(null)
    }, CLOSE_DELAY_MS)
  }

  const handleOpen = () => {
    cancelClose()
    setOpen(true)
  }

  useLayoutEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    const popup = popupRef.current
    if (!trigger || !popup) return
    setPos(computePosition(trigger, popup))
  }, [open, entry])

  useEffect(() => {
    if (!open) return
    const reposition = () => {
      const trigger = triggerRef.current
      const popup = popupRef.current
      if (!trigger || !popup) return
      setPos(computePosition(trigger, popup))
    }
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open])

  useEffect(() => () => cancelClose(), [])

  const popupStyle: CSSProperties | undefined = pos
    ? {
        top: pos.top,
        left: pos.left,
        '--arrow-left': `${pos.arrowLeft}px`,
      } as CSSProperties
    : undefined

  return (
    <>
      <span className="term-tip">
        <button
          ref={triggerRef}
          type="button"
          className="term-tip-trigger"
          aria-label={t.glossaryImpactsLabel}
          aria-expanded={open}
          onMouseEnter={handleOpen}
          onMouseLeave={scheduleClose}
          onFocus={handleOpen}
          onBlur={scheduleClose}
        >
          ?
        </button>
      </span>
      {open &&
        createPortal(
          <span
            ref={popupRef}
            className={`term-tip-popup is-open${pos ? ' is-positioned' : ''}${pos ? ` term-tip-popup--${pos.placement}` : ''}`}
            data-placement={pos?.placement ?? 'above'}
            role="tooltip"
            style={popupStyle}
            onMouseEnter={handleOpen}
            onMouseLeave={scheduleClose}
          >
            <p className="term-tip-desc">{entry.desc}</p>
            <p className="term-tip-impacts-heading">{t.glossaryImpactsLabel}</p>
            <p className="term-tip-impacts">{entry.impacts}</p>
            {entry.human && (
              <>
                <p className="term-tip-impacts-heading term-tip-human-heading">
                  {t.panels.humanImpacts}
                </p>
                <p className="term-tip-human-row">
                  <span className="term-tip-human-tag">{t.glossaryHumanPhysicalLabel}</span>
                  {entry.human.physical}
                </p>
                <p className="term-tip-human-row">
                  <span className="term-tip-human-tag term-tip-human-tag--mental">
                    {t.glossaryHumanMentalLabel}
                  </span>
                  {entry.human.mental}
                </p>
              </>
            )}
          </span>,
          document.body,
        )}
    </>
  )
}

interface PanelHeadingProps {
  title: string
  hint?: GlossaryEntry
  caption?: string
}

export function PanelHeading({ title, hint, caption }: PanelHeadingProps) {
  return (
    <div className="panel-heading">
      <div className="panel-header">
        <h3 className="panel-title">
          {title}
          {hint && <TermTip entry={hint} />}
        </h3>
        {caption && <span className="panel-caption">{caption}</span>}
      </div>
    </div>
  )
}

interface LabelWithHintProps {
  label: string
  hint?: GlossaryEntry
}

export function LabelWithHint({ label, hint }: LabelWithHintProps) {
  return (
    <span className="label-with-hint">
      {label}
      {hint && <TermTip entry={hint} />}
    </span>
  )
}

/** Inline label text followed by an optional term tooltip. */
export function InlineTerm({ label, hint }: { label: string; hint?: GlossaryEntry }) {
  return (
    <span className="inline-term">
      {label}
      {hint && <TermTip entry={hint} />}
    </span>
  )
}
