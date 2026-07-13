import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { waitForAppReady } from '../utils/appReady'

type LoaderPhase = 'loading' | 'exiting' | 'ready'

interface AppLoadingContextValue {
  runWithLoader: (action: () => void, minMs?: number) => Promise<void>
}

const AppLoadingContext = createContext<AppLoadingContextValue | null>(null)

const EXIT_MS = 450

export function AppLoadingProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<LoaderPhase>('loading')

  useEffect(() => {
    let cancelled = false

    waitForAppReady().then(() => {
      if (cancelled) return
      setPhase('exiting')
      window.setTimeout(() => {
        if (!cancelled) setPhase('ready')
      }, EXIT_MS)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const runWithLoader = useCallback(async (action: () => void, minMs = 600) => {
    setPhase('loading')
    await waitForAppReady(minMs)
    action()
    setPhase('exiting')
    await delay(EXIT_MS)
    setPhase('ready')
  }, [])

  return (
    <AppLoadingContext.Provider value={{ runWithLoader }}>
      {phase !== 'ready' && <LoadingScreen exiting={phase === 'exiting'} />}
      <div
        className={`app-content ${phase === 'ready' ? 'app-content-visible' : ''} ${
          phase === 'exiting' ? 'app-content-entering' : ''
        }`}
        aria-hidden={phase !== 'ready'}
      >
        {children}
      </div>
    </AppLoadingContext.Provider>
  )
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function useAppLoading() {
  const ctx = useContext(AppLoadingContext)
  if (!ctx) throw new Error('useAppLoading must be used within AppLoadingProvider')
  return ctx
}
