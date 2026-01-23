# Migração do Banco de Dados - Opcionais de Produtos

Para adicionar o modelo de ProductOptional ao banco de dados, execute o seguinte comando:

```bash
npx prisma migrate dev --name add_product_optionals
```

Isso irá:
1. Criar uma nova migração
2. Adicionar a tabela `ProductOptional` ao banco de dados
3. Gerar o Prisma Client atualizado

## Como usar a funcionalidade "Monte sua Cama"

### 1. No Admin
- Acesse `/admin/products`
- Clique em "Editar" em um produto
- Role até a seção "Opcionais do Produto"
- Adicione opcionais com:
  - Nome (obrigatório)
  - Descrição (opcional)
  - Valor (opcional)
  - Checkbox "Mostrar preço ao cliente" (se marcado, mostra o preço; se não, mostra "Sob consulta")
  - Checkbox "Ativo" (para ativar/desativar)
  - Ordem de exibição

### 2. No Site
- Quando um produto tiver opcionais cadastrados, a seção "🛏️ Monte sua Cama" aparecerá automaticamente na página do produto
- O cliente pode selecionar os opcionais desejados
- Ao clicar em "Solicitar Orçamento", os opcionais selecionados serão incluídos no email

### 3. Email
- O email será enviado do email configurado no `.env` (EMAIL) para o próprio email
- O campo `replyTo` será o email do cliente, permitindo responder diretamente
- Os opcionais selecionados aparecerão formatados no email
