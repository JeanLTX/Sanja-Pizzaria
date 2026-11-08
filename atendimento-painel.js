(() => {
'use strict';
const d=window.SANJA_ATENDIMENTO_CATALOGO;if(!d)throw Error('Catálogo da Sanja não carregado.');
const $=id=>document.getElementById(id),money=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sizes={M:'Média · 25 cm · 6 fatias',G:'Grande · 35 cm · 8 fatias'},customPizzaId=d.comboCustomPizzaId;
const allPizzas=[...d.pizzasSalgadas,...d.pizzasDoces],comboSavory=d.pizzasSalgadas.filter(x=>![2,33].includes(x.id)),sweet=d.pizzasDoces;
const products=[
...d.pizzasSalgadas.map(x=>({...x,kind:'pizza',category:'Pizzas salgadas'})),
...d.pizzasDoces.map(x=>({...x,kind:'pizza',category:'Pizzas doces'})),
...d.lanches.map(x=>({...x,kind:'simple',category:'Lanches'})),
...d.lanchesArtesanais.map(x=>({...x,kind:'simple',category:'Lanches artesanais'})),
...d.porcoesInteiras.map(x=>({...x,kind:'variation',category:'Porções inteiras'})),
...d.porcoesMeias.map(x=>({...x,kind:'variation',category:'Porções meia'})),
...d.esfihasSalgadas.map(x=>({...x,kind:x.id===141?'esfihaCombo':'simple',category:x.id===141?'Combos de esfihas':'Esfihas salgadas'})),
...d.esfihasDoces.map(x=>({...x,kind:'simple',category:'Esfihas doces'})),
...d.bebidas.map(x=>({...x,kind:'variation',category:'Bebidas'})),
...d.combos.map(x=>({...x,kind:'combo',category:'Combos'})),
{id:'half-pizza',name:'Pizza meio a meio',category:'Personalizados',desc:'Escolha dois sabores em uma pizza média ou grande.',kind:'half',img:'assets/meioameio.webp'}
];
const CATEGORY_NAV=[
{id:'combos',label:'Combos',icon:'combos.webp',includes:['Combos']},
{id:'pizzas',label:'Pizzas',icon:'pizza2.webp',includes:['Pizzas salgadas','Pizzas doces']},
{id:'meio-a-meio',label:'Meio a Meio',icon:'meioameio.webp',includes:['Personalizados']},
{id:'lanches',label:'Lanches',icon:'lanche.webp',includes:['Lanches','Lanches artesanais']},
{id:'porcoes',label:'Porções',icon:'fritas.webp',includes:['Porções inteiras','Porções meia']},
{id:'esfihas',label:'Esfihas',icon:'esfiha.webp',includes:['Esfihas salgadas','Esfihas doces','Combos de esfihas']},
{id:'bebidas',label:'Bebidas',icon:'bebidas.webp',includes:['Bebidas']}
];
let activeCategory='all';
const esfihaVariants=[...d.esfihasSalgadas,...d.esfihasDoces].filter(x=>![141,149].includes(x.id)).flatMap(x=>x.id===142?[{...x,key:'142-granulado',name:'Chocolate com granulado',choice:'Granulado'},{...x,key:'142-confete',name:'Chocolate com confete',choice:'Confete'}]:[{...x,key:String(x.id),choice:null}]);
let selected=null,cfg=null,cart=[],receiving='delivery',justAddedKey='',submissionId=null,submissionPayload=null,savedOrder=null;
function initial(p){return {size:p.kind==='half'?'G':'M',border:'sem_borda',choice:'',optionKey:p.prices&&p.options?Object.keys(p.prices)[0]:'',ingredients:[],halfFlavors:['',''],halfIngredients:[[],[]],comboFlavors:['',''],comboSweet:'',comboDrink:'',comboIngredients:[],esfihaCounts:{}}}
function priceStart(p){if(p.kind==='combo')return p.price;if(p.kind==='esfihaCombo')return d.esfihaComboPrice;if(p.kind==='half')return null;if(p.type==='pizza')return Math.min(p.prices.M,p.prices.G);if(p.prices)return Math.min(...Object.values(p.prices));return p.price}
function renderCategories(){
const all='<button type="button" class="category-tab category-tab-all '+(activeCategory==='all'?'active':'')+'" data-category="all" aria-pressed="'+(activeCategory==='all')+'">Todas</button>';
$('categoryNav').innerHTML=all+CATEGORY_NAV.map(cat=>'<button type="button" class="category-tab '+(activeCategory===cat.id?'active':'')+'" data-category="'+cat.id+'" aria-pressed="'+(activeCategory===cat.id)+'"><span class="category-icon-wrap"><img class="category-icon" src="assets/category-icons/'+cat.icon+'" alt="" aria-hidden="true" width="128" height="128" decoding="async"></span><span class="category-label">'+esc(cat.label)+'</span></button>').join('');
}
function renderProducts(){
const q=$('productSearch').value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),category=CATEGORY_NAV.find(x=>x.id===activeCategory),included=category?.includes||[];
const matches=products.filter(p=>(activeCategory==='all'||included.includes(p.category))&&(!q||(p.name+' '+(p.desc||'')+' '+p.category).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q)));
$('productResults').innerHTML=matches.length?matches.map(p=>{const v=priceStart(p);return '<button type="button" class="product-option '+(selected&&selected.id===p.id?'selected':'')+'" data-product-id="'+esc(p.id)+'" aria-pressed="'+!!(selected&&selected.id===p.id)+'"><span class="product-option-name">'+esc(p.name)+'</span><span class="product-option-meta">'+esc(p.category)+' <span>'+(v==null?'Configure os sabores':'A partir de '+money(v))+'</span></span></button>'}).join(''):'<div class="product-no-results"><strong>Nenhum produto encontrado.</strong><span>Tente outro nome ou categoria.</span></div>';
$('productResultCount').textContent=matches.length+' '+(matches.length===1?'produto':'produtos');
}
function selectProduct(id){selected=products.find(p=>String(p.id)===String(id))||null;cfg=selected?initial(selected):null;renderProducts();renderConfig()}
function sizeUI(value){return '<div class="config-field"><span class="config-label">Tamanho</span><div class="choice-grid">'+['M','G'].map(s=>'<button type="button" class="choice-button '+(value===s?'active':'')+'" data-config="size" data-value="'+s+'" aria-pressed="'+(value===s)+'"><strong>'+(s==='M'?'Média':'Grande')+'</strong><small>'+sizes[s]+'</small></button>').join('')+'</div></div>'}
function borderUI(size){return '<div class="config-field"><label class="config-label" for="borderOption">Borda recheada <span>opcional</span></label><select id="borderOption" data-config="border">'+d.borders.map(b=>'<option value="'+b.id+'" '+(cfg.border===b.id?'selected':'')+'>'+(b.id==='sem_borda'?'Sem borda':b.name+' · + '+money(b.prices[size]))+'</option>').join('')+'</select></div>'}
function ingredientsUI(list,group,label){return '<div class="config-field"><div class="config-label-row"><span class="config-label">'+esc(label||'Escolha de 1 a 5 ingredientes')+'</span><strong>'+list.length+'/5</strong></div><div class="ingredient-grid">'+d.customIngredients.map(x=>{const on=list.includes(x.id),disabled=!on&&list.length>=5;return '<button type="button" class="ingredient-chip '+(on?'active':'')+'" data-ingredient="'+x.id+'" data-ingredient-group="'+group+'" aria-pressed="'+on+'" '+(disabled?'disabled':'')+'>'+(on?'✓ ':'+ ')+esc(x.name)+'</button>'}).join('')+'</div><p class="config-help">Escolha no mínimo 1 e no máximo 5 ingredientes.</p></div>'}
function choiceUI(p){if(!p.choice||!p.choice.options.length)return '';return '<div class="config-field"><span class="config-label">'+esc(p.choice.label||'Escolha uma opção')+'</span><div class="choice-grid">'+p.choice.options.map(o=>'<button type="button" class="choice-button '+(cfg.choice===o.id?'active':'')+'" data-config="choice" data-value="'+o.id+'" aria-pressed="'+(cfg.choice===o.id)+'"><strong>'+esc(o.label)+'</strong></button>').join('')+'</div></div>'}
function flavorSelect(id,label,list,attr){
const arr=attr.startsWith('half')?cfg.halfFlavors:cfg.comboFlavors,slot=attr.endsWith('1')?0:1;
return '<div class="config-field"><label class="config-label" for="'+id+'">'+label+'</label><select id="'+id+'" data-config="'+attr+'"><option value="">Selecione um sabor</option>'+list.map(f=>'<option value="'+f.id+'" '+(String(arr[slot])===String(f.id)?'selected':'')+'>'+esc(f.name)+'</option>').join('')+'</select></div>'
}
function halfUI(){
let html=sizeUI(cfg.size)+'<div class="config-grid">'+flavorSelect('halfFlavor1','Primeiro sabor',allPizzas,'halfFlavor1')+flavorSelect('halfFlavor2','Segundo sabor',allPizzas,'halfFlavor2')+'</div>';
cfg.halfFlavors.forEach((id,i)=>{if(Number(id)===customPizzaId)html+=ingredientsUI(cfg.halfIngredients[i],'half'+(i+1),'Ingredientes do '+(i?'segundo':'primeiro')+' sabor personalizado')});
return html+borderUI(cfg.size)
}
function comboUI(p){
const two=['familia','perfeito'].includes(p.id);
let html=(p.obs?'<div class="config-note">'+esc(p.obs)+'</div>':'')+'<div class="config-grid">'+flavorSelect('comboFlavor1',two?'Primeiro sabor da pizza':'Sabor da pizza',comboSavory,'comboFlavor1')+(two?flavorSelect('comboFlavor2','Segundo sabor · opcional',comboSavory,'comboFlavor2'):'')+'</div>';
if(cfg.comboFlavors.some(x=>Number(x)===customPizzaId))html+=ingredientsUI(cfg.comboIngredients,'combo','Ingredientes da pizza personalizada (1 a 5)');
if(p.id==='perfeito')html+='<div class="config-field"><label class="config-label" for="comboSweet">Pizza doce · 25 cm</label><select id="comboSweet" data-config="comboSweet"><option value="">Selecione a pizza doce</option>'+sweet.map(x=>'<option value="'+x.id+'" '+(String(cfg.comboSweet)===String(x.id)?'selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select></div>';
if(two)html+='<div class="config-field"><span class="config-label">Refrigerante 2 litros</span><div class="choice-grid"><button type="button" class="choice-button '+(cfg.comboDrink==='guarana'?'active':'')+'" data-config="comboDrink" data-value="guarana" aria-pressed="'+(cfg.comboDrink==='guarana')+'"><strong>Guaraná Antarctica</strong></button><button type="button" class="choice-button '+(cfg.comboDrink==='fanta'?'active':'')+'" data-config="comboDrink" data-value="fanta" aria-pressed="'+(cfg.comboDrink==='fanta')+'"><strong>Fanta</strong></button></div></div>';
else html+='<div class="config-note">Bebida inclusa: Guaraná Antarctica '+(p.id==='individual'?'lata':'2 litros')+'.</div>';
return html+borderUI(d.comboBorderSizes[p.id])
}
function esfihaUI(){
const total=Object.values(cfg.esfihaCounts).reduce((a,b)=>a+b,0);
return '<div class="config-note">Escolha exatamente 10 esfihas doces e/ou salgadas. Pode misturar e repetir sabores. <strong>Valor fixo: '+money(d.esfihaComboPrice)+'.</strong></div><div class="esfiha-combo-head"><strong>Quantidade escolhida</strong><span>'+total+' / 10</span></div><div class="esfiha-combo-list">'+esfihaVariants.map((v,i)=>{const qty=cfg.esfihaCounts[v.key]||0;return '<div class="esfiha-combo-row"><div class="esfiha-combo-info"><strong>'+esc(v.name)+'</strong><small>'+esc(v.category)+(v.choice?' · '+esc(v.choice):'')+'</small></div><div class="qty"><button type="button" data-esfiha-index="'+i+'" data-esfiha-delta="-1" aria-label="Remover uma unidade de '+esc(v.name)+'" '+(!qty?'disabled':'')+'>−</button><span>'+qty+'</span><button type="button" data-esfiha-index="'+i+'" data-esfiha-delta="1" aria-label="Adicionar uma unidade de '+esc(v.name)+'" '+(total>=10?'disabled':'')+'>+</button></div></div>'}).join('')+'</div>'
}
function currentPrice(){
if(!selected)return null;
if(selected.kind==='pizza'){const promo=d.promoPizzaDays.includes(new Date().getDay())&&cfg.size===d.promoPizzaSize&&d.promoPizzaIds.includes(selected.id)&&(selected.id!==21||cfg.choice==='catupiry');return (promo?d.promoPizzaPrice:selected.prices[cfg.size])+(d.borders.find(b=>b.id===cfg.border)?.prices[cfg.size]||0)}
if(selected.kind==='half'){const a=allPizzas.find(x=>x.id===Number(cfg.halfFlavors[0])),b=allPizzas.find(x=>x.id===Number(cfg.halfFlavors[1]));return a&&b?Math.max(a.prices[cfg.size],b.prices[cfg.size])+(d.borders.find(x=>x.id===cfg.border)?.prices[cfg.size]||0):null}
if(selected.kind==='combo'){const s=d.comboBorderSizes[selected.id];return selected.price+(d.borders.find(x=>x.id===cfg.border)?.prices[s]||0)}
if(selected.kind==='esfihaCombo')return d.esfihaComboPrice;
if(selected.kind==='variation')return selected.prices[cfg.optionKey];
return selected.price
}
function valid(){
if(!selected)return false;if(selected.choice?.options?.length&&!cfg.choice)return false;
if(selected.kind==='pizza'&&selected.id===customPizzaId)return cfg.ingredients.length>0&&cfg.ingredients.length<=5;
if(selected.kind==='half'){const a=Number(cfg.halfFlavors[0]),b=Number(cfg.halfFlavors[1]);return !!a&&!!b&&a!==b&&cfg.halfFlavors.every((x,i)=>Number(x)!==customPizzaId||(cfg.halfIngredients[i].length>0&&cfg.halfIngredients[i].length<=5))}
if(selected.kind==='combo'){if(!cfg.comboFlavors[0])return false;if(cfg.comboFlavors.some(x=>Number(x)===customPizzaId)&&(cfg.comboIngredients.length<1||cfg.comboIngredients.length>5))return false;if(['familia','perfeito'].includes(selected.id)&&!cfg.comboDrink)return false;if(selected.id==='perfeito'&&!cfg.comboSweet)return false;return true}
if(selected.kind==='esfihaCombo')return Object.values(cfg.esfihaCounts).reduce((a,b)=>a+b,0)===10;
return true
}
function flavorText(id,ingredients){const f=allPizzas.find(x=>x.id===Number(id));if(!f)return '';return f.id===customPizzaId?'Monte sua pizza ('+ingredients.map(i=>d.customIngredients.find(x=>x.id===i)?.name).filter(Boolean).join(', ')+')':f.name}
function buildItem(){
const p=selected,detail=[];let price=currentPrice(),name=p.name;
if(p.kind==='pizza'){detail.push(sizes[cfg.size]);if(p.id===customPizzaId)detail.push('Ingredientes: '+cfg.ingredients.map(i=>d.customIngredients.find(x=>x.id===i).name).join(', '));if(p.choice?.options?.length)detail.push(p.choice.label+': '+p.choice.options.find(x=>x.id===cfg.choice)?.label);detail.push(cfg.border==='sem_borda'?'Sem borda':'Borda de '+d.borders.find(x=>x.id===cfg.border).name);if(d.promoPizzaDays.includes(new Date().getDay())&&cfg.size===d.promoPizzaSize&&d.promoPizzaIds.includes(p.id)&&(p.id!==21||cfg.choice==='catupiry'))detail.push('Promoção terça a quinta')}
else if(p.kind==='half'){detail.push(sizes[cfg.size]);detail.push('Sabores: '+flavorText(cfg.halfFlavors[0],cfg.halfIngredients[0])+' / '+flavorText(cfg.halfFlavors[1],cfg.halfIngredients[1]));detail.push(cfg.border==='sem_borda'?'Sem borda':'Borda de '+d.borders.find(x=>x.id===cfg.border).name);name='Pizza meio a meio'}
else if(p.kind==='combo'){const s=d.comboBorderSizes[p.id],a=flavorText(cfg.comboFlavors[0],cfg.comboIngredients),b=cfg.comboFlavors[1]?flavorText(cfg.comboFlavors[1],cfg.comboIngredients):'';if(p.id==='individual')detail.push('Pizza '+sizes[s]+' · '+a,'Guaraná Antarctica lata incluso');if(p.id==='casal')detail.push('Pizza '+sizes[s]+' · '+a,'Guaraná Antarctica 2 litros incluso');if(p.id==='familia')detail.push('Pizza '+sizes[s]+' · '+a+(b?' / '+b:' (inteira)'),(cfg.comboDrink==='fanta'?'Fanta':'Guaraná Antarctica')+' 2 litros');if(p.id==='perfeito')detail.push('Pizza salgada '+sizes[s]+' · '+a+(b?' / '+b:' (inteira)'),'Pizza doce · 25 cm · 4 fatias · '+sweet.find(x=>x.id===Number(cfg.comboSweet))?.name,(cfg.comboDrink==='fanta'?'Fanta':'Guaraná Antarctica')+' 2 litros');detail.push(cfg.border==='sem_borda'?'Sem borda':'Borda de '+d.borders.find(x=>x.id===cfg.border).name);if(p.obs)detail.push('Observação do cardápio: '+p.obs)}
else if(p.kind==='esfihaCombo')detail.push(...esfihaVariants.filter(x=>cfg.esfihaCounts[x.key]).map(x=>cfg.esfihaCounts[x.key]+'x '+x.name));
else if(p.kind==='variation')detail.push(p.options?.[cfg.optionKey]?.label||cfg.optionKey);
else if(p.choice?.options?.length)detail.push(p.choice.label+': '+p.choice.options.find(x=>x.id===cfg.choice)?.label);
return {key:p.id+'|'+JSON.stringify(cfg),productId:p.id,type:p.kind,name,details:detail.join(' · '),price,qty:Math.max(1,Math.min(99,Math.floor(Number($('itemQty').value)||1)))}
}
function renderConfig(){
const box=$('productConfig');if(!selected||!cfg){box.innerHTML='<div class="config-empty">Selecione um produto para visualizar tamanhos, opções e personalizações.</div>';$('configTotal').textContent='Selecione um produto';$('addItem').disabled=true;return}
let controls='',p=selected;
if(p.kind==='pizza')controls=sizeUI(cfg.size)+choiceUI(p)+(p.id===customPizzaId?ingredientsUI(cfg.ingredients,'main'):'')+borderUI(cfg.size);
else if(p.kind==='half')controls=halfUI();else if(p.kind==='combo')controls=comboUI(p);else if(p.kind==='esfihaCombo')controls=esfihaUI();
else if(p.kind==='variation'){const keys=Object.keys(p.prices||{});controls='<div class="config-field"><span class="config-label">'+(p.category==='Bebidas'?'Tamanho / sabor':'Tamanho')+'</span><div class="choice-grid">'+keys.map(k=>{const o=p.options?.[k]||{label:k,sub:''};return '<button type="button" class="choice-button '+(cfg.optionKey===k?'active':'')+'" data-config="optionKey" data-value="'+k+'"><strong>'+esc(o.label)+'</strong><small>'+esc(o.sub||'')+' · '+money(p.prices[k])+'</small></button>'}).join('')+'</div></div>'}
else controls=choiceUI(p);
const img=p.img?'<img src="'+esc(p.img)+'" alt="" loading="lazy" onerror="this.style.display=\'none\'">':'';
box.innerHTML='<div class="selected-product-head">'+img+'<div><span>'+esc(p.category)+'</span><strong>'+esc(p.name)+'</strong><p>'+esc(p.desc||'')+'</p></div></div><div class="product-config-controls">'+controls+'</div>';
const price=currentPrice();$('configTotal').textContent=price==null?'Configure as opções':'Valor unitário: '+money(price);$('addItem').disabled=!valid()
}
function renderCart(){
if(!cart.length)$('cart').innerHTML='<div class="cart-empty"><strong>Nenhum item adicionado</strong>Selecione os produtos informados pelo cliente.</div>';
else $('cart').innerHTML='<div class="cart-list">'+cart.map((x,i)=>'<div class="cart-row '+(x.key===justAddedKey?'cart-row-enter':'')+'"><div class="cart-item-main"><div class="cart-name">'+esc(x.name)+'</div><div class="cart-meta">'+esc(x.details)+'</div></div><div class="cart-actions"><div class="qty"><button type="button" data-cart-action="dec" data-cart-index="'+i+'" aria-label="Diminuir quantidade de '+esc(x.name)+'">−</button><span>'+x.qty+'</span><button type="button" data-cart-action="inc" data-cart-index="'+i+'" aria-label="Aumentar quantidade de '+esc(x.name)+'" '+(x.qty>=99?'disabled':'')+'>+</button></div><span class="price">'+money(x.price*x.qty)+'</span><button type="button" class="btn btn-quiet" data-cart-action="remove" data-cart-index="'+i+'" aria-label="Remover '+esc(x.name)+'">Remover</button></div></div>').join('')+'</div>';
const count=cart.reduce((a,x)=>a+x.qty,0);$('itemCount').textContent=count+' '+(count===1?'item':'itens');renderSummaryItems();totals();progress();justAddedKey=''
}
function renderSummaryItems(){
const box=$('summaryItems'),count=cart.reduce((sum,item)=>sum+item.qty,0);
$('summaryItemsCount').textContent=count+' '+(count===1?'item':'itens');
box.innerHTML=cart.length?cart.map(item=>'<div class="summary-item"><div class="summary-item-main"><strong class="summary-item-name">'+esc(item.name)+'</strong><span class="summary-item-meta">'+esc(item.details)+'</span><div class="summary-item-bottom"><span class="summary-item-qty">'+item.qty+' x '+money(item.price)+'</span><strong class="summary-item-price">'+money(item.price*item.qty)+'</strong></div></div></div>').join(''):'<div class="summary-items-empty">Os produtos selecionados aparecem aqui.</div>';
}
function totals(){const sub=cart.reduce((a,x)=>a+x.price*x.qty,0),fee=receiving==='delivery'?Math.max(0,Number($('fee').value)||0):0,old=$('total').textContent;$('subtotal').textContent=money(sub);$('deliveryTotal').textContent=money(fee);$('deliveryTotal').parentElement.style.opacity=receiving==='delivery'?'1':'.45';$('total').textContent=money(sub+fee);if(old!==$('total').textContent&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const total=$('total');total.classList.remove('value-change');void total.offsetWidth;total.classList.add('value-change');total.addEventListener('animationend',()=>total.classList.remove('value-change'),{once:true})}}
function progress(){const done={customer:!!$('customer').value.trim(),receiving:receiving==='pickup'||!!$('address').value.trim(),items:cart.length>0,payment:false},order=['customer','receiving','items','payment'];done.payment=done.customer&&done.receiving&&done.items&&!!$('payment').value;let current=order.findIndex(k=>!done[k]);document.querySelectorAll('[data-progress]').forEach(el=>{const i=order.indexOf(el.dataset.progress);el.classList.toggle('is-done',done[el.dataset.progress]);el.classList.toggle('is-current',i===current&&!done[el.dataset.progress]);el.querySelector('.step-dot').textContent=done[el.dataset.progress]?'✓':String(i+1)})}
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),2400)}
function setOrderFormLocked(locked){
document.querySelectorAll('.main-col input,.main-col select,.main-col textarea,.main-col button').forEach(el=>el.disabled=locked);
$('reset').disabled=false;
}
function buildOrderPayload(){
const subtotal=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
const fee=receiving==='delivery'?Number($('fee').value||0):0;
const extraNotes=[];
const change=Number($('change').value||0);
if($('payment').value==='Dinheiro'&&change>0)extraNotes.push('Troco para: '+money(change));
if($('notes').value.trim())extraNotes.push('Observações: '+$('notes').value.trim());
return {
p_order_id:submissionId,
p_establishment_id:window.SUPABASE_CONFIG.establishmentId,
p_customer_name:$('customer').value.trim(),
p_customer_phone:$('phone').value.trim()||null,
p_address:receiving==='delivery'?$('address').value.trim():null,
p_delivery_region:receiving==='delivery'?($('region').value.trim()||null):null,
p_delivery_fee:fee,
p_payment_method:$('payment').value,
p_subtotal:Number(subtotal.toFixed(2)),
p_total:Number((subtotal+fee).toFixed(2)),
p_order_type:receiving,
p_notes:extraNotes.join(' · ')||null,
p_items:cart.map(item=>({
product_id:String(item.productId),
product_name:item.name,
quantity:item.qty,
unit_price:Number(item.price.toFixed(2)),
options:{details:item.details||'',type:item.type||''},
notes:null
}))
};
}
async function submitOrder(){
if(savedOrder)return;
if(!$('customer').value.trim()){toast('Informe o nome do cliente');$('customer').focus();return}
if(!cart.length){toast('Adicione pelo menos um item');$('productSearch').focus();return}
if(receiving==='delivery'&&!$('address').value.trim()){toast('Informe o endereço de entrega');$('address').focus();return}
const fee=receiving==='delivery'?Number($('fee').value):0;
if(!Number.isFinite(fee)||fee<0){toast('Informe uma taxa de entrega válida');$('fee').focus();return}
const change=Number($('change').value||0);
if($('payment').value==='Dinheiro'&&(!Number.isFinite(change)||change<0)){toast('Informe um valor de troco válido');$('change').focus();return}
const config=window.SUPABASE_CONFIG;
if(!config?.url||!config?.publishableKey||!config?.establishmentId){toast('A conexão com o sistema não está configurada');return}
if(!submissionId){submissionId=crypto.randomUUID();submissionPayload=buildOrderPayload()}
const button=$('submitOrder'),status=$('submitStatus');
button.disabled=true;button.textContent='Registrando pedido...';
status.className='submit-status show';status.textContent='Salvando o pedido e preparando a impressão...';
try{
const accessToken=await window.SANJA_AUTH.getAccessToken();
const response=await fetch(config.url.replace(/\/$/,'')+'/rest/v1/rpc/create_manual_order',{
method:'POST',
headers:{apikey:config.publishableKey,Authorization:'Bearer '+accessToken,'Content-Type':'application/json'},
body:JSON.stringify(submissionPayload)
});
const raw=await response.text();let result=null;
try{result=raw?JSON.parse(raw):null}catch{}
if(!response.ok)throw new Error(result?.message||result?.details||'Não foi possível registrar o pedido ('+response.status+').');
if(!result?.order_id)throw new Error('O sistema não confirmou o registro do pedido.');
savedOrder=result;setOrderFormLocked(true);
button.textContent='Pedido #'+result.order_number+' registrado';
$('reset').textContent='Novo pedido';
status.className='submit-status show '+(result.print_queued?'success':'warning');
status.textContent=result.print_queued
?'Pedido #'+result.order_number+' registrado e enviado à fila de impressão.'
:'Pedido #'+result.order_number+' registrado, mas não há impressora ativa vinculada à fila.';
toast(result.print_queued?'Pedido registrado e enviado para impressão.':'Pedido registrado; fila de impressão indisponível.');
}catch(error){
setOrderFormLocked(true);button.disabled=false;button.textContent='Tentar novamente';
status.className='submit-status show error';
status.textContent=(error.message||'Falha ao registrar o pedido.')+' Seus dados foram mantidos. Se a conexão falhou, tente novamente antes de iniciar outro pedido para evitar duplicidade.';
}
}


