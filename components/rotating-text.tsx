'use client'

import { useState, useEffect } from 'react'

const phrases = [
  'Referência em móveis hospitalares no Paraná',
  'Qualidade que o mercado confia',
  'Tradição e inovação no mercado',
  'Alta durabilidade comprovada',
  'Soluções que facilitam a higiene hospitalar',
  'Confiança construída com qualidade',
]

export function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false)
      
      // Após o fade out, muda o texto e faz fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length)
        setIsVisible(true)
      }, 500) // Metade do tempo da animação
    }, 3000) // Troca a cada 3 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-[#67CBDD] py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center min-h-[40px]">
          <p
            className={`text-center text-sm md:text-base font-semibold text-white transition-opacity duration-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {phrases[currentIndex]}
          </p>
        </div>
      </div>
    </div>
  )
}

