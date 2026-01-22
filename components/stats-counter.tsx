'use client'

import { useState, useEffect, useRef } from 'react'

interface StatItem {
  value: number
  prefix?: string
  suffix: string
  label: string
}

const stats: StatItem[] = [
  { value: 350, prefix: '+', suffix: '', label: 'Cidades Atendidas' },
  { value: 26, prefix: '+', suffix: '', label: 'Estados' },
  { value: 40, prefix: '+', suffix: ' anos', label: 'Experiência' },
  { value: 60, prefix: '+', suffix: ' tipos', label: 'Produtos' },
]

export function StatsCounter() {
  const [counters, setCounters] = useState(stats.map(() => 0))
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateCounters()
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [hasAnimated])

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const duration = 2000 // 2 segundos
      const steps = 60
      const increment = stat.value / steps
      const stepDuration = duration / steps

      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= stat.value) {
          current = stat.value
          clearInterval(timer)
        }

        setCounters((prev) => {
          const newCounters = [...prev]
          newCounters[index] = Math.floor(current)
          return newCounters
        })
      }, stepDuration)
    })
  }

  return (
    <section ref={sectionRef} className="py-20 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Elementos decorativos tecnológicos */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#67CBDD] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
            Números que Comprovam
          </h2>
          <div className="w-24 h-1 bg-[#67CBDD] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-[#67CBDD] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col items-center justify-center min-h-[180px]">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#67CBDD] mb-3 group-hover:scale-110 transition-transform">
                  {stat.prefix}
                  {counters[index].toLocaleString('pt-BR')}
                  {stat.suffix}
                </div>
                <div className="text-xs md:text-sm text-gray-700 font-semibold">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

