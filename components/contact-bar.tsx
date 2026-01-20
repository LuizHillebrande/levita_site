import { Phone, Mail, Clock } from 'lucide-react'

export function ContactBar() {
  return (
    <div className="bg-gray-50 border-b border-gray-200 py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-700">
          <a href="tel:+554331544455" className="flex items-center space-x-2 hover:text-[#67CBDD] transition-colors">
            <Phone className="h-4 w-4" />
            <span>(43) 3154-4455 / (43) 3035-8750</span>
          </a>
          <a href="mailto:comercial@levitamoveis.com.br" className="flex items-center space-x-2 hover:text-[#67CBDD] transition-colors">
            <Mail className="h-4 w-4" />
            <span>comercial@levitamoveis.com.br</span>
          </a>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Seg à Sex das 8h às 18h</span>
          </div>
        </div>
      </div>
    </div>
  )
}

