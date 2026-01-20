'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Phone, Mail, Clock } from 'lucide-react'

export function Footer() {
  const router = useRouter()
  const [clickCount, setClickCount] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleFooterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const newCount = clickCount + 1
    setClickCount(newCount)

    if (newCount >= 3) {
      setClickCount(0)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      router.push('/admin/login')
      return
    }

    // Reset contador após 2 segundos
    timeoutRef.current = setTimeout(() => {
      setClickCount(0)
    }, 2000)
  }

  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
                <Image
                  src="/images/logo/logo.png"
                  alt="Levita Móveis Hospitalares"
                  width={120}
                  height={50}
                  className="h-10 md:h-12 w-auto"
                />
              </div>
            </Link>
            <p className="text-gray-300 mb-4">
              Fabricantes de móveis hospitalares, consolidados como a marca mais lembrada 
              pelo paranaense através da qualidade e por meio de um sistema de distribuição eficaz.
            </p>
            <div className="flex space-x-4">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-accent transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-accent transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-accent transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="text-gray-300 hover:text-accent transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-300 hover:text-accent transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-accent transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-300">
                <Phone className="h-5 w-5 mt-0.5 text-[#67CBDD] flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Telefones</p>
                  <p>(43) 3154-4455 / (43) 3035-8750</p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-300">
                <Mail className="h-5 w-5 mt-0.5 text-[#67CBDD] flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">E-mail</p>
                  <a href="mailto:comercial@levitamoveis.com.br" className="hover:text-[#67CBDD] transition-colors">
                    comercial@levitamoveis.com.br
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-300">
                <Clock className="h-5 w-5 mt-0.5 text-[#67CBDD] flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Horário</p>
                  <p>Seg à Sex das 8h às 18h</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div 
          role="button"
          tabIndex={0}
          className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300 cursor-pointer select-none"
          onClick={handleFooterClick}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            return false
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleFooterClick(e as any)
            }
          }}
        >
          <p>&copy; {new Date().getFullYear()} Levita Móveis Hospitalares. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
