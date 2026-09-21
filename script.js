
// ==========================================
// 1. DADOS DO CARDÁPIO (ORIGINAL COMPLETO)
// ==========================================
const PIZZAS_SALGADAS = [
    {
        id: 1, name: "Calabresa", category: "Pizzas Tradicionais",
        desc: "Molho de tomate, muçarela, calabresa, cebola, orégano.",
        img: "assets/calabresa.webp",
        type: "pizza", prices: { P: 48.90, M: 59.90, G: 69.90 }
    },
    {
        id: 2, name: "Muçarela", category: "Pizzas Tradicionais",
        desc: "Molho de tomate, muçarela, tomate, orégano, azeitona preta.",
        img: "assets/muçarela.webp",
        type: "pizza", prices: { P: 49.90, M: 59.90, G: 69.90 }
    },
    {
        id: 3, name: "Margherita", category: "Pizzas Tradicionais",
        desc: "Molho de tomate, muçarela, tomate, parmesão, orégano, manjericão fresco.",
        img: "assets/margherita.webp",
        type: "pizza", prices: { P: 49.90, M: 59.90, G: 75.90 }
    },
    {
        id: 6, name: "Alho e Óleo", category: "Pizzas Tradicionais",
        desc: "Molho de tomate, muçarela, parmesão, orégano, alho frito.",
        img: "assets/alhoeoleo.webp",
        type: "pizza", prices: { P: 54.90, M: 69.90, G: 71.90 }
    },
    {
        id: 7, name: "Frango com Catupiry", category: "Pizzas Tradicionais",
        desc: "Molho de tomate, frango desfiado, requeijão cremoso, muçarela, orégano.",
        img: "assets/frangocomcatupiry.webp",
        type: "pizza", prices: { P: 54.90, M: 63.90, G: 89.90 }
    },
    {
        id: 49, name: "Vegetariana", category: "Pizzas Tradicionais",
        desc: "Molho de tomate, muçarela, palmito, champignon, tomate picado, manjericão fresco e orégano.",
        img: "assets/vegetariana.webp",
        type: "pizza", prices: { P: 59.90, M: 79.90, G: 97.90 }
    },
    {
        id: 9, name: "Portuguesa", category: "Pizzas Tradicionais",
        desc: "Molho, muçarela, presunto, ovos, calabresa, cebola, pimentão, tomate, azeitona, orégano.",
        img: "assets/portuguesa.webp",
        type: "pizza", prices: { P: 55.90, M: 69.90, G: 89.90 }
    },
    {
        id: 10, name: "Francesa", category: "Pizzas Tradicionais",
        desc: "Molho de tomate, muçarela, presunto, requeijão cremoso, ovos, orégano.",
        img: "assets/francesa.webp",
        type: "pizza", prices: { P: 55.90, M: 69.90, G: 89.90 }
    },
    {
        id: 11, name: "Quatro Queijos", category: "Pizzas Tradicionais",
        desc: "Molho, provolone, requeijão cremoso, muçarela, parmesão, orégano.",
        img: "assets/quatroqueijos.webp",
        type: "pizza", prices: { P: 55.90, M: 69.90, G: 89.90 }
    },
    {
        id: 12, name: "Gênova", category: "Pizzas Tradicionais",
        desc: "Molho, lombo canadense, ovos, cebola, muçarela, bacon, orégano.",
        img: "assets/genova.webp",
        type: "pizza", prices: { P: 55.90, M: 69.90, G: 89.90 }
    },
    {
        id: 14, name: "Brócolis", category: "Pizzas Tradicionais",
        desc: "Molho de tomate, muçarela, brócolis, alho frito, orégano.",
        img: "assets/brocolis.webp",
        type: "pizza", prices: { P: 53.90, M: 60.90, G: 70.90 }
    },
    {
        id: 8, name: "Calabria", category: "Pizzas Tradicionais",
        desc: "Molho de tomate, requeijão cremoso, calabresa, parmesão, orégano.",
        img: "assets/calabria.webp",
        type: "pizza", prices: { P: 54.90, M: 69.90, G: 89.90 }
    },
    {
        id: 15, name: "Carne Seca", category: "Pizzas Tradicionais",
        desc: "Molho de tomate, muçarela, carne seca, orégano.",
        img: "assets/carneseca.webp",
        type: "pizza", prices: { P: 59.90, M: 78.90, G: 95.90 }
    }
];

const PIZZAS_ESPECIAIS = [
    {
        id: 13, name: "Atum", category: "Pizzas Tradicionais",
        desc: "Molho de tomate, muçarela, atum, cebola, tomate, orégano.",
        img: "assets/atum.webp",
        type: "pizza", prices: { P: 58.90, M: 82.90, G: 97.90 }
    },
    {
        id: 16, name: "Frango Especial", category: "Pizzas Especiais",
        desc: "Molho, frango, requeijão cremoso, palmito, muçarela, calabresa, orégano.",
        img: "assets/frangoespecial.webp",
        type: "pizza", prices: { P: 58.90, M: 69.90, G: 95.90 }
    },
    {
        id: 17, name: "Carne Seca Especial", category: "Pizzas Especiais",
        desc: "Molho, carne seca, requeijão cremoso, palmito, cebola, orégano.",
        img: "assets/carnesecaespecial.webp",
        type: "pizza", prices: { P: 58.90, M: 82.90, G: 97.90 }
    },
    {
        id: 18, name: "Calabresa Especial", category: "Pizzas Especiais",
        desc: "Molho de tomate, requeijão cremoso, calabresa, ovos, cebola, orégano.",
        img: "assets/calabresaespecial.webp",
        type: "pizza", prices: { P: 61.90, M: 69.90, G: 85.90 }
    },
    {
        id: 19, name: "Brócolis com Bacon", category: "Pizzas Especiais",
        desc: "Molho de tomate, muçarela, brócolis, bacon, alho frito, orégano.",
        img: "assets/brocoliscombacon.webp",
        type: "pizza", prices: { P: 49.90, M: 59.90, G: 77.90 }
    },
    {
        id: 20, name: "Champion", category: "Pizzas Especiais",
        desc: "Molho de tomate, muçarela, champion, azeitonas verdes fatiadas, cebola, alho frito, orégano.",
        img: "assets/champion.webp",
        type: "pizza", prices: { P: 49.90, M: 68.90, G: 87.90 }
    },
    {
        id: 21, name: "Brócolis c/ Cream Cheese", category: "Pizzas Especiais",
        desc: "Molho, muçarela, brócolis, palmito, milho, cream cheese, orégano.",
        img: "assets/brocoliscomrequeijao.webp",
        type: "pizza", prices: { P: 62.90, M: 75.90, G: 99.90 }
    },
    {
        id: 22, name: "Costela Especial", category: "Pizzas Especiais",
        desc: "Molho de tomate, costela desfiada, cream cheese, muçarela e orégano.",
        img: "assets/costelaespecial.webp",
        type: "pizza", prices: { P: 64.90, M: 79.90, G: 97.90 }
    },
    {
        id: 23, name: "Pizza Foggareli", category: "Pizzas Especiais",
        desc: "Molho, frango desfiado, cheddar, milho, muçarela, bacon, orégano.",
        img: "assets/foggareli.webp",
        type: "pizza", prices: { P: 59.90, M: 61.90, G: 75.90 }
    },
    {
        id: 24, name: "5 Queijos", category: "Pizzas Especiais",
        desc: "Molho, provolone, requeijão, muçarela, parmesão, gorgonzola e orégano.",
        img: "assets/5queijos.webp",
        type: "pizza", prices: { P: 68.90, M: 76.90, G: 100.90 }
    },
    {
        id: 25, name: "Peperoni", category: "Pizzas Especiais",
        desc: "Molho de tomate, muçarela, peperoni, cebola, orégano.",
        img: "assets/pepperoni.webp",
        type: "pizza", prices: { P: 59.90, M: 65.90, G: 86.90 }
    },
    {
        id: 48, name: "Nordestina Premium", category: "Pizzas Especiais",
        desc: "Molho de tomate, muçarela, costela desfiada, queijo coalho e orégano.",
        img: "assets/nordestina.webp",
        type: "pizza", prices: { P: 64.90, M: 79.90, G: 97.90 }
    },
];

