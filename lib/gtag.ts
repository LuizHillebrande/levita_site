declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const LEAD_CONVERSION_SEND_TO = 'AW-18223545694/zT_vCK_IoLscEN761PFD'

export function trackLeadConversion() {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  window.gtag('event', 'conversion', { send_to: LEAD_CONVERSION_SEND_TO })
}
