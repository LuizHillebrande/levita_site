'use client'

import { useEffect, useState } from 'react'

interface StatItem {
  value: string
  label: string
}

const stats: StatItem[] = [
  { value: '+350', label: 'Cidades Atendidas' },
  { value: '+26', label: 'Estados' },
  { value: '+40 anos', label: 'Experiência' },
  { value: '+60 tipos', label: 'Produtos' },
]

export function StatsCounter() {
  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0))

  useEffect(() => {
    const duration = 700
    const start = performance.now()
    const targets = stats.map((stat) => Number.parseInt(stat.value.replace(/[^\d]/g, ''), 10))

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setAnimatedValues(targets.map((target) => Math.floor(target * progress)))
      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [])

  return (
    <>
      <section className="bg-white p-4 md:hidden">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-[12px] border border-[#e0eef2] bg-[#f4f8fa] px-3 py-5 text-center shadow-none"
              >
                <div className="text-[30px] font-bold leading-none text-[#1a3060]">
                  +
                  {animatedValues[index]}
                  {stat.value.includes('anos') ? ' anos' : ''}
                  {stat.value.includes('tipos') ? ' tipos' : ''}
                </div>
                <div className="mt-[6px] text-[11px] font-medium text-[#6b8a99]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hidden border-b-2 border-[#f0f4f8] bg-white px-10 py-5 md:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-around">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center">
              <div className="flex min-w-[180px] flex-col items-center gap-1 text-center">
                <div className="text-[28px] font-bold leading-none text-[#1a3060]">
                  +
                  {animatedValues[index]}
                  {stat.value.includes('anos') ? ' anos' : ''}
                  {stat.value.includes('tipos') ? ' tipos' : ''}
                </div>
                <div className="text-center text-[11px] font-medium uppercase tracking-[0.04em] text-[#6b8a99]">
                  {stat.label}
                </div>
              </div>
              {index < stats.length - 1 && <div className="ml-6 h-10 w-px bg-[#e0eef2]" />}
            </div>
          ))}
        </div>
      </section>

      <section className="hidden bg-gradient-to-r from-[#1a3060] to-[#2aaab5] px-10 py-3 md:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-10">
          {[
            'Qualidade ISO certificada',
            'Entrega para todo o Brasil',
            'Suporte técnico especializado',
            'Pioneiros em Londrina há +40 anos',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.9)]">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.2)] text-[10px] text-white">
                ✓
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
