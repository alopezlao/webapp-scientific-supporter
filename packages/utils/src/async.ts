/**
 * Utilidades asincrónicas
 */

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function debounce<T extends AsyncFunction>(fn: T, delay: number): T {
  let timeoutId: NodeJS.Timeout

  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(fn(...args))
      }, delay)
    })
  }) as T
}

export function throttle<T extends AsyncFunction>(fn: T, delay: number): T {
  let lastRun = 0

  return ((...args: any[]) => {
    const now = Date.now()
    if (now - lastRun >= delay) {
      lastRun = now
      return fn(...args)
    }
    return Promise.resolve()
  }) as T
}

export function retry<T extends AsyncFunction>(
  fn: T,
  maxAttempts = 3,
  delayMs = 1000
): T {
  return (async (...args: any[]) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn(...args)
      } catch (error) {
        if (i === maxAttempts - 1) throw error
        await sleep(delayMs * (i + 1))
      }
    }
  }) as T
}
