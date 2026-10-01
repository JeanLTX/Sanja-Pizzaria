
// ==========================================
// 1. DADOS DO CARDÁPIO
// ==========================================

// Preços de borda adicional
const BORDAS = [
    { id: 'sem_borda', name: 'Sem Borda Recheada', prices: { P: 0, M: 0, G: 0 } },
    { id: 'catupiry', name: 'Catupiry', prices: { P: 10.00, M: 10.00, G: 10.00 } },
    { id: 'cheddar', name: 'Cheddar', prices: { P: 10.00, M: 10.00, G: 10.00 } },
    { id: 'chocolate', name: 'Chocolate', prices: { P: 10.00, M: 10.00, G: 10.00 } },
    { id: 'mussarela', name: 'Mussarela', prices: { P: 20.00, M: 20.00, G: 20.00 } }
];

// Massa/Broto base: R$ 40,00
// Pizzas Salgadas
const PIZZAS_SALGADAS = [
    { id: 1, name: "À MODA DA CASA", category: "Pizzas Salgadas", desc: "Molho, mussarela, frango, lombo, bacon, tomate e orégano.", img: "assets/modadacasa.webp", type: "pizza", prices: { P: 58.00, M: 58.00, G: 58.00 } },
    { id: 2, name: "ATUM", category: "Pizzas Salgadas", desc: "Molho, mussarela, atum, cebola, azeitona e orégano.", img: "assets/atum.webp", type: "pizza", prices: { P: 52.00, M: 52.00, G: 52.00 } },
    { id: 3, name: "BACON", category: "Pizzas Salgadas", desc: "Molho, mussarela, bacon, cebola e orégano.", img: "assets/bacon.webp", type: "pizza", prices: { P: 55.00, M: 55.00, G: 55.00 } },
    { id: 4, name: "BACON C/ FRITAS", category: "Pizzas Salgadas", desc: "Molho, mussarela, bacon, catupiry e batata frita.", img: "assets/baconcomfritas.webp", type: "pizza", prices: { P: 60.00, M: 60.00, G: 60.00 } },
    { id: 5, name: "BAIACATU", category: "Pizzas Salgadas", desc: "Molho, mussarela, calabresa, catupiry e orégano.", img: "assets/baiacatu.webp", type: "pizza", prices: { P: 55.00, M: 55.00, G: 55.00 } },
    { id: 6, name: "BOLONHESA", category: "Pizzas Salgadas", desc: "Molho, carne-moída temperada, mussarela, pimentão e cebola.", img: "assets/bolonhesa.webp", type: "pizza", prices: { P: 59.00, M: 59.00, G: 59.00 } },
    { id: 7, name: "BRÓCOLIS", category: "Pizzas Salgadas", desc: "Molho, mussarela, brócolis, bacon, azeitona e orégano.", img: "assets/brocolis.webp", type: "pizza", prices: { P: 54.00, M: 54.00, G: 54.00 } },
    { id: 8, name: "CAIPIRA", category: "Pizzas Salgadas", desc: "Molho, mussarela, frango, milho e orégano.", img: "assets/caipira.webp", type: "pizza", prices: { P: 54.00, M: 54.00, G: 54.00 } },
    { id: 9, name: "CALABRESA", category: "Pizzas Salgadas", desc: "Molho, mussarela, calabresa, cebola e orégano.", img: "assets/calabresa.webp", type: "pizza", prices: { P: 52.00, M: 52.00, G: 52.00 } },
    { id: 10, name: "CALABRESA C/ CHEDDAR", category: "Pizzas Salgadas", desc: "Molho, mussarela, calabresa, cheddar e orégano.", img: "assets/calabresacomcheddar.webp", type: "pizza", prices: { P: 55.00, M: 55.00, G: 55.00 } },
    { id: 11, name: "CALABRESA MINEIRA", category: "Pizzas Salgadas", desc: "Molho, mussarela, calabresa, milho, bacon e orégano.", img: "assets/calabresa_mineira.webp", type: "pizza", prices: { P: 54.00, M: 54.00, G: 54.00 } },
    { id: 12, name: "CALARUFFLES", category: "Pizzas Salgadas", desc: "Molho, mussarela, batata Ruffles, frango, bacon e calabresa.", img: "assets/calaruffles.webp", type: "pizza", prices: { P: 62.00, M: 62.00, G: 62.00 } },
    { id: 13, name: "CINCO QUEIJOS", category: "Pizzas Salgadas", desc: "Molho, mussarela, parmesão, provolone, gorgonzola, catupiry e orégano.", img: "assets/cincoqueijos.webp", type: "pizza", prices: { P: 64.00, M: 64.00, G: 64.00 } },
    { id: 14, name: "CROCANTE", category: "Pizzas Salgadas", desc: "Molho, mussarela, presunto, bacon, milho, batata palha e orégano.", img: "assets/crocante.webp", type: "pizza", prices: { P: 56.00, M: 56.00, G: 56.00 } },
    { id: 15, name: "FAZENDEIRA", category: "Pizzas Salgadas", desc: "Molho, mussarela, frango, milho, bacon, catupiry e orégano.", img: "assets/fazendeira.webp", type: "pizza", prices: { P: 58.00, M: 58.00, G: 58.00 } },
    { id: 16, name: "FAZENDINHA", category: "Pizzas Salgadas", desc: "Molho, mussarela, milho, bacon, catupiry e orégano.", img: "assets/fazendinha.webp", type: "pizza", prices: { P: 54.00, M: 54.00, G: 54.00 } },
    { id: 17, name: "FILADELPHIA", category: "Pizzas Salgadas", desc: "Molho, mussarela, costela bovina desfiada temperada, tomate e cebola.", img: "assets/filadelphia.webp", type: "pizza", prices: { P: 62.00, M: 62.00, G: 62.00 } },
    { id: 18, name: "FRANCESA", category: "Pizzas Salgadas", desc: "Molho, mussarela, presunto, bacon, azeitona e orégano.", img: "assets/francesa.webp", type: "pizza", prices: { P: 57.00, M: 57.00, G: 57.00 } },
    { id: 19, name: "FRANCHEDDAR", category: "Pizzas Salgadas", desc: "Molho, mussarela, frango, bacon, cheddar e Doritos.", img: "assets/frankedar.webp", type: "pizza", prices: { P: 62.00, M: 62.00, G: 62.00 } },
    { id: 20, name: "FRANGO CAIPIRA", category: "Pizzas Salgadas", desc: "Molho, mussarela, frango, milho, cheddar, calabresa e orégano.", img: "assets/frango_caipira.webp", type: "pizza", prices: { P: 61.00, M: 61.00, G: 61.00 } },
    { id: 21, name: "FRANGO C/ CATUPIRY OU CHEDDAR", category: "Pizzas Salgadas", desc: "Molho, mussarela, frango, catupiry ou cheddar.", img: "assets/frangocomcatupiry.webp", type: "pizza", prices: { P: 55.00, M: 55.00, G: 55.00 } },
    { id: 22, name: "FRANGO C/ CREME CHEESE", category: "Pizzas Salgadas", desc: "Molho, mussarela, frango, cebola e creme cheese.", img: "assets/creamcheese.webp", type: "pizza", prices: { P: 54.00, M: 54.00, G: 54.00 } },
    { id: 23, name: "LOMBO", category: "Pizzas Salgadas", desc: "Molho, mussarela, lombo e orégano.", img: "assets/lombo.webp", type: "pizza", prices: { P: 54.00, M: 54.00, G: 54.00 } },
    { id: 24, name: "LOMBO ESPECIAL", category: "Pizzas Salgadas", desc: "Molho, mussarela, lombo, champignon, catupiry e orégano.", img: "assets/lombo_especial.webp", type: "pizza", prices: { P: 56.00, M: 56.00, G: 56.00 } },
    { id: 25, name: "LOMBO CANADENSE", category: "Pizzas Salgadas", desc: "Molho, mussarela, lombo canadense, abacaxi, bacon e catupiry.", img: "assets/lombo_canadense.webp", type: "pizza", prices: { P: 60.00, M: 60.00, G: 60.00 } },
    { id: 26, name: "LOMBO CHEDDAR", category: "Pizzas Salgadas", desc: "Molho, mussarela, lombo, cheddar e azeitona.", img: "assets/lombo_cheddar.webp", type: "pizza", prices: { P: 55.00, M: 55.00, G: 55.00 } },
    { id: 27, name: "MARGUERITA", category: "Pizzas Salgadas", desc: "Molho, mussarela, parmesão, manjericão e alho.", img: "assets/margherita.webp", type: "pizza", prices: { P: 52.00, M: 52.00, G: 52.00 } },
    { id: 28, name: "MAIALE", category: "Pizzas Salgadas", desc: "Molho, mussarela, lombo, calabresa, bacon, catupiry e orégano.", img: "assets/maiale.webp", type: "pizza", prices: { P: 57.00, M: 57.00, G: 57.00 } },
    { id: 29, name: "MARINARA", category: "Pizzas Salgadas", desc: "Molho, mussarela, atum, tomate picado, provolone e orégano.", img: "assets/marinhana.webp", type: "pizza", prices: { P: 54.00, M: 54.00, G: 54.00 } },
    { id: 30, name: "MEXICANA", category: "Pizzas Salgadas", desc: "Molho, mussarela, calabresa, ovo, pimenta e cebola.", img: "assets/mexicana.webp", type: "pizza", prices: { P: 53.00, M: 53.00, G: 53.00 } },
    { id: 31, name: "MISTA", category: "Pizzas Salgadas", desc: "Molho, mussarela, presunto, parmesão, tomate e orégano.", img: "assets/mista.webp", type: "pizza", prices: { P: 50.00, M: 50.00, G: 50.00 } },
    { id: 32, name: "MUSSARELA", category: "Pizzas Salgadas", desc: "Molho, mussarela, tomate, azeitona e orégano.", img: "assets/Muçarela.webp", type: "pizza", prices: { P: 50.00, M: 50.00, G: 50.00 } },
    { id: 33, name: "NORDESTINA", category: "Pizzas Salgadas", desc: "Molho, mussarela, carne seca temperada, tomate e cebola.", img: "assets/nordestina.webp", type: "pizza", prices: { P: 55.00, M: 55.00, G: 55.00 } },
    { id: 34, name: "PALMITO ESPECIAL", category: "Pizzas Salgadas", desc: "Molho, mussarela, palmito e milho.", img: "assets/palmito.webp", type: "pizza", prices: { P: 54.00, M: 54.00, G: 54.00 } },
    { id: 35, name: "PEPPERONI", category: "Pizzas Salgadas", desc: "Molho, mussarela, pepperoni, cheddar, pimentão, cebola e orégano.", img: "assets/Pepperoni.webp", type: "pizza", prices: { P: 55.00, M: 55.00, G: 55.00 } },
    { id: 36, name: "PORTUGUESA", category: "Pizzas Salgadas", desc: "Molho, mussarela, presunto, ervilha, palmito, ovo e cebola.", img: "assets/portuguesa.webp", type: "pizza", prices: { P: 56.00, M: 56.00, G: 56.00 } },
    { id: 37, name: "ROCA BLANCA", category: "Pizzas Salgadas", desc: "Molho, mussarela, calabresa, catupiry, cebola e alho frito.", img: "assets/roca_blanca.webp", type: "pizza", prices: { P: 54.00, M: 54.00, G: 54.00 } },
    { id: 38, name: "ROMANA", category: "Pizzas Salgadas", desc: "Molho, mussarela, ovo, bacon, tomate e orégano.", img: "assets/romana.webp", type: "pizza", prices: { P: 53.00, M: 53.00, G: 53.00 } },
    { id: 39, name: "TEXANA", category: "Pizzas Salgadas", desc: "Molho, mussarela, frango, bacon, calabresa e orégano.", img: "assets/texana.webp", type: "pizza", prices: { P: 57.00, M: 57.00, G: 57.00 } },
    { id: 40, name: "TOSCANA", category: "Pizzas Salgadas", desc: "Molho, mussarela, calabresa, tomate, cebola, azeitona e orégano.", img: "assets/toscana.webp", type: "pizza", prices: { P: 54.00, M: 54.00, G: 54.00 } },
    { id: 41, name: "VEGETARIANA", category: "Pizzas Salgadas", desc: "Molho, mussarela, tomate, cebola, palmito, champignon e orégano.", img: "assets/vegetariana.webp", type: "pizza", prices: { P: 54.00, M: 54.00, G: 54.00 } },
    { id: 42, name: "VIENA", category: "Pizzas Salgadas", desc: "Molho, mussarela, lombo, tomate, catupiry, champignon e orégano.", img: "assets/viena.webp", type: "pizza", prices: { P: 57.00, M: 57.00, G: 57.00 } },
    { id: 43, name: "QUATRO QUEIJOS", category: "Pizzas Salgadas", desc: "Molho, mussarela, provolone, parmesão, catupiry e orégano.", img: "assets/quatroqueijos.webp", type: "pizza", prices: { P: 61.00, M: 61.00, G: 61.00 } },
    { id: 44, name: "QUATRO QUEIJOS, FRANGO E BACON", category: "Pizzas Salgadas", desc: "Molho, mussarela, provolone, parmesão, catupiry, frango, bacon e orégano.", img: "assets/4queijos_frango_bacon.webp", type: "pizza", prices: { P: 65.00, M: 65.00, G: 65.00 } },
    { id: 45, name: "SACOLA", category: "Pizzas Salgadas", desc: "Molho, mussarela, catupiry, lombo, bacon, frango, palmito e orégano.", img: "assets/sacola.webp", type: "pizza", prices: { P: 62.00, M: 62.00, G: 62.00 } },
    { id: 46, name: "STROGONOFF", category: "Pizzas Salgadas", desc: "Molho, mussarela, milho, frango, champignon, batata palha e orégano.", img: "assets/strogonoff.webp", type: "pizza", prices: { P: 56.00, M: 56.00, G: 56.00 } },
    { id: 47, name: "MONTE SUA PIZZA", category: "Pizzas Salgadas", desc: "Com até 5 ingredientes.", img: "assets/monte_sua_pizza.webp", type: "pizza", prices: { P: 62.00, M: 62.00, G: 62.00 } }
];