const PIZZAS_DOCES = [
    {
        id: 26, name: "Prestígio", category: "Pizzas Doces",
        desc: "Creme de leite, chocolate, coco ralado.",
        img: "assets/prestigio.webp",
        type: "pizza", prices: { P: 48.90, M: 53.90, G: 64.90 }
    },
    {
        id: 27, name: "Confete", category: "Pizzas Doces",
        desc: "Creme de leite, chocolate, confete.",
        img: "assets/confete.webp",
        type: "pizza", prices: { P: 53.90, M: 59.90, G: 68.90 }
    },
    {
        id: 28, name: "Churros", category: "Pizzas Doces",
        desc: "Creme de leite, doce de leite, açúcar com canela.",
        img: "assets/churros.webp",
        type: "pizza", prices: { P: 48.90, M: 54.90, G: 62.90 }
    },
    {
        id: 29, name: "Doce de Leite", category: "Pizzas Doces",
        desc: "Creme de leite, doce de leite, amendoim em pedaços.",
        img: "assets/docedeleite.webp",
        type: "pizza", prices: { P: 45.90, M: 55.90, G: 65.90 }
    },
    {
        id: 30, name: "Brigadeiro", category: "Pizzas Doces",
        desc: "Creme de leite, chocolate, granulado.",
        img: "assets/brigadeiro.webp",
        type: "pizza", prices: { P: 56.90, M: 68.90, G: 81.90 }
    },
    {
        id: 32, name: "Banana", category: "Pizzas Doces",
        desc: "Muçarela, banana, açúcar com canela.",
        img: "assets/banana.webp",
        type: "pizza", prices: { P: 40.90, M: 45.90, G: 57.90 }
    },

    {
        id: 34, name: "Banana c/ Chocolate", category: "Pizzas Doces",
        desc: "Creme de leite, banana, açúcar com canela, chocolate.",
        img: "assets/bananacomchocolate.webp",
        type: "pizza", prices: { P: 54.90, M: 60.90, G: 74.90 }
    },
    {
        id: 35, name: "Banana Nevada", category: "Pizzas Doces",
        desc: "Creme de leite, banana, chocolate branco, açúcar com canela.",
        img: "assets/banananevada.webp",
        type: "pizza", prices: { P: 50.90, M: 56.90, G: 69.90 }
    },
    {
        id: 36, name: "Sonho de Valsa", category: "Pizzas Doces",
        desc: "Creme de leite, chocolate, sonho de valsa, leite condensado.",
        img: "assets/sonhodevalsa.webp",
        type: "pizza", prices: { P: 63.90, M: 70.90, G: 85.90 }
    },
    {
        id: 37, name: "Romeu e Julieta", category: "Pizzas Doces",
        desc: "Goiabada e requeijão cremoso.",
        img: "assets/romeuejulieta.webp",
        type: "pizza", prices: { P: 49.90, M: 54.90, G: 69.90 }
    }
];

const BEBIDAS = [
    {
        id: 38, name: "Coca-Cola", category: "Bebidas", desc: "A bebida mais famosa do mundo.",
        img: "assets/coca.webp",
        type: "drink",
        prices: {
            "2L": 14.99,
            "ZERO": 13.99,
            "LATA": 8.50
        },
        options: {
            "2L": { label: "Normal 2L", sub: "2 Litros" },
            "ZERO": { label: "Zero 1.5L", sub: "1.5 Litros" },
            "LATA": { label: "Lata", sub: "350ml" }
        }
    },
    {
        id: 40, name: "Guaraná Antarctica", category: "Bebidas", desc: "O sabor do Brasil.",
        img: "assets/guarana.webp",
        type: "drink",
        prices: {
            "2L": 14.90,
            "1.5L_ZERO": 13.50,
            "LATA": 8.50
        },
        options: {
            "2L": { label: "Normal 2L", sub: "2 Litros" },
            "1.5L_ZERO": { label: "Zero 1.5L", sub: "1.5 Litros" },
            "LATA": { label: "Lata", sub: "350ml" }
        }
    },
    {
        id: 39, name: "Fanta Laranja 2L", category: "Bebidas", desc: "Muito mais sabor.",
        img: "assets/fanta.webp",
        type: "drink", price: 13.90
    },

    {
        id: 47, name: "Água Mineral", category: "Bebidas", desc: "Refrescância pura.",
        img: "assets/agua.webp",
        type: "drink",
        prices: {
            "SEM": 3.50,
            "COM": 4.50
        },
        options: {
            "SEM": { label: "Sem Gás", sub: "510ml" },
            "COM": { label: "Com Gás", sub: "510ml" }
        }
    }
];

// OPÇÕES DE BORDAS E VALORES
const BORDAS = [
    { id: 'sem_borda', name: 'Sem Borda Recheada', prices: { P: 0, M: 0, G: 0 } },
    { id: 'catupiry', name: 'Catupiry', prices: { P: 11.99, M: 13.99, G: 18.99 } },
    { id: 'cheddar', name: 'Cheddar', prices: { P: 11.99, M: 13.99, G: 18.99 } },
    { id: 'cream_cheese', name: 'Cream Cheese', prices: { P: 11.99, M: 13.99, G: 18.99 } },
    { id: 'chocolate', name: 'Chocolate', prices: { P: 13.99, M: 15.99, G: 18.99 } },
    { id: 'catupiry_calabresa', name: 'Catupiry + Calabresa', prices: { P: 15.99, M: 17.99, G: 20.99 } }
];

const COMBOS = [
    {
        id: "individual",
        name: "Combo Individual",
        badge: "Individual",
        desc: "A simplicidade que conquista no primeiro pedaço. 🍕 Pizza na lenha, massa artesanal + refri gelado, combinação perfeita!",
        itens: ["Pizza 25cm · 4 fatias", "Guaraná Antarctica Lata"],
        price: 49.90,
        obs: "Válido para pizzas tradicionais, exceto Carne Seca e Atum.",
        img: "assets/comboindividual.webp",
        type: "combo"
    },
    {
        id: "casal",
        name: "Combo Casal",
        badge: "Casal",
        desc: "Na medida! nem muito, nem pouco! 🍕💕 Pizza na lenha, massa artesanal e sabor sem igual!",
        itens: ["Pizza 30cm · 6 fatias", "Refrigerante 1L", "Borda recheada já inclusa: cream cheese, catupiry ou cheddar"],
        price: 75.90,
        obs: "Válido para pizzas tradicionais, exceto Carne Seca e Atum.",
        img: "assets/combocasal.webp",
        type: "combo"
    },
    {
        id: "familia",
        name: "Combo Família",
        badge: "Família",
        desc: "Combo Família que resolve! 👨‍👩‍👧‍👦 Pizza na lenha 🪵, massa artesanal e sabor Incomparável!",
        itens: ["Pizza 40cm · 10 fatias", "Refrigerante 2L (Fanta ou Guaraná Antarctica)"],
        price: 89.90,
        obs: "Válido para pizzas tradicionais, exceto Carne Seca e Atum.",
        img: "assets/combofamilia2.webp",
        type: "combo"
    },
    {
        id: "perfeito",
        name: "Combo Perfeito",
        badge: "Perfeito",
        desc: "Experiência completa 🍕✨ Na lenha, massa artesanal. Não fique na vontade! 😋 Quer garantir o seu?",
        itens: ["Pizza 40cm · 10 fatias", "Pizza doce 25cm · 4 fatias", "Refrigerante 2L (Fanta ou Guaraná Antarctica)"],
        price: 115.90,
        obs: "Válido para pizzas tradicionais, exceto Carne Seca e Atum.",
        img: "assets/comboperfeito2.webp",
        type: "combo"
    }
];

// ESTRUTURA DE CATEGORIAS
const CATEGORIES = [
    { id: 'combos', label: '🔥 Combos', items: COMBOS, type: 'combo' },
    { id: 'salgadas', label: 'Pizzas Tradicionais', items: PIZZAS_SALGADAS },
    { id: 'especiais', label: 'Pizzas Especiais', items: PIZZAS_ESPECIAIS },
    { id: 'meio-a-meio', label: 'Monte sua Pizza (Meio a Meio)', items: [{ id: 'meio-a-meio-card' }], type: 'half' },
    { id: 'doces', label: 'Pizzas Doces', items: PIZZAS_DOCES },
    { id: 'bebidas', label: 'Bebidas', items: BEBIDAS, type: 'drink' }
];

// Cálculo da largura da scrollbar para evitar saltos de layout
const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;
document.documentElement.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);

// PREÇOS DE ENTREGA
const DELIVERY_REGIONS = [
    { id: 'colinas', name: 'Colinas do Peró', fee: 4.00 },
    { id: 'caminho', name: 'Caminho de Búzios', fee: 6.00 },
    { id: 'jardim', name: 'Jardim Esperança, Tangará, Reserva, Nova Cabo Frio, Jardim Peró', fee: 6.00 },
    { id: 'porto', name: 'Porto do Carro, Vinhanteiro, Peró, Boca do Mato', fee: 8.00 },
    { id: 'passaros', name: 'Condomínio dos pássaros', fee: 8.00 },
    { id: 'bosque_pero', name: 'Condomínio Bosque do Peró', fee: 8.00 },
    { id: 'ogiva', name: 'Ogiva', fee: 10.00 },
    { id: 'cabo', name: 'Cabo Frio, Portinho, Novo Portinho', fee: 12.00 }
];

// ==========================================
// 2. ESTADO DA APLICAÇÃO (STATE)
// ==========================================
let cart = [];
let checkoutData = {
    name: '',
    phone: '',
    address: '',
    region: '',
    paymentMethod: ''
};

// ==========================================
// 3. STORAGE E FUNÇÕES AUXILIARES
// ==========================================
const loadCart = () => {
    try {
        const saved = localStorage.getItem('foggareli-cart');
        if (saved) cart = JSON.parse(saved);
        updateCartUI();
    } catch (e) { console.warn("LocaleStorage unavailable"); }
};

