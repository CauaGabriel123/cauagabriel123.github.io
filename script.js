// =========================
// LS STORE v11.0 — Cauã
// =========================
const { jsPDF } = window.jspdf;

// --- Configurações
const WHATSAPP = '5551989235482';
const ADMIN_MODE = new URLSearchParams(location.search).get('admin') === 'true';
const FEES = {"Mathias Velho":5,"Harmonia":6,"Mato Grande":7,"São Luís":8,"Centro":8,"Fátima":9,"Igara":10,"Rio Branco":10,"Industrial":10,"Marechal Rondon":11,"Estância Velha":12,"Guajuviras":15,"Olaria":16,"Outra Cidade":"consultar"};
const INSTAGRAM_HANDLE = '@ls_store.fc';

// Abrir app Instagram no iPhone (fallback web)
const instaDeepLink = `instagram://user?username=${INSTAGRAM_HANDLE.replace('@','')}`;
const instaWeb = `https://www.instagram.com/${INSTAGRAM_HANDLE.replace('@','')}`;
const instaLink = document.getElementById('insta-link');
const footerInsta = document.getElementById('footer-insta');
if (instaLink) instaLink.href = instaWeb;
if (footerInsta) footerInsta.href = instaWeb;
[instaLink, footerInsta].forEach(a=>{
  if(!a) return;
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    // tenta abrir o app
    window.location.href = instaDeepLink;
    // fallback em 700ms para web
    setTimeout(()=>{ window.open(instaWeb, '_blank', 'noopener'); }, 700);
  });
});

// --- Splash
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('splash').classList.add('hidden');
    setTimeout(()=>document.getElementById('splash').remove(),650);
  },2000);
});

// --- Áudio (sino finalização + click do menu) via WebAudio
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playChime(){ const t=audioCtx.currentTime; const o=audioCtx.createOscillator(); const g=audioCtx.createGain();
  o.type='sine'; o.frequency.setValueAtTime(880,t); o.frequency.exponentialRampToValueAtTime(1318,t+0.35);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.2,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+0.7);
  o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t+0.75);
}
function clickSoft(){ const t=audioCtx.currentTime; const o=audioCtx.createOscillator(); const g=audioCtx.createGain();
  o.type='triangle'; o.frequency.setValueAtTime(600,t); o.frequency.exponentialRampToValueAtTime(900,t+0.08);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.12,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+0.15);
  o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t+0.18);
}