const PIZZAS_ESPECIAIS = [
    { id: 99, name: "Pizza Sanja", category: "Pizzas Especiais", desc: "Molho, frango desfiado, cheddar, milho, muçarela, bacon, orégano.", img: "assets/sanja.webp", type: "pizza", prices: { P: 59.90, M: 61.90, G: 75.90 } }
];

const PIZZAS_DOCES = [
    { id: 50, name: "Rock Braz Açaí", category: "Pizzas Doces", desc: "Açaí, leite em pó, leite condensado.", img: "assets/rock_braz.webp", type: "pizza", prices: { P: 60.00, M: 60.00, G: 60.00 } },
    { id: 51, name: "BOLACHA OREO", category: "Pizzas Doces", desc: "Chocolate branco, bolacha Oreo triturada e leite condensado.", img: "assets/oreo.webp", type: "pizza", prices: { P: 57.00, M: 57.00, G: 57.00 } },
    { id: 52, name: "BIS", category: "Pizzas Doces", desc: "Chocolate ao leite, Bis e leite condensado.", img: "assets/bis.webp", type: "pizza", prices: { P: 58.00, M: 58.00, G: 58.00 } },
    { id: 53, name: "CONFETE", category: "Pizzas Doces", desc: "Chocolate ao leite, confete e leite condensado.", img: "assets/confete.webp", type: "pizza", prices: { P: 57.00, M: 57.00, G: 57.00 } },
    { id: 54, name: "CHOCOLATE DUPLO", category: "Pizzas Doces", desc: "Chocolate ao leite, chocolate branco e leite condensado.", img: "assets/chocolate_duplo.webp", type: "pizza", prices: { P: 57.00, M: 57.00, G: 57.00 } },
    { id: 55, name: "BRIGADEIRO", category: "Pizzas Doces", desc: "Chocolate ao leite, granulado e leite condensado.", img: "assets/brigadeiro.webp", type: "pizza", prices: { P: 55.00, M: 55.00, G: 55.00 } },
    { id: 56, name: "PRESTÍGIO", category: "Pizzas Doces", desc: "Chocolate ao leite, coco ralado e leite condensado.", img: "assets/prestigio.webp", type: "pizza", prices: { P: 55.00, M: 55.00, G: 55.00 } },
    { id: 57, name: "ROMEU E JULIETA", category: "Pizzas Doces", desc: "Mussarela, goiabada e leite condensado.", img: "assets/romeu_julieta.webp", type: "pizza", prices: { P: 56.00, M: 56.00, G: 56.00 } },
    { id: 58, name: "QUEIJADINHA", category: "Pizzas Doces", desc: "Mussarela, coco ralado e leite condensado.", img: "assets/queijadinha.webp", type: "pizza", prices: { P: 56.00, M: 56.00, G: 56.00 } }
];

