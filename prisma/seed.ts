import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário admin padrão
  const adminEmail = 'admin@levitamoveis.com.br'
  const adminPassword = 'admin123'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPassword)
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrador',
        role: 'admin',
      },
    })
    console.log('✅ Usuário admin criado:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Senha: ${adminPassword}`)
  } else {
    console.log('ℹ️  Usuário admin já existe')
  }

  // Criar categorias padrão
  const categories = [
    { name: 'Camas', slug: 'camas', order: 1 },
    { name: 'Armários', slug: 'armarios', order: 2 },
    { name: 'Berços', slug: 'bercos', order: 3 },
    { name: 'Carros', slug: 'carros', order: 4 },
    { name: 'Mesas', slug: 'mesas', order: 5 },
    { name: 'Suportes', slug: 'suportes', order: 6 },
    { name: 'Diversos', slug: 'diversos', order: 7 },
  ]

  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug },
    })

    if (!existing) {
      await prisma.category.create({ data: category })
      console.log(`✅ Categoria criada: ${category.name}`)
    }
  }

  // Criar certificações padrão
  const certifications = [
    { name: 'BPF ANVISA', description: 'BOAS PRÁTICAS DE FABRICAÇÃO', order: 1 },
    { name: 'INC ISO 9001', description: 'ABNT NBR ISO 9001', order: 2 },
    { name: 'INC ISO 13485', description: 'ABNT NBR ISO 13485', order: 3 },
    { name: 'NBR IEC 60601-2-52', description: 'CERTIFICADA CONFORME NOVOS PADRÕES', order: 4 },
    { name: 'CE Mark', description: 'Conformidade Europeia', order: 5 },
    { name: 'Invima', description: 'Instituto Nacional de Vigilancia de Medicamentos y Alimentos', order: 6 },
    { name: 'DINAVISA', description: 'Dirección Nacional de Vigilancia Sanitaria', order: 7 },
  ]

  for (const cert of certifications) {
    const existing = await prisma.certification.findFirst({
      where: { name: cert.name },
    })

    if (!existing) {
      await prisma.certification.create({ data: cert })
      console.log(`✅ Certificação criada: ${cert.name}`)
    }
  }

  // Criar página "Sobre"
  const sobreContent = `Fabricantes de móveis hospitalares, nos consolidamos como a marca mais lembrada pelo paranaense através da qualidade e por meio de um sistema de distribuição eficaz.

Pioneiros na região de Londrina neste ramo, somos conhecidos por manter um padrão técnico na confecção de nossos produtos, que resulta em móveis de alta durabilidade e atende minuciosamente as exigências do mercado.

Investimos na disponibilização de produtos que viabilizam a higiene e também a funcionalidade do sistema hospitalar.

Por manter o compromisso com nossos clientes, ofertando produtos confiáveis e seguros, buscamos o aperfeiçoamento contínuo da qualidade de nossos produtos e serviços, visando atender e superar os requisitos de nossos clientes.

Permanecendo, assim, como referência no mercado em que atuamos por todo território nacional.`

  const existingSobre = await prisma.page.findUnique({
    where: { slug: 'sobre' },
  })

  if (!existingSobre) {
    await prisma.page.create({
      data: {
        slug: 'sobre',
        title: 'Quem Somos',
        content: sobreContent,
        metaTitle: 'Quem Somos - Levita Móveis Hospitalares',
        metaDescription: 'Conheça a Levita Móveis Hospitalares, fabricantes de móveis hospitalares de alta qualidade.',
        active: true,
      },
    })
    console.log('✅ Página "Sobre" criada')
  }

  console.log('✨ Seed concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

