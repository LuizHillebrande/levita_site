# 📸 Onde Colocar as Imagens do Carrossel Hero

## 🎯 Localização das Imagens

Coloque as **2 imagens do carrossel** na seguinte pasta:

```
/public/images/banners/
```

## 📁 Estrutura de Arquivos

```
public/
└── images/
    └── banners/
        ├── home-01.jpg    ← PRIMEIRA IMAGEM DO CARROSSEL
        └── home-02.jpg    ← SEGUNDA IMAGEM DO CARROSSEL
```

## ✅ Passos para Adicionar as Imagens

1. **Crie a pasta** (se não existir):
   ```bash
   mkdir -p public/images/banners
   ```

2. **Adicione suas imagens**:
   - Nome da primeira imagem: `home-01.jpg`
   - Nome da segunda imagem: `home-02.jpg`

3. **Formatos suportados**:
   - `.jpg` ou `.jpeg` (recomendado)
   - `.png`
   - `.webp` (melhor performance)

4. **Tamanho recomendado**:
   - Largura: **1920px** (ou maior)
   - Altura: **600px - 800px**
   - Proporção: 16:9 ou similar
   - Tamanho do arquivo: máximo 500KB (otimize antes de usar)

## 🎨 Personalizar o Carrossel

Se quiser alterar os textos ou adicionar mais slides, edite o arquivo:

```
/components/hero-carousel.tsx
```

Na linha **12-28**, você pode:
- Adicionar mais slides
- Alterar os textos
- Alterar os links dos botões
- Alterar os nomes das imagens

## 📝 Exemplo de Configuração

```typescript
const slides = [
  {
    image: '/images/banners/home-01.jpg',  // ← Sua primeira imagem
    title: 'Móveis Hospitalares de Alta Qualidade',
    description: 'Texto descritivo...',
    buttonText: 'Ver Produtos',
    buttonLink: '/produtos',
  },
  {
    image: '/images/banners/home-02.jpg',  // ← Sua segunda imagem
    title: 'Soluções Hospitalares Completas',
    description: 'Texto descritivo...',
    buttonText: 'Solicitar Orçamento',
    buttonLink: '/contato',
  },
]
```

## 🚀 Após Adicionar as Imagens

1. Salve as imagens na pasta `public/images/banners/`
2. O carrossel irá funcionar automaticamente
3. As imagens mudam automaticamente a cada 5 segundos
4. Você pode clicar nas setas ou nos indicadores para navegar

## ⚠️ Importante

- As imagens devem ter **nomes exatos**: `home-01.jpg` e `home-02.jpg`
- Se usar `.png`, altere a extensão no código também
- Certifique-se de que as imagens estão otimizadas para web
- Use imagens de alta qualidade, mas com tamanho de arquivo razoável

---

**Pronto! Agora é só adicionar suas imagens na pasta `public/images/banners/`** 🎉