const saveCart = () => {
    try { localStorage.setItem('foggareli-cart', JSON.stringify(cart)); } catch (e) { }
};

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

const showToast = (msg) => {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast) return;

    msgEl.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.add('toast-animate');
    setTimeout(() => {
        toast.classList.add('hidden');
        toast.classList.remove('toast-animate');
    }, 3000);
};

// ==========================================
// 4. LÓGICA DO CARRINHO
// ==========================================
const addToCart = (item) => {
    const existingIndex = cart.findIndex(c =>
        c.name === item.name && c.type === item.type && c.details === item.details
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${item.name} adicionado!`);
};

const removeFromCart = (index) => {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
};

const updateCartItemQuantity = (index, delta) => {
    const newQty = cart[index].quantity + delta;
    if (newQty < 1) {
        removeFromCart(index);
    } else {
        cart[index].quantity = newQty;
        saveCart();
        updateCartUI();
    }
};

const getCartTotal = () => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
const getDeliveryFee = () => {
    if (!checkoutData.region) return 0;
    const reg = DELIVERY_REGIONS.find(r => r.id === checkoutData.region);
    return reg ? reg.fee : 0;
}

// ==========================================
// 5. RENDERIZAÇÃO DE UI
// ==========================================

// --- RENDERIZAR TABS DE CATEGORIA ---
const renderCategoryButtons = () => {
    const container = document.getElementById('categories-bar-scrolling');
    container.innerHTML = CATEGORIES.map((cat, index) => `
        <button class="category-tab ${index === 0 ? 'active' : ''} whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 hover:text-orange-600 transition-colors" 
                data-category="${cat.id}"
                onclick="scrollToCategory('${cat.id}')">
            ${cat.label}
        </button>
    `).join('');
};

function scrollToCategory(id) {
    const el = document.getElementById(`category-${id}`);
    if (el) {
        const headerHeight = 64;
        const barHeight = 54;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - (headerHeight + barHeight - 20);

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

// --- RENDERIZAR CARDS ---
// --- RENDERIZAR CARDS COMPACTOS ---
const renderPizzaCard = (pizza) => {
    const card = document.createElement('div');
    card.className = "flex items-center gap-4 p-4 bg-white border border-orange-100 rounded-3xl shadow-sm hover:shadow-md hover:border-orange-200 transition-[transform,box-shadow,border-color] duration-300 cursor-pointer group relative z-10";
    card.onclick = () => openProductModal(pizza);

    const minPrice = Math.min(...Object.values(pizza.prices));

    card.innerHTML = `
        <div class="flex-1 min-w-0">
            <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors uppercase truncate">${pizza.name}</h3>
            <p class="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed pr-2">${pizza.desc}</p>
            <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">A partir de</span>
                <span class="text-base font-bold text-orange-600">${formatCurrency(minPrice)}</span>
            </div>
        </div>
        <div class="pizza-img-container">
            <img src="${pizza.img}" alt="${pizza.name}" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" 
                 onerror="this.src='assets/logofoggareli.webp'">
        </div>
    `;
    return card;
};

const renderDrinkCard = (drink) => {
    const card = document.createElement('div');
    card.className = "flex items-center gap-4 p-4 bg-white border border-orange-100 rounded-3xl shadow-sm hover:shadow-md hover:border-orange-200 transition-[transform,box-shadow,border-color] duration-300 cursor-pointer group relative z-10";
    card.onclick = () => openProductModal(drink);

    const hasVariations = drink.prices && typeof drink.prices === 'object';
    const minPrice = hasVariations ? Math.min(...Object.values(drink.prices)) : drink.price;

    card.innerHTML = `
        <div class="flex-1 min-w-0">
            <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors uppercase truncate">${drink.name}</h3>
            <p class="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed pr-2">${drink.desc}</p>
            <div class="flex items-center gap-2">
                ${hasVariations ? '<span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">A partir de</span>' : ''}
                <span class="text-base font-bold text-orange-600">${formatCurrency(minPrice)}</span>
            </div>
        </div>
        <div class="pizza-img-container">
            <img src="${drink.img}" alt="${drink.name}" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                 onerror="this.src='assets/logofoggareli.webp'">
        </div>
    `;
    return card;
};

const renderComboCard = (combo) => {
    const card = document.createElement('div');
    card.className = "flex items-center gap-4 p-4 bg-orange-50/20 border-2 border-orange-200 rounded-3xl shadow-sm hover:shadow-md hover:border-orange-500 transition-[transform,box-shadow,border-color] duration-300 cursor-pointer group relative z-10";
    card.onclick = () => openComboModal(combo);

    const itemsHtml = combo.itens.map(item => `
        <li class="flex items-start gap-1.5 text-xs text-gray-600 font-medium">
            <i data-lucide="check" class="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0"></i>
            <span class="leading-tight">${item}</span>
        </li>
    `).join('');

    card.innerHTML = `
        <div class="flex-1 min-w-0">
            <div class="mb-2">
                <span class="bg-orange-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide inline-block">${combo.badge}</span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors uppercase truncate">${combo.name}</h3>
            <p class="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed pr-2">${combo.desc}</p>
            <ul class="mb-4 space-y-1.5">
                ${itemsHtml}
            </ul>
            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                    <span class="text-lg sm:text-xl font-bold text-orange-600">${formatCurrency(combo.price)}</span>
                </div>
                <span class="text-[10px] sm:text-xs text-gray-400 leading-tight">${combo.obs}</span>
            </div>
        </div>
        <div class="pizza-img-container shadow-inner">
            <img src="${combo.img}" alt="${combo.name}" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                 onerror="this.src='assets/logofoggareli.webp'">
        </div>
    `;
    return card;
};

// --- LÓGICA DO MODAL DE PRODUTO ---
let currentModalItem = null;
let currentModalSize = 'M';

// --- LÓGICA MEIO A MEIO ---
let halfPizzaState = {
    size: 'G',
    flavor1: null,
    flavor2: null,
    border: 'sem_borda'
};

const ALL_PIZZA_FLAVORS = [...PIZZAS_SALGADAS, ...PIZZAS_ESPECIAIS, ...PIZZAS_DOCES];

function openHalfModal() {
    const modal = document.getElementById('half-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('modal-open');

    // Reset State
    halfPizzaState = { size: 'G', flavor1: null, flavor2: null, border: 'sem_borda' };

    renderHalfFlavors();
    renderHalfBorders();
    setHalfSize('G');
    updateHalfPrice();

    if (window.lucide) {
        lucide.createIcons({
            root: document.getElementById('half-modal')
        });
    }
}

function closeHalfModal() {
    const modal = document.getElementById('half-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('modal-open');
}

function renderHalfFlavors() {
    const grid = document.getElementById('half-flavors-grid');
    if (!grid) return;

    grid.innerHTML = ALL_PIZZA_FLAVORS.map(pizza => `
        <div onclick="selectFlavor(${pizza.id})" id="flavor-card-${pizza.id}" class="flavor-card shadow-sm">
            <div class="flavor-card-img-container">
                <img src="${pizza.img}" alt="${pizza.name}" class="flavor-card-img" 
                     onerror="this.src='assets/logofoggareli.webp'">
            </div>
            <div class="flavor-card-body">
                <span class="flavor-card-name">${pizza.name}</span>
                <span class="flavor-card-desc">${pizza.desc}</span>
            </div>
            <div class="selection-badge selection-badge-1">1º SABOR</div>
            <div class="selection-badge selection-badge-2">2º SABOR</div>
        </div>
    `).join('');

    // Re-aplicar seleções visuais se existirem
    syncHalfVisuals();
}

function syncHalfVisuals() {
    document.querySelectorAll('.flavor-card').forEach(c => c.classList.remove('selected-1', 'selected-2'));

    if (halfPizzaState.flavor1) {
        const el = document.getElementById(`flavor-card-${halfPizzaState.flavor1.id}`);
        if (el) el.classList.add('selected-1');
    }
    if (halfPizzaState.flavor2) {
        const el = document.getElementById(`flavor-card-${halfPizzaState.flavor2.id}`);
        if (el) el.classList.add('selected-2');
    }
}

function renderHalfBorders() {
    const select = document.getElementById('half-border-select');
    if (!select) return;

    select.innerHTML = BORDAS.map(b => `
        <option value="${b.id}">${b.name}${b.prices[halfPizzaState.size] > 0 ? ` (+ ${formatCurrency(b.prices[halfPizzaState.size])})` : ''}</option>
    `).join('');

    select.value = halfPizzaState.border;
}

function setHalfSize(s) {
    halfPizzaState.size = s;
    document.querySelectorAll('.half-size-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`half-size-${s}`);
    if (btn) btn.classList.add('active');

    // Atualizar opções de borda (preços mudam por tamanho)
    renderHalfBorders();
    updateHalfPrice();
}

function setHalfBorder(id) {
    halfPizzaState.border = id;
    updateHalfPrice();
}

function selectFlavor(id) {
    const pizza = ALL_PIZZA_FLAVORS.find(p => p.id === id);
    if (!pizza) return;

    // Lógica de Seleção Inteligente
    if (halfPizzaState.flavor1 && halfPizzaState.flavor1.id === id) {
        // Desmarcar Sabor 1
        halfPizzaState.flavor1 = null;
    } else if (halfPizzaState.flavor2 && halfPizzaState.flavor2.id === id) {
        // Desmarcar Sabor 2
        halfPizzaState.flavor2 = null;
    } else if (!halfPizzaState.flavor1) {
        // Preencher Slot 1
        halfPizzaState.flavor1 = pizza;
    } else if (!halfPizzaState.flavor2) {
        // Preencher Slot 2
        halfPizzaState.flavor2 = pizza;
    } else {
        // Ambos cheios? Substitui o 2º
        halfPizzaState.flavor2 = pizza;
    }

    syncHalfVisuals();
    updateHalfPrice();
}

function updateHalfPrice() {
    let total = 0;
    const summary = document.getElementById('half-selection-summary');
    const addBtn = document.getElementById('half-add-btn');

    if (halfPizzaState.flavor1 && halfPizzaState.flavor2) {
        const p1 = halfPizzaState.flavor1.prices[halfPizzaState.size];
        const p2 = halfPizzaState.flavor2.prices[halfPizzaState.size];
        total = Math.max(p1, p2);

        const bordaObj = BORDAS.find(b => b.id === halfPizzaState.border);
        if (bordaObj) total += (bordaObj.prices[halfPizzaState.size] || 0);

        summary.textContent = `${halfPizzaState.flavor1.name} + ${halfPizzaState.flavor2.name}`;
        summary.classList.remove('text-slate-400');
        summary.classList.add('text-slate-800');
        if (addBtn) addBtn.disabled = false;
    } else {
        let text = "Nenhum sabor selecionado";
        if (halfPizzaState.flavor1) text = `Escolha o 2º sabor... (${halfPizzaState.flavor1.name})`;
        else if (halfPizzaState.flavor2) text = `Escolha o 1º sabor... (${halfPizzaState.flavor2.name})`;

        summary.textContent = text;
        summary.classList.add('text-slate-400');
        summary.classList.remove('text-slate-800');
        if (addBtn) addBtn.disabled = true;
    }

    const priceDisplay = document.getElementById('half-price-display');
    if (priceDisplay) priceDisplay.textContent = formatCurrency(total);
}

function addHalfToCart() {
    if (!halfPizzaState.flavor1 || !halfPizzaState.flavor2) return;

    const p1 = halfPizzaState.flavor1.prices[halfPizzaState.size];
    const p2 = halfPizzaState.flavor2.prices[halfPizzaState.size];
    const basePrice = Math.max(p1, p2);
    const bordaObj = BORDAS.find(b => b.id === halfPizzaState.border);
    const bordaPrice = bordaObj ? (bordaObj.prices[halfPizzaState.size] || 0) : 0;
    const total = basePrice + bordaPrice;

    const sizeName = halfPizzaState.size === 'M' ? 'Média' : 'Grande';
    const borderDisplay = bordaObj && bordaObj.id !== 'sem_borda' ? `Borda de ${bordaObj.name}` : 'Sem Borda';

    const item = {
        name: `Meio a Meio (${halfPizzaState.flavor1.name} / ${halfPizzaState.flavor2.name})`,
        price: total,
        size: halfPizzaState.size,
        border: borderDisplay,
        isHalf: true,
        details: `Tam: ${sizeName} • ${borderDisplay}`,
        type: 'pizza'
    };

    addToCart(item);
    closeHalfModal();
    // showToast removido pois o addToCart já chama
}


// ==========================================
// 5.1 LÓGICA DO MODAL DE COMBOS
// ==========================================

let currentCombo = null;
let comboStep = 1; // 1: Detalhes, 2: Sabores Salgados, 3: Sabores Doces (para Perfeito)
let comboSelections = {
    flavors: [], // ids de pizzas salgadas
    sweetFlavor: null, // id de pizza doce
    border: null // catupiry, cheddar, ou cream_cheese
};

const TRADITIONAL_SABORES = [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 14];
const SWEET_SABORES = [26, 27, 28, 29, 30, 32, 34, 35, 36, 37];
const COMBO_BORDER_SIZES = {
    individual: 'P',
    casal: 'M',
    familia: 'G',
    perfeito: 'G'
};
const COMBO_BORDER_IMAGES = {
    catupiry: 'assets/catupiry.webp',
    catupiry_calabresa: 'assets/catupirycalabresa.webp',
    chocolate: 'assets/chocolate.webp',
    cheddar: 'assets/cheddar.webp',
    cream_cheese: 'assets/creamcheese.webp'
};

function getComboBorderPrice() {
    if (currentCombo.id === 'casal') return 0;

    const border = BORDAS.find(item => item.id === comboSelections.border);
    const size = COMBO_BORDER_SIZES[currentCombo.id];
    return border && size ? border.prices[size] : 0;
}

function getComboBorder() {
    return BORDAS.find(item => item.id === comboSelections.border);
}

function updateComboPrice() {
    const priceDisplay = document.getElementById('combo-modal-price');
    if (priceDisplay && currentCombo) {
        priceDisplay.textContent = formatCurrency(currentCombo.price + getComboBorderPrice());
    }
}

function openComboModal(combo) {
    currentCombo = combo;
    comboStep = 1;
    comboSelections = { flavors: [], sweetFlavor: null, border: 'sem_borda', drink: combo.id === 'casal' ? 'guaraná' : null };

    document.getElementById('combo-modal').classList.remove('hidden');
    document.getElementById('combo-modal').classList.add('flex');
    document.body.classList.add('modal-open');

    renderComboStep();
}

function closeComboModal() {
    document.getElementById('combo-modal').classList.add('hidden');
    document.getElementById('combo-modal').classList.remove('flex');
    document.body.classList.remove('modal-open');
    currentCombo = null;
}

function renderComboStep() {
    const content = document.getElementById('combo-modal-content');
    const backBtn = document.getElementById('combo-back-btn');
    const nextBtn = document.getElementById('combo-next-btn');
    const nextText = document.getElementById('combo-next-text');
    const nextIcon = document.getElementById('combo-next-icon');
    const summaryContainer = document.getElementById('combo-selection-summary-container');
    const priceDisplay = document.getElementById('combo-modal-price');

    content.onclick = event => {
        const flavorCard = event.target.closest('.flavor-card');
        if (!flavorCard || !content.contains(flavorCard)) return;
        selectComboFlavor(Number(flavorCard.dataset.flavorId), flavorCard.dataset.sweet === 'true');
    };

    updateComboPrice();

    if (comboStep === 1) {
        backBtn.classList.add('hidden');
        nextText.textContent = "Escolher sabor";
        nextIcon.setAttribute('data-lucide', 'arrow-right');
        summaryContainer.classList.add('hidden');
        nextBtn.disabled = false;

        const itemsHtml = currentCombo.itens.map(item => `
            <div class="flex items-start gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <i data-lucide="check-circle" class="w-6 h-6 text-green-500 mt-0.5 shrink-0"></i>
                <span class="text-base font-bold text-slate-700">${item}</span>
            </div>
        `).join('');

        content.innerHTML = `
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-10">
                <div class="relative h-64 sm:h-72 w-full bg-slate-100">
                    <img src="${currentCombo.img}" alt="${currentCombo.name}" class="w-full h-full object-cover" onerror="this.src='assets/logofoggareli.webp'">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div class="combo-padding space-y-12" style="padding-top: 1.5rem; padding-bottom: 1.5rem;">
                    <div class="space-y-4">
                        <h3 class="text-3xl font-black text-slate-800 uppercase tracking-tight">${currentCombo.name}</h3>
                        <p class="text-base text-slate-500 leading-relaxed font-medium">${currentCombo.desc}</p>
                    </div>

                    <div>
                        <label class="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-8 block">O que está incluso?</label>
                        <div class="grid grid-cols-1 gap-4">
                            ${itemsHtml}
                        </div>
                    </div>

                    <div class="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                        <p class="text-xs text-orange-800 font-bold flex items-center gap-4">
                            <i data-lucide="info" class="w-6 h-6 opacity-70"></i>
                            ${currentCombo.obs}
                        </p>
                    </div>
                </div>
            </div>
        `;
    } else if (comboStep === 4) {
        backBtn.classList.remove('hidden');
        summaryContainer.classList.remove('hidden');
        nextText.textContent = "Adicionar ao pedido";
        nextIcon.setAttribute('data-lucide', 'shopping-cart');
        nextBtn.disabled = false;

        const comboBorderSize = COMBO_BORDER_SIZES[currentCombo.id];
        content.innerHTML = `
            <div class="animate-in fade-in slide-in-from-right-4 duration-300 min-h-[420px] flex flex-col justify-center px-6 sm:px-10 pt-20 pb-10 sm:pt-24" style="padding-top: 1rem;">
                <div class="text-center mb-6">
                    <div class="mx-auto mb-2 mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <i data-lucide="pizza" class="h-10 w-10"></i>
                    </div>
                    <h4 class="text-2xl font-black uppercase tracking-tight text-slate-800">Personalize sua pizza</h4>
                    <p class="mt-3 text-sm leading-relaxed text-slate-500">Escolha uma borda recheada para deixar seu combo ainda mais especial.</p>
                </div>
                <div class="rounded-3xl border-2 border-orange-100 bg-orange-50 p-5 sm:p-7 shadow-sm">
                    <p class="mb-1 text-center text-xs font-black uppercase tracking-[2px] text-orange-700">Borda recheada (opcional)</p>
                    <div class="space-y-3">
                        ${BORDAS.filter(border => currentCombo.id !== 'casal' || !['chocolate', 'catupiry_calabresa'].includes(border.id)).map(border => {
                            const isSelected = comboSelections.border === border.id;
                            const priceLabel = currentCombo.id === 'casal'
                                ? 'Grátis no combo'
                                : `+ ${formatCurrency(border.prices[comboBorderSize])}`;
                            const image = COMBO_BORDER_IMAGES[border.id];
                            const borderName = border.id === 'sem_borda'
                                ? 'Sem borda'
                                : `Borda de ${border.name}`;

                            return `
                                <button type="button" onclick="selectComboBorder('${border.id}')"
                                    class="flex min-h-24 w-full items-center justify-between gap-4 rounded-2xl border-2 bg-white px-4 py-3 text-left transition-all ${isSelected ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-orange-100 hover:border-orange-300'}">
                                    <span class="flex min-w-0 flex-col">
                                        <span class="text-sm font-black text-slate-800">${borderName}</span>
                                        ${border.id !== 'sem_borda' ? `<span class="mt-1 text-xs font-bold text-orange-600">${priceLabel}</span>` : ''}
                                    </span>
                                    ${image ? `<img src="${image}" alt="${border.name}" class="h-16 w-24 rounded-xl object-cover" loading="lazy">` : '<span class="flex h-16 w-24 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-400">Sem borda</span>'}
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        updateComboSummary();
        updateComboPrice();
    } else {
        // ETAPA DE SELEÇÃO DE SABOR
        backBtn.classList.remove('hidden');
        summaryContainer.classList.remove('hidden');

        let gridTitle = "";
        let flavorList = [];
        let isPerfeitoStep2 = currentCombo.id === 'perfeito' && comboStep === 3;

        if (isPerfeitoStep2) {
            gridTitle = "Escolha a pizza doce";
            flavorList = ALL_PIZZA_FLAVORS.filter(p => SWEET_SABORES.includes(p.id));
            nextText.textContent = "Adicionar";
            nextIcon.setAttribute('data-lucide', 'shopping-cart');
        } else {
            gridTitle = currentCombo.id === 'perfeito' ? "Escolha a salgada" : "Escolha o sabor";
            flavorList = ALL_PIZZA_FLAVORS.filter(p => TRADITIONAL_SABORES.includes(p.id));

            nextText.textContent = "Próximo";
            nextIcon.setAttribute('data-lucide', 'arrow-right');
        }

        const flavorsHtml = flavorList.map(pizza => {
            const isSelected = isPerfeitoStep2
                ? comboSelections.sweetFlavor === pizza.id
                : comboSelections.flavors.includes(pizza.id);

            const selectionIndex = comboSelections.flavors.indexOf(pizza.id);

            return `
                 <button type="button" data-flavor-id="${pizza.id}" data-sweet="${isPerfeitoStep2}"
                     class="flavor-card ${isSelected ? (selectionIndex === 1 ? 'selected-2' : 'selected-1') : ''} !border-2">
                    <div class="flavor-card-img-container !h-24">
                        <img src="${pizza.img}" alt="${pizza.name}" class="flavor-card-img" onerror="this.src='assets/logofoggareli.webp'">
                    </div>
                    <div class="flavor-card-body !p-2">
                        <span class="flavor-card-name !text-[11px]">${pizza.name}</span>
                        <span class="flavor-card-desc !text-[9px] !-webkit-line-clamp-1">${pizza.desc}</span>
                    </div>
                    <div class="selection-badge selection-badge-1">${['casal', 'familia'].includes(currentCombo.id) || (currentCombo.id === 'perfeito' && !isPerfeitoStep2) ? '1º SABOR' : 'Sabor Escolhido'}</div>
                    <div class="selection-badge selection-badge-2">2º SABOR</div>
                </button>
            `;
        }).join('');

        let drinkHtml = "";
        const isCasal = currentCombo.id === 'casal';
        const isFamilia = currentCombo.id === 'familia';
        const isPerfeitoStep3 = currentCombo.id === 'perfeito' && comboStep === 3;

        if (isCasal || isFamilia || isPerfeitoStep3) {
            const drinkSize = (isFamilia || isPerfeitoStep3) ? '2L' : '1L';
            const drinkLabel = (isFamilia || isPerfeitoStep3) ? '2 Litros' : '1 Litro';
            drinkHtml = `
                <div class="combo-padding mt-4">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2 block">ESCOLHA O REFRIGERANTE (${drinkSize})</label>
                    <div style="display: grid; grid-template-columns: ${isCasal ? '1fr' : '1fr 1fr'}; gap: 0.75rem;">
                        ${(isCasal ? ['Guaraná'] : ['Fanta', 'Guaraná']).map(d => {
                const dId = d.toLowerCase();
                const isSelected = comboSelections.drink === dId;
                return `
                                <button onclick="selectComboDrink('${dId}')" 
                                        class="p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center 
                                        ${isSelected ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-gray-200 text-gray-500'}">
                                    <span class="text-sm">${d}</span>
                                    <span class="text-[10px] opacity-60 font-normal mt-0.5">${drinkLabel}</span>
                                </button>
                            `;
            }).join('')}
                    </div>
                </div>
            `;
        }

        content.innerHTML = `
            <div class="animate-in fade-in slide-in-from-right-4 duration-300" style="padding-top: 1.5rem; padding-bottom: 1.5rem;">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-center">${gridTitle}</h4>
                <div class="combo-padding grid grid-cols-2 gap-4">
                    ${flavorsHtml}
                </div>
                ${drinkHtml}
            </div>
        `;
        updateComboSummary();
        updateComboPrice();
    }

    if (window.lucide) {
        lucide.createIcons({
            root: document.getElementById('combo-modal')
        });
    }
}


function nextComboStep() {
    if (comboStep === 1) {
        comboStep = 2;
        renderComboStep();
    } else if (comboStep === 2) {
        if (comboSelections.flavors.length === 0) return alert('Escolha o sabor da pizza!');
        if (currentCombo.id === 'individual') {
            comboStep = 4;
            renderComboStep();
        } else if (currentCombo.id === 'perfeito') {
            comboStep = 3;
            renderComboStep();
        } else {
            if (!comboSelections.drink) return alert('Escolha o refrigerante!');
            comboStep = 4;
            renderComboStep();
        }
    } else if (comboStep === 3) {
        if (currentCombo.id === 'perfeito' && (!comboSelections.sweetFlavor || !comboSelections.drink)) {
            return alert(!comboSelections.sweetFlavor ? 'Escolha a pizza doce!' : 'Escolha o refrigerante!');
        }
        comboStep = 4;
        renderComboStep();
    } else {
        addComboToCart();
    }
}

function prevComboStep() {
    if (comboStep > 1) {
        comboStep = comboStep === 4 && currentCombo.id !== 'perfeito' ? 2 : comboStep - 1;
        renderComboStep();
    }
}

function selectComboFlavor(id, isSweet) {
    if (isSweet) {
        comboSelections.sweetFlavor = id;
    } else {
        const canHalf = ['casal', 'familia', 'perfeito'].includes(currentCombo.id);
        const max = canHalf ? 2 : 1;

        if (comboSelections.flavors.includes(id)) {
            comboSelections.flavors = comboSelections.flavors.filter(fid => fid !== id);
        } else {
            if (comboSelections.flavors.length >= max) {
                if (max === 1) comboSelections.flavors = [id];
                else comboSelections.flavors[1] = id;
            } else {
                comboSelections.flavors.push(id);
            }
        }
    }
    syncComboFlavorSelection(isSweet);
}

function syncComboFlavorSelection(isSweet) {
    document.querySelectorAll('#combo-modal-content .flavor-card').forEach(card => {
        card.classList.remove('selected-1', 'selected-2');
    });

    comboSelections.flavors.forEach((flavorId, index) => {
        const flavorCards = document.querySelectorAll('#combo-modal-content .flavor-card');
        const card = [...flavorCards].find(item => Number(item.dataset.flavorId) === flavorId);
        if (card) card.classList.add(index === 1 ? 'selected-2' : 'selected-1');
    });

    if (isSweet && comboSelections.sweetFlavor) {
        const sweetCard = [...document.querySelectorAll('#combo-modal-content .flavor-card')]
            .find(card => Number(card.dataset.flavorId) === comboSelections.sweetFlavor);
        if (sweetCard) sweetCard.classList.add('selected-1');
    }

    updateComboSummary();
}

function selectComboBorder(id) {
    comboSelections.border = id;
    renderComboStep();
}

function selectComboDrink(id) {
    comboSelections.drink = id;
    renderComboStep();
}

function updateComboSummary() {
    const summary = document.getElementById('combo-selection-summary');
    const nextBtn = document.getElementById('combo-next-btn');
    let text = "🍕 ";
    let ready = false;

    if (currentCombo.id === 'individual') {
        if (comboSelections.flavors.length > 0) {
            const p = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[0]);
            text += `Sabor: ${p.name}`;
            ready = true;
        } else {
            text += "Escolha seu sabor...";
        }
    } else if (currentCombo.id === 'casal') {
        const hasFlavor = comboSelections.flavors.length > 0;
        const hasDrink = !!comboSelections.drink;

        if (hasFlavor && hasDrink) {
            const p1 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[0]);
            const b = comboSelections.border === 'sem_borda' ? 'S/ Borda' : comboSelections.border.replace('_', ' ').toUpperCase();
            const d = comboSelections.drink === 'coca-cola' ? 'Coca' : 'Guaraná';
            const flavors = comboSelections.flavors.length === 1
                ? p1.name
                : `${p1.name} / ${ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[1]).name}`;
            text += `${flavors} | ${b} | ${d}`;
            ready = true;
        } else if (!hasFlavor) {
            text += "Escolha o sabor...";
        } else {
            text += "Escolha o refrigerante...";
        }
    } else if (currentCombo.id === 'familia') {
        const hasFlavors = comboSelections.flavors.length >= 1;
        const hasDrink = !!comboSelections.drink;

        if (hasFlavors && hasDrink) {
            const p1 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[0]);
            const d = comboSelections.drink === 'fanta' ? 'Fanta' : 'Guaraná';
            if (comboSelections.flavors.length === 1) {
                text += `Inteira: ${p1.name} | ${d}`;
            } else {
                const p2 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[1]);
                text += `${p1.name} / ${p2.name} | ${d}`;
            }
            ready = true;
        } else if (!hasFlavors) {
            text += "Escolha o sabor...";
        } else {
            text += "Escolha o refrigerante...";
        }
    } else if (currentCombo.id === 'perfeito') {
        if (comboStep === 2) {
            if (comboSelections.flavors.length >= 1) {
                const p1 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[0]);
                if (comboSelections.flavors.length === 1) {
                    text += `Salgada Inteira: ${p1.name}`;
                } else {
                    const p2 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[1]);
                    text += `Salgada: ${p1.name} + ${p2.name}`;
                }
                ready = true;
            } else {
                text += "Escolha a pizza salgada...";
            }
        } else {
            const hasSweet = !!comboSelections.sweetFlavor;
            const hasDrink = !!comboSelections.drink;

            if (hasSweet && hasDrink) {
                const ps = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.sweetFlavor);
                const p1 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[0]);
                const d = comboSelections.drink === 'fanta' ? 'Fanta' : 'Guaraná';

                if (comboSelections.flavors.length === 1) {
                    text += `Salgada: ${p1.name} | Doce: ${ps.name} | ${d}`;
                } else {
                    const p2 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[1]);
                    text += `Salgada: ${p1.name}/${p2.name} | Doce: ${ps.name} | ${d}`;
                }
                ready = true;
            } else if (!hasSweet) {
                text += "Escolha a pizza doce...";
            } else {
                text += "Escolha o refrigerante...";
            }
        }
    }

    summary.textContent = text;
    nextBtn.disabled = !ready;
}

function addComboToCart() {
    let details = "";
    let finalName = currentCombo.name;

    if (currentCombo.id === 'individual') {
        const p = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[0]);
        details = `Sabor: ${p.name}`;
    } else if (currentCombo.id === 'casal') {
        const p1 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[0]);
        const bLabel = comboSelections.border === 'sem_borda' ? 'Sem Borda' : comboSelections.border.replace('_', ' ');
        const d = comboSelections.drink === 'coca-cola' ? 'Coca-Cola' : 'Guaraná';
        const flavorDetails = comboSelections.flavors.length === 1
            ? `Sabor: ${p1.name}`
            : `Sabores: ${p1.name} / ${ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[1]).name}`;
        details = `${flavorDetails} • Borda: ${bLabel} • Refri: ${d} 1L`;
    } else if (currentCombo.id === 'familia') {
        const p1 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[0]);
        const d = comboSelections.drink === 'fanta' ? 'Fanta' : 'Guaraná';
        if (comboSelections.flavors.length === 1) {
            details = `Inteira: ${p1.name} • Refri: ${d} 2L`;
        } else {
            const p2 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[1]);
            details = `Sabores: ${p1.name} / ${p2.name} • Refri: ${d} 2L`;
        }
    } else if (currentCombo.id === 'perfeito') {
        const p1 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[0]);
        const ps = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.sweetFlavor);
        const d = comboSelections.drink === 'fanta' ? 'Fanta' : 'Guaraná';
        if (comboSelections.flavors.length === 1) {
            details = `Salgada Inteira: ${p1.name} • Doce: ${ps.name} • Refri: ${d} 2L`;
        } else {
            const p2 = ALL_PIZZA_FLAVORS.find(f => f.id === comboSelections.flavors[1]);
            details = `Salgada: ${p1.name}/${p2.name} • Doce: ${ps.name} • Refri: ${d} 2L`;
        }
    }

    const selectedBorder = getComboBorder();
    if (selectedBorder && selectedBorder.id !== 'sem_borda') {
        details += ` • Borda: ${selectedBorder.name}`;
    }

    const item = {
        name: finalName,
        price: currentCombo.price + getComboBorderPrice(),
        details: details,
        type: 'combo',
        isCombo: true
    };

    addToCart(item);
    closeComboModal();
}

function openProductModal(item) {
    currentModalItem = item;
    const modal = document.getElementById('product-modal');
    const modalImg = document.getElementById('modal-img');
    const modalName = document.getElementById('modal-name');
    const modalDesc = document.getElementById('modal-desc');
    const modalSizesContainer = document.getElementById('modal-sizes-container');
    const modalBordersContainer = document.getElementById('modal-borders-container');
    const modalBorderSelect = document.getElementById('modal-border-select');
    const modalNote = document.getElementById('modal-note');

    if (!modal) return;

    // Preencher dados básicos
    modalImg.src = item.img;
    modalImg.onerror = () => {
        modalImg.src = 'assets/logofoggareli.webp';
    };
    modalName.textContent = item.name.toUpperCase();
    modalDesc.textContent = item.desc;
    modalNote.value = '';

    const hasVariations = item.prices && typeof item.prices === 'object';

    // Lógica para Pizzas
    if (item.type === 'pizza') {
        currentModalSize = 'M';
        modalSizesContainer.classList.remove('hidden');
        modalBordersContainer.classList.remove('hidden');

        // Renderizar tamanhos
        const sizes = {
            P: { label: 'Pequena', size: '25cm' },
            M: { label: 'Média', size: '30cm' },
            G: { label: 'Grande', size: '40cm' }
        };

        const sizesGrid = document.getElementById('modal-sizes-grid');
        sizesGrid.innerHTML = Object.keys(sizes).map(size => `
            <button type="button" class="modal-size-btn p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${size === 'M' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-gray-200 text-gray-500'}"
                onclick="setModalSize('${size}')" id="size-btn-${size}">
                <span class="text-sm">${sizes[size].label}</span>
                <span class="text-[10px] opacity-60 font-normal mt-0.5">${sizes[size].size}</span>
            </button>
        `).join('');

        // Preencher Bordas
        renderModalBorders();
        modalBorderSelect.onchange = updateModalPrice;

    } else if (hasVariations) {
        // Lógica para Bebidas com variações
        currentModalSize = Object.keys(item.prices)[0];
        modalSizesContainer.classList.remove('hidden');
        modalBordersContainer.classList.add('hidden');

        const sizesGrid = document.getElementById('modal-sizes-grid');
        sizesGrid.innerHTML = Object.keys(item.options).map(key => `
            <button type="button" class="modal-size-btn p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${key === currentModalSize ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-gray-200 text-gray-500'}"
                onclick="setModalSize('${key}')" id="size-btn-${key}">
                <span class="text-[10px] sm:text-xs font-bold">${item.options[key].label}</span>
                <span class="text-[10px] opacity-60 font-normal mt-0.5">${item.options[key].sub}</span>
            </button>
        `).join('');

    } else {
        // Lógica para Bebidas comuns
        modalSizesContainer.classList.add('hidden');
        modalBordersContainer.classList.add('hidden');
    }

    updateModalPrice();
    modal.classList.add('flex');
    document.body.classList.add('modal-open');

    if (window.lucide) {
        lucide.createIcons({
            root: modal
        });
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('flex');
        document.body.classList.remove('modal-open');
    }
}

function setModalSize(size) {
    currentModalSize = size;
    document.querySelectorAll('.modal-size-btn').forEach(btn => {
        btn.classList.remove('border-orange-500', 'bg-orange-50', 'text-orange-700', 'font-bold');
        btn.classList.add('border-gray-200', 'text-gray-500');
    });
    const selectedBtn = document.getElementById(`size-btn-${size}`);
    if (selectedBtn) {
        selectedBtn.classList.add('border-orange-500', 'bg-orange-50', 'text-orange-700', 'font-bold');
        selectedBtn.classList.remove('border-gray-200', 'text-gray-500');
    }

    // Atualizar labels das bordas se for pizza
    if (currentModalItem && currentModalItem.type === 'pizza') {
        renderModalBorders();
    }

    updateModalPrice();
}

function renderModalBorders() {
    const select = document.getElementById('modal-border-select');
    if (!select) return;

    const currentBorder = select.value || 'sem_borda';

    select.innerHTML = BORDAS.map(b => `
        <option value="${b.id}">${b.name}${b.prices[currentModalSize] > 0 ? ` (+ ${formatCurrency(b.prices[currentModalSize])})` : ''}</option>
    `).join('');

    select.value = currentBorder;
}

function updateModalPrice() {
    if (!currentModalItem) return;

    let price = 0;
    if (currentModalItem.type === 'pizza') {
        price = currentModalItem.prices[currentModalSize];
        const borderId = document.getElementById('modal-border-select').value;
        const border = BORDAS.find(b => b.id === borderId);
        if (border) price += border.prices[currentModalSize];
    } else if (currentModalItem.prices && typeof currentModalItem.prices === 'object') {
        price = currentModalItem.prices[currentModalSize];
    } else {
        price = currentModalItem.price;
    }

    document.getElementById('modal-price-display').textContent = formatCurrency(price);
}

document.getElementById('modal-add-btn').onclick = () => {
    if (!currentModalItem) return;

    const note = document.getElementById('modal-note').value.trim();
    let itemToAdd = {};

    if (currentModalItem.type === 'pizza') {
        const borderId = document.getElementById('modal-border-select').value;
        const borderObj = BORDAS.find(b => b.id === borderId);
        const borderDisplay = borderObj.id !== 'sem_borda' ? `Borda de ${borderObj.name}` : 'Sem Borda';

        const sizesNames = { P: 'Pequena', M: 'Média', G: 'Grande' };

        let finalPrice = currentModalItem.prices[currentModalSize];
        if (borderObj) finalPrice += borderObj.prices[currentModalSize];

        itemToAdd = {
            type: 'pizza',
            name: currentModalItem.name,
            details: `Tam: ${sizesNames[currentModalSize]} • ${borderDisplay}`,
            price: finalPrice,
            note: note
        };
    } else {
        const hasVariations = currentModalItem.prices && typeof currentModalItem.prices === 'object';
        itemToAdd = {
            type: currentModalItem.type || 'item',
            name: currentModalItem.name,
            details: hasVariations ? currentModalItem.options[currentModalSize].label : currentModalItem.desc,
            price: hasVariations ? currentModalItem.prices[currentModalSize] : currentModalItem.price,
            note: note
        };
    }

    addToCart(itemToAdd);
    closeProductModal();
};

const renderHalfCard = () => {
    const card = document.createElement('div');
    card.className = "half-card-full bg-orange-600 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 text-white cursor-pointer hover:bg-orange-700 transition-all shadow-xl relative overflow-hidden group";
    card.onclick = openHalfModal;

    card.innerHTML = `
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <i data-lucide="pizza" class="w-32 h-32 md:w-48 md:h-48"></i>
        </div>
        <div class="flex-1 relative z-10 text-center md:text-left">
            <span class="bg-white/20 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Funcionalidade Exclusiva</span>
            <h3 class="text-2xl md:text-4xl font-black mb-3 font-playfair tracking-tight">CRIAR PIZZA MEIO A MEIO</h3>
            <p class="text-sm md:text-base opacity-90 max-w-md mb-6 leading-relaxed">Não consegue decidir? Escolha dois dos seus sabores favoritos em uma única pizza Média ou Grande.</p>
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
                <span class="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 italic">
                    <i data-lucide="check-circle-2" class="w-4 h-4"></i> Média 6 Fatias
                </span>
                <span class="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 italic">
                    <i data-lucide="check-circle-2" class="w-4 h-4"></i> Grande 10 Fatias
                </span>
            </div>
        </div>
        <div class="relative z-10 bg-white text-orange-600 p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg group-hover:scale-105 transition-transform">
            <span class="text-[10px] font-black uppercase">Monte Agora</span>
            <i data-lucide="arrow-right" class="w-6 h-6"></i>
        </div>
    `;
    return card;
};

const renderMenu = () => {
    const container = document.getElementById('pizzas-container');
    container.innerHTML = '';

    CATEGORIES.forEach(cat => {
        const section = document.createElement('section');
        section.id = `category-${cat.id}`;
        section.className = "category-section scroll-mt-32 mb-12 px-1";

        const title = document.createElement('h2');
        title.className = "text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-orange-500 inline-block";
        title.textContent = cat.label;
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = "grid grid-cols-1 md:grid-cols-2 gap-4";

        if (cat.type === 'half') {
            grid.appendChild(renderHalfCard());
        } else {
            cat.items.forEach(item => {
                if (cat.type === 'drink') {
                    grid.appendChild(renderDrinkCard(item));
                } else if (cat.type === 'combo') {
                    grid.appendChild(renderComboCard(item));
                } else {
                    grid.appendChild(renderPizzaCard(item));
                }
            });
        }

        section.appendChild(grid);
        container.appendChild(section);
    });

    if (window.lucide) lucide.createIcons();
};




// ==========================================
// 6. UI DO CARRINHO (DRAWER)
// ==========================================
function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = getCartTotal();
    const deliveryFee = getDeliveryFee();

    // Badges
    const badges = [document.getElementById('header-cart-count'), document.getElementById('cart-fab-badge')];
    badges.forEach(el => {
        if (!el) return;
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
        el.classList.remove('hidden');
    });

    // Drawer Body
    const drawerBody = document.querySelector('.cart-drawer-body');
    if (cart.length === 0) {
        drawerBody.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-gray-400">
                <i data-lucide="shopping-basket" class="w-16 h-16 mb-4 opacity-20"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
    } else {
        drawerBody.innerHTML = cart.map((item, i) => `
            <div class="cart-item-card">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-sm text-gray-900">${item.name}</h4>
                    <span class="font-bold text-sm text-orange-600">${formatCurrency(item.price * item.quantity)}</span>
                </div>
                <p class="text-xs text-gray-500 mb-2">${item.details}</p>
                ${item.note ? `<p class="text-xs text-green-600 italic mb-3">Obs: ${item.note}</p>` : ''}
                
                <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
                        <button class="px-2 text-gray-500 hover:text-orange-600" onclick="updateCartItemQuantity(${i}, -1)">-</button>
                        <span class="text-sm font-bold w-4 text-center">${item.quantity}</span>
                        <button class="px-2 text-gray-500 hover:text-orange-600" onclick="updateCartItemQuantity(${i}, 1)">+</button>
                    </div>
                    <button class="text-red-400 hover:text-red-600" onclick="removeFromCart(${i})">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Drawer Footer Summary
    const summary = document.querySelector('.cart-summary');
    if (summary) {
        summary.innerHTML = `
            <div class="flex justify-between text-gray-500 text-sm mb-1">
                <span>Subtotal</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
            ${checkoutData.region ? `
                 <div class="flex justify-between text-gray-500 text-sm mb-1">
                    <span>Entrega</span>
                    <span>${formatCurrency(deliveryFee)}</span>
                </div>
            ` : ''}
            <div class="flex justify-between text-gray-900 font-bold text-lg mt-2 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>${formatCurrency(subtotal + deliveryFee)}</span>
            </div>
        `;
    }

    if (window.lucide) {
        lucide.createIcons({
            root: drawerBody
        });
    }
    updateCheckoutForm(); // Atualiza resumo no checkout também se aberto
}


function toggleCartDrawer() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-drawer-overlay').classList.add('open');
    document.body.classList.add('modal-open');
    updateCartUI();
}

function closeCartDrawer() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-drawer-overlay').classList.remove('open');
    document.body.classList.remove('modal-open');
}

