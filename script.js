// =========================
// LS STORE v11.2.3 — Correções (splash + modal + login + carrinho)
// =========================
const { jsPDF } = window.jspdf;

// --- Configurações
const WHATSAPP = '5551989235482';
const ADMIN_MODE = new URLSearchParams(location.search).get('admin') === 'true';
const FEES = {
  "Mathias Velho":5,"Harmonia":6,"Mato Grande":7,"São Luís":8,
  "Centro":8,"Fátima":9,"Igara":10,"Rio Branco":10,"Industrial":10,
  "Marechal Rondon":11,"Estância Velha":12,"Guajuviras":15,"Olaria":16,"Outra Cidade":"consultar"
};
const INSTAGRAM_HANDLE = '@ls_store.fc';

// --- Links Instagram (app + web)
const instaDeepLink = `instagram://user?username=${INSTAGRAM_HANDLE.replace('@','')}`;
const instaWeb = `https://www.instagram.com/${INSTAGRAM_HANDLE.replace('@','')}`;
const instaLink = document.getElementById('insta-link');
const footerInsta = document.getElementById('footer-insta');
[instaLink, footerInsta].forEach(a=>{
  if(!a) return;
  a.href = instaWeb;
  a.addEventListener('click', e=>{
    e.preventDefault();
    window.location.href = instaDeepLink;
    setTimeout(()=>window.open(instaWeb, '_blank', 'noopener'),700);
  });
});

// --- Splash (corrigido para não travar)
document.addEventListener('DOMContentLoaded', ()=>{
  const s = document.getElementById('splash');
  if(!s) return;
  setTimeout(()=>{
    s.classList.add('hidden');
    setTimeout(()=>s.remove(),650);
  }, 2000);
});

// --- Áudio (efeitos)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playChime(){const t=audioCtx.currentTime;const o=audioCtx.createOscillator();const g=audioCtx.createGain();
  o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(1318,t+0.35);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.2,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+0.7);
  o.connect(g).connect(audioCtx.destination);o.start(t);o.stop(t+0.75);}
function clickSoft(){const t=audioCtx.currentTime;const o=audioCtx.createOscillator();const g=audioCtx.createGain();
  o.type='triangle';o.frequency.setValueAtTime(600,t);o.frequency.exponentialRampToValueAtTime(900,t+0.08);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.12,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+0.15);
  o.connect(g).connect(audioCtx.destination);o.start(t);o.stop(t+0.18);}