$('productSearch').addEventListener('input',renderProducts);$('categoryNav').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;activeCategory=b.dataset.category;renderCategories();renderProducts()});
$('productResults').addEventListener('click',e=>{const b=e.target.closest('[data-product-id]');if(b)selectProduct(b.dataset.productId)});
$('productConfig').addEventListener('change',e=>{const t=e.target;if(!t.matches('[data-config]'))return;const k=t.dataset.config;if(k==='halfFlavor1'||k==='halfFlavor2')cfg.halfFlavors[k.endsWith('1')?0:1]=t.value;else if(k==='comboFlavor1'||k==='comboFlavor2')cfg.comboFlavors[k.endsWith('1')?0:1]=t.value;else cfg[k]=t.value;renderConfig()});
$('productConfig').addEventListener('click',e=>{
const b=e.target.closest('[data-ingredient]');if(b){const g=b.dataset.ingredientGroup,list=g==='main'?cfg.ingredients:g==='combo'?cfg.comboIngredients:cfg.halfIngredients[Number(g.slice(-1))-1],id=b.dataset.ingredient,i=list.indexOf(id);if(i>=0)list.splice(i,1);else if(list.length<5)list.push(id);renderConfig();return}
const q=e.target.closest('[data-esfiha-index]');if(q){const total=Object.values(cfg.esfihaCounts).reduce((a,b)=>a+b,0),v=esfihaVariants[Number(q.dataset.esfihaIndex)],n=Math.max(0,(cfg.esfihaCounts[v.key]||0)+Number(q.dataset.esfihaDelta));if(n>(cfg.esfihaCounts[v.key]||0)&&total>=10)return;if(n)cfg.esfihaCounts[v.key]=n;else delete cfg.esfihaCounts[v.key];renderConfig();return}
const c=e.target.closest('button[data-config][data-value]');if(c){cfg[c.dataset.config]=c.dataset.value;renderConfig()}
});
$('addItem').addEventListener('click',()=>{if(!valid())return;const item=buildItem(),old=cart.find(x=>x.key===item.key);if(old)old.qty=Math.min(99,old.qty+item.qty);else cart.push(item);justAddedKey=item.key;$('itemQty').value='1';renderCart();toast(item.name+' adicionado ao pedido')});
$('cart').addEventListener('click',e=>{const b=e.target.closest('[data-cart-action]');if(!b)return;const i=Number(b.dataset.cartIndex),x=cart[i];if(!x)return;if(b.dataset.cartAction==='inc')x.qty=Math.min(99,x.qty+1);else if(b.dataset.cartAction==='dec'){x.qty--;if(x.qty<1)cart.splice(i,1)}else cart.splice(i,1);renderCart()});
$('fee').addEventListener('input',totals);['customer','address'].forEach(id=>$(id).addEventListener('input',progress));$('payment').addEventListener('change',progress);
document.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>{receiving=b.dataset.kind;document.querySelectorAll('[data-kind]').forEach(x=>x.classList.toggle('active',x===b));$('deliveryFields').style.display=receiving==='delivery'?'grid':'none';if(receiving==='delivery'){$('deliveryFields').classList.remove('delivery-fields-enter');void $('deliveryFields').offsetWidth;$('deliveryFields').classList.add('delivery-fields-enter')}totals();progress()}));
$('submitOrder').addEventListener('click',submitOrder);
$('reset').addEventListener('click',()=>{const message=savedOrder?'Iniciar um novo pedido? O pedido atual já foi registrado.':'Limpar os dados deste pedido e começar novamente?';if(!confirm(message))return;cart=[];['customer','phone','address','region','notes','change'].forEach(id=>$(id).value='');justAddedKey='';submissionId=null;submissionPayload=null;savedOrder=null;$('submitOrder').textContent='Registrar pedido';$('submitOrder').disabled=false;$('submitStatus').className='submit-status';$('submitStatus').textContent='';$('reset').textContent='Limpar formulário';document.querySelectorAll('.main-col input,.main-col select,.main-col textarea,.main-col button').forEach(el=>el.disabled=false);$('fee').value='4.00';$('payment').value='Pix';$('itemQty').value='1';$('productSearch').value='';activeCategory='all';renderCategories();$('deliveryFields').style.display='grid';receiving='delivery';document.querySelectorAll('[data-kind]').forEach(b=>b.classList.toggle('active',b.dataset.kind==='delivery'));selected=null;cfg=null;renderProducts();renderConfig();renderCart();toast('Pronto para um novo pedido')});
renderCategories();renderProducts();renderConfig();renderCart();$('today').textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
})();