// ==========================================
// 7. CHECKOUT E WHATSAPP
// ==========================================
function openCheckout() {
    if (isClosedToday()) {
        closeCartDrawer();
        openClosedDayModal();
        return;
    }
    if (cart.length === 0) {
        showToast("Seu carrinho está vazio!");
        return;
    }
    closeCartDrawer();
    document.getElementById('checkout-section').classList.add('open');
    document.body.classList.add('modal-open');
    renderCheckoutForm();
}

function closeCheckout() {
    document.getElementById('checkout-section').classList.remove('open');
    document.body.classList.remove('modal-open');
}

function renderCheckoutForm() {
    const form = document.querySelector('.checkout-form');
    form.innerHTML = `
        <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
            <input type="text" class="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none" 
                placeholder="Seu nome" value="${checkoutData.name}" oninput="checkoutData.name = this.value">
        </div>
        <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone / WhatsApp</label>
            <input type="tel" class="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none" 
                placeholder="(XX) XXXXX-XXXX" value="${checkoutData.phone}" oninput="checkoutData.phone = this.value">
        </div>
        <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Endereço de Entrega</label>
            <input type="text" class="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none" 
                placeholder="Rua, Número, Bairro, Complemento" value="${checkoutData.address}" oninput="checkoutData.address = this.value">
        </div>
        <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Região de Entrega</label>
            <select class="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white" onchange="checkoutData.region = this.value; updateCartUI();">
                <option value="">Selecione sua região...</option>
                ${DELIVERY_REGIONS.map(Reg => `
                    <option value="${Reg.id}" ${checkoutData.region === Reg.id ? 'selected' : ''}>
                        ${Reg.name} (+ ${formatCurrency(Reg.fee)})
                    </option>
                `).join('')}
            </select>
        </div>
        <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Forma de Pagamento</label>
            <div class="payment-method-grid">
                <div class="payment-method-btn ${checkoutData.paymentMethod === 'Pix' ? 'active' : ''}" onclick="setPaymentMethod('Pix')">
                    <i data-lucide="qr-code"></i>
                    <span class="text-xs uppercase tracking-tighter">Pix</span>
                </div>
                <div class="payment-method-btn ${checkoutData.paymentMethod === 'Dinheiro' ? 'active' : ''}" onclick="setPaymentMethod('Dinheiro')">
                    <i data-lucide="banknote"></i>
                    <span class="text-xs uppercase tracking-tighter">Dinheiro</span>
                </div>
                <div class="payment-method-btn ${checkoutData.paymentMethod === 'Cartão' ? 'active' : ''}" onclick="setPaymentMethod('Cartão')">
                    <i data-lucide="credit-card"></i>
                    <span class="text-xs uppercase tracking-tighter">Cartão</span>
                </div>
            </div>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
            <div class="flex justify-between text-gray-900 font-bold">
                 <span>Total a Pagar:</span>
                 <span id="checkout-total-display">${formatCurrency(getCartTotal() + getDeliveryFee())}</span>
            </div>
        </div>
    `;

    if (window.lucide) {
        lucide.createIcons({
            root: form
        });
    }
}

