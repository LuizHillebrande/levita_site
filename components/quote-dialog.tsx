'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

const DEFAULT_WHATSAPP_E164 = '5543991598585'

type OptionalRow = {
  id: string
  name: string
  description: string | null
  price: number | null
  showPrice: boolean
}

interface QuoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName?: string
  productSlug?: string
  selectedOptionals?: string[]
  productId?: string
}

function formatOptionalForWhatsApp(opt: OptionalRow) {
  const priceInfo =
    opt.showPrice && opt.price != null
      ? ` - R$ ${opt.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : ' - Sob consulta'
  let line = `✓ ${opt.name}${priceInfo}`
  if (opt.description) line += `\n  ${opt.description}`
  return line
}

function buildWhatsAppMessage(params: {
  name: string
  email: string
  phone: string
  message: string
  productName?: string
  productSlug?: string
  optionals: OptionalRow[]
}) {
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const lines: string[] = [
    'Olá! Gostaria de solicitar um orçamento pela Levita.',
    '',
    `*Nome:* ${params.name}`,
    `*E-mail:* ${params.email}`,
  ]
  if (params.phone.trim()) {
    lines.push(`*Telefone:* ${params.phone.trim()}`)
  }
  lines.push('')
  if (params.productName) {
    lines.push(`*Produto:* ${params.productName}`)
  }
  if (params.productSlug) {
    lines.push(`*Página do produto:* ${baseUrl}/produtos/${params.productSlug}`)
  }
  if (params.optionals.length > 0) {
    lines.push('', '*Monte sua Cama (opcionais selecionados):*')
    params.optionals.forEach((o) => lines.push(formatOptionalForWhatsApp(o)))
  }
  lines.push('', '*Mensagem:*', params.message)
  return lines.join('\n')
}

export function QuoteDialog({
  open,
  onOpenChange,
  productName,
  productSlug,
  selectedOptionals = [],
  productId,
}: QuoteDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productName,
          productSlug,
          selectedOptionals,
          productId,
          channel: 'whatsapp',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Não foi possível registrar o pedido. Tente novamente.')
        return
      }

      const optionals: OptionalRow[] = Array.isArray(data.optionals) ? data.optionals : []

      const text = buildWhatsAppMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        productName,
        productSlug,
        optionals,
      })

      const phone =
        process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\D/g, '') || DEFAULT_WHATSAPP_E164
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`

      window.open(url, '_blank', 'noopener,noreferrer')

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })
      setTimeout(() => {
        setSuccess(false)
        onOpenChange(false)
      }, 2500)
    } catch {
      alert('Erro ao continuar para o WhatsApp. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setSuccess(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Solicitar Orçamento</DialogTitle>
          <DialogDescription>
            {productName
              ? `Preencha seus dados. Você será direcionado ao WhatsApp com a mensagem pronta para o produto: ${productName}`
              : 'Preencha seus dados. Você será direcionado ao WhatsApp com a mensagem pronta.'}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Abrindo o WhatsApp…</h3>
            <p className="text-gray-600">
              Se não abrir automaticamente, verifique o bloqueio de pop-ups do navegador.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(43) 99999-9999"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="message">Mensagem *</Label>
              <Textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Descreva sua necessidade ou faça perguntas sobre o produto..."
                disabled={loading}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#67CBDD] hover:bg-[#4FA8B8] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparando…
                  </>
                ) : (
                  'Continuar no WhatsApp'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