const LANCHES = [
    { id: 60, name: "BURGUINHO", category: "Lanches", desc: "Pão, hambúrguer, maionese, mussarela e batata palha.", img: "assets/burguinha.webp", type: "drink", price: 11.00 },
    { id: 61, name: "MISTO", category: "Lanches", desc: "Pão, mussarela e presunto.", img: "assets/misto.webp", type: "drink", price: 11.00 },
    { id: 62, name: "X-BURGUER", category: "Lanches", desc: "Pão, hambúrguer, maionese, mussarela, presunto, milho e batata palha.", img: "assets/xburguer.webp", type: "drink", price: 14.00 },
    { id: 63, name: "X-SALADA", category: "Lanches", desc: "Pão, hambúrguer, maionese, mussarela, alface, tomate, milho e batata palha.", img: "assets/xsalada.webp", type: "drink", price: 17.00 },
    { id: 64, name: "AMERICANO", category: "Lanches", desc: "Pão, maionese, mussarela, presunto, ovo, alface, tomate e batata palha.", img: "assets/americano.webp", type: "drink", price: 15.00 },
    { id: 65, name: "X-EGG", category: "Lanches", desc: "Pão, hambúrguer, maionese, mussarela, presunto, ovo, alface, tomate, milho e batata palha.", img: "assets/xegg.webp", type: "drink", price: 18.00 },
    { id: 66, name: "X-FRANGO", category: "Lanches", desc: "Pão, frango, maionese, mussarela, presunto, alface, tomate, milho e batata palha.", img: "assets/xfrango.webp", type: "drink", price: 21.00 },
    { id: 67, name: "X-FRANGO BACON", category: "Lanches", desc: "Pão, frango, maionese, mussarela, presunto, alface, tomate, bacon e batata palha.", img: "assets/xfrango_bacon.webp", type: "drink", price: 23.00 },
    { id: 68, name: "X-CALAFRANGO", category: "Lanches", desc: "Pão, frango, maionese, mussarela, presunto, alface, tomate, calabresa, milho e batata palha.", img: "assets/xcalafrao.webp", type: "drink", price: 24.00 },
    { id: 69, name: "X-CALABACON", category: "Lanches", desc: "Pão, frango, maionese, mussarela, presunto, alface, tomate, calabresa, bacon, milho e batata palha.", img: "assets/xcalabacon.webp", type: "drink", price: 24.00 },
    { id: 70, name: "X-CALABRESA", category: "Lanches", desc: "Pão, hambúrguer, maionese, mussarela, presunto, alface, tomate, calabresa e batata palha.", img: "assets/xcalabresa.webp", type: "drink", price: 23.00 },
    { id: 71, name: "X-TUDO", category: "Lanches", desc: "Pão, 2 hambúrgueres, maionese, mussarela, presunto, calabresa, alface, tomate, bacon, milho, ovo e batata palha.", img: "assets/xtudo.webp", type: "drink", price: 26.00 },
    { id: 72, name: "X-BAURU", category: "Lanches", desc: "Pão francês, maionese, tomate, presunto, mussarela e orégano.", img: "assets/xbauru.webp", type: "drink", price: 15.00 },
    { id: 73, name: "X-BACON", category: "Lanches", desc: "Pão, hambúrguer, bacon, maionese, mussarela, presunto, alface, tomate, milho e batata palha.", img: "assets/xbacon.webp", type: "drink", price: 21.00 },
    { id: 74, name: "X-BACON EGG", category: "Lanches", desc: "Pão, hambúrguer, bacon, ovo, maionese, mussarela, presunto, milho e batata palha.", img: "assets/xbacon_egg.webp", type: "drink", price: 23.00 },
    { id: 75, name: "X-RANGO", category: "Lanches", desc: "Pão, hambúrguer, bacon, ovo, maionese, mussarela, presunto, milho e batata palha.", img: "assets/xrango.webp", type: "drink", price: 22.00 },
    { id: 76, name: "X-GULOSO", category: "Lanches", desc: "Pão, hambúrguer, maionese, mussarela, frango, presunto, calabresa, bacon, ovo, alface, tomate, catupiry e batata palha.", img: "assets/xguloso.webp", type: "drink", price: 29.00 },
    { id: 77, name: "X-PICANHA SALADA", category: "Lanches", desc: "Pão gourmet, hambúrguer de picanha, queijo prato, alface, tomate, batata palha e maionese.", img: "assets/xpicanha_salada.webp", type: "drink", price: 21.00 },
    { id: 78, name: "X-PICANHA CHEDDAR", category: "Lanches", desc: "Pão gourmet, hambúrguer de picanha, queijo prato, cheddar, batata palha e maionese.", img: "assets/xpicanha_cheddar.webp", type: "drink", price: 25.00 },
    { id: 79, name: "X-PICANHA BACON", category: "Lanches", desc: "Pão gourmet, hambúrguer de picanha, queijo prato, ovo, bacon, batata palha e maionese.", img: "assets/xpicanha_bacon.webp", type: "drink", price: 26.00 },
    { id: 80, name: "X-PICANHA", category: "Lanches", desc: "Pão gourmet, hambúrguer de picanha, queijo prato, batata palha e maionese.", img: "assets/xpicanha.webp", type: "drink", price: 21.00 }
];

