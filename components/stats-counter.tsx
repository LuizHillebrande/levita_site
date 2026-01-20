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
    <section ref={sectionRef} className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#67CBDD] mb-2">
                {stat.prefix}
                {counters[index].toLocaleString('pt-BR')}
                {stat.suffix}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

