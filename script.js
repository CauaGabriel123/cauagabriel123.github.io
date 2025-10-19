// =========================
// LS STORE v11.3 — Cauã (Splash corrigido + melhorias gerais)
// =========================
const { jsPDF } = window.jspdf;

// --- Configurações
const WHATSAPP = '5551989235482';
const ADMIN_MODE = new URLSearchParams(location.search).get('admin') === 'true';
const FEES = {"Mathias Velho":5,"Harmonia":6,"Mato Grande":7,"São Luís":8,"Centro":8,"Fátima":9,"Igara":10,"Rio Branco":10,"Industrial":10,"Marechal Rondon":11,"Estância Velha":12,"Guajuviras":15,"Olaria":16,"Outra Cidade":"consultar"};

// --- SPLASH (agora com fallback garantido)
window.addEventListener('load',()=>{
  console.log('[LS] Página carregada — splash iniciando');
  setTimeout(()=>{
    const s=document.getElementById('splash');
    if(s){
      s.classList.add('hidden');
      setTimeout(()=>s.remove(),700);
      console.log('[LS] Splash removido normalmente ✅');
    }
  },2000);
});

// fallback de segurança (6s)
setTimeout(()=>{
  const s=document.getElementById('splash');
  if(s){
    console.warn('[LS] Fallback: splash ainda ativo, removendo à força ⚠️');
    s.classList.add('hidden');
    setTimeout(()=>s.remove(),700);
  }
},6000);

// --- Áudio leve (clique e sino)
const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
function playChime(){
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  const t=audioCtx.currentTime;
  o.type='sine';o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(1318,t+0.35);
  g.gain.setValueAtTime(0.001,t);g.gain.exponentialRampToValueAtTime(0.2,t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+0.7);
  o.connect(g).connect(audioCtx.destination);o.start(t);o.stop(t+0.75);
}

// --- Catálogo (mantido igual, resumido aqui)
const catalog = {
  vestidos:[
    {id:'v1',name:'Vestido Floral Midi',price:159.9,
     imgs:[
       'https://images.unsplash.com/photo-1614691812260-0b2152d5f83e?q=80&w=1200',
       'https://images.unsplash.com/photo-1618376620619-b7e0aef60f51?q=80&w=1200',
       'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1200'
     ],
     sizes:['P','M','G'],colors:['Rosa','Branco'],stock:5,desc:'Vestido midi floral em tecido leve.'}
  ]
};

// --- Renderizar produtos
function renderGrid(el,arr){
  el.innerHTML=arr.map(p=>`
    <div class="card" data-id="${p.id}">
      <img src="${p.imgs?p.imgs[0]:p.img}" alt="${p.name}">
      <div class="info"><p class="name">${p.name}</p><p class="price">R$ ${p.price.toFixed(2).replace('.',',')}</p></div>
    </div>`).join('');
  el.querySelectorAll('.card').forEach(c=>c.onclick=()=>openModal(c.dataset.id));
}
const featured=document.getElementById('featured');
if(featured) renderGrid(featured,catalog.vestidos);

// --- Modal produto (até 5 imagens)
const modal=document.getElementById('product-modal');
const modalName=document.getElementById('modal-name');
const modalDesc=document.getElementById('modal-desc');
const modalPrice=document.getElementById('modal-price');
const modalAdd=document.getElementById('modal-add');
const sizeOpt=document.getElementById('size-options');
const colorOpt=document.getElementById('color-options');
let currentProduct=null,selectedSize='',selectedColor='';

