const MIN_SPLASH_MS = 900

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

export async function waitForAppReady(minMs = MIN_SPLASH_MS) {
  const fontsReady = document.fonts?.ready ?? Promise.resolve()
  await Promise.all([
    fontsReady,
    preloadImage('/ismartlogo.png'),
    delay(minMs),
  ])
}
