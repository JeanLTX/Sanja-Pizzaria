# 🤖 PROMPT PARA O ANTIGRAVITY (PROJETO COI BASE)

**Copie e cole todo o conteúdo abaixo no chat do Antigravity no projeto COI Base para que ele replique perfeitamente o sistema de combos.**

---

Contexto: Preciso que você implemente o "Sistema de Modais de Combos" neste projeto (COI Base). Este sistema já foi desenvolvido e refinado em outro projeto, e precisamos de uma replicação exata e à prova de falhas. Siga todos os passos com extrema atenção aos detalhes, copiando a lógica de negócios e as regras de interface descritas abaixo. 

O sistema consiste em combos que abrem um modal multi-etapas (step-by-step), permitindo a seleção de sabores (com a opção de escolher meio a meio ou inteira), bordas e refrigerantes, com regras condicionais complexas para cada tipo de combo.

Siga rigorosamente a ordem de implementação abaixo:

### PASSO 1: DADOS DOS COMBOS E CATEGORIAS (script.js)
1. Certifique-se de que `ALL_PIZZA_FLAVORS` e as listas de categorias (`TRADITIONAL_SABORES`, `SWEET_SABORES`) estejam acessíveis.
2. Crie a lista `COMBOS` contendo os objetos de combo (Individual, Casal, Família, Perfeito), com as chaves: `id`, `name`, `badge`, `desc`, `itens`, `price`, `obs`, `img` e `type: "combo"`.
3. Adicione a categoria de Combos no array `CATEGORIES` para que a guia "🔥 Combos" apareça na barra de rolagem horizontal principal:
```javascript
{ id: 'combos', label: '🔥 Combos', items: COMBOS, type: 'combo' }
```

### PASSO 2: RENDERIZAÇÃO DOS CARDS (script.js)
1. Crie a função `renderComboCard(combo)` que retorna um elemento DOM do card do combo. 
2. O design deste card deve conter:
   - Fundo levemente alaranjado (`bg-orange-50/20`) e borda destacada (`border-orange-200`).
   - Um Badge indicativo (ex:"Casal", "Família").
   - Lista detalhada de itens `combo.itens` marcados com ícone de check (`lucide="check"` laranja).
   - O preço destacado e a observação abaixo dele.
3. Este elemento deve ter o evento `onclick = () => openComboModal(combo)`.
4. Atualize a função de renderização principal (`renderMenu` ou similar) para que, quando `cat.type === 'combo'`, ele utilize o `renderComboCard(item)` invés dos cards normais de pizza.

### PASSO 3: ESTRUTURA HTML (index.html)
Adicione o container do modal de combos. Ele deve ficar solto no `<body>` (geralmente próximo aos outros modais).
Requisitos do HTML:
- ID principal: `combo-modal`
- O modal deve estar inicialmente escondido flex (`hidden`).
- O modal deve ter um botão de fechar (`combo-close-btn`).
- O cabeçalho deve conter um botão de voltar etapa (`combo-back-btn`) que fica oculto na primeira etapa.
- Área de conteúdo rolável com ID `combo-modal-content`.
- Rodapé (footer) fixo na parte inferior com ID `combo-modal-footer`, contendo o resumo (`combo-selection-summary`), preço (`combo-modal-price`) e o botão de avançar/adicionar (`combo-next-btn`).

### PASSO 4: ESTILOS CSS (style.css)
O modal precisa ser perfeitamente responsivo, especialmente para iOS (evitando que a barra inferior do navegador tampe os botões).
Adicione o seguinte CSS:
1. `#combo-modal-footer` deve ter `padding-bottom: calc(1.5rem + env(safe-area-inset-bottom)) !important;`
2. No Media Query para mobile (`max-width: 640px`), o `#combo-modal-footer` deve ter `padding: 1rem !important;` e `padding-bottom: calc(1rem + env(safe-area-inset-bottom)) !important;`
3. Crie a classe `.combo-padding` que tenha `padding-left: 1.5rem; padding-right: 1.5rem;` no desktop, e `padding-left: 1rem; padding-right: 1rem;` no mobile. Isso garantirá os "respiros" nas etapas 2 e 3 do modal.

### PASSO 5: VARIÁVEIS DE ESTADO E ESTRUTURAS (script.js)
Crie as seguintes variáveis de controle do estado do modal de combos:
```javascript
let currentCombo = null;
let comboStep = 1; // 1: Detalhes, 2: Sabores (Salgados), 3: Sabores Doces (Exclusivo Combo Perfeito)
let comboSelections = {
    flavors: [], // Array de IDs de pizzas 
    sweetFlavor: null, // ID da pizza doce
    border: null,
    drink: null
};
```

### PASSO 6: FUNÇÕES DE ABERTURA E FECHAMENTO DO MODAL (script.js)
Ao abrir o modal (`openComboModal(combo)`):
- Defina `currentCombo = combo;`
- Defina `comboStep = 1;`
- Faça o reset de `comboSelections`: se for o Combo Casal (identifique pelo ID do combo, ex: `combo.id === 'casal'`), a bebida DEVE ser pré-selecionada como `'guaraná'`. Para o restante, `drink: null`.
- Mostre o modal removendo a classe `hidden` e adicionando `flex`.
- Adicione a classe `modal-open` no `document.body`.
- Chame `renderComboStep()`.

O fechamento (`closeComboModal()`) faz o inverso (esconde modal, remove classes do body, limpa `currentCombo`).

