'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Category {
  id: string
  name: string
  slug: string
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Buscar categorias
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || [])
      })
      .catch((error) => {
        console.error('Error fetching categories:', error)
      })
  }, [])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsDropdownOpen(false)
      }
    }

    if (isProductsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProductsDropdownOpen])

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/#quem-somos', label: 'Quem Somos' },
    { href: '/produtos', label: 'Monte sua Cama' },
    { href: '/contato', label: 'Contato' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/produtos?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[#f0f2f5] bg-white">
      <div className="mx-auto max-w-[1280px] px-4 md:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/logo/logo.png"
              alt="Levita Móveis Hospitalares"
              width={200}
              height={84}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden flex-1 items-center justify-center space-x-6 lg:flex">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[14px] font-medium text-[#3a5068] transition-colors hover:text-[#1a3060]"
              >
                {item.label}
              </Link>
            ))}
            {/* Produtos Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                className="flex items-center space-x-1 text-[14px] font-medium text-[#3a5068] transition-colors hover:text-[#1a3060]"
              >
                <span>Produtos</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProductsDropdownOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/produtos"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#67CBDD] hover:text-white transition-colors text-base"
                    onClick={() => setIsProductsDropdownOpen(false)}
                  >
                    Todos os Produtos
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/produtos/${category.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-[#67CBDD] hover:text-white transition-colors text-base"
                      onClick={() => setIsProductsDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar Desktop */}
          <div className="ml-4 hidden max-w-md flex-1 items-center space-x-4 md:flex">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Input
                type="search"
                placeholder="Pesquisar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-[200px] rounded-[10px] border border-[#e0eef2] bg-[#f5f8fa] py-2 pl-10 pr-[14px] text-[13px] text-[#8ab0bb] placeholder:text-[#8ab0bb] focus:border-[#3dc8d4]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>

          {/* Actions Desktop */}
          <div className="ml-4 hidden items-center space-x-3 md:flex">
            <Button
              asChild
              size="default"
              className="rounded-[10px] border-none bg-[#3dc8d4] px-[22px] py-[10px] text-[14px] font-bold text-[#0a2a40] hover:bg-[#2aaab5]"
            >
              <Link href="/contato">Orçamento</Link>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-[#67CBDD] transition-colors"
              aria-label="Pesquisar"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Pesquisar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 border-2 border-gray-200 focus:border-[#67CBDD] rounded-lg"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-[#67CBDD] transition-colors text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile Produtos */}
            <div className="py-2">
              <Link
                href="/produtos"
                className="block py-2 text-gray-700 hover:text-[#67CBDD] transition-colors text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Todos os Produtos
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/produtos/${category.slug}`}
                  className="block py-2 pl-4 text-gray-600 hover:text-[#67CBDD] transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t mt-4">
              <Button asChild className="w-full bg-[#67CBDD] hover:bg-[#4FA8B8] text-white text-base">
                <Link href="/contato">Solicitar Orçamento</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

