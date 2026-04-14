'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Phone, Mail, Clock, MapPin } from 'lucide-react'
import { useState } from 'react'
import { openWhatsAppWithText } from '@/lib/whatsapp'

export default function ContatoPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    buyerType: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar solicitação')
      }

      const buyerLabelMap: Record<string, string> = {
        distribuidor: 'Distribuidor',
        'orgao-publico': 'Órgão Público',
        'pessoa-fisica': 'Pessoa Física',
        hospital: 'Hospital / Clínica',
        'empresa-privada': 'Empresa Privada',
        outro: 'Outro',
      }

      const lines = [
        'Olá! Vim pelo site da Levita e gostaria de solicitar um orçamento.',
        '',
        `Nome: ${formData.name}`,
        `E-mail: ${formData.email}`,
        `Telefone: ${formData.phone || 'Não informado'}`,
        `Tipo de comprador: ${buyerLabelMap[formData.buyerType] || 'Não informado'}`,
        `Assunto: ${formData.subject || 'Não informado'}`,
        '',
        'Mensagem:',
        formData.message,
      ]

      openWhatsAppWithText(lines.join('\n'))

      setFormData({
        name: '',
        email: '',
        phone: '',
        buyerType: '',
        subject: '',
        message: '',
      })
    } catch (error: any) {
      alert(error.message || 'Erro ao enviar solicitação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-secondary mb-8 text-center">
          Entre em Contato
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Solicite um Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="buyerType">Tipo de Comprador</Label>
                  <Select
                    value={formData.buyerType}
                    onValueChange={(value) => setFormData({ ...formData, buyerType: value })}
                  >
                    <SelectTrigger id="buyerType">
                      <SelectValue placeholder="Selecione o tipo de comprador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distribuidor">Distribuidor</SelectItem>
                      <SelectItem value="orgao-publico">Órgão Público</SelectItem>
                      <SelectItem value="pessoa-fisica">Pessoa Física</SelectItem>
                      <SelectItem value="hospital">Hospital / Clínica</SelectItem>
                      <SelectItem value="empresa-privada">Empresa Privada</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Assunto</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orcamento">Solicitar Orçamento</SelectItem>
                      <SelectItem value="duvida">Dúvida sobre Produto</SelectItem>
                      <SelectItem value="suporte">Suporte Técnico</SelectItem>
                      <SelectItem value="frete">Cotar Frete</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar para WhatsApp'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Telefones</p>
                    <p className="text-gray-600">(43) 3154-4455</p>
                    <p className="text-gray-600">(43) 3035-8750</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">E-mail</p>
                    <p className="text-gray-600">comercial@levitamoveis.com.br</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Horário de Atendimento</p>
                    <p className="text-gray-600">Segunda a Sexta das 8h às 18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Localização</p>
                    <p className="text-gray-600">Londrina - PR</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Por que escolher a Levita?</h3>
                <p className="text-gray-700 text-sm">
                  Somos referência no mercado de móveis hospitalares, oferecendo produtos 
                  de alta qualidade e um atendimento diferenciado. Entre em contato e 
                  descubra como podemos ajudar sua instituição.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


