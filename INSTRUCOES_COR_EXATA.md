# 🎨 Como Pegar a Cor Azul Clara do Header

## ⚠️ A cor `#32373c` que você encontrou é CINZA ESCURO (botões), não azul claro!

## ✅ Passo a Passo Correto:

### 1. Abra o site original
https://levitamoveis.com.br

### 2. Abra o DevTools
- **Windows/Linux:** Pressione `F12`
- **Mac:** Pressione `Cmd + Option + I`

### 3. Ative a ferramenta de seleção
- Clique no ícone de **seleção** (canto superior esquerdo do DevTools)
- Ou pressione `Ctrl + Shift + C` (Windows) / `Cmd + Shift + C` (Mac)

### 4. Clique no HEADER AZUL CLARO
- Clique na **parte superior do site** onde está:
  - "(43)3154-4455 / (43)3035-8750"
  - "comercial@levitamoveis.com.br"
  - "Seg à Sex das 8h às 18h"
- **Essa é a parte azul clara!**

### 5. Veja a cor no DevTools
No painel direito, você verá algo como:

**Opção A - Aba "Computed":**
```
background-color: rgb(179, 217, 242)
```
ou
```
background-color: #b3d9f2
```

**Opção B - Aba "Styles":**
Procure por `background` ou `background-color` e clique no **quadrado colorido**.
Depois clique no **conta-gotas** (ícone de pipeta) e clique no azul claro.

### 6. Copie o código hexadecimal
Você verá algo como: `#B3D9F2` ou `#A8D5F0` ou similar.

---

## 🔍 Dica: Use o Console do Navegador

Cole este código no **Console** do DevTools (aba Console):

```javascript
// Clique no header azul claro primeiro, depois cole isso:
const elemento = document.querySelector(':hover');
if (elemento) {
  const cor = window.getComputedStyle(elemento).backgroundColor;
  console.log('Cor RGB:', cor);
  
  // Converte RGB para HEX
  const rgb = cor.match(/\d+/g);
  if (rgb) {
    const hex = '#' + rgb.map(x => {
      const val = parseInt(x).toString(16);
      return val.length === 1 ? '0' + val : val;
    }).join('').toUpperCase();
    console.log('✅ COR HEXADECIMAL:', hex);
    console.log('📋 Copie este código:', hex);
  }
}
```

---

## 📝 O que você está procurando:

- ✅ Cor de fundo do **header superior** (azul claro)
- ❌ NÃO é a cor dos botões (`#32373c` é cinza)
- ❌ NÃO é a cor do texto
- ✅ É a cor de **fundo** da seção superior

---

**Depois de pegar o código hexadecimal, me envie e eu atualizo tudo!** 🚀


