/** Número padrão: (43) 99600-0948 → E.164 BR */
export const DEFAULT_WHATSAPP_E164 = '5543996000948'

export function getWhatsAppDigits(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || DEFAULT_WHATSAPP_E164
  return raw.replace(/\D/g, '')
}

export function openWhatsAppWithText(text: string): void {
  const phone = getWhatsAppDigits()
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

/** URL pública do site (Vercel) quando configurada; senão origem atual. */
export function getPublicSiteBaseUrl(): string {
  if (typeof window === 'undefined') {
    return (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '') || 'https://levita-site.vercel.app'
  }
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '')
  if (fromEnv) return fromEnv
  return window.location.origin.replace(/\/$/, '')
}

export function formatProductQuoteWhatsAppMessage(opts: {
  productName: string
  productSlug: string
  baseUrl: string
  optionals: Array<{ name: string; showPrice: boolean; price: number | null }>
}): string {
  const base = opts.baseUrl.replace(/\/$/, '')
  const lines: string[] = [
    'Olá! Gostaria de solicitar um orçamento.',
    '',
    `Produto: ${opts.productName}`,
    '',
    `Link: ${base}/produtos/${opts.productSlug}`,
  ]

  if (opts.optionals.length > 0) {
    lines.push('', 'Monte sua Cama (opcionais selecionados):', '')
    for (const opt of opts.optionals) {
      const suffix =
        opt.showPrice && opt.price != null
          ? ` - R$ ${opt.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : ' - Sob consulta'
      lines.push('\u2713 ' + opt.name + suffix)
    }
  }

  return lines.join('\n')
}
