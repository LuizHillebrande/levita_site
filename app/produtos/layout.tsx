import { WhatsAppFloatButton } from '@/components/whatsapp-float-button'

export default function ProdutosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <WhatsAppFloatButton />
    </>
  )
}