### PASSO 7: RENDERIZAÇÃO DO CONTEÚDO DO MODAL (`renderComboStep()`)
Esta é a função mais crítica. Ela é dividida em dois casos com base no `comboStep`:

**Se comboStep === 1:**
- Esconda o botão Voltar (`combo-back-btn`).
- O botão Next exibe o texto "Escolher sabor" e tem ícone de "arrow-right".
- A div do resumo deve ser escondida (`combo-selection-summary-container`).
- O botão Next fica habilitado (`disabled = false`).
- Renderize o banner contendo a imagem do combo, a descrição (com padding), os itens inclusos estilizados com check-circles verdes e a caixa de `.obs`. (Tudo isso envelopado com classe de animação e `combo-padding`).

**Se comboStep > 1 (Etapa de Escolhas):**
- Mostre o botão Voltar.
- Mostre o container de resumo.
- Avalie o tipo de etapa (se é `Combo Perfeito etapa 3`, está escolhendo a pizza doce. Se não, está escolhendo a pizza salgada).
- Defina o botão Next: "Adicionar" (com ícone 'shopping-cart') a menos que seja o Combo Perfeito na etapa 2 (que deve mostrar "Próximo" e ícone 'arrow-right').
- Renderize a Listagem de sabores: Cada sabor é um `.flavor-card`. Identifique visualmente `selection-badge-1` e `selection-badge-2` conforme o índice do sabor dentro do array `comboSelections.flavors`.
- Regras condicionais para renderizar o restante da UI:
  1. **Se Combo Casal**: Renderize um `<select>` com as opções de Borda (Sem Borda, Catupiry, Cheddar, Cream Cheese). O `value` deve estar amarrado ao `comboSelections.border`. 
  2. **Se Combo Casal**: Renderize a escolha de refrigerante em container 100% (1 coluna), SOMENTE com Guaraná, já exibindo marcado (conforme o preset definido no Passo 4).
  3. **Se Combo Família ou Perfeito (etapa 3)**: Renderize as opções de refrigerante 2L em grid de 2 colunas (`grid-cols-2`). Opções: "Coca-Cola" e "Guaraná".

### PASSO 8: LÓGICA DE NAVEGAÇÃO E SELEÇÕES (script.js)
**`nextComboStep()`**: Se estiver na etapa 1, vai para 2. Se for `perfeito` na etapa 2, exige pelo menos 1 sabor salgado e avança para a etapa 3. Senão, chama `addComboToCart()`.
**`prevComboStep()`**: Volta a etapa atual se `> 1`.
**`selectComboFlavor(id, isSweet)`**: 
- Se `isSweet`: define `comboSelections.sweetFlavor = id;`
- Se for salgado: avalia `canHalf` (true se for Família ou Perfeito). `max` será 2 ou 1.
- Se o ID já estiver em `comboSelections.flavors`, remova-o (desmarcação).
- Se não estiver, e o array já tiver o limite (`max`), substitua o último `.push(id)`.
- Chame `renderComboStep()`.
**`selectComboBorder(id)`** e **`selectComboDrink(id)`**: Atualizam o estado correspondente em `comboSelections` e chamam `renderComboStep()`.

### PASSO 9: LÓGICA DO RESUMO - `updateComboSummary()` E VALIDAÇÃO (script.js)
Aqui validamos se o botão de prosseguir pode ser clicado:
- **Casal**: Valida se tem `>= 1` sabor em `comboSelections.flavors`. (`drink` já vem preenchido).
- **Família**: Aceita 1 sabor (Inteira) ou 2 sabores (Meio a Meio). Tem que ter `drink`. Se tiver 1 sabor, exiba `"Inteira: Sabor | Refri"`. Se tiver 2, exiba `"Sabor 1 / Sabor 2 | Refri"`.
- **Perfeito (etapa 2)**: Exige `>= 1` sabor. Se tiver 1 sabor diz `"Salgada Inteira: Sabor"`. Se 2, diz `"Salgada: Sabor 1 + Sabor 2"`.
- **Perfeito (etapa 3)**: Exige também que `sweetFlavor` esteja preenchido e `drink` esteja preenchido. Usa a mesma lógica de Inteira ou Meia para a descrição resumida.
Se os requisitos de preenchimento estiverem ok, defina `ready = true` e desbloqueie o botão (`disabled = !ready`).

### PASSO 10: ADICIONAR AO CARRINHO - `addComboToCart()` (script.js)
Quando os passos terminarem, formate o texto que vai para o carrinho.
Regra de ouro aplicável a todos os modais que aceitam até dois sabores (Família e Perfeito):
- Identifique se o combo possui 1 sabor no Array `flavors` ou 2.
- **Se 1 sabor**: Formate os `details` contendo a palavra `"Inteira"` para que o estabelecimento saiba que não é meio-a-meio.
  Exemplo Família 1 sabor: `"Inteira: Sabor X • Refri: Guaraná 2L"`.
  Exemplo Perfeito 1 sabor salgado: `"Salgada Inteira: Sabor X • Doce: Doce Y • Refri: Coca-Cola 2L"`.
- Em seguida, monte o objeto com as chaves `{name: currentCombo.name, price: currentCombo.price, details: string_formatada, type: 'combo', isCombo: true}` e passe para a função global `addToCart()`, fechando o modal do combo na sequência.

---

**Objetivo:** Não tente re-inventar ou simplificar essas regras. Implemente o fluxo EXATAMENTE como descrito nessas instruções, assegurando total estabilidade e paridade com a versão original validada. 
