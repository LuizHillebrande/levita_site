# Configurar Email (Gmail SMTP)

Para que o sistema de solicitação de orçamento funcione, você precisa configurar as credenciais do Gmail no arquivo `.env`.

## Passos para configurar:

### 1. Habilitar "Senha de App" no Gmail

O Gmail não permite mais usar a senha normal da conta. Você precisa criar uma "Senha de App":

1. Acesse sua conta Google: [myaccount.google.com](https://myaccount.google.com)
2. Vá em **Segurança**
3. Ative a **Verificação em duas etapas** (se ainda não estiver ativada)
4. Role até encontrar **Senhas de app** (pode estar em "Como fazer login no Google")
5. Clique em **Selecionar app** → escolha "Email"
6. Clique em **Selecionar dispositivo** → escolha "Outro (nome personalizado)"
7. Digite "Levita Móveis" ou qualquer nome
8. Clique em **Gerar**
9. **COPIE A SENHA GERADA** (ela aparece apenas uma vez!)

### 2. Adicionar variáveis no `.env`

Adicione as seguintes variáveis no arquivo `.env` na raiz do projeto:

```env
# Email Gmail SMTP
EMAIL=seu-email@gmail.com
SENHA_APP=senha-de-app-gerada-pelo-google

# Opcional: URL base do site (para links no email)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Exemplo:**
```env
EMAIL=luiz.logika@gmail.com
SENHA_APP=abcd efgh ijkl mnop
NEXT_PUBLIC_BASE_URL=https://levitamoveis.com.br
```

### 3. Instalar dependências

Após adicionar as variáveis, instale o pacote `nodemailer`:

```bash
npm install nodemailer @types/nodemailer
```

### 4. Reiniciar o servidor

⚠️ **IMPORTANTE**: Reinicie o servidor de desenvolvimento após adicionar/modificar variáveis de ambiente:

```bash
# Pare o servidor (Ctrl+C) e inicie novamente
npm run dev
```

## Como funciona:

1. Quando um cliente clica em "Solicitar Orçamento" na página do produto
2. Um popup/modal aparece com um formulário
3. O cliente preenche: nome, email, telefone e mensagem
4. O sistema envia um email para o endereço configurado em `EMAIL`
5. O email inclui todas as informações do cliente e o link do produto
6. Você pode responder diretamente ao cliente (o email do cliente fica em `replyTo`)

## Estrutura do email enviado:

- **Assunto**: "Nova Solicitação de Orçamento - [Nome do Produto]"
- **Para**: Seu email configurado em `EMAIL`
- **Reply-To**: Email do cliente (para responder diretamente)
- **Conteúdo**: Nome, email, telefone, produto de interesse, link do produto e mensagem

## Troubleshooting:

### Erro: "Invalid login"
- Verifique se a senha de app está correta (sem espaços extras)
- Certifique-se de que copiou a senha de app completa (16 caracteres, pode ter espaços)

### Erro: "Less secure app access"
- Não é mais necessário. Use "Senha de App" conforme instruções acima.

### Email não chega
- Verifique a pasta de spam
- Verifique se as variáveis estão no `.env` (não `.env.local` ou outro nome)
- Certifique-se de ter reiniciado o servidor após adicionar as variáveis

### Erro ao enviar
- Verifique o console do servidor para ver mensagens de erro detalhadas
- Certifique-se de que `EMAIL` e `SENHA_APP` estão configurados corretamente
