# 🔐 Configurar Senha de Admin

## ⚙️ Configuração da Variável de Ambiente

Para configurar a senha de acesso ao painel administrativo, adicione a variável `SENHA` no arquivo `.env`:

### 1. Abra ou crie o arquivo `.env` na raiz do projeto

### 2. Adicione a variável:

```env
SENHA="sua-senha-aqui"
```

### 3. Exemplo completo do `.env`:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Admin Login
SENHA="sua-senha-segura-aqui"
```

## 🔑 Credenciais de Acesso

**Email:** `luiz.logika@gmail.com`  
**Senha:** A senha configurada na variável `SENHA` do `.env`

## ⚠️ Importante

- A senha deve ser configurada no arquivo `.env`
- **NÃO** commite o arquivo `.env` no git (já está no .gitignore)
- Use uma senha forte e segura
- Apenas o email `luiz.logika@gmail.com` tem acesso ao painel admin

## 🚀 Após Configurar

1. Adicione a variável `SENHA` no `.env`
2. Reinicie o servidor (`npm run dev`)
3. Acesse `/admin/login` ou clique 3x no footer
4. Use o email `luiz.logika@gmail.com` e a senha do `.env`

---

**Pronto! Agora é só configurar a senha no `.env`** 🔒
