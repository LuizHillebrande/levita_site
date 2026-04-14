import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/**
 * Faixa fina no topo da home: destaque para distribuidores + CTA orçamento.
 * Visual: gradiente âmbar/laranja + camada de brilho em movimento (globals.css).
 */
export function DistributorBanner() {
  return (
    <Link
      href="/contato"
      className="group relative block overflow-hidden border-b border-amber-700/20 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 py-2.5 shadow-sm transition-[filter] hover:brightness-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    >
      {/* Brilho fino que atravessa a faixa */}
      <span
        className="distributor-banner-shine pointer-events-none absolute inset-0 opacity-90"
        aria-hidden
      />
      <span className="relative flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-slate-900 sm:text-xs md:text-sm">
        <span>Condições especiais para distribuidores</span>
        <span className="hidden text-slate-800/80 sm:inline" aria-hidden>
          ·
        </span>
        <span className="inline-flex items-center gap-1">
          Faça um orçamento
          <ArrowRight
            className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5"
            aria-hidden
          />
        </span>
      </span>
    </Link>
  )
}