const LANCHES_ARTESANAIS = [
    { id: 81, name: "START", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 90g, maionese Heinz, mussarela, alface e tomate.", img: "assets/lanche_start.webp", type: "drink", price: 25.00 },
    { id: 82, name: "FLIP", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 90g, frango empanado, maionese Heinz, mussarela, alface e tomate.", img: "assets/lanche_flip.webp", type: "drink", price: 27.00 },
    { id: 83, name: "PRIME", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 90g, queijo cheddar, bacon, cebola caramelizada, maionese Heinz, alface e tomate.", img: "assets/lanche_prime.webp", type: "drink", price: 30.00 },
    { id: 84, name: "GOURMET BACON", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 150g, farofa de bacon e cheddar fatiado.", img: "assets/lanche_gbacon.webp", type: "drink", price: 28.00 },
    { id: 85, name: "UAI CATUPIRY", category: "Lanches Artesanais", desc: "Pão artesanal, 2 hambúrgueres 90g, queijo prato, ovo, bacon, molho cheddar e catupiry.", img: "assets/lanche_uai.webp", type: "drink", price: 31.00 },
    { id: 86, name: "SALADA CATUPIRY", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 90g, mussarela, catupiry, bacon, cebola, alface e tomate.", img: "assets/lanche_salada_cat.webp", type: "drink", price: 28.00 },
    { id: 87, name: "REI CHEDDAR", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 90g, cheddar empanado, molho barbecue, maionese Heinz, alface e tomate.", img: "assets/lanche_rei_cheddar.webp", type: "drink", price: 28.00 },
    { id: 88, name: "UNIVERSITÁRIO", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 90g, mussarela empanada, bacon, ovo, maionese Heinz, cream cheese, alface e tomate.", img: "assets/lanche_uni.webp", type: "drink", price: 30.00 },
    { id: 89, name: "OSTENTAÇÃO", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 90g, cheddar empanado, bacon, maionese de alho e cream cheese.", img: "assets/lanche_ostentacao.webp", type: "drink", price: 28.00 },
    { id: 90, name: "GOURMET 4 QUEIJOS", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 150g, mussarela, catupiry, cheddar e queijo prato.", img: "assets/lanche_4queijos.webp", type: "drink", price: 31.00 },
    { id: 91, name: "GOURMET", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 150g, maionese Heinz, queijo prato e barbecue.", img: "assets/lanche_gourmet.webp", type: "drink", price: 25.00 },
    { id: 92, name: "GOURMET SALADA", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 150g, maionese Heinz, queijo prato, alface, tomate e barbecue.", img: "assets/lanche_gsalada.webp", type: "drink", price: 28.00 },
    { id: 93, name: "GOURMET ACEBOLADO", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 150g, cebola, bacon, maionese Heinz, queijo prato e barbecue.", img: "assets/lanche_acenbolado.webp", type: "drink", price: 27.00 },
    { id: 94, name: "GOURMET CHEDDAR", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 150g, cheddar, bacon, ovo, maionese Heinz, queijo prato e barbecue.", img: "assets/lanche_gcheddar.webp", type: "drink", price: 28.00 },
    { id: 95, name: "GOURMET CALABRESA", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 150g, queijo prato, tomate, alface, cebola e barbecue.", img: "assets/lanche_gcalabresa.webp", type: "drink", price: 28.00 },
    { id: 96, name: "GOURMET 3 QUEIJOS", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 150g, mussarela, cheddar, queijo prato, tomate, alface, maionese Heinz, cheddar e barbecue.", img: "assets/lanche_3queijos.webp", type: "drink", price: 28.00 },
    { id: 98, name: "GOURMET ESPECIAL", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 150g, cheddar, ovo, queijo prato, calabresa, bacon, cebola, maionese Heinz e barbecue.", img: "assets/lanche_especial.webp", type: "drink", price: 37.00 },
    { id: 99, name: "SMASH DORITOS", category: "Lanches Artesanais", desc: "Pão artesanal, hambúrguer 90g, cheddar, bacon, Doritos e cream cheese.", img: "assets/lanche_smash_doritos.webp", type: "drink", price: 27.00 }
];

const PORCOES_INTEIRA = [
    { id: 100, name: "Batata frita", category: "Porções - Inteira", desc: "Crosta crocante da batata dourada.", img: "assets/porcao_batata.webp", type: "drink", prices: { P: 25.00, G: 30.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } },
    { id: 101, name: "Batata frita completa", category: "Porções - Inteira", desc: "Mussarela, cheddar e bacon.", img: "assets/porcao_batata_completa.webp", type: "drink", prices: { P: 28.00, G: 32.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } },
    { id: 102, name: "Calabresa acebolada", category: "Porções - Inteira", desc: "Calabresa grelhada com cebola caramelizada.", img: "assets/porcao_calabresa.webp", type: "drink", prices: { P: 25.00, G: 30.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } },
    { id: 103, name: "Contra filé acebolado", category: "Porções - Inteira", desc: "Fatias de contra filé com cebola caramelizada.", img: "assets/porcao_contrafilé.webp", type: "drink", prices: { P: 45.00, G: 50.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } },
    { id: 104, name: "Linguiça toscana acebolada", category: "Porções - Inteira", desc: "Linguiça toscana grelhada com cebola caramelizada.", img: "assets/porcao_linguica.webp", type: "drink", prices: { P: 25.00, G: 30.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } },
    { id: 105, name: "Mandioca frita", category: "Porções - Inteira", desc: "Mandioca crocante e dourada.", img: "assets/porcao_mandioca.webp", type: "drink", prices: { P: 25.00, G: 30.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } }
];

const PORCOES_MEIA = [
    { id: 106, name: "½ Batata frita com calabresa acebolada", category: "Porções - Meia", desc: "Combinação de batata frita e calabresa.", img: "assets/porcao_meia1.webp", type: "drink", prices: { P: 28.00, G: 32.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } },
    { id: 107, name: "½ Batata frita completa com mandioca", category: "Porções - Meia", desc: "Batata frita completa com mandioca frita.", img: "assets/porcao_meia2.webp", type: "drink", prices: { P: 28.00, G: 32.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } },
    { id: 108, name: "½ Batata f. comp. c/ contra filé acebolado", category: "Porções - Meia", desc: "Batata frita completa com contra filé.", img: "assets/porcao_meia3.webp", type: "drink", prices: { P: 38.00, G: 40.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } },
    { id: 109, name: "½ Mandioca c/ calabresa acebolada", category: "Porções - Meia", desc: "Mandioca frita com calabresa.", img: "assets/porcao_meia4.webp", type: "drink", prices: { P: 28.00, G: 30.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } },
    { id: 110, name: "½ Linguiça toscana c/ contra filé acebolado", category: "Porções - Meia", desc: "Linguiça toscana com contra filé.", img: "assets/porcao_meia5.webp", type: "drink", prices: { P: 40.00, G: 45.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } },
    { id: 111, name: "½ Mandioca c/ contra filé acebolado", category: "Porções - Meia", desc: "Mandioca frita com contra filé.", img: "assets/porcao_meia6.webp", type: "drink", prices: { P: 35.00, G: 40.00 }, options: { P: { label: "P", sub: "" }, G: { label: "G", sub: "" } } }
];

const ESFIHAS_SALGADAS = [
    { id: 120, name: "FRANGO", category: "Esfihas Salgadas", desc: "Frango e mussarela.", img: "assets/esfihas_frango.webp", type: "drink", price: 5.00 },
    { id: 121, name: "FRANGO C/ CATUPIRY", category: "Esfihas Salgadas", desc: "Frango e catupiry.", img: "assets/esfihas_frango_catupiry.webp", type: "drink", price: 5.00 },
    { id: 122, name: "FRANGO C/ CHEDDAR", category: "Esfihas Salgadas", desc: "Frango e cheddar.", img: "assets/esfihas_frango_cheddar.webp", type: "drink", price: 5.00 },
    { id: 123, name: "FRANGO C/ CATUPIRY E MUSSARELA", category: "Esfihas Salgadas", desc: "Frango, catupiry e mussarela.", img: "assets/esfihas_frango_catupiry_muss.webp", type: "drink", price: 5.00 },
    { id: 124, name: "CALABRESA", category: "Esfihas Salgadas", desc: "Calabresa.", img: "assets/esfihas_calabresa.webp", type: "drink", price: 5.00 },
    { id: 125, name: "CALABRESA C/ CATUPIRY", category: "Esfihas Salgadas", desc: "Calabresa e catupiry.", img: "assets/esfihas_calabresa_catupiry.webp", type: "drink", price: 5.00 },
    { id: 126, name: "CALABRESA C/ CHEDDAR", category: "Esfihas Salgadas", desc: "Calabresa e cheddar.", img: "assets/esfihas_calabresa_cheddar.webp", type: "drink", price: 5.00 },
    { id: 127, name: "PEPPERONI", category: "Esfihas Salgadas", desc: "Pepperoni e mussarela.", img: "assets/esfihas_pepperoni.webp", type: "drink", price: 5.00 },
    { id: 128, name: "PEPPERONI C/ CHEDDAR", category: "Esfihas Salgadas", desc: "Pepperoni e cheddar.", img: "assets/esfihas_pepperoni_cheddar.webp", type: "drink", price: 5.00 },
    { id: 129, name: "BRÓCOLIS", category: "Esfihas Salgadas", desc: "Brócolis, bacon e alho.", img: "assets/esfihas_brocolis.webp", type: "drink", price: 5.00 },
    { id: 130, name: "ATUM", category: "Esfihas Salgadas", desc: "Atum.", img: "assets/esfihas_atum.webp", type: "drink", price: 5.00 },
    { id: 131, name: "ATUM C/ BACON", category: "Esfihas Salgadas", desc: "Atum e bacon.", img: "assets/esfihas_atum_bacon.webp", type: "drink", price: 5.00 },
    { id: 132, name: "CARNE", category: "Esfihas Salgadas", desc: "Carne e tomate.", img: "assets/esfihas_carne.webp", type: "drink", price: 5.00 },
    { id: 133, name: "CARNE C/ BACON E TOMATE", category: "Esfihas Salgadas", desc: "Carne, bacon e tomate.", img: "assets/esfihas_carne_bacon.webp", type: "drink", price: 5.00 },
    { id: 134, name: "BAURU", category: "Esfihas Salgadas", desc: "Queijo, presunto e tomate.", img: "assets/esfihas_bauru.webp", type: "drink", price: 5.00 },
    { id: 135, name: "MUSSARELA", category: "Esfihas Salgadas", desc: "Mussarela.", img: "assets/esfihas_mussarela.webp", type: "drink", price: 5.00 },
    { id: 136, name: "4 QUEIJOS", category: "Esfihas Salgadas", desc: "Mussarela, provolone, parmesão e catupiry.", img: "assets/esfihas_4queijos.webp", type: "drink", price: 5.00 },
    { id: 137, name: "4 QUEIJOS C/ CHEDDAR", category: "Esfihas Salgadas", desc: "Mussarela, provolone, parmesão e cheddar.", img: "assets/esfihas_4queijos_cheddar.webp", type: "drink", price: 5.00 },
    { id: 138, name: "4 QUEIJOS C/ BACON", category: "Esfihas Salgadas", desc: "Mussarela, provolone, parmesão e bacon.", img: "assets/esfihas_4queijos_bacon.webp", type: "drink", price: 5.00 },
    { id: 139, name: "OPÇÃO LIGHT", category: "Esfihas Salgadas", desc: "Palmito e mussarela.", img: "assets/esfihas_light.webp", type: "drink", price: 5.00 },
    { id: 140, name: "PALMITO ESPECIAL", category: "Esfihas Salgadas", desc: "Palmito, queijo e milho.", img: "assets/esfihas_palmito.webp", type: "drink", price: 5.00 },
    { id: 141, name: "COMBO DE 10 ESFIHAS", category: "Esfihas Salgadas", desc: "Escolha 10 esfihas de sua preferência. (Combo de 10 esfihas: R$ 40,00)", img: "assets/esfihas_combo.webp", type: "drink", price: 40.00 }
];

const ESFIHAS_DOCES = [
    { id: 142, name: "CHOCOLATE COM GRANULADO OU CONFETE", category: "Esfihas Doces", desc: "Chocolate com granulado ou confete.", img: "assets/esfihas_doces_chocolate.webp", type: "drink", price: 7.00 },
    { id: 143, name: "PRESTÍGIO", category: "Esfihas Doces", desc: "Chocolate, coco ralado e leite condensado.", img: "assets/esfihas_doces_prestigio.webp", type: "drink", price: 7.00 },
    { id: 144, name: "DOCES DE LEITE", category: "Esfihas Doces", desc: "Queijo, doce de leite e leite condensado.", img: "assets/esfihas_doces_docedeleite.webp", type: "drink", price: 7.00 },
    { id: 145, name: "CHOCOLATE DUO", category: "Esfihas Doces", desc: "Chocolate preto e branco.", img: "assets/esfihas_doces_duo.webp", type: "drink", price: 7.00 },
    { id: 146, name: "QUEIJADINHA", category: "Esfihas Doces", desc: "Queijo, coco ralado e leite condensado.", img: "assets/esfihas_doces_queijadinha.webp", type: "drink", price: 7.00 },
    { id: 147, name: "ROMEU E JULIETA", category: "Esfihas Doces", desc: "Queijo, goiabada e leite condensado.", img: "assets/esfihas_doces_romeu.webp", type: "drink", price: 7.00 },
    { id: 148, name: "CHOCOLATE COM AMENDOIM", category: "Esfihas Doces", desc: "Chocolate com amendoim.", img: "assets/esfihas_doces_amendoim.webp", type: "drink", price: 7.00 },
    { id: 149, name: "COMBO DE 10 ESFIHAS DOCES", category: "Esfihas Doces", desc: "Escolha 10 esfihas doces de sua preferência. (Combo de 10 esfihas: R$ 40,00)", img: "assets/esfihas_doces_combo.webp", type: "drink", price: 40.00 }
];

const BEBIDAS = [
    {
        id: 150, name: "Coca-Cola", category: "Bebidas", desc: "A bebida mais famosa do mundo.",
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
        id: 151, name: "Guaraná Antarctica", category: "Bebidas", desc: "O sabor do Brasil.",
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
        id: 152, name: "Fanta Laranja 2L", category: "Bebidas", desc: "Muito mais sabor.",
        img: "assets/fanta.webp",
        type: "drink", price: 13.90
    },
    {
        id: 153, name: "Água Mineral", category: "Bebidas", desc: "Refrescância pura.",
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

const COMBOS = [
    {
        id: "individual",
        name: "Combo Individual",
        badge: "Individual",
        desc: "A simplicidade que conquista no primeiro pedaço. 🍕\nPizza na lenha, massa artesanal + refri gelado,\ncombinação perfeita!",
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
        desc: "Na medida! nem muito, nem pouco! 🍕💕\nPizza na lenha, massa artesanal e sabor sem igual!",
        itens: ["Pizza 25cm · 6 fatias", "Refrigerante 1L", "Borda recheada já inclusa: catupiry, cheddar, chocolate ou mussarela"],
        price: 75.90,
        obs: "Válido para pizzas tradicionais, exceto Carne Seca e Atum.",
        img: "assets/combocasal.webp",
        type: "combo"
    },
    {
        id: "familia",
        name: "Combo Família",
        badge: "Família",
        desc: "Combo Família que resolve! 👨‍👩‍👧‍👦\nPizza na lenha, massa artesanal e sabor incomparável!",
        itens: ["Pizza 35cm · 10 fatias", "Refrigerante 2L (Fanta ou Guaraná Antarctica)"],
        price: 89.90,
        obs: "Válido para pizzas tradicionais, exceto Carne Seca e Atum.",
        img: "assets/combofamilia2.webp",
        type: "combo"
    },
    {
        id: "perfeito",
        name: "Combo Perfeito",
        badge: "Perfeito",
        desc: "Experiência completa 🍕✨\nNa lenha, massa artesanal. Não fique na vontade! 😋",
        itens: ["Pizza 35cm · 10 fatias", "Pizza doce 25cm · 4 fatias", "Refrigerante 2L (Fanta ou Guaraná Antarctica)"],
        price: 115.90,
        obs: "Válido para pizzas tradicionais, exceto Carne Seca e Atum.",
        img: "assets/comboperfeito2.webp",
        type: "combo"
    }
];

const TRADITIONAL_SABORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
const SWEET_SABORES = [50, 51, 52, 53, 54, 55, 56, 57, 58];

const ALL_PIZZA_FLAVORS = [...PIZZAS_SALGADAS, ...PIZZAS_ESPECIAIS, ...PIZZAS_DOCES];

// ESTRUTURA DE CATEGORIAS
const CATEGORIES = [
    { id: 'combos', label: '🔥 Combos', items: COMBOS, type: 'combo' },
    { id: 'salgadas', label: 'Pizzas Salgadas', items: PIZZAS_SALGADAS },
    { id: 'especiais', label: 'Pizzas Especiais', items: PIZZAS_ESPECIAIS },
    { id: 'meio-a-meio', label: 'Monte sua Pizza (Meio a Meio)', items: [{ id: 'meio-a-meio-card' }], type: 'half' },
    { id: 'doces', label: 'Pizzas Doces', items: PIZZAS_DOCES },
    { id: 'lanches', label: 'Lanches', items: LANCHES, type: 'drink' },
    { id: 'lanches_artesanais', label: 'Lanches Artesanais', items: LANCHES_ARTESANAIS, type: 'drink' },
    { id: 'porcoes_inteira', label: 'Porções - Inteira', items: PORCOES_INTEIRA, type: 'drink' },
    { id: 'porcoes_meia', label: 'Porções - Meia', items: PORCOES_MEIA, type: 'drink' },
    { id: 'esfihas_sal', label: 'Esfihas Salgadas', items: ESFIHAS_SALGADAS, type: 'drink' },
    { id: 'esfihas_doces', label: 'Esfihas Doces', items: ESFIHAS_DOCES, type: 'drink' },
    { id: 'bebidas', label: 'Bebidas', items: BEBIDAS, type: 'drink' }
];

// Cálculo da largura da scrollbar para evitar saltos de layout
const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;
document.documentElement.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);

// ENTREGA
// A taxa de entrega da Sanja é confirmada pela equipe conforme o endereço/localização.

// ==========================================
// 2. ESTADO DA APLICAÇÃO (STATE)
// ==========================================
let cart = [];
let checkoutData = {
    name: '',
    phone: '',
    address: '',
    location: null,
    paymentMethod: ''
};

// ==========================================
// 3. STORAGE E FUNÇÕES AUXILIARES
// ==========================================
const loadCart = () => {
    try {
        const saved = localStorage.getItem('sanja-pizzaria-cart');
        if (saved) cart = JSON.parse(saved);
        updateCartUI();
    } catch (e) { console.warn("LocaleStorage unavailable"); }
};

const saveCart = () => {
    try { localStorage.setItem('sanja-pizzaria-cart', JSON.stringify(cart)); } catch (e) { }
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
// A taxa de entrega é confirmada pela Sanja conforme a localização.
const getDeliveryFee = () => 0;

// ==========================================
// 5. RENDERIZAÇÃO DE UI
// ==========================================

// --- RENDERIZAR TABS DE CATEGORIA ---
const CATEGORY_NAV = [
    { id: 'combos', label: 'Combos', icon: 'combos.webp', target: 'combos', includes: ['combos'] },
    { id: 'pizzas', label: 'Pizzas', icon: 'pizza2.webp', target: 'salgadas', includes: ['salgadas', 'especiais', 'doces'] },
    { id: 'meio-a-meio', label: 'Meio a Meio', icon: 'meioameio.webp', target: 'meio-a-meio', includes: ['meio-a-meio'] },
    { id: 'lanches', label: 'Lanches', icon: 'lanche.webp', target: 'lanches', includes: ['lanches', 'lanches_artesanais'] },
    { id: 'porcoes', label: 'Porções', icon: 'fritas.webp', target: 'porcoes_inteira', includes: ['porcoes_inteira', 'porcoes_meia'] },
    { id: 'esfihas', label: 'Esfihas', icon: 'esfiha.webp', target: 'esfihas_sal', includes: ['esfihas_sal', 'esfihas_doces'] },
    { id: 'bebidas', label: 'Bebidas', icon: 'bebidas.webp', target: 'bebidas', includes: ['bebidas'] }
];

const renderCategoryButtons = () => {
    const container = document.getElementById('categories-bar-scrolling');
    container.innerHTML = CATEGORY_NAV.map((cat, index) => `
        <button class="category-tab ${index === 0 ? 'active' : ''}"
            data-category="${cat.id}"
            onclick="scrollToCategory('${cat.target}')">
            <span class="category-icon-wrap">
                <img class="category-icon" src="assets/category-icons/${cat.icon}" alt="" aria-hidden="true" width="128" height="128" decoding="async">
            </span>
            <span class="category-label">${cat.label}</span>
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

function scrollToHero() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function scrollToFooter() {
    const footer = document.getElementById('contato');
    if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- RENDERIZAR CARDS ---
// --- RENDERIZAR CARDS COMPACTOS ---
const getCardImageSrc = (src) => {
    if (!src || !src.startsWith('assets/') || src.includes('/')) return src;
    return src.replace('assets/', 'assets/thumbs/');
};

const renderPizzaCard = (pizza) => {
    const card = document.createElement('div');
    card.className = "flex items-center gap-4 p-4 bg-white border border-red-100 rounded-3xl shadow-sm hover:shadow-md hover:border-red-200 transition-[transform,box-shadow,border-color] duration-300 cursor-pointer group relative z-10";
    card.onclick = () => openProductModal(pizza);

    const minPrice = Math.min(...Object.values(pizza.prices));

    card.innerHTML = `
        <div class="flex-1 min-w-0">
            <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors uppercase truncate">${pizza.name}</h3>
            <p class="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed pr-2">${pizza.desc}</p>
            <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">A partir de</span>
                <span class="text-base font-bold text-red-600">${formatCurrency(minPrice)}</span>
            </div>
        </div>
        <div class="pizza-img-container">
            <img src="${getCardImageSrc(pizza.img)}" alt="${pizza.name}" width="100" height="100" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                 onerror="this.src='assets/thumbs/logosemfundo.webp'">
        </div>
    `;
    return card;
};

const renderDrinkCard = (drink) => {
    const card = document.createElement('div');
    card.className = "flex items-center gap-4 p-4 bg-white border border-red-100 rounded-3xl shadow-sm hover:shadow-md hover:border-red-200 transition-[transform,box-shadow,border-color] duration-300 cursor-pointer group relative z-10";
    card.onclick = () => openProductModal(drink);

    const hasVariations = drink.prices && typeof drink.prices === 'object';
    const minPrice = hasVariations ? Math.min(...Object.values(drink.prices)) : drink.price;

    card.innerHTML = `
        <div class="flex-1 min-w-0">
            <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors uppercase truncate">${drink.name}</h3>
            <p class="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed pr-2">${drink.desc}</p>
            <div class="flex items-center gap-2">
                ${hasVariations ? '<span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">A partir de</span>' : ''}
                <span class="text-base font-bold text-red-600">${formatCurrency(minPrice)}</span>
            </div>
        </div>
        <div class="pizza-img-container">
            <img src="${getCardImageSrc(drink.img)}" alt="${drink.name}" width="100" height="100" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                 onerror="this.src='assets/thumbs/logosemfundo.webp'">
        </div>
    `;
    return card;
};

const renderComboCard = (combo) => {
    const card = document.createElement('div');
    card.className = "flex items-center gap-4 p-4 bg-red-50/20 border-2 border-red-200 rounded-3xl shadow-sm hover:shadow-md hover:border-red-500 transition-[transform,box-shadow,border-color] duration-300 cursor-pointer group relative z-10";
    card.onclick = () => openComboModal(combo);

    const itemsHtml = combo.itens.map(item => `
        <li class="flex items-start gap-1.5 text-xs text-gray-600 font-medium">
            <i data-lucide="check" class="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0"></i>
            <span class="leading-tight">${item}</span>
        </li>
    `).join('');

    card.innerHTML = `
        <div class="flex-1 min-w-0">
            <div class="mb-2">
                <span class="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide inline-block">${combo.badge}</span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors uppercase truncate">${combo.name}</h3>
            <p class="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed pr-2">${combo.desc}</p>
            <ul class="mb-4 space-y-1.5">
                ${itemsHtml}
            </ul>
            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                    <span class="text-lg sm:text-xl font-bold text-red-600">${formatCurrency(combo.price)}</span>
                </div>
                <span class="text-[10px] sm:text-xs text-gray-400 leading-tight">${combo.obs}</span>
            </div>
        </div>
        <div class="pizza-img-container shadow-inner">
            <img src="${getCardImageSrc(combo.img)}" alt="${combo.name}" width="100" height="100" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                 onerror="this.src='assets/thumbs/logosemfundo.webp'">
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

    grid.innerHTML = ALL_PIZZA_FLAVORS.map(pizza => {
        const isSelected1 = halfPizzaState.flavor1 && halfPizzaState.flavor1.id === pizza.id;
        const isSelected2 = halfPizzaState.flavor2 && halfPizzaState.flavor2.id === pizza.id;
        const isSelected = isSelected1 || isSelected2;
        const selectionIndex = isSelected1 ? 0 : (isSelected2 ? 1 : -1);
        const overlayText = selectionIndex === 0 ? '1º SABOR' : '2º SABOR';

        return `
            <button type="button" onclick="selectFlavor(${pizza.id})" id="flavor-card-${pizza.id}"
                class="flavor-card ${isSelected ? (selectionIndex === 0 ? 'selected-1' : 'selected-2') : ''} border rounded-xl overflow-hidden cursor-pointer text-left transition-all">
                <div class="flavor-card-img-container h-24 sm:h-28 w-full bg-gray-50 overflow-hidden relative">
                    <img src="${getCardImageSrc(pizza.img)}" alt="${pizza.name}" width="224" height="224" loading="lazy" decoding="async" class="flavor-card-img w-full h-full object-cover" onerror="this.src='assets/thumbs/logosemfundo.webp'">
                </div>
                <div class="flavor-card-body p-3 relative">
                    <div class="flavor-card-content">
                        <span class="flavor-card-name text-sm font-bold text-gray-800 line-clamp-1 block uppercase">${pizza.name}</span>
                        <span class="flavor-card-desc text-xs text-gray-500 line-clamp-2 block mt-1 leading-snug">${pizza.desc}</span>
                    </div>
                    <!-- Bottom-up selection overlay (tarja) -->
                    <div class="flavor-card-selection-overlay ${isSelected ? 'active' : ''} ${selectionIndex === 0 ? 'selected-1' : 'selected-2'}">
                        <span class="text-xs font-bold text-white">
                            ${overlayText}
                        </span>
                    </div>
                </div>
            </button>
        `;
    }).join('');

    // Re-aplicar seleções visuais se existirem
    syncHalfVisuals();
}

function syncHalfVisuals() {
    document.querySelectorAll('.flavor-card').forEach(c => {
        c.classList.remove('selected-1', 'selected-2');
        const overlay = c.querySelector('.flavor-card-selection-overlay');
        if (overlay) {
            overlay.classList.remove('active', 'selected-1', 'selected-2');
        }
    });

    if (halfPizzaState.flavor1) {
        const el = document.getElementById(`flavor-card-${halfPizzaState.flavor1.id}`);
        if (el) {
            el.classList.add('selected-1');
            const overlay = el.querySelector('.flavor-card-selection-overlay');
            if (overlay) {
                overlay.classList.add('active', 'selected-1');
                const span = overlay.querySelector('span');
                if (span) span.textContent = '1º SABOR';
            }
        }
    }
    if (halfPizzaState.flavor2) {
        const el = document.getElementById(`flavor-card-${halfPizzaState.flavor2.id}`);
        if (el) {
            el.classList.add('selected-2');
            const overlay = el.querySelector('.flavor-card-selection-overlay');
            if (overlay) {
                overlay.classList.add('active', 'selected-2');
                const span = overlay.querySelector('span');
                if (span) span.textContent = '2º SABOR';
            }
        }
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
    border: null // catupiry, cheddar, chocolate ou mussarela
};

const COMBO_BORDER_SIZES = {
    individual: 'M',
    casal: 'M',
    familia: 'G',
    perfeito: 'G'
};
const COMBO_BORDER_IMAGES = {
    catupiry: 'assets/catupiry.webp',
    cheddar: 'assets/cheddar.webp',
    chocolate: 'assets/chocolate.webp'
};

function getComboBorderPrice() {
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
            <div class="flex items-center gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-gray-900 shadow-none">
                <i data-lucide="check-circle" class="w-5 h-5 text-gray-900 shrink-0 stroke-[2]"></i>
                <span class="text-sm font-bold text-gray-900">${item}</span>
            </div>
        `).join('');

        content.innerHTML = `
            <div class="animate-in fade-in duration-200">
                <div class="relative h-56 sm:h-60 w-full bg-gray-100 overflow-hidden shrink-0">
                    <img src="${currentCombo.img}" alt="${currentCombo.name}" class="w-full h-full object-cover" onerror="this.src='assets/thumbs/logosemfundo.webp'">
                </div>

                <div class="px-6 py-5 sm:px-7 sm:py-6 space-y-4">
                    <div>
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-wide font-serif mb-2 uppercase">${currentCombo.name}</h3>
                        <p class="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line">${currentCombo.desc}</p>
                    </div>

                    <div>
                        <span class="text-xs font-normal text-gray-700 uppercase tracking-wider block mb-3">O QUE ESTÁ INCLUSO?</span>
                        <div class="space-y-2.5">
                            ${itemsHtml}
                        </div>
                    </div>

                    ${currentCombo.obs ? `
                        <div class="pt-1">
                            <p class="text-[11px] text-gray-400 italic">${currentCombo.obs}</p>
                        </div>
                    ` : ''}
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
            <div class="animate-in fade-in slide-in-from-right-4 duration-300 p-5 sm:p-6">
                <div class="text-center mb-5">
                    <div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <i data-lucide="pizza" class="h-6 w-6"></i>
                    </div>
                    <h4 class="text-lg sm:text-xl font-bold uppercase tracking-tight text-gray-900 font-serif">Personalize sua pizza</h4>
                    <p class="mt-1 text-xs sm:text-sm leading-relaxed text-gray-500">Escolha uma borda recheada para deixar seu combo ainda mais especial.</p>
                </div>
                <div class="rounded-2xl border border-red-100 bg-red-50/50 p-4 sm:p-5 shadow-sm">
                    <p class="mb-3 text-center text-xs font-bold uppercase tracking-wider text-red-700">Borda recheada (opcional)</p>
                    <div class="space-y-2.5">
                        ${BORDAS.map(border => {
                            const isSelected = comboSelections.border === border.id;
                            const priceLabel = `+ ${formatCurrency(border.prices[comboBorderSize])}`;
                            const image = COMBO_BORDER_IMAGES[border.id];
                            const borderName = border.id === 'sem_borda'
                                ? 'Sem borda'
                                : `Borda de ${border.name}`;

                            return `
                                <button type="button" onclick="selectComboBorder('${border.id}')"
                                    class="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-left transition-all cursor-pointer ${isSelected ? 'border-red-500 bg-red-50 shadow-sm' : 'border-gray-200 hover:border-red-300'}">
                                    <span class="flex min-w-0 flex-col">
                                        <span class="text-xs sm:text-sm font-bold text-gray-800">${borderName}</span>
                                        ${border.id !== 'sem_borda' ? `<span class="mt-0.5 text-[11px] font-bold text-red-600">${priceLabel}</span>` : ''}
                                    </span>
                                    ${image ? `<img src="${image}" alt="${border.name}" class="h-10 w-14 rounded-lg object-cover" loading="lazy">` : '<span class="flex h-10 w-14 items-center justify-center rounded-lg bg-gray-100 text-[10px] font-bold text-gray-400">Sem borda</span>'}
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
            gridTitle = currentCombo.id === 'perfeito' ? "Escolha a pizza salgada" : "Escolha o sabor da pizza";
            flavorList = ALL_PIZZA_FLAVORS.filter(p => TRADITIONAL_SABORES.includes(p.id));

            nextText.textContent = "Próximo";
            nextIcon.setAttribute('data-lucide', 'arrow-right');
        }

        const flavorsHtml = flavorList.map(pizza => {
                    const isSelected = isPerfeitoStep2
                        ? comboSelections.sweetFlavor === pizza.id
                        : comboSelections.flavors.includes(pizza.id);

                    const selectionIndex = comboSelections.flavors.indexOf(pizza.id);
                    const isFirstSelection = selectionIndex === 0;
                    const overlayText = (['casal', 'familia'].includes(currentCombo.id) || (currentCombo.id === 'perfeito' && !isPerfeitoStep2))
                        ? (isFirstSelection ? '1º SABOR' : '2º SABOR')
                        : 'Sabor Escolhido';

                    return `
                         <button type="button" data-flavor-id="${pizza.id}" data-sweet="${isPerfeitoStep2}"
                             class="flavor-card ${isSelected ? (selectionIndex === 0 ? 'selected-1' : 'selected-2') : ''} border rounded-xl overflow-hidden cursor-pointer text-left transition-all">
                            <div class="flavor-card-img-container h-24 sm:h-28 w-full bg-gray-50 overflow-hidden relative">
                                <img src="${getCardImageSrc(pizza.img)}" alt="${pizza.name}" width="224" height="224" loading="lazy" decoding="async" class="flavor-card-img w-full h-full object-cover" onerror="this.src='assets/thumbs/logosemfundo.webp'">
                            </div>
                            <div class="flavor-card-body p-3 relative">
                                <div class="flavor-card-content">
                                    <span class="flavor-card-name text-sm font-bold text-gray-800 line-clamp-1 block uppercase">${pizza.name}</span>
                                    <span class="flavor-card-desc text-xs text-gray-500 line-clamp-2 block mt-1 leading-snug">${pizza.desc}</span>
                                </div>
                                <!-- Bottom-up selection overlay -->
                                <div class="flavor-card-selection-overlay ${isSelected ? 'active' : ''} ${selectionIndex === 0 ? 'selected-1' : 'selected-2'}">
                                    <span class="text-xs font-bold text-white">
                                        ${overlayText}
                                    </span>
                                </div>
                            </div>
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
                        <div class="mt-5">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block text-center sm:text-left">ESCOLHA O REFRIGERANTE (${drinkSize})</label>
                            <div style="display: grid; grid-template-columns: ${isCasal ? '1fr' : '1fr 1fr'}; gap: 0.75rem;">
                                ${(isCasal ? ['Guaraná'] : ['Fanta', 'Guaraná']).map(d => {
                        const dId = d.toLowerCase();
                        const isSelected = comboSelections.drink === dId;
                        return `
                                        <button type="button" onclick="selectComboDrink('${dId}')"
                                                class="p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer
                                                ${isSelected ? 'border-red-500 bg-red-50 text-red-700 font-bold' : 'border-gray-200 text-gray-600 hover:border-red-200'}>
                                            <span class="text-xs sm:text-sm">${d}</span>
                                            <span class="text-[10px] opacity-60 font-normal mt-0.5">${drinkLabel}</span>
                                        </button>
                                    `;
                    }).join('')}
                            </div>
                        </div>
                    `;
                }

                content.innerHTML = `
                    <div class="animate-in fade-in duration-200 p-4 sm:p-6">
                        <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">${gridTitle}</h4>
                        <div class="grid grid-cols-1 gap-3">
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
    const isTwoFlavorCombo = ['casal', 'familia'].includes(currentCombo.id) || (currentCombo.id === 'perfeito' && !isSweet);

    document.querySelectorAll('#combo-modal-content .flavor-card').forEach(card => {
        card.classList.remove('selected-1', 'selected-2');
        // Also remove active from overlays
        const overlay = card.querySelector('.flavor-card-selection-overlay');
        if (overlay) overlay.classList.remove('active', 'selected-1', 'selected-2');
    });

    comboSelections.flavors.forEach((flavorId, index) => {
        const flavorCards = document.querySelectorAll('#combo-modal-content .flavor-card');
        const card = [...flavorCards].find(item => Number(item.dataset.flavorId) === flavorId);
        if (card) {
            card.classList.add(index === 0 ? 'selected-1' : 'selected-2');
            // Add active to overlay and update text
            const overlay = card.querySelector('.flavor-card-selection-overlay');
            if (overlay) {
                overlay.classList.add('active', index === 0 ? 'selected-1' : 'selected-2');
                const span = overlay.querySelector('span');
                if (span) {
                    span.textContent = isTwoFlavorCombo ? (index === 0 ? '1º SABOR' : '2º SABOR') : 'Sabor Escolhido';
                }
            }
        }
    });

    if (isSweet && comboSelections.sweetFlavor) {
        const sweetCard = [...document.querySelectorAll('#combo-modal-content .flavor-card')]
            .find(card => Number(card.dataset.flavorId) === comboSelections.sweetFlavor);
        if (sweetCard) {
            sweetCard.classList.add('selected-1');
            const overlay = sweetCard.querySelector('.flavor-card-selection-overlay');
            if (overlay) overlay.classList.add('active', 'selected-1');
        }
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
        modalImg.src = 'assets/thumbs/logosemfundo.webp';
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
            M: { label: 'Média', size: '25cm' },
            G: { label: 'Grande', size: '35cm' }
        };

        const sizesGrid = document.getElementById('modal-sizes-grid');
        sizesGrid.innerHTML = Object.keys(sizes).map(size => `
            <button type="button" class="modal-size-btn p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${size === 'M' ? 'border-red-500 bg-red-50 text-red-700 font-bold' : 'border-gray-200 text-gray-500'}"
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
            <button type="button" class="modal-size-btn p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${key === currentModalSize ? 'border-red-500 bg-red-50 text-red-700 font-bold' : 'border-gray-200 text-gray-500'}"
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
    modal.classList.remove('hidden');
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
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.classList.remove('modal-open');
    }
}

function setModalSize(size) {
    currentModalSize = size;
    document.querySelectorAll('.modal-size-btn').forEach(btn => {
        btn.classList.remove('border-red-500', 'bg-red-50', 'text-red-700', 'font-bold');
        btn.classList.add('border-gray-200', 'text-gray-500');
    });
    const selectedBtn = document.getElementById(`size-btn-${size}`);
    if (selectedBtn) {
        selectedBtn.classList.add('border-red-500', 'bg-red-50', 'text-red-700', 'font-bold');
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

        const sizesNames = { M: 'Média', G: 'Grande' };

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
    card.className = "half-card-full bg-red-600 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 text-white cursor-pointer hover:bg-red-700 transition-all shadow-xl relative overflow-hidden group";
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
        <div class="relative z-10 bg-white text-red-600 p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg group-hover:scale-105 transition-transform">
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
        title.className = "text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-red-500 inline-block";
        title.textContent = cat.label;
        section.appendChild(title);

        // Grid específico para meio a meio (full width no desktop)
        let gridClassName = "grid grid-cols-1 md:grid-cols-2 gap-4";
        if (cat.type === 'half') {
            gridClassName = "grid grid-cols-1 gap-4"; // Full width para meio a meio
        }
        const grid = document.createElement('div');
        grid.className = gridClassName;

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

    if (window.lucide) lucide.createIcons({ root: container });
};




// ==========================================
// 6. UI DO CARRINHO (DRAWER)
// ==========================================
function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = getCartTotal();
    const deliveryFee = getDeliveryFee();

    // Badges
    const badges = [document.getElementById('cart-fab-badge')];
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
                    <span class="font-bold text-sm text-red-600">${formatCurrency(item.price * item.quantity)}</span>
                </div>
                <p class="text-xs text-gray-500 mb-2">${item.details}</p>
                ${item.note ? `<p class="text-xs text-green-600 italic mb-3">Obs: ${item.note}</p>` : ''}
                
                <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
                        <button class="px-2 text-gray-500 hover:text-red-600" onclick="updateCartItemQuantity(${i}, -1)">-</button>
                        <span class="text-sm font-bold w-4 text-center">${item.quantity}</span>
                        <button class="px-2 text-gray-500 hover:text-red-600" onclick="updateCartItemQuantity(${i}, 1)">+</button>
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
            <div class="flex justify-between text-gray-500 text-sm mb-1">
                <span>Entrega</span>
                <span>A confirmar</span>
            </div>
            <div class="flex justify-between text-gray-900 font-bold text-lg mt-2 pt-2 border-t border-gray-100">
                <span>Total dos itens</span>
                <span>${formatCurrency(subtotal)}</span>
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
    const checkoutSection = document.getElementById('checkout-section');
    checkoutSection.classList.remove('hidden');
    checkoutSection.classList.add('open');
    document.body.classList.add('modal-open');
    renderCheckoutForm();
}

function closeCheckout() {
    const checkoutSection = document.getElementById('checkout-section');
    checkoutSection.classList.add('hidden');
    checkoutSection.classList.remove('open');
    document.body.classList.remove('modal-open');
}

function captureUserLocation() {
    if (!navigator.geolocation) {
        alert("Seu navegador não suporta localização.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            checkoutData.location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: Math.round(position.coords.accuracy)
            };
            renderCheckoutForm();
        },
        (error) => {
            let message = "Não foi possível obter sua localização.";
            if (error.code === 1) message = "Permita o acesso à localização no navegador para enviar sua posição.";
            if (error.code === 2) message = "Não foi possível determinar sua localização. Tente novamente.";
            if (error.code === 3) message = "A localização demorou para responder. Tente novamente.";
            alert(message);
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

function renderCheckoutForm() {
    const form = document.querySelector('.checkout-form');
    form.innerHTML = `
        <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
            <input type="text" class="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 outline-none" 
                placeholder="Seu nome" value="${checkoutData.name}" oninput="checkoutData.name = this.value">
        </div>
        <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Telefone / WhatsApp</label>
            <input type="tel" class="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 outline-none" 
                placeholder="(XX) XXXXX-XXXX" value="${checkoutData.phone}" oninput="checkoutData.phone = this.value">
        </div>
        <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Endereço de Entrega</label>
            <input type="text" class="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 outline-none" 
                placeholder="Rua, Número, Bairro, Complemento" value="${checkoutData.address}" oninput="checkoutData.address = this.value">
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Localização para entrega</label>
            <p class="text-xs text-gray-500 leading-relaxed mb-3">
                Principalmente para endereços na zona rural, envie sua localização atual para ajudar o entregador a encontrar você.
            </p>
            <button type="button" onclick="captureUserLocation()"
                class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 border-red-500 text-red-600 font-bold hover:bg-red-50 transition-colors ${checkoutData.location ? 'bg-red-50' : 'bg-white'}">
                <i data-lucide="map-pin" class="w-5 h-5"></i>
                <span>${checkoutData.location ? 'Localização capturada ✓' : 'Enviar minha localização atual'}</span>
            </button>
            <p class="text-[11px] text-gray-400 mt-2 text-center">Seu navegador pedirá permissão para acessar sua localização.</p>
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
            <div class="flex justify-between text-gray-600 text-sm mb-1">
                <span>Taxa de entrega</span>
                <span>A confirmar</span>
            </div>
            <div class="flex justify-between text-gray-900 font-bold">
                 <span>Total dos itens:</span>
                 <span id="checkout-total-display">${formatCurrency(getCartTotal())}</span>
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
    if (!checkoutData.name || !checkoutData.phone || !checkoutData.address || !checkoutData.paymentMethod) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const total = getCartTotal() + getDeliveryFee();
    const mapsUrl = checkoutData.location
        ? `https://www.google.com/maps?q=${checkoutData.location.latitude},${checkoutData.location.longitude}`
        : '';

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
    msg += `📦 *Taxa de Entrega:* A confirmar pela Sanja\n`;
    msg += `💰 *TOTAL DOS ITENS: ${formatCurrency(total)}*\n\n`;

    msg += `*--------------------------*\n\n`;

    msg += `*👤 DADOS DE ENTREGA:*\n`;
    msg += `*• Nome:* ${checkoutData.name}\n`;
    msg += `*• Telefone:* ${checkoutData.phone}\n`;
    msg += `*• Endereço:* ${checkoutData.address}\n`;
    msg += checkoutData.location
        ? `*• Localização (GPS):* ${mapsUrl}\n`
        : `*• Localização (GPS):* Não informada\n`;
    msg += `*• Pagamento:* ${checkoutData.paymentMethod}\n\n`;

    msg += `*--------------------------*\n`;
    msg += `_Sanja Pizzaria agradece a preferência!_ 🔥`;

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

    
    const url = `https://api.whatsapp.com/send?phone=553591142433&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}


// ==========================================
// 7.5 DIA FECHADO (SEGUNDA-FEIRA)
// ==========================================
function isClosedToday() {
    return new Date().getDay() === 1; // 0 = domingo, 1 = segunda... (FECHADO ÀS SEGUNDAS)
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

    // Active Category Logic
    const categoriesBar = document.getElementById('categories-bar');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const header = document.getElementById('site-header');
        const categoriesBar = document.getElementById('categories-bar');
        const floatingLogo = document.getElementById('floating-logo');

        // Hero section height (viewport height)
        const heroSection = document.getElementById('inicio');
        const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

        // Hide navbar and logo on scroll down, show only at hero (top)
        if (scrollY > 100 && scrollY > heroHeight * 0.3) {
            // Scrolled past hero - hide navbar and logo
            if (header) header.classList.add('navbar-hidden');
            if (floatingLogo) floatingLogo.classList.add('navbar-hidden');
        } else {
            // At or near hero - show navbar and logo
            if (header) header.classList.remove('navbar-hidden');
            if (floatingLogo) floatingLogo.classList.remove('navbar-hidden');
        }

        // Categories bar style (keep existing)
        if (scrollY > 50) {
            if (categoriesBar) categoriesBar.classList.add('scrolled');
        } else {
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
            const navCategory = CATEGORY_NAV.find(cat => cat.id === btn.dataset.category);
            const isActive = navCategory ? navCategory.includes.includes(currentCat) : false;
            btn.classList.toggle('active', isActive);
        });
    });

    document.getElementById('cta-order-btn').onclick = () => {
        scrollToCategory('combos');
    };

    // --- Animação do CTA sem biblioteca externa ---
    const ctaBtn = document.getElementById('cta-order-btn');
    if (ctaBtn && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        ctaBtn.classList.add('cta-enter');
        ctaBtn.addEventListener('animationend', () => {
            ctaBtn.classList.remove('cta-enter');
            ctaBtn.classList.add('cta-bounce');
        }, { once: true });
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
window.scrollToHero = scrollToHero;
window.scrollToFooter = scrollToFooter;
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

// Combos
window.openComboModal = openComboModal;
window.closeComboModal = closeComboModal;
window.nextComboStep = nextComboStep;
window.prevComboStep = prevComboStep;
window.selectComboBorder = selectComboBorder;
window.selectComboDrink = selectComboDrink;
window.selectComboFlavor = selectComboFlavor;
