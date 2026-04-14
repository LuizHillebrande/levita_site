'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileText,
  Award,
  LogOut,
  Menu,
  X,
  MessageSquareQuote,
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Verificar autenticação
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        } else if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      })
      .catch(() => {
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      })
  }, [router, pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const menuItems = [
    { href: '/admin/products', label: 'Produtos', icon: Package },
    { href: '/admin/categories', label: 'Categorias', icon: FolderTree },
    { href: '/admin/reviews', label: 'Avaliações', icon: MessageSquareQuote },
    { href: '/admin/certifications', label: 'Certificações', icon: Award },
    { href: '/admin/pages', label: 'Páginas', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-secondary text-white z-40 transform transition-transform md:translate-x-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          {user && (
            <div className="mb-4">
              <p className="text-sm text-gray-300">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-white hover:bg-white/10"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-secondary text-white p-2 rounded"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}


