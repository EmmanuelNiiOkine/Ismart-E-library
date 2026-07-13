export interface BookPalette {
  cover: string
  coverLight: string
  spine: string
  accent: string
  label: string
}

const categoryPalettes: Record<string, BookPalette> = {
  'cat-1': {
    cover: '#6b1c2a',
    coverLight: '#8b2d3e',
    spine: '#4a1220',
    accent: '#7bc142',
    label: 'Law Reports',
  },
  'cat-2': {
    cover: '#1a2f4e',
    coverLight: '#2a4570',
    spine: '#0f1f38',
    accent: '#13aff4',
    label: 'Court Cases',
  },
  'cat-3': {
    cover: '#1e4d3a',
    coverLight: '#2d6b52',
    spine: '#143528',
    accent: '#7bc142',
    label: 'Statutes',
  },
  'cat-4': {
    cover: '#3d2e1f',
    coverLight: '#5c4530',
    spine: '#2a1f14',
    accent: '#13aff4',
    label: 'Constitutional',
  },
  'cat-5': {
    cover: '#2c3e5c',
    coverLight: '#3d5478',
    spine: '#1e2d42',
    accent: '#13aff4',
    label: 'Regulations',
  },
  'cat-6': {
    cover: '#1a3d4a',
    coverLight: '#2a5566',
    spine: '#0f2a35',
    accent: '#7bc142',
    label: 'Textbooks',
  },
  'cat-7': {
    cover: '#4a2c4e',
    coverLight: '#6b3d72',
    spine: '#351f38',
    accent: '#13aff4',
    label: 'Practice',
  },
  'cat-8': {
    cover: '#5c3a28',
    coverLight: '#7a4e38',
    spine: '#3f281c',
    accent: '#7bc142',
    label: 'Journals',
  },
}

const fallbackPalette: BookPalette = {
  cover: '#1a2f4e',
  coverLight: '#2a4570',
  spine: '#0f1f38',
  accent: '#13aff4',
  label: 'Legal',
}

export function getBookPalette(categoryId: string): BookPalette {
  return categoryPalettes[categoryId] ?? fallbackPalette
}

/** Law Reports and similar published report series use document-style covers. */
export function isReportCategory(categoryId: string): boolean {
  return categoryId === 'cat-1'
}

export function getShortTitle(title: string, max = 48): string {
  if (title.length <= max) return title
  return title.slice(0, max - 1).trimEnd() + '…'
}