// --- Menu Drawer
const drawer=document.getElementById('drawer');
const menuBtn=document.getElementById('menu-btn');
const closeDrawer=document.getElementById('close-drawer');
const drawerGrid=document.getElementById('drawer-grid');
const categories=[
  {key:'blusas',name:'Blusas',img:'https://images.unsplash.com/photo-1624996379697-a7c8d6df7a70?q=80&w=1200&auto=format&fit=crop'},
  {key:'calcas',name:'Calças',img:'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop'},
  {key:'vestidos',name:'Vestidos',img:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop'},
  {key:'intimas',name:'Roupas Íntimas',img:'https://images.unsplash.com/photo-1583496661160-fb5886a95736?q=80&w=1200&auto=format&fit=crop'},
  {key:'calcados',name:'Calçados',img:'https://images.unsplash.com/photo-1460355296524-6c2fd3f3a3f4?q=80&w=1200&auto=format&fit=crop'},
  {key:'oculos',name:'Óculos',img:'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop'},
  {key:'cosmeticos',name:'Cosméticos',img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'},
  {key:'beleza',name:'Beleza',img:'https://images.unsplash.com/photo-1608222351212-69c3ab3b1bda?q=80&w=1200&auto=format&fit=crop'}
];
drawerGrid.innerHTML = categories.map(c=>`
  <div class="cat-card" data-target="${c.key}">
    <img src="${c.img}" alt="${c.name}">
    <div class="label">${c.name}</div>
  </div>`).join('');
drawerGrid.addEventListener('click',e=>{
  const card=e.target.closest('.cat-card');
  if(!card) return;
  const sec=card.dataset.target;
  showSection(sec);
  drawer.setAttribute('aria-hidden','true');
});
menuBtn.onclick=()=>{drawer.setAttribute('aria-hidden',drawer.getAttribute('aria-hidden')==='true'?'false':'true');clickSoft();}
closeDrawer.onclick=()=>{drawer.setAttribute('aria-hidden','true');clickSoft();}
drawer.querySelector('.drawer-backdrop').onclick=()=>drawer.setAttribute('aria-hidden','true');

// --- Navegação entre seções
document.querySelectorAll('.drawer-links a[data-section], .footer a[data-section]').forEach(a=>{
  a.onclick=e=>{
    e.preventDefault();
    showSection(a.getAttribute('data-section'));
    drawer.setAttribute('aria-hidden','true');
  };
});
function showSection(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
  window.scrollTo({top:0,behavior:'smooth'});
}

// --- Catálogo
const catalog = {
  vestidos:[
    {id:'v1',name:'Vestido Floral Midi',price:159.9,
      imgs:[
        'https://images.unsplash.com/photo-1614691812260-0b2152d5f83e?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614691812260-0b2152d5f83e?q=80&w=1200&auto=format&fit=crop'
      ],
      sizes:['P','M','G'],colors:['Rosa','Branco'],stock:5,isNew:true,
      desc:'Vestido midi floral em tecido leve, caimento perfeito.'
    },
    {id:'v2',name:'Vestido Longo Fenda',price:179.9,
      imgs:[
        'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop'
      ],
      sizes:['M','G','GG'],colors:['Preto','Bege'],stock:3,
      desc:'Longo com fenda lateral e cintura marcada.'
    }
  ],
  calcas:[
    {id:'c1',name:'Calça Jeans Cintura Alta',price:139.9,
      imgs:[
        'https://images.unsplash.com/photo-1618354691438-25e01c74f8b1?q=80&w=1200&auto=format&fit=crop'
      ],
      sizes:['P','M','G'],colors:['Azul','Preto'],stock:7,
      desc:'Jeans com stretch e cintura alta.'
    }
  ]
};

// --- Destaques
const featured=[catalog.vestidos[0],catalog.calcas[0]];

function priceHTML(p){
  const v=p.discount?(p.price*(1-p.discount)):p.price;
  let s=`R$ ${v.toFixed(2).replace('.',',')}`;
  if(p.discount){
    s+=` <span style="text-decoration:line-through;color:#8a7aa5;font-size:12px;margin-left:6px">R$ ${p.price.toFixed(2).replace('.',',')}</span>`;
  }
  return s;
}
function badgeHTML(p){
  if(p.stock<=0) return '<span class="badge">Esgotado</span>';
  if(p.discount) return '<span class="badge">-30%</span>';
  if(p.isNew) return '<span class="badge">Novo</span>';
  return '';
}
function cardHTML(p){
  return `<div class="card" data-id="${p.id}">
    ${badgeHTML(p)}
    <img src="${(p.imgs?p.imgs[0]:p.img)}" alt="${p.name}"/>
    <div class="info"><p class="name">${p.name}</p><p class="price">${priceHTML(p)}</p></div>
  </div>`;
}
function renderGrid(el,arr){
  el.innerHTML=arr.map(cardHTML).join('');
  el.querySelectorAll('.card').forEach(c=>c.onclick=()=>openModal(c.getAttribute('data-id')));
}
function renderAll(){
  const f=document.getElementById('featured');if(f)renderGrid(f,featured);
  document.querySelectorAll('[data-cat]').forEach(g=>{
    const cat=g.getAttribute('data-cat');
    renderGrid(g,catalog[cat]||[]);
  });
}
renderAll();

// =============================
// MODAL DE PRODUTO (corrigido)
// =============================
const modal=document.getElementById('product-modal');
const modalImgs=document.getElementById('modal-imgs');
const modalName=document.getElementById('modal-name');
const modalPrice=document.getElementById('modal-price');
const modalDesc=document.getElementById('modal-desc');
const sizeOpt=document.getElementById('size-options');
const colorOpt=document.getElementById('color-options');
const modalAdd=document.getElementById('modal-add');
const modalClose=document.getElementById('modal-close');

let currentProduct=null,selectedSize='',selectedColor='';

function openModal(id){
  for(const cat in catalog){
    const prod=catalog[cat].find(p=>p.id===id);
    if(prod){ currentProduct=prod; break; }
  }
  if(!currentProduct) return;
  modalName.textContent=currentProduct.name;
  modalPrice.textContent=`R$ ${currentProduct.price.toFixed(2).replace('.',',')}`;
  modalDesc.textContent=currentProduct.desc;
  selectedSize=''; selectedColor='';

  // múltiplas imagens (corrigido)
  const imgsHTML=(currentProduct.imgs||[currentProduct.img||'']).slice(0,5)
    .map(i=>`<img src="${i}" alt="${currentProduct.name}">`).join('');
  modalImgs.innerHTML = imgsHTML;

  // opções de tamanho/cor
  sizeOpt.innerHTML=currentProduct.sizes.map(s=>`<button>${s}</button>`).join('');
  colorOpt.innerHTML=currentProduct.colors.map(c=>`<button>${c}</button>`).join('');
  sizeOpt.querySelectorAll('button').forEach(b=>b.onclick=()=>{selectedSize=b.textContent;sizeOpt.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');});
  colorOpt.querySelectorAll('button').forEach(b=>b.onclick=()=>{selectedColor=b.textContent;colorOpt.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');});
  
  modal.setAttribute('aria-hidden','false');
}
modalClose.onclick=()=>modal.setAttribute('aria-hidden','true');
modal.addEventListener('click',e=>{if(e.target===modal)modal.setAttribute('aria-hidden','true');});

// =============================
// ALERTA (reaproveitado)
// =============================
function showAlert(msg){
  const overlay=document.createElement('div');
  overlay.style.position='fixed';
  overlay.style.inset='0';
  overlay.style.background='rgba(0,0,0,.4)';
  overlay.style.display='flex';
  overlay.style.alignItems='center';
  overlay.style.justifyContent='center';
  overlay.style.zIndex='9999';
  overlay.innerHTML=`<div style="background:#fff;border-radius:16px;padding:20px 24px;text-align:center;max-width:320px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <p style="font-weight:600;color:#7A3BFD;margin-bottom:10px;">⚠️ Atenção</p>
    <p style="margin-bottom:12px">${msg}</p>
    <button style="background:linear-gradient(90deg,#E96BA8,#7A3BFD);color:#fff;border:0;border-radius:10px;padding:8px 16px;font-weight:600;cursor:pointer;">Ok</button>
  </div>`;
  overlay.querySelector('button').onclick=()=>overlay.remove();
  document.body.appendChild(overlay);
}

// =============================
// CARRINHO
// =============================
const cart=document.getElementById('cart');
const cartBtn=document.getElementById('cart-btn');
const cartCount=document.getElementById('cart-count');
const cartItems=document.getElementById('cart-items');
const cartTotal=document.getElementById('cart-total');
const finalTotal=document.getElementById('final-total');
const feeValue=document.getElementById('fee-value');
const deliveryFee=document.getElementById('delivery-fee');
const closeCart=document.getElementById('close-cart');
const checkout=document.getElementById('checkout');

let items=[];

cartBtn.onclick=()=>cart.setAttribute('aria-hidden','false');
closeCart.onclick=()=>cart.setAttribute('aria-hidden','true');

function updateCart(){
  cartItems.innerHTML='';
  let total=0;
  items.forEach((it,i)=>{
    const row=document.createElement('div');
    row.className='row';
    row.innerHTML=`
      <small>${it.name} (${it.size}/${it.color})</small>
      <small>R$ ${it.price.toFixed(2).replace('.',',')}</small>
      <button data-i="${i}" style="border:0;background:transparent;color:#E96BA8;font-weight:700;cursor:pointer;">✕</button>`;
    cartItems.appendChild(row);
    total+=it.price;
  });
  cartTotal.textContent=total.toFixed(2).replace('.',',');
  cartCount.textContent=items.length;
  finalTotal.textContent=total.toFixed(2).replace('.',',');
  cartItems.querySelectorAll('button').forEach(b=>b.onclick=()=>{items.splice(b.dataset.i,1);updateCart();});
}
function addToCart(prod,size,color){
  items.push({name:prod.name,size,color,price:prod.price});
  cartBtn.classList.add('pulse');
  setTimeout(()=>cartBtn.classList.remove('pulse'),400);
  updateCart();
}

// =============================
// ENTREGA, PAGAMENTO E WHATSAPP
// =============================
const nameInput=document.getElementById('client-name');
const paymentSel=document.getElementById('payment');
const cashSection=document.getElementById('cash-section');
const cashRadios=cashSection.querySelectorAll('input[name="cash-change"]');
const cashAmount=document.getElementById('cash-amount');
const deliveryType=document.getElementById('delivery-type');
const addressFields=document.getElementById('address-fields');
const neighborhood=document.getElementById('neighborhood');
const orderNotes=document.getElementById('order-notes');

paymentSel.onchange=()=>{
  const v=paymentSel.value;
  cashSection.style.display=(v==='Dinheiro')?'block':'none';
};
cashRadios.forEach(r=>r.onchange=()=>{
  cashAmount.style.display=(r.value==='sim')?'inline-block':'none';
});
deliveryType.onchange=()=>{
  addressFields.style.display=(deliveryType.value==='entrega')?'block':'none';
};

checkout.onclick=()=>{
  // exige tamanho/cor e itens
  if(items.length===0){showAlert('Seu carrinho está vazio.');return;}
  if(!nameInput.value.trim()){showAlert('Por favor, informe seu nome.');return;}

  const client=nameInput.value.trim();
  const payment=paymentSel.value;
  const entrega=deliveryType.value;
  const bairro=neighborhood.value;
  const obs=orderNotes.value.trim()||'Nenhuma';
  const fee=entrega==='entrega'?FEES[bairro]||'consultar':0;
  let total=parseFloat(cartTotal.textContent.replace(',','.'));
  if(typeof fee==='number') total+=fee;

  let valorPago='',troco='';
  if(payment==='Dinheiro'){
    const trocoOp=[...cashRadios].find(r=>r.checked)?.value||'nao';
    if(trocoOp==='sim' && cashAmount.value){
      valorPago=parseFloat(cashAmount.value.replace(',','.'));
      troco=(valorPago-total).toFixed(2).replace('.',',');
    }else troco='Não precisa';
  }

  const itensTxt=items.map(it=>`
---------------------------------
👗 *Produto:* ${it.name}
📏 *Tamanho:* ${it.size}
🎨 *Cor:* ${it.color}
💰 *Preço:* R$ ${it.price.toFixed(2).replace('.',',')}
---------------------------------`).join('');

  const msg=`🛍️ *NOVO PEDIDO - LS STORE*
---------------------------------
👩‍💖 *Cliente:* ${client}
📦 *Entrega:* ${entrega}
🏡 *Endereço:* ${entrega==='entrega'?bairro:'Retirada na loja'}
💬 *Observações:* ${obs}

🧺 *Itens do pedido:*
${itensTxt}

💳 *Pagamento:* ${payment}
🚚 *Taxa de entrega:* ${typeof fee==='number'?`R$ ${fee.toFixed(2).replace('.',',')}`:fee}
💰 *Total final:* R$ ${total.toFixed(2).replace('.',',')}
${payment==='Dinheiro'?`\n💵 *Valor pago:* R$ ${valorPago}\n🔁 *Troco:* ${troco}`:''}
---------------------------------
✨ *Obrigada por comprar na LS Store!* 💖`;

  const url=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  window.open(url,'_blank');
  const p=document.getElementById('popup-overlay');
  p.hidden=false; p.classList.add('show');
  setTimeout(()=>{p.hidden=true;},5000);
};

// =============================
// VOLTAR AO TOPO
// =============================
const backToTop=document.getElementById('backToTop');
window.addEventListener('scroll',()=>{
  if(window.scrollY>400) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
});
backToTop.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});

// =============================
// LOGIN (ajuste de montagem do card)
// =============================
const loginBtn=document.getElementById('login-btn');
const accountArea=document.getElementById('account-area');
loginBtn.onclick=()=>{
  accountArea.innerHTML=`<div class="auth-card">
    <div class="auth-title">
      <h3>Entrar</h3>
      <button class="close-auth">✕</button>
    </div>
    <label>Email
      <input type="email" id="login-email" placeholder="Digite seu e-mail">
    </label>
    <label>Senha
      <input type="password" id="login-pass" placeholder="Digite sua senha">
    </label>
    <div class="auth-actions">
      <button class="add-btn" id="login-ok">Entrar</button>
      <button class="add-btn" style="background:linear-gradient(90deg,#E96BA8,#7A3BFD)" id="register">Criar conta</button>
    </div>
  </div>`;
  accountArea.classList.add('account-area'); // garante layout aplicado
  accountArea.querySelector('.close-auth').onclick=()=>accountArea.innerHTML='';
  accountArea.querySelector('#login-ok').onclick=()=>showAlert('Função de login em desenvolvimento 💜');
  accountArea.querySelector('#register').onclick=()=>showAlert('Cadastro disponível em breve 💖');
  showSection('minha-conta');
};

// =============================
// ADMIN (gerar PDF pedidos)
// =============================
if(ADMIN_MODE){
  const pdfBtn=document.createElement('button');
  pdfBtn.textContent='Gerar PDF';
  pdfBtn.style='position:fixed;bottom:90px;right:16px;background:#7A3BFD;color:#fff;border:0;border-radius:12px;padding:10px 16px;font-weight:700;cursor:pointer;z-index:9999;';
  document.body.appendChild(pdfBtn);
  pdfBtn.onclick=()=>{
    const doc=new jsPDF();
    doc.text('Pedidos LS STORE',20,20);
    let y=40;
    items.forEach((it,i)=>{
      doc.text(`${i+1}. ${it.name} - ${it.size}/${it.color} - R$${it.price.toFixed(2)}`,20,y);
      y+=10;
    });
    doc.save('pedido-lsstore.pdf');
  };
}
