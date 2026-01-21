# 🔄 Atualizar Banco de Dados

## ⚠️ Importante

Após as mudanças no schema do Prisma, você precisa atualizar o banco de dados.

## 📋 Passos

1. **Atualize o banco de dados:**
   ```bash
   npx prisma db push
   ```

2. **Regenere o cliente Prisma (opcional, mas recomendado):**
   ```bash
   npx prisma generate
   ```

## ✅ O que foi adicionado

- **`technicalSpecs`**: Campo para armazenar especificações técnicas detalhadas (dimensões, peso, material, etc.)
- **`documentation`**: Campo para armazenar URLs de documentação (PDFs, manuais, certificações)

Ambos os campos são armazenados como JSON (String no SQLite) e são automaticamente convertidos para objetos JavaScript nas APIs.

## 🎯 Próximos Passos

Após atualizar o banco, você poderá:
- Cadastrar produtos com especificações técnicas completas
- Adicionar links para documentação (PDFs, manuais)
- Marcar produtos como "em destaque" para aparecer na página inicial

---

**Execute `npx prisma db push` agora!** 🚀
