import { Phone, Mail, Clock, Facebook, Instagram, Linkedin } from 'lucide-react'

export function TopHeader() {
  return (
    <div className="bg-[#67CBDD] text-secondary py-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex flex-wrap items-center gap-4 mb-2 md:mb-0">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>(43) 3154-4455 / (43) 3035-8750</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>comercial@levitamoveis.com.br</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Seg à Sex das 8h às 18h</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:opacity-70 transition-opacity">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:opacity-70 transition-opacity">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:opacity-70 transition-opacity">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}


