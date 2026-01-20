# 🖼️ Onde Colocar a Logo

## 📁 Localização das Logos

Coloque as logos na seguinte pasta:

```
/public/images/logo/
```

## 📂 Estrutura de Arquivos

```
public/
└── images/
    └── logo/
        ├── logo.png          ← LOGO PARA HEADER (fundo branco)
        └── logo-white.png    ← LOGO PARA FOOTER (fundo escuro)
```

## ✅ Arquivos Necessários

### 1. `logo.png` - Logo para o Header
- **Onde é usada:** Navbar (cabeçalho branco)
- **Formato:** `.png` (com fundo transparente ou branco)
- **Tamanho recomendado:** 
  - Largura: **176px** (ou proporcional)
  - Altura: **75px** (ou proporcional)
  - Resolução: 2x para retina (352x150px)

### 2. `logo-white.png` - Logo para o Footer
- **Onde é usada:** Footer (rodapé azul escuro)
- **Formato:** `.png` (versão branca/clara da logo)
- **Tamanho recomendado:**
  - Largura: **176px** (ou proporcional)
  - Altura: **75px** (ou proporcional)
  - Resolução: 2x para retina (352x150px)

## 🎨 Especificações Técnicas

### Logo do Header (`logo.png`)
- Fundo: **Transparente** ou **Branco**
- Cores: Use as cores originais da logo (azul, etc)
- Formato: PNG com transparência (se necessário)

### Logo do Footer (`logo-white.png`)
- Fundo: **Transparente**
- Cores: **Branco** ou **Claro** (para aparecer no fundo azul escuro)
- Formato: PNG com transparência

## 📝 Passos para Adicionar

1. **Crie a pasta** (se não existir):
   ```bash
   mkdir -p public/images/logo
   ```

2. **Adicione as logos:**
   - `logo.png` → Logo normal para o header
   - `logo-white.png` → Logo branca para o footer

3. **Otimize as imagens:**
   - Use ferramentas como TinyPNG ou ImageOptim
   - Mantenha boa qualidade, mas reduza o tamanho do arquivo
   - Tamanho recomendado: máximo 50KB por imagem

## 🔄 Se Você Tiver Apenas Uma Logo

Se você tiver apenas uma versão da logo:

1. **Para o header:** Use a logo original
2. **Para o footer:** 
   - Crie uma versão branca/clara no Photoshop/Figma
   - Ou use a mesma logo (pode não ter bom contraste)

## ⚙️ Personalizar Tamanho

Se sua logo tiver tamanho diferente, edite os arquivos:

**Navbar** (`components/navbar.tsx`):
```tsx
<Image
  src="/images/logo/logo.png"
  width={176}  // ← Ajuste aqui
  height={75}  // ← Ajuste aqui
/>
```

**Footer** (`components/footer.tsx`):
```tsx
<Image
  src="/images/logo/logo-white.png"
  width={176}  // ← Ajuste aqui
  height={75}  // ← Ajuste aqui
/>
```

## ✅ Após Adicionar

1. Salve as logos na pasta `public/images/logo/`
2. As logos aparecerão automaticamente no header e footer
3. Se não aparecer, verifique:
   - Nomes dos arquivos estão corretos
   - Arquivos estão na pasta correta
   - Formato é PNG ou JPG

---

**Pronto! Agora é só adicionar suas logos na pasta `public/images/logo/`** 🎉


