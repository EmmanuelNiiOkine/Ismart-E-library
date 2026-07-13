export type ReaderViewMode = 'single' | 'spread'

export interface ReaderPageSlot {
  width: number
  height: number
  bookWidth: number
}

/** Space used by top bar, footer toolbar, hints, and stage padding. */
export function getReaderChromeHeight(): number {
  return 188
}

export function getReaderPageSlot(mode: ReaderViewMode): ReaderPageSlot {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const slotHeight = Math.max(vh - getReaderChromeHeight(), 500)

  if (mode === 'single') {
    const bookWidth = Math.min(vw * 0.88, 900)
    return { width: bookWidth, height: slotHeight, bookWidth }
  }

  const bookWidth = Math.min(vw * 0.97, 1520)
  const slotWidth = Math.max((bookWidth - 12) / 2, 320)
  return { width: slotWidth, height: slotHeight, bookWidth }
}

export function applyReaderLayoutVars(element: HTMLElement) {
  const single = getReaderPageSlot('single')
  const spread = getReaderPageSlot('spread')

  const stage = element.querySelector('.reader-stage')
  let pageHeight = single.height

  if (stage instanceof HTMLElement) {
    const stagePadding = 24
    pageHeight = Math.max(stage.clientHeight - stagePadding, 420)
  }

  element.style.setProperty('--reader-single-width', `${single.bookWidth}px`)
  element.style.setProperty('--reader-spread-width', `${spread.bookWidth}px`)
  element.style.setProperty('--reader-page-height', `${pageHeight}px`)
  element.style.setProperty('--reader-spread-page-width', `${spread.width}px`)
}

export function getTextCharsPerPage(mode: ReaderViewMode = 'single'): number {
  const slot = getReaderPageSlot(mode)
  const area = slot.width * slot.height
  if (area > 520_000) return 1400
  if (area > 380_000) return 1200
  return 1000
}