function setPaymentMethod(method) {
    checkoutData.paymentMethod = method;
    renderCheckoutForm();
}

function updateCheckoutForm() {
    const display = document.getElementById('checkout-total-display');
    if (display) display.textContent = formatCurrency(getCartTotal() + getDeliveryFee());
}

function sendToWhatsApp() {
    if (isClosedToday()) {
        closeCheckout();
        openClosedDayModal();
        return;
    }
    if (!checkoutData.name || !checkoutData.phone || !checkoutData.address || !checkoutData.region || !checkoutData.paymentMethod) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const total = getCartTotal() + getDeliveryFee();
    const regionName = DELIVERY_REGIONS.find(r => r.id === checkoutData.region)?.name || '';

    const now = new Date();
    const dateTime = now.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let msg = `*--- 🍕 NOVO PEDIDO 🍕 ---*\n`;
    msg += `*📅 Data:* ${dateTime}\n\n`;

    msg += `*🛒 ITENS DO PEDIDO:*\n`;
    cart.forEach(item => {
        msg += `✅ *${item.quantity}x ${item.name}*\n`;
        msg += `   └ ${item.details}\n`;
        if (item.note) msg += `   📝 *Obs:* _${item.note}_\n`;
        msg += `   *Valor:* ${formatCurrency(item.price * item.quantity)}\n\n`;
    });

    msg += `*--------------------------*\n\n`;

    msg += `*➕ RESUMO:* \n`;
    msg += `📦 *Taxa de Entrega:* ${formatCurrency(getDeliveryFee())}\n`;
    msg += `💰 *TOTAL A PAGAR: ${formatCurrency(total)}*\n\n`;

    msg += `*--------------------------*\n\n`;

    msg += `*👤 DADOS DE ENTREGA:*\n`;
    msg += `*• Nome:* ${checkoutData.name}\n`;
    msg += `*• Telefone:* ${checkoutData.phone}\n`;
    msg += `*• Endereço:* ${checkoutData.address}\n`;
    msg += `*• Região:* ${regionName}\n`;
    msg += `*• Pagamento:* ${checkoutData.paymentMethod}\n\n`;

    msg += `*--------------------------*\n`;
    msg += `_Foggareli agradece a preferência!_ 🔥`;

    // Gera um ID de transação único (timestamp) para registrar como compra finalizada no GA4
    const transactionId = 'WA_' + new Date().getTime();

    // Log para você verificar no console do navegador se o valor está correto antes de enviar
    console.log("Enviando evento de compra para GA4:", { transactionId, total, items: cart });

    // Dispara evento de conversão para o Google Analytics (Padrão de E-commerce GA4)
    if (typeof gtag === 'function') {
        gtag('event', 'purchase', {
            'transaction_id': transactionId,
            'currency': 'BRL',
            'value': Number(total.toFixed(2)), // Garante que é um número com 2 casas decimais
            'items': cart.map(item => ({
                'item_id': item.id || item.name, // GA4 recomenda ter um ID
                'item_name': item.name,
                'price': Number(item.price),
                'quantity': item.quantity
            }))
        });

        // Mantemos o evento personalizado também
        gtag('event', 'finalizar_pedido', {
            'value': Number(total.toFixed(2)),
            'currency': 'BRL'
        });
    }

    // A forma mais robusta de abrir no WhatsApp
    const url = `https://api.whatsapp.com/send?phone=5522997891890&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}


// ==========================================
// 7.5 DIA FECHADO (TERÇA-FEIRA)
// ==========================================
function isClosedToday() {
    return new Date().getDay() === 2; // 0 = domingo, 1 = segunda, 2 = terça...
}

function openClosedDayModal() {
    const modal = document.getElementById('closed-day-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('modal-open');
    // Força o navegador a aplicar o display antes da transição de opacidade (fade in)
    setTimeout(() => modal.classList.add('visible'), 50);
}

function closeClosedDayModal() {
    const modal = document.getElementById('closed-day-modal');
    modal.classList.remove('visible'); // dispara o fade out
    document.body.classList.remove('modal-open');
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 350); // aguarda a transição de opacidade terminar
}

// ==========================================
// 8. INICIALIZAÇÃO
// ==========================================
window.onload = function () {
    loadCart();
    renderCategoryButtons();
    renderMenu();
    updateCartUI();

    if (isClosedToday()) {
        openClosedDayModal();
    }

    // Scroll Sticky Header & Active Category Logic
    const header = document.getElementById('site-header');
    const categoriesBar = document.getElementById('categories-bar');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Header Style - Aumentado para 50px para evitar flicks no topo
        if (scrollY > 50) {
            header.classList.add('scrolled');
            if (categoriesBar) categoriesBar.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            if (categoriesBar) categoriesBar.classList.remove('scrolled');
        }

        // Active State Sync
        const headerOffset = 180;
        let currentCat = CATEGORIES[0].id;

        CATEGORIES.forEach(cat => {
            const section = document.getElementById(`category-${cat.id}`);
            if (section) {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - headerOffset) {
                    currentCat = cat.id;
                }
            }
        });

        // Update Tabs
        document.querySelectorAll('.category-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === currentCat);
        });
    });

    document.getElementById('cta-order-btn').onclick = () => {
        scrollToCategory('combos');
    };

    // --- Inicia animação do botão CTA com GSAP ---
    gsap.registerPlugin(ScrollTrigger);

    const ctaBtn = document.getElementById('cta-order-btn');
    if (ctaBtn) {
        // Configuração conforme pedido (AnimatedContent props)
        const distance = 100; // distance={240}
        const startScale = 0.5; // scale={0.1}

        // Define estado inicial
        gsap.set(ctaBtn, {
            y: distance,
            scale: startScale,
            opacity: 0,
            visibility: 'visible'
        });

        // Timeline da animação
        const tl = gsap.timeline({
            paused: true,
            delay: 0.2, // delay={0.2}
            onComplete: () => {
                // Inicia o bounce infinito diretamente via GSAP para evitar conflitos com estilos inline
                gsap.to(ctaBtn, {
                    y: -10,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        });

        // Animação de entrada
        tl.to(ctaBtn, {
            y: 0,
            scale: 1,
            opacity: 1, // animateOpacity={true}
            duration: 2, // duration={3}
            ease: "power3.out" // ease="power3.out"
        });

        // ScrollTrigger para disparar quando visível
        ScrollTrigger.create({
            trigger: ctaBtn,
            start: "top 90%", // threshold={0.1} => 90% view
            once: true,
            onEnter: () => tl.play()
        });
    }
};

// Expose global functions
window.toggleCartDrawer = toggleCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeFromCart = removeFromCart;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.sendToWhatsApp = sendToWhatsApp;
window.scrollToCategory = scrollToCategory;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.setModalSize = setModalSize;
window.updateModalPrice = updateModalPrice;
window.setPaymentMethod = setPaymentMethod;
window.closeClosedDayModal = closeClosedDayModal;

// Meio a Meio
window.openHalfModal = openHalfModal;
window.closeHalfModal = closeHalfModal;
window.setHalfSize = setHalfSize;
window.setHalfBorder = setHalfBorder;
window.selectFlavor = selectFlavor;
window.addHalfToCart = addHalfToCart;
