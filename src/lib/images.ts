const UNOPTIMIZED_IMAGE_HOSTS = new Set<string>([])

export function shouldSkipImageOptimization(src: string | null | undefined) {
  if (!src || src.startsWith("/")) return false

  try {
    return UNOPTIMIZED_IMAGE_HOSTS.has(new URL(src).hostname)
  } catch {
    return false
  }
}