// --- Drawer (menu visual com blur) + cards de categorias
const drawer = document.getElementById('drawer');
const menuBtn = document.getElementById('menu-btn');
const closeDrawer = document.getElementById('close-drawer');
const drawerGrid = document.getElementById('drawer-grid');
const categories = [
  {key:'blusas', name:'Blusas', img:'https://images.unsplash.com/photo-1624996379697-a7c8d6df7a70?q=80&w=1200&auto=format&fit=crop'},
  {key:'calcas', name:'Calças', img:'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop'},
  {key:'vestidos', name:'Vestidos', img:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop'},
  {key:'intimas', name:'Roupas Íntimas', img:'https://images.unsplash.com/photo-1583496661160-fb5886a95736?q=80&w=1200&auto=format&fit=crop'},
  {key:'calcados', name:'Calçados', img:'https://images.unsplash.com/photo-1460355296524-6c2fd3f3a3f4?q=80&w=1200&auto=format&fit=crop'},
  {key:'oculos', name:'Óculos', img:'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop'},
  {key:'cosmeticos', name:'Cosméticos', img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'},
  {key:'beleza', name:'Beleza', img:'https://images.unsplash.com/photo-1608222351212-69c3ab3b1bda?q=80&w=1200&auto=format&fit=crop'},
];
drawerGrid.innerHTML = categories.map(c=>`
  <div class="cat-card" data-target="${c.key}">
    <img src="${c.img}" alt="${c.name}">
    <div class="label">${c.name}</div>
  </div>
`).join('');
drawerGrid.addEventListener('click', (e)=>{
  const card = e.target.closest('.cat-card'); if(!card) return;
  const sec = card.dataset.target;
  showSection(sec);
  drawer.setAttribute('aria-hidden','true');
});
menuBtn.onclick = ()=>{ drawer.setAttribute('aria-hidden', drawer.getAttribute('aria-hidden')==='true'?'false':'true'); clickSoft(); }
closeDrawer.onclick = ()=>{ drawer.setAttribute('aria-hidden','true'); clickSoft(); }
drawer.querySelector('.drawer-backdrop').onclick = ()=>{ drawer.setAttribute('aria-hidden','true'); }

// --- Navegação (links simples)
document.querySelectorAll('.drawer-links a[data-section], .footer a[data-section]').forEach(a=>{
  a.onclick = (e)=>{
    e.preventDefault();
    showSection(a.getAttribute('data-section'));
    drawer.setAttribute('aria-hidden','true');
  }
});
function showSection(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
  // esconde banner fora do início: (só existe no #inicio)
  window.scrollTo({top:0, behavior:'smooth'});
}

// --- Carousel com swipe
const slides = document.querySelector('.slides'); const dots=[...document.querySelectorAll('.dot')];
let idx=0, autoTimer=null;
function go(i){ idx=(i+dots.length)%dots.length; slides.style.transform=`translateX(-${idx*100}%)`; dots.forEach((d,j)=>d.classList.toggle('active', j===idx)); }
dots.forEach(d=> d.onclick=()=>{ go(parseInt(d.dataset.i,10)); resetAuto(); });
function resetAuto(){ clearInterval(autoTimer); autoTimer=setInterval(()=>go(idx+1), 5000); } resetAuto();
const carousel=document.getElementById('carousel'); let startX=0, delta=0;
if(carousel){
  carousel.addEventListener('touchstart',e=>{ startX=e.touches[0].clientX; delta=0; }, {passive:true});
  carousel.addEventListener('touchmove',e=>{ delta=e.touches[0].clientX-startX; slides.style.transform=`translateX(calc(-${idx*100}% + ${delta}px))`; }, {passive:true});
  carousel.addEventListener('touchend',()=>{ if(Math.abs(delta)>60){ go(idx + (delta<0?1:-1)); } else { go(idx); } resetAuto(); });
}

// --- Catálogo (com imagens de modelos — vitrine)
const catalog = {
  vestidos: [
    {id:'v1',name:'Vestido Floral Midi',price:159.9,img:'https://images.unsplash.com/photo-1614691812260-0b2152d5f83e?q=80&w=1200&auto=format&fit=crop',sizes:['P','M','G'],colors:['Rosa','Branco'],stock:5,isNew:true,desc:'Vestido midi floral em tecido leve, caimento perfeito.'},
    {id:'v2',name:'Vestido Longo Fenda',price:179.9,img:'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',sizes:['M','G','GG'],colors:['Preto','Bege'],stock:3,desc:'Longo com fenda lateral e cintura marcada.'},
    {id:'v3',name:'Vestido Tubinho Preto',price:149.9,img:'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=1200&auto=format&fit=crop',sizes:['P','M','G'],colors:['Preto'],stock:8,discount:0.3,desc:'Clássico tubinho preto, versátil e elegante.'},
    {id:'v4',name:'Vestido Casual Listrado',price:139.9,img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop',sizes:['P','M'],colors:['Branco','Preto'],stock:0,desc:'Casual listrado em malha confortável.'}
  ],
  camisas: [
    {id:'c1',name:'Camisa Social Seda',price:129.9,img:'https://images.unsplash.com/photo-1618354691438-25e01c74f8b1?q=80&w=1200&auto=format&fit=crop',sizes:['P','M','G'],colors:['Branco'],stock:2,isNew:true,desc:'Toque de seda, acabamento premium.'},
    {id:'c2',name:'Blusa Canelada',price:89.9,img:'https://images.unsplash.com/photo-1581674031085-14c2f3f730c8?q=80&w=1200&auto=format&fit=crop',sizes:['P','M','G','GG'],colors:['Rosa','Preto'],stock:0,desc:'Canelada macia, perfeita para o dia a dia.'},
    {id:'c3',name:'Cropped Rosa',price:79.9,img:'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',sizes:['P','M'],colors:['Rosa'],stock:10,desc:'Cropped canelado rosa, trend da estação.'},
    {id:'c4',name:'Camisa Branca Feminina',price:99.9,img:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop',sizes:['M','G','GG'],colors:['Branco'],stock:4,desc:'A camisa branca que combina com tudo.'}
  ],
  calcas: [
    {id:'cj1',name:'Calça Jeans Cintura Alta',price:139.9,img:'https://images.unsplash.com/photo-1618354691438-25e01c74f8b1?q=80&w=1200&auto=format&fit=crop',sizes:['P','M','G'],colors:['Azul','Preto'],stock:7,desc:'Jeans com stretch e cintura alta.'},
    {id:'cj2',name:'Calça Pantalona',price:149.9,img:'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop',sizes:['P','M','G','GG'],colors:['Bege','Preto'],stock:5,desc:'Pantalona fluida, elegância e conforto.'},
    {id:'cj3',name:'Calça Legging Confort',price:89.9,img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',sizes:['P','M','G'],colors:['Preto'],stock:0,desc:'Legging com alta elasticidade.'},
    {id:'cj4',name:'Calça Cargo Feminina',price:159.9,img:'https://images.unsplash.com/photo-1544441892-9a2d95f8f6c3?q=80&w=1200&auto=format&fit=crop',sizes:['M','G'],colors:['Verde','Preto'],stock:3,discount:0.3,desc:'Cargo moderna com bolsos utilitários.'}
  ],
  intimas: [
    {id:'i1',name:'Conjunto Renda',price:109.9,img:'https://images.unsplash.com/photo-1583496661160-fb5886a95736?q=80&w=1200&auto=format&fit=crop',sizes:['P','M','G'],colors:['Preto','Branco'],stock:6,desc:'Conjunto em renda delicada.'},
    {id:'i2',name:'Sutiã Comfort',price:69.9,img:'https://images.unsplash.com/photo-1593030668935-a8a15a69f8df?q=80&w=1200&auto=format&fit=crop',sizes:['P','M','G','GG'],colors:['Bege','Preto'],stock:5,desc:'Suporte e conforto diário.'},
    {id:'i3',name:'Calcinha Sem Costura',price:29.9,img:'https://images.unsplash.com/photo-1588856122867-5f3878e8b9f5?q=80&w=1200&auto=format&fit=crop',sizes:['P','M','G'],colors:['Rosa','Preto'],stock:10,desc:'Toque leve e invisível sob a roupa.'},
    {id:'i4',name:'Body Modelador',price:139.9,img:'https://images.unsplash.com/photo-1596357395100-0f2c11d2b9ad?q=80&w=1200&auto=format&fit=crop',sizes:['P','M','G'],colors:['Preto'],stock:2,desc:'Modelagem que valoriza as curvas.'}
  ],
  calcados: [
    {id:'s1',name:'Tênis Casual Branco',price:159.9,img:'https://images.unsplash.com/photo-1460355296524-6c2fd3f3a3f4?q=80&w=1200&auto=format&fit=crop',sizes:['34','35','36','37','38','39'],colors:['Branco'],stock:6,desc:'Versátil, combina com tudo.'},
    {id:'s2',name:'Sandália Salto Bloco',price:129.9,img:'https://images.unsplash.com/photo-1544441892-9a2d95f8f6c3?q=80&w=1200&auto=format&fit=crop',sizes:['34','35','36','37','38','39'],colors:['Bege','Preto'],stock:3,desc:'Conforto e elegância diária.'},
    {id:'s3',name:'Mocassim Couro',price:189.9,img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',sizes:['34','35','36','37','38','39'],colors:['Marrom','Preto'],stock:2,desc:'Clássico atemporal.'},
    {id:'s4',name:'Bota Cano Curto',price:199.9,img:'https://images.unsplash.com/photo-1580089056075-6d4df6ab1b39?q=80&w=1200&auto=format&fit=crop',sizes:['34','35','36','37','38','39'],colors:['Preto'],stock:1,desc:'Estilo para dias frios.'}
  ],
  oculos: [
    {id:'o1',name:'Óculos Retrô',price:89.9,img:'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['Preto'],stock:4,desc:'Retrô com proteção UV.'},
    {id:'o2',name:'Óculos Gatinho',price:99.9,img:'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['Preto','Dourado'],stock:2,desc:'Charmoso e atual.'},
    {id:'o3',name:'Óculos Redondo',price:79.9,img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['Preto','Marrom'],stock:3,desc:'Estilo urbano.'},
    {id:'o4',name:'Óculos Minimal',price:89.9,img:'https://images.unsplash.com/photo-1514995428455-447d4443fa7f?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['Dourado'],stock:5,desc:'Leve e elegante.'}
  ],
  cosmeticos: [
    {id:'cs1',name:'Batom Matte',price:49.9,img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['Vermelho','Nude'],stock:12,desc:'Alta pigmentação e conforto.'},
    {id:'cs2',name:'Base Líquida',price:69.9,img:'https://images.unsplash.com/photo-1608222351212-69c3ab3b1bda?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['Bege','Escuro'],stock:8,desc:'Cobertura média e natural.'},
    {id:'cs3',name:'Rímel Curvador',price:39.9,img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['Preto'],stock:9,desc:'Curvatura e definição.'},
    {id:'cs4',name:'Blush Rosado',price:44.9,img:'https://images.unsplash.com/photo-1608222351212-69c3ab3b1bda?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['Rosa'],stock:7,desc:'Efeito saudável instantâneo.'}
  ],
  beleza: [
    {id:'bz1',name:'Kit Skin Care',price:119.9,img:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['—'],stock:5,desc:'Rotina completa diária.'},
    {id:'bz2',name:'Hidratante Facial',price:59.9,img:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['—'],stock:10,desc:'Hidratação prolongada.'},
    {id:'bz3',name:'Sérum Vitamina C',price:89.9,img:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['—'],stock:6,desc:'Luminosidade e firmeza.'},
    {id:'bz4',name:'Protetor Solar FPS50',price:69.9,img:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',sizes:[],colors:['—'],stock:15,desc:'Proteção alta diária.'}
  ]
};

// Destaques (home)
const featured = [ catalog.vestidos[0], catalog.camisas[2], catalog.calcas[0], catalog.calcados?.[0] || catalog.vestidos[1] ];

function priceHTML(p){
  const v = p.discount ? (p.price*(1-p.discount)) : p.price;
  let s = `R$ ${v.toFixed(2).replace('.',',')}`;
  if(p.discount){
    s += ` <span style="text-decoration:line-through;color:#8a7aa5;font-size:12px;margin-left:6px">R$ ${p.price.toFixed(2).replace('.',',')}</span>`;
  }
  return s;
}
function badgeHTML(p){ if(p.stock<=0) return '<span class="badge">Esgotado</span>'; if(p.discount) return '<span class="badge">-30%</span>'; if(p.isNew) return '<span class="badge">Novo</span>'; return ''; }
function cardHTML(p){ return `<div class="card" data-id="${p.id}">${badgeHTML(p)}<img src="${p.img}" alt="${p.name}"/><div class="info"><p class="name">${p.name}</p><p class="price">${priceHTML(p)}</p></div></div>`; }
function renderGrid(el,arr){ el.innerHTML=arr.map(cardHTML).join(''); el.querySelectorAll('.card').forEach(c=>c.onclick=()=>openModal(c.getAttribute('data-id'))); }
function renderAll(){
  const f=document.getElementById('featured'); if(f) renderGrid(f, featured);
  document.querySelectorAll('[data-cat]').forEach(g=>{ const cat=g.getAttribute('data-cat'); renderGrid(g,catalog[cat]||[]); });
}
renderAll();

// --- Modal de produto
const modal=document.getElementById('product-modal'); const modalImg=document.getElementById('modal-img');
const modalName=document.getElementById('modal-name'); const modalPrice=document.getElementById('modal-price'); const modalDesc=document.getElementById('modal-desc');
const sizeOptions=document.getElementById('size-options'); const colorOptions=document.getElementById('color-options'); const modalAdd=document.getElementById('modal-add');
let currentProduct=null, chosenSize=null, chosenColor=null;

function chip(container, value, onPick){
  const b=document.createElement('button'); b.textContent=value; b.onclick=()=>{ [...container.children].forEach(x=>x.classList.remove('active')); b.classList.add('active'); onPick(value); };
  container.appendChild(b);
}
function openModal(id){
  const p=Object.values(catalog).flat().find(x=>x.id===id); if(!p) return;
  currentProduct=p; chosenSize=null; chosenColor=null;
  modalImg.src=p.img; modalName.textContent=p.name; modalPrice.innerHTML=priceHTML(p); modalDesc.textContent=p.desc||'';
  sizeOptions.innerHTML=''; colorOptions.innerHTML='';
  (p.sizes&&p.sizes.length?p.sizes:['Único']).forEach(v=>chip(sizeOptions,v,(val)=>chosenSize=val));
  (p.colors&&p.colors.length?p.colors:['Única']).forEach(v=>chip(colorOptions,v,(val)=>chosenColor=val));
  modal.setAttribute('aria-hidden','false');
}
document.getElementById('modal-close').onclick=()=>modal.setAttribute('aria-hidden','true');
modal.addEventListener('click',e=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true'); });

// --- Carrinho com animação curva e toggle abrir/fechar
const cartEl=document.getElementById('cart'); const cartBtn=document.getElementById('cart-btn');
const closeCart=document.getElementById('close-cart');
cartBtn.onclick=()=>{ cartEl.setAttribute('aria-hidden', cartEl.getAttribute('aria-hidden')==='true'?'false':'true'); renderCart(); };
closeCart.onclick=()=>cartEl.setAttribute('aria-hidden','true');

let cart=[];
function animateToCart(fromImg){
  const r=fromImg.getBoundingClientRect(); const cartR=cartBtn.getBoundingClientRect();
  const fly=fromImg.cloneNode(true); fly.className='flying';
  Object.assign(fly.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',position:'fixed'});
  document.body.appendChild(fly);
  const steps=22;
  for(let i=0;i<=steps;i++){
    setTimeout(()=>{
      const t=i/steps;
      const cx=r.left + (cartR.left - r.left)*0.5; const cy=Math.min(r.top,cartR.top) - 120;
      const x=(1-t)*(1-t)*r.left + 2*(1-t)*t*cx + t*t*cartR.left;
      const y=(1-t)*(1-t)*r.top  + 2*(1-t)*t*cy + t*t*cartR.top;
      const scale=1 - 0.9*t;
      fly.style.transform=`translate(${x-r.left}px, ${y-r.top}px) scale(${scale})`;
      fly.style.opacity=String(1 - t*0.8);
      if(i===steps){ fly.remove(); cartBtn.classList.add('pulse'); setTimeout(()=>cartBtn.classList.remove('pulse'),400); }
    }, i*12);
  }
}
function addToCartFromModal(){
  const p=currentProduct; if(!p) return;
  if(p.stock<=0){ alert('Produto esgotado.'); return; }
  if(!chosenSize) chosenSize = (p.sizes && p.sizes[0]) || 'Único';
  if(!chosenColor) chosenColor = (p.colors && p.colors[0]) || 'Única';
  const key=p.id+'|'+chosenSize+'|'+chosenColor;
  const ex=cart.find(i=>i.key===key);
  if(ex) ex.qty++; else cart.push({key,id:p.id,name:p.name,price:p.discount?(p.price*(1-p.discount)):p.price,qty:1,size:chosenSize,color:chosenColor,img:p.img});
  renderCart();
  animateToCart(document.getElementById('modal-img'));
  modal.setAttribute('aria-hidden','true');
}
document.getElementById('modal-add').onclick=addToCartFromModal;

function removeFromCart(key){ cart=cart.filter(i=>i.key!=key); renderCart(); }
function changeQty(key,delta){ const it=cart.find(i=>i.key===key); if(!it) return; it.qty+=delta; if(it.qty<1) removeFromCart(key); else renderCart(); }
function cartTotal(){ return cart.reduce((s,i)=>s+i.price*i.qty,0); }
function renderCart(){
  document.getElementById('cart-count').textContent=cart.reduce((s,i)=>s+i.qty,0);
  const list=document.getElementById('cart-items'); list.innerHTML='';
  if(!cart.length){ list.innerHTML='<p>Seu carrinho está vazio 🛍️</p>'; }
  cart.forEach(i=>{
    const totalItem=i.price*i.qty;
    const row=document.createElement('div'); row.className='row';
    row.innerHTML=`<div>${i.name}<br><small>${i.size?('Tam '+i.size+' · '):''}${i.color?('Cor '+i.color):''}</small></div>
      <div><button onclick="changeQty('${i.key}',-1)">-</button><span style="padding:0 8px">${i.qty}</span><button onclick="changeQty('${i.key}',1)">+</button></div>
      <div>R$ ${totalItem.toFixed(2).replace('.',',')}</div>
      <button onclick="removeFromCart('${i.key}')" class="icon-btn" style="color:#d33">x</button>`;
    list.appendChild(row);
  });
  calcTotals();
}

// Totais + entrega (sem mostrar preço no select)
const paymentEl=document.getElementById('payment'); const cashSection=document.getElementById('cash-section'); const cashAmountEl=document.getElementById('cash-amount');
paymentEl.onchange=()=>{ const cash=paymentEl.value==='Dinheiro'; cashSection.style.display=cash?'block':'none'; if(!cash){ document.querySelectorAll('input[name="cash-change"]').forEach(r=>r.checked=false); cashAmountEl.style.display='none'; cashAmountEl.value=''; } };
document.querySelectorAll('input[name="cash-change"]').forEach(r=>{ r.onchange=()=>{ cashAmountEl.style.display=r.value==='sim'?'inline-block':'none'; }; });

const deliveryTypeEl=document.getElementById('delivery-type'); const addressFields=document.getElementById('address-fields'); const neighborhoodEl=document.getElementById('neighborhood');
deliveryTypeEl.onchange=()=>{ addressFields.style.display=deliveryTypeEl.value==='entrega'?'block':'none'; calcTotals(); }; neighborhoodEl.onchange=calcTotals;

function calcTotals(){
  const base=cartTotal();
  document.getElementById('cart-total').textContent=base.toFixed(2).replace('.',',');
  let fee=0, show=false;
  if(deliveryTypeEl.value==='entrega'){
    const b=neighborhoodEl.value;
    if(b){ const f=FEES[b]; if(f!=='consultar'){ fee=f; show=true; } }
  }
  document.getElementById('delivery-fee').style.display=show?'block':'none';
  if(show) document.getElementById('fee-value').textContent=fee.toFixed(2).replace('.',',');
  const final=base+fee;
  document.getElementById('final-total').textContent=final.toFixed(2).replace('.',',');
  return final;
}

// Voltar ao topo
const back=document.getElementById('backToTop'); window.addEventListener('scroll',()=> back.classList.toggle('show', window.scrollY>600)); back.onclick=()=> window.scrollTo({top:0,behavior:'smooth'});

// --- Busca (tempo real)
const searchInput=document.getElementById('search-input');
const searchClear=document.getElementById('search-clear');
const searchResults=document.getElementById('search-results');
function allProducts(){ return Object.values(catalog).flat(); }
function doSearch(q){
  const term=q.trim().toLowerCase();
  if(!term){ searchResults.hidden=true; searchResults.innerHTML=''; return; }
  const results = allProducts().filter(p =>
    p.name.toLowerCase().includes(term) ||
    (p.colors||[]).some(c=>c.toLowerCase().includes(term)) ||
    Object.entries(catalog).some(([cat,arr]) => arr.includes(p) && cat.includes(term))
  ).slice(0,10);
  searchResults.hidden=false;
  searchResults.innerHTML = results.length? results.map(p=>`
    <div class="search-item" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}">
      <div><div style="font-weight:700">${p.name}</div><div style="color:#7A3BFD">${priceHTML(p)}</div></div>
      <button class="add-btn" data-add="${p.id}" style="padding:8px 10px">Ver</button>
    </div>`).join('') : '<div style="padding:8px">Sem resultados 😅</div>';
}
searchInput.addEventListener('input', ()=> doSearch(searchInput.value));
searchClear.onclick=()=>{ searchInput.value=''; searchResults.hidden=true; searchResults.innerHTML=''; }
searchResults.addEventListener('click', (e)=>{
  const id = e.target.closest('[data-id]')?.dataset.id;
  if(!id) return;
  openModal(id);
  searchResults.hidden=true; searchResults.innerHTML='';
});

// --- WhatsApp checkout + PDF admin
function sanitizeName(n){ return (n||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'').slice(0,40) || 'Cliente'; }
function todayStr(){ const d=new Date(); const dd=String(d.getDate()).padStart(2,'0'); const mm=String(d.getMonth()+1).padStart(2,'0'); const yy=d.getFullYear(); return `${dd}-${mm}-${yy}`; }
function generatePDF({name,items,total,payment,cashNote,delivery,address,notes}){
  const doc=new jsPDF(); let y=15;
  doc.setFontSize(18); doc.text('LS Store',15,20); y=28;
  doc.setFontSize(14); doc.text('Resumo do Pedido',15,y); y+=8; doc.setFontSize(11);
  doc.text(`Cliente: ${name}`,15,y); y+=6; doc.text(`Data: ${todayStr()}`,15,y); y+=8;
  doc.setFont(undefined,'bold'); doc.text('Itens:',15,y); doc.setFont(undefined,'normal'); y+=6;
  items.forEach(i=>{ doc.text(`• ${i.name} ${i.size?('('+i.size+')'):''} ${i.color?('- '+i.color):''} x${i.qty} — R$ ${(i.price*i.qty).toFixed(2)}`,18,y); y+=6; if(y>270){ doc.addPage(); y=20; } });
  y+=2; doc.text(`Total final: R$ ${total.toFixed(2)}`,15,y); y+=6; doc.text(`Pagamento: ${payment}`,15,y); y+=6; if(cashNote){ doc.text(cashNote.replace(/%0A/g,' | '),15,y); y+=6; } doc.text(`Entrega: ${delivery}`,15,y); y+=6; if(address){ doc.text(`Endereço: ${address}`,15,y); y+=6; } if(notes){ doc.text(`Obs: ${notes}`,15,y); y+=6; }
  const fname=`pedido-LSSTORE-${sanitizeName(name)}-${todayStr()}.pdf`; doc.save(fname);
}
document.getElementById('checkout').onclick=()=>{
  if(!cart.length) return alert('Seu carrinho está vazio.');
  const name=document.getElementById('client-name').value.trim(); if(!name) return alert('Informe seu nome.');
  const payment=document.getElementById('payment').value; let cashNote='';
  if(payment==='Dinheiro'){ const chosen=[...document.querySelectorAll('input[name="cash-change"]')].find(r=>r.checked); if(!chosen) return alert('Informe se precisa de troco.');
    if(chosen.value==='sim'){ const v=parseFloat((document.getElementById('cash-amount').value||'').replace(',','.')); if(isNaN(v)) return alert('Digite o valor que vai pagar.');
      const total=calcTotals(); if(v<total) return alert('O valor pago é menor que o total.'); const change=(v-total); cashNote=`Valor pago: R$ ${v.toFixed(2)}%0ATroco: R$ ${change.toFixed(2)}`; } else { cashNote='Sem troco'; } }
  const delivery=document.getElementById('delivery-type').value; let address='', feeNote='';
  if(delivery==='entrega'){ const street=document.getElementById('street').value.trim(); const number=document.getElementById('number').value.trim(); const b=neighborhoodEl.value;
    if(!street||!number||!b) return alert('Preencha rua, número e bairro.'); address=`Rua ${street}, Nº ${number}, Bairro ${b}`; const f=FEES[b]; feeNote=(f==='consultar')?'(consultar taxa de entrega)':`(+ R$ ${f.toFixed(2)} de entrega)`; }
  const notes=(document.getElementById('order-notes').value||'').trim(); const items=[...cart]; const final=calcTotals();

  if(ADMIN_MODE){ generatePDF({ name, items, total:final, payment, cashNote: payment==='Dinheiro'?cashNote:'', delivery, address: address?`${address} ${feeNote}`:'', notes }); }

  const itemsStr=items.map(i=>`• ${i.name} — Tam ${i.size||'-'} — Cor ${i.color||'-'} — x${i.qty} — R$ ${(i.price*i.qty).toFixed(2)}`).join('%0A');
  let msg=`🛍️ *NOVO PEDIDO - LS STORE*%0A---------------------------------%0A👩‍💖 *Cliente:* ${name}%0A💳 *Pagamento:* ${payment}`;
  msg+=`%0A📦 *Entrega:* ${delivery}`; if(address) msg+=`%0A🏡 *Endereço:* ${address} ${feeNote}`; if(notes) msg+=`%0A💬 *Observações:* ${notes}`;
  msg+=`%0A%0A🧺 *Itens do pedido:*%0A${itemsStr}`;
  const feeDisp=(delivery==='entrega'&&neighborhoodEl.value)?FEES[neighborhoodEl.value]:0;
  if(feeDisp && feeDisp!=='consultar'){ msg+=`%0A%0A🚚 *Taxa de entrega:* R$ ${feeDisp.toFixed(2)}`; }
  msg+=`%0A💰 *Total final:* R$ ${final.toFixed(2)}%0A---------------------------------%0A✨ *Obrigada por comprar na LS Store!* 💖`;

  playChime();
  const pop = document.getElementById('popup-overlay');
pop.classList.add('show');
setTimeout(() => { pop.classList.remove('show'); }, 1600);

  location.href=`https://wa.me/${WHATSAPP}?text=${msg}`;
};

// --- Login/Cadastro (versão simples localStorage + “gancho” pra Firebase)
const accountArea = document.getElementById('account-area');
function renderAccount(){
  const user = JSON.parse(localStorage.getItem('ls_user')||'null');
  if(!user){
    accountArea.innerHTML = `
      <div class="card" style="padding:12px">
        <h3>Entrar</h3>
        <label>E-mail<input id="login-email" type="email"></label>
        <label>Senha<input id="login-pass" type="password"></label>
        <button id="do-login" class="add-btn" style="margin-top:8px">Entrar</button>
        <hr style="margin:14px 0;border:none;border-top:1px solid #eee">
        <h3>Criar conta</h3>
        <label>Nome<input id="reg-name" type="text"></label>
        <label>E-mail<input id="reg-email" type="email"></label>
        <label>Senha<input id="reg-pass" type="password"></label>
        <button id="do-register" class="add-btn" style="margin-top:8px">Cadastrar</button>
        <p style="font-size:12px;color:#6b5a70;margin-top:8px">Dica: depois podemos trocar para Firebase Auth — basta inserir sua config no script.</p>
      </div>
    `;
    document.getElementById('do-login').onclick=()=>{
      const email=document.getElementById('login-email').value.trim();
      const pass=document.getElementById('login-pass').value.trim();
      const db=JSON.parse(localStorage.getItem('ls_users')||'[]');
      const u=db.find(x=>x.email===email && x.pass===pass);
      if(!u) return alert('Credenciais inválidas');
      localStorage.setItem('ls_user', JSON.stringify({name:u.name,email:u.email}));
      renderAccount();
    };
    document.getElementById('do-register').onclick=()=>{
      const name=document.getElementById('reg-name').value.trim();
      const email=document.getElementById('reg-email').value.trim();
      const pass=document.getElementById('reg-pass').value.trim();
      if(!name||!email||!pass) return alert('Preencha todos os campos');
      const db=JSON.parse(localStorage.getItem('ls_users')||'[]');
      if(db.find(x=>x.email===email)) return alert('E-mail já cadastrado');
      db.push({name,email,pass}); localStorage.setItem('ls_users', JSON.stringify(db));
      localStorage.setItem('ls_user', JSON.stringify({name,email}));
      renderAccount();
    };
  } else {
    accountArea.innerHTML = `
      <div class="card" style="padding:12px">
        <p><strong>Olá, ${user.name}</strong></p>
        <p>${user.email}</p>
        <button id="logout" class="add-btn" style="background:#eee;color:#333">Sair</button>
      </div>
    `;
    document.getElementById('logout').onclick=()=>{ localStorage.removeItem('ls_user'); renderAccount(); };
  }
}
renderAccount();

// Botão "Entrar" no topo navega pra Minha Conta
document.getElementById('login-btn').onclick=()=>{ showSection('minha-conta'); };

// --- Monta listas
function cardClickAttach(){ document.querySelectorAll('.card').forEach(c=>c.onclick=()=>openModal(c.getAttribute('data-id'))); }
renderAll(); cardClickAttach();

// --- Clique fora do modal fecha
// (já tratado acima)

// --- Mostrar seções via links do rodapé
document.querySelectorAll('.footer a[data-section]').forEach(a=>{
  a.onclick=(e)=>{ e.preventDefault(); showSection(a.getAttribute('data-section')); }
});

// --- Calcular totais no início
calcTotals();
