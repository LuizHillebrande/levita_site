# 📸 Onde Colocar as Imagens do Carrossel "Quem Somos"

## 🎯 Localização das Imagens

Coloque as imagens institucionais na seguinte pasta:

```
/public/images/institutional/
```

## 📁 Estrutura de Arquivos

```
public/
└── images/
    └── institutional/
        ├── factory-01.jpg    ← Primeira imagem (fábrica/instalações)
        ├── factory-02.jpg    ← Segunda imagem (fábrica/instalações)
        ├── factory-03.jpg    ← Terceira imagem (fábrica/instalações)
        └── team-01.jpg       ← Quarta imagem (equipe/trabalho)
```

## ✅ Passos para Adicionar as Imagens

1. **Crie a pasta** (se não existir):
   ```bash
   mkdir -p public/images/institutional
   ```

2. **Adicione suas imagens** com os nomes:
   - `factory-01.jpg` - Imagem da fábrica/instalações
   - `factory-02.jpg` - Imagem da fábrica/instalações
   - `factory-03.jpg` - Imagem da fábrica/instalações
   - `team-01.jpg` - Imagem da equipe/trabalho

3. **Formatos suportados**:
   - `.jpg` ou `.jpeg` (recomendado)
   - `.png`
   - `.webp` (melhor performance)

4. **Tamanho recomendado**:
   - Largura: **800px - 1200px**
   - Altura: **500px - 700px**
   - Proporção: 16:9 ou 4:3
   - Tamanho do arquivo: máximo 300KB (otimize antes de usar)

## 🎨 Personalizar o Carrossel

Se quiser alterar as imagens ou adicionar mais, edite o arquivo:

```
/components/quem-somos-section.tsx
```

Na linha **6-11**, você pode alterar o array `images`:

```typescript
const images = [
  '/images/institutional/factory-01.jpg',
  '/images/institutional/factory-02.jpg',
  '/images/institutional/factory-03.jpg',
  '/images/institutional/team-01.jpg',
  // Adicione mais imagens aqui se quiser
]
```

## 📝 Exemplo de Nomes de Arquivos

Você pode usar qualquer nome, mas mantenha a consistência:

**Opções:**
- `factory-01.jpg`, `factory-02.jpg`, etc.
- `instalacoes-01.jpg`, `instalacoes-02.jpg`, etc.
- `empresa-01.jpg`, `empresa-02.jpg`, etc.
- `equipe-01.jpg`, `equipe-02.jpg`, etc.

## 🚀 Após Adicionar as Imagens

1. Salve as imagens na pasta `public/images/institutional/`
2. Atualize os nomes no arquivo `quem-somos-section.tsx` se necessário
3. O carrossel irá funcionar automaticamente
4. As imagens mudam automaticamente a cada 4 segundos
5. Você pode clicar nas setas ou nos indicadores para navegar

## ⚠️ Importante

- As imagens devem ter **nomes exatos** conforme definido no código
- Se usar `.png`, altere a extensão no código também
- Certifique-se de que as imagens estão otimizadas para web
- Use imagens de alta qualidade, mas com tamanho de arquivo razoável

---

**Pronto! Agora é só adicionar suas imagens na pasta `public/images/institutional/`** 🎉

