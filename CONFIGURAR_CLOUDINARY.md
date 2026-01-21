# Configurar Cloudinary

Para usar o upload de imagens, você precisa configurar as credenciais do Cloudinary no arquivo `.env`:

```env
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

## Como obter as credenciais:

1. Acesse [cloudinary.com](https://cloudinary.com)
2. Crie uma conta ou faça login
3. No Dashboard, você encontrará:
   - **Cloud Name**: Nome da sua conta
   - **API Key**: Chave de API
   - **API Secret**: Segredo da API

## Instalar dependência:

Após configurar o `.env`, instale o pacote cloudinary:

```bash
npm install cloudinary
```

## Funcionalidades:

- Upload de imagens JPG, PNG e WEBP
- Tamanho máximo: 10MB por imagem
- Otimização automática de imagens
- Organização em pastas no Cloudinary (`levita-moveis/products/`)
- Preview das imagens antes de salvar
- Reordenação de imagens (arrastar para cima/baixo)
- Remoção de imagens antes de salvar
