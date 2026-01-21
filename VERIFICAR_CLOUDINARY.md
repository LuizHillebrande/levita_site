# Verificar Configuração do Cloudinary

Se você está recebendo o erro "Must supply api_key", significa que as variáveis de ambiente do Cloudinary não estão configuradas corretamente.

## Passos para resolver:

1. **Crie ou edite o arquivo `.env` na raiz do projeto** (mesmo nível do `package.json`)

2. **Adicione as seguintes variáveis** (substitua pelos seus valores reais):

```env
CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
CLOUDINARY_API_KEY=sua_api_key_aqui
CLOUDINARY_API_SECRET=seu_api_secret_aqui
```

3. **Como obter as credenciais:**

   - Acesse [cloudinary.com](https://cloudinary.com)
   - Faça login na sua conta
   - No Dashboard, você encontrará:
     - **Cloud Name**: Nome da sua conta (ex: `dkoasdkoas`)
     - **API Key**: Chave de API (ex: `123456789012345`)
     - **API Secret**: Segredo da API (ex: `abcdefghijklmnopqrstuvwxyz123456`)

4. **Reinicie o servidor de desenvolvimento:**

   ```bash
   # Pare o servidor (Ctrl+C) e inicie novamente
   npm run dev
   ```

   ⚠️ **IMPORTANTE**: O Next.js só carrega variáveis de ambiente quando o servidor é iniciado. Se você adicionar ou modificar variáveis no `.env`, precisa reiniciar o servidor.

5. **Verifique se o arquivo `.env` está na raiz do projeto:**

   ```
   /Users/luizhill/Documents/levita certo/
   ├── .env          ← Deve estar aqui
   ├── package.json
   ├── next.config.js
   └── ...
   ```

6. **Certifique-se de que o arquivo `.env` não está no `.gitignore`** (para não ser commitado acidentalmente):

   O arquivo `.env` deve estar no `.gitignore` para segurança, mas deve existir localmente.

## Exemplo de arquivo `.env`:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Auth
NEXTAUTH_SECRET="seu-secret-aqui"
SENHA="sua-senha-admin-aqui"

# Cloudinary
CLOUDINARY_CLOUD_NAME="dkoasdkoas"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123456"
```

## Teste:

Após configurar, tente fazer upload de uma imagem no formulário de produtos. Se ainda der erro, verifique:

1. Se as variáveis estão escritas corretamente (sem espaços extras)
2. Se não há aspas desnecessárias (a menos que o valor contenha espaços)
3. Se o servidor foi reiniciado após adicionar as variáveis
