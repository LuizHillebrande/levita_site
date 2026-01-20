// Script para pegar a cor do header azul claro
// Cole este código no Console do DevTools (F12) do site levitamoveis.com.br

// Método 1: Pegar cor do primeiro elemento com fundo azul claro
const sections = document.querySelectorAll('section');
let azulClaro = null;

sections.forEach(section => {
  const style = window.getComputedStyle(section);
  const bgColor = style.backgroundColor;
  
  // Verifica se tem cor de fundo (não é transparente)
  if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
    // Converte RGB para HEX
    const rgb = bgColor.match(/\d+/g);
    if (rgb && rgb.length === 3) {
      const hex = '#' + rgb.map(x => {
        const val = parseInt(x).toString(16);
        return val.length === 1 ? '0' + val : val;
      }).join('').toUpperCase();
      
      // Verifica se é um azul claro (R e G altos, B alto)
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      
      if (r > 150 && g > 200 && b > 200) {
        azulClaro = hex;
        console.log('🎨 Cor encontrada:', hex);
        console.log('RGB:', bgColor);
        console.log('Elemento:', section);
      }
    }
  }
});

if (azulClaro) {
  console.log('\n✅ COR AZUL CLARO ENCONTRADA:', azulClaro);
  console.log('📋 Copie este código e me envie:', azulClaro);
} else {
  console.log('❌ Cor não encontrada automaticamente.');
  console.log('💡 Use o método manual:');
  console.log('1. Clique no elemento azul claro');
  console.log('2. No DevTools, veja a cor em Computed > background-color');
  console.log('3. Ou use o conta-gotas do DevTools');
}

// Método 2: Pegar cor do elemento que você clicar
console.log('\n🖱️  OU: Clique no elemento azul claro e execute:');
console.log('window.getComputedStyle(document.querySelector(":hover")).backgroundColor');


