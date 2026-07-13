interface LoadingScreenProps {
  exiting?: boolean
}

export function LoadingScreen({ exiting = false }: LoadingScreenProps) {
  return (
    <div
      className={`loading-screen ${exiting ? 'loading-screen-exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading iSmart E-Library"
    >
      <div className="loading-screen-inner">
        <div className="loading-ring loading-ring-outer" />
        <div className="loading-ring loading-ring-inner" />
        <div className="loading-logo-wrap">
          <img src="/ismartlogo.png" alt="" className="loading-logo" />
        </div>
      </div>
      <p className="loading-label">iSmart E-Library</p>
      <p className="loading-sublabel">Preparing your library…</p>
    </div>
  )
}
