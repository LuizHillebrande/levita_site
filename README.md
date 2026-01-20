# Levita Móveis Hospitalares

Site institucional e catálogo de produtos hospitalares desenvolvido com Next.js 14, TypeScript, TailwindCSS e Prisma.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Shadcn/UI**
- **Prisma ORM**
- **SQLite** (preparado para migração para Postgres)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório e instale as dependências:**

```bash
npm install
```

2. **Configure as variáveis de ambiente:**

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-key-aqui"
```

3. **Configure o banco de dados:**

```bash
# Gerar o Prisma Client
npm run db:generate

# Criar o banco de dados e aplicar o schema
npm run db:push

# Popular o banco com dados iniciais (usuário admin e categorias)
npm run db:seed
```

4. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

O site estará disponível em [http://localhost:3000](http://localhost:3000)

## 🔐 Acesso ao Painel Administrativo

Após rodar o seed, você terá um usuário admin criado:

- **URL:** http://localhost:3000/admin/login
- **Email:** admin@levitamoveis.com.br
- **Senha:** admin123

⚠️ **IMPORTANTE:** Altere a senha padrão após o primeiro login em produção!

## 📁 Estrutura do Projeto

```
levita-moveis-hospitalares/
├── app/
│   ├── admin/              # Painel administrativo
│   │   ├── login/         # Página de login
│   │   ├── products/      # CRUD de produtos
│   │   ├── categories/    # CRUD de categorias
│   │   └── pages/         # Edição de páginas institucionais
│   ├── api/               # API Routes
│   │   ├── auth/         # Autenticação
│   │   ├── products/     # Endpoints de produtos
│   │   ├── categories/   # Endpoints de categorias
│   │   └── upload/       # Upload de imagens
│   ├── produtos/         # Páginas públicas de produtos
│   ├── sobre/            # Página sobre a empresa
│   ├── contato/          # Página de contato
│   └── layout.tsx        # Layout principal
├── components/
│   ├── ui/               # Componentes Shadcn/UI
│   ├── navbar.tsx        # Navbar global
│   └── footer.tsx        # Footer global
├── lib/
│   ├── prisma.ts         # Cliente Prisma
│   ├── auth.ts           # Funções de autenticação
│   └── utils.ts          # Utilitários
├── prisma/
│   ├── schema.prisma     # Schema do banco de dados
│   └── seed.ts           # Script de seed
└── public/
    └── images/           # Imagens do site
        ├── logo/         # Logos da empresa
        ├── banners/      # Banners da home
        ├── products/     # Fotos dos produtos
        └── institutional/ # Fotos institucionais
```

## 📸 Onde Colocar as Imagens

### Logo da Empresa
- `/public/images/logo/logo.png`
- `/public/images/logo/logo-white.png` (variante para header escuro)
- `/public/images/logo/favicon.png`

### Banners da Home
- `/public/images/banners/home-01.jpg`
- `/public/images/banners/home-02.jpg`

### Fotos dos Produtos
Cada produto deve ter sua própria pasta:
- `/public/images/products/poltrona-reclinavel/img1.jpg`
- `/public/images/products/poltrona-reclinavel/img2.jpg`

### Fotos Institucionais
- `/public/images/institutional/factory.jpg`
- `/public/images/institutional/team.jpg`

## 🗄️ Banco de Dados

### Migração para Postgres

O projeto está preparado para migração futura para Postgres. Para migrar:

1. Altere o `provider` no `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Atualize a `DATABASE_URL` no `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/levita_db"
```

3. Execute as migrações:
```bash
npm run db:migrate
```

## 🎨 Paleta de Cores

- **Primary:** `#1A73E8` (azul profissional)
- **Primary Dark:** `#0F4FB5`
- **Secondary:** `#0A2647` (azul profundo)
- **Accent:** `#88C0F7` (azul claro)
- **Background Light:** `#F8FAFC` (cinza hospitalar)

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm run db:generate` - Gera o Prisma Client
- `npm run db:push` - Aplica o schema ao banco
- `npm run db:migrate` - Cria e aplica migrações
- `npm run db:studio` - Abre o Prisma Studio
- `npm run db:seed` - Popula o banco com dados iniciais

## 🔧 Funcionalidades

### Páginas Públicas
- ✅ Home com banner, produtos em destaque e categorias
- ✅ Listagem de produtos com filtros
- ✅ Página individual de produto com galeria
- ✅ Página "Sobre a Empresa"
- ✅ Formulário de contato

### Painel Administrativo
- ✅ Login com autenticação JWT
- ✅ CRUD completo de produtos
- ✅ CRUD completo de categorias
- ✅ Upload de imagens
- ✅ Gerenciamento de páginas institucionais (estrutura criada)

## 🚧 Próximos Passos

- [ ] Implementar upload de imagens no painel admin
- [ ] Adicionar editor de texto rico para descrições
- [ ] Implementar busca avançada de produtos
- [ ] Adicionar sistema de e-mail para contatos
- [ ] Implementar paginação na listagem de produtos
- [ ] Adicionar SEO otimizado
- [ ] Implementar sistema de favoritos/carrinho (se necessário)

## 📄 Licença

Este projeto é privado e de propriedade da Levita Móveis Hospitalares.

---

Desenvolvido com ❤️ para Levita Móveis Hospitalares