function openModal(id){
  for(const cat in catalog){
    const prod=catalog[cat].find(p=>p.id===id);
    if(prod){ currentProduct=prod; break; }
  }
  if(!currentProduct)return;
  modalName.textContent=currentProduct.name;
  modalDesc.textContent=currentProduct.desc;
  modalPrice.textContent=`R$ ${currentProduct.price.toFixed(2).replace('.',',')}`;
  const imgsHTML=(currentProduct.imgs||[currentProduct.img]).slice(0,5).map(i=>`<img src="${i}" alt="">`).join('');
  document.getElementById('modal-img').outerHTML=`<div class="modal-imgs">${imgsHTML}</div>`;
  sizeOpt.innerHTML=currentProduct.sizes.map(s=>`<button>${s}</button>`).join('');
  colorOpt.innerHTML=currentProduct.colors.map(c=>`<button>${c}</button>`).join('');
  sizeOpt.querySelectorAll('button').forEach(b=>b.onclick=()=>{selectedSize=b.textContent;sizeOpt.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');});
  colorOpt.querySelectorAll('button').forEach(b=>b.onclick=()=>{selectedColor=b.textContent;colorOpt.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');});
  modal.setAttribute('aria-hidden','false');
}
document.getElementById('modal-close').onclick=()=>modal.setAttribute('aria-hidden','true');
modal.addEventListener('click',e=>{if(e.target===modal)modal.setAttribute('aria-hidden','true');});

// --- Alerta suave
function showAlert(msg){
  const o=document.createElement('div');
  o.style=`position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.4);z-index:9999`;
  o.innerHTML=`<div style="background:#fff;border-radius:14px;padding:20px 24px;max-width:300px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)">
  <p style="font-weight:600;color:#7A3BFD;margin-bottom:8px;">⚠️ Atenção</p><p>${msg}</p>
  <button style="margin-top:12px;background:linear-gradient(90deg,#E96BA8,#7A3BFD);color:#fff;border:0;border-radius:10px;padding:8px 16px;cursor:pointer;">OK</button></div>`;
  o.querySelector('button').onclick=()=>o.remove();
  document.body.appendChild(o);
}

modalAdd.onclick=()=>{
  if(!selectedSize||!selectedColor){
    showAlert('Selecione o tamanho e a cor antes de adicionar ao carrinho!');
    return;
  }
  addToCart(currentProduct,selectedSize,selectedColor);
  modal.setAttribute('aria-hidden','true');
  playChime();
};

// --- Carrinho
let items=[];
const cart=document.getElementById('cart');
const cartBtn=document.getElementById('cart-btn');
const cartItems=document.getElementById('cart-items');
const cartCount=document.getElementById('cart-count');
const cartTotal=document.getElementById('cart-total');
const finalTotal=document.getElementById('final-total');
const closeCart=document.getElementById('close-cart');
cartBtn.onclick=()=>cart.setAttribute('aria-hidden','false');
closeCart.onclick=()=>cart.setAttribute('aria-hidden','true');

function addToCart(prod,size,color){
  items.push({name:prod.name,size,color,price:prod.price});
  updateCart();
}
function updateCart(){
  cartItems.innerHTML='';
  let total=0;
  items.forEach((it,i)=>{
    const r=document.createElement('div');
    r.className='row';
    r.innerHTML=`<div>${it.name}<br><small>${it.size} • ${it.color}</small></div>
    <div>R$ ${it.price.toFixed(2).replace('.',',')}</div>
    <button data-i="${i}" style="border:0;background:none;color:#E96BA8;font-weight:700;cursor:pointer;">✕</button>`;
    cartItems.appendChild(r);
    total+=it.price;
  });
  cartTotal.textContent=total.toFixed(2).replace('.',',');
  finalTotal.textContent=total.toFixed(2).replace('.',',');
  cartCount.textContent=items.length;
  cartItems.querySelectorAll('button').forEach(b=>b.onclick=()=>{items.splice(b.dataset.i,1);updateCart();});
}

// --- Checkout / WhatsApp
const checkout=document.getElementById('checkout');
checkout.onclick=()=>{
  if(!items.length){showAlert('Seu carrinho está vazio.');return;}
  const nome=document.getElementById('client-name').value.trim()||'Cliente';
  const pagamento=document.getElementById('payment').value;
  const entrega=document.getElementById('delivery-type').value;
  const bairro=document.getElementById('neighborhood').value;
  const obs=document.getElementById('order-notes').value.trim()||'Nenhuma';
  const fee=entrega==='entrega'?FEES[bairro]||'consultar':0;
  let total=parseFloat(cartTotal.textContent.replace(',','.'));
  if(typeof fee==='number') total+=fee;

  const itensTxt=items.map(it=>`
---------------------------------
👗 *Produto:* ${it.name}
📏 *Tamanho:* ${it.size}
🎨 *Cor:* ${it.color}
💰 *Preço:* R$ ${it.price.toFixed(2).replace('.',',')}
---------------------------------`).join('');

  const msg=`🛍️ *NOVO PEDIDO - LS STORE*
---------------------------------
👩‍💖 *Cliente:* ${nome}
📦 *Entrega:* ${entrega}
🏡 *Endereço:* ${entrega==='entrega'?bairro:'Retirada na loja'}
💬 *Observações:* ${obs}

🧺 *Itens do pedido:*
${itensTxt}

💳 *Pagamento:* ${pagamento}
🚚 *Taxa de entrega:* ${typeof fee==='number'?`R$ ${fee.toFixed(2).replace('.',',')}`:fee}
💰 *Total final:* R$ ${total.toFixed(2).replace('.',',')}
---------------------------------
✨ *Obrigada por comprar na LS Store!* 💖`;

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,'_blank');
  const pop=document.getElementById('popup-overlay');
  if(pop){pop.hidden=false;pop.classList.add('show');setTimeout(()=>{pop.hidden=true;},4000);}
};

// --- Login estilizado
document.getElementById('login-btn').onclick=()=>{
  const area=document.getElementById('account-area');
  area.innerHTML=`<div class="auth-card"><div class="auth-title">
  <h3>Entrar</h3><button class="close-auth">✕</button></div>
  <label>Email<input id="email" type="email"></label>
  <label>Senha<input id="senha" type="password"></label>
  <div class="auth-actions"><button class="add-btn">Entrar</button></div></div>`;
  area.querySelector('.close-auth').onclick=()=>area.innerHTML='';
};

// --- PDF admin (modo admin)
if(ADMIN_MODE){
  const pdfBtn=document.createElement('button');
  pdfBtn.textContent='Gerar PDF';
  pdfBtn.style='position:fixed;bottom:80px;right:16px;background:#7A3BFD;color:#fff;border:0;border-radius:10px;padding:10px 16px;font-weight:700;z-index:999;';
  document.body.appendChild(pdfBtn);
  pdfBtn.onclick=()=>{
    const doc=new jsPDF();doc.text('Pedidos LS STORE',20,20);let y=40;
    items.forEach((it,i)=>{doc.text(`${i+1}. ${it.name} - ${it.size}/${it.color} - R$${it.price.toFixed(2)}`,20,y);y+=10;});
    doc.save('pedido-lsstore.pdf');
  };
}
