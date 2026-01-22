# Migração do Banco de Dados - Certificações

Para adicionar o modelo de Certificações ao banco de dados, execute o seguinte comando:

```bash
npx prisma migrate dev --name add_certifications
```

Isso irá:
1. Criar uma nova migração
2. Adicionar a tabela `Certification` ao banco de dados
3. Gerar o Prisma Client atualizado

Após executar a migração, você poderá:
- Acessar `/admin/certifications` para gerenciar certificações
- Adicionar novas certificações com upload de imagens
- Editar certificações existentes
- As certificações aparecerão automaticamente na página principal
