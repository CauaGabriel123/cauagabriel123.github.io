// LS STORE v11.1 — popup corrigido, animação suave, blur no menu, busca e login local
const { jsPDF } = window.jspdf;

const WHATSAPP = '5551989235482';
const ADMIN_MODE = new URLSearchParams(location.search).get('admin') === 'true';
const FEES = {"Mathias Velho":5,"Harmonia":6,"Mato Grande":7,"São Luís":8,"Centro":8,"Fátima":9,"Igara":10,"Rio Branco":10,"Industrial":10,"Marechal Rondon":11,"Estância Velha":12,"Guajuviras":15,"Olaria":16,"Outra Cidade":"consultar"};
const INSTAGRAM_HANDLE='@ls_store.fc';

// Splash
window.addEventListener('load',()=>{
  setTimeout(()=>{
    const s=document.getElementById('splash'); if(!s) return;
    s.classList.add('hidden'); setTimeout(()=>s.remove(),650);
  },2000);
});

// Áudio (sino + click)
const audioCtx=new (window.AudioContext||window.webkitAudioContext)();
function playChime(){const t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';
o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(1318,t+0.35);
g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.25,t+0.03);g.gain.exponentialRampToValueAtTime(.001,t+0.7);
o.connect(g).connect(audioCtx.destination);o.start(t);o.stop(t+0.75);}
function clickSoft(){const t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();
o.type='triangle';o.frequency.setValueAtTime(500,t);o.frequency.exponentialRampToValueAtTime(700,t+0.1);
g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.1,t+0.02);g.gain.exponentialRampToValueAtTime(.001,t+0.2);
o.connect(g).connect(audioCtx.destination);o.start(t);o.stop(t+0.25);}

// Instagram deep link (app → fallback web)
const instaDeep=`instagram://user?username=${INSTAGRAM_HANDLE.replace('@','')}`;
const instaWeb=`https://www.instagram.com/${INSTAGRAM_HANDLE.replace('@','')}`;
['insta-link','footer-insta'].forEach(id=>{
  const a=document.getElementById(id); if(!a) return; a.href=instaWeb;
  a.addEventListener('click',e=>{e.preventDefault();location.href=instaDeep;setTimeout(()=>window.open(instaWeb,'_blank','noopener'),700);});
});

// Drawer + categorias visuais
const drawer=document.getElementById('drawer'), menuBtn=document.getElementById('menu-btn'), closeDrawer=document.getElementById('close-drawer'), drawerGrid=document.getElementById('drawer-grid');
const categories=[
  {key:'blusas',name:'Blusas',img:'https://images.unsplash.com/photo-1624996379697-a7c8d6df7a70?q=80&w=1200&auto=format&fit=crop'},
  {key:'calcas',name:'Calças',img:'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop'},
  {key:'vestidos',name:'Vestidos',img:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop'},
  {key:'intimas',name:'Roupas Íntimas',img:'https://images.unsplash.com/photo-1583496661160-fb5886a95736?q=80&w=1200&auto=format&fit=crop'},
  {key:'calcados',name:'Calçados',img:'https://images.unsplash.com/photo-1460355296524-6c2fd3f3a3f4?q=80&w=1200&auto=format&fit=crop'},
  {key:'oculos',name:'Óculos',img:'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop'},
  {key:'cosmeticos',name:'Cosméticos',img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'},
  {key:'beleza',name:'Beleza',img:'https://images.unsplash.com/photo-1608222351212-69c3ab3b1bda?q=80&w=1200&auto=format&fit=crop'},
];
drawerGrid.innerHTML=categories.map(c=>`
  <div class="cat-card" data-target="${c.key}">
    <img src="${c.img}" alt="${c.name}"><div class="label">${c.name}</div>
  </div>`).join('');
drawerGrid.addEventListener('click',e=>{
  const card=e.target.closest('.cat-card'); if(!card) return;
  showSection(card.dataset.target); drawer.setAttribute('aria-hidden','true');
});
menuBtn.onclick=()=>{drawer.setAttribute('aria-hidden',drawer.getAttribute('aria-hidden')==='true'?'false':'true');clickSoft();}
closeDrawer.onclick=()=>{drawer.setAttribute('aria-hidden','true');clickSoft();}
drawer.querySelector('.drawer-backdrop').onclick=()=>drawer.setAttribute('aria-hidden','true');
document.querySelectorAll('.drawer-links a[data-section], .footer a[data-section]').forEach(a=>{
  a.onclick=e=>{e.preventDefault();showSection(a.getAttribute('data-section'));drawer.setAttribute('aria-hidden','true');};
});
function showSection(id){document.querySelectorAll('.section').forEach(s=>s.classList.remove('visible'));document.getElementById(id).classList.add('visible');window.scrollTo({top:0,behavior:'smooth'});}

// Carousel + swipe
const slides=document.querySelector('.slides'), dots=[...document.querySelectorAll('.dot')]; let idx=0, timer=null;
function go(i){idx=(i+dots.length)%dots.length; slides.style.transform=`translateX(-${idx*100}%)`; dots.forEach((d,j)=>d.classList.toggle('active',j===idx));}
function auto(){clearInterval(timer);timer=setInterval(()=>go(idx+1),5000);} auto();
dots.forEach(d=>d.onclick=()=>{go(parseInt(d.dataset.i,10));auto();});
const carousel=document.getElementById('carousel'); let startX=0, delta=0;
if(carousel){carousel.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;delta=0;},{passive:true});
carousel.addEventListener('touchmove',e=>{delta=e.touches[0].clientX-startX;slides.style.transform=`translateX(calc(-${idx*100}% + ${delta}px))`;},{passive:true});
carousel.addEventListener('touchend',()=>{if(Math.abs(delta)>60){go(idx+(delta<0?1:-1));}else go(idx);auto();});}

// Catálogo (modelos reais)
const catalog={ /* (mesmo conteúdo da versão anterior, encurtado aqui) */ };
// — Para não estourar a resposta, usa o MESMO catálogo que te enviei na v11.0.
//   Se precisar, eu te mando o bloco completo novamente.

function priceHTML(p){const v=p.discount?(p.price*(1-p.discount)):p.price;let s=`R$ ${v.toFixed(2).replace('.',',')}`;if(p.discount){s+=` <span style="text-decoration:line-through;color:#8a7aa5;font-size:12px;margin-left:6px">R$ ${p.price.toFixed(2).replace('.',',')}</span>`;}return s;}
function badgeHTML(p){if(p.stock<=0) return '<span class="badge">Esgotado</span>'; if(p.discount) return '<span class="badge">-30%</span>'; if(p.isNew) return '<span class="badge">Novo</span>'; return '';}
function cardHTML(p){return `<div class="card" data-id="${p.id}">${badgeHTML(p)}<img src="${p.img}" alt="${p.name}"/><div class="info"><p class="name">${p.name}</p><p class="price">${priceHTML(p)}</p></div></div>`;}
function renderGrid(el,arr){el.innerHTML=arr.map(cardHTML).join(''); el.querySelectorAll('.card').forEach(c=>c.onclick=()=>openModal(c.getAttribute('data-id')));}
const featured=[]; // pode preencher como quiser
function renderAll(){const f=document.getElementById('featured'); if(f) renderGrid(f, featured); document.querySelectorAll('[data-cat]').forEach(g=>{const cat=g.getAttribute('data-cat'); renderGrid(g,catalog[cat]||[]);});}
renderAll();

// Modal
const modal=document.getElementById('product-modal'), modalImg=document.getElementById('modal-img'), modalName=document.getElementById('modal-name'), modalPrice=document.getElementById('modal-price'), modalDesc=document.getElementById('modal-desc'), sizeOptions=document.getElementById('size-options'), colorOptions=document.getElementById('color-options');
let currentProduct=null, chosenSize=null, chosenColor=null;
function chip(container,value,on){const b=document.createElement('button'); b.textContent=value; b.onclick=()=>{[...container.children].forEach(x=>x.classList.remove('active'));b.classList.add('active');on(value);}; container.appendChild(b);}
function openModal(id){const p=Object.values(catalog).flat().find(x=>x.id===id); if(!p) return; currentProduct=p; chosenSize=null; chosenColor=null;
modalImg.src=p.img; modalName.textContent=p.name; modalPrice.innerHTML=priceHTML(p); modalDesc.textContent=p.desc||''; sizeOptions.innerHTML=''; colorOptions.innerHTML='';
(p.sizes&&p.sizes.length?p.sizes:['Único']).forEach(v=>chip(sizeOptions,v,(val)=>chosenSize=val)); (p.colors&&p.colors.length?p.colors:['Única']).forEach(v=>chip(colorOptions,v,(val)=>chosenColor=val));
modal.setAttribute('aria-hidden','false');}
document.getElementById('modal-close').onclick=()=>modal.setAttribute('aria-hidden','true'); modal.addEventListener('click',e=>{if(e.target===modal) modal.setAttribute('aria-hidden','true');});

// Carrinho + animação
const cartEl=document.getElementById('cart'), cartBtn=document.getElementById('cart-btn'); document.getElementById('close-cart').onclick=()=>cartEl.setAttribute('aria-hidden','true');
cartBtn.onclick=()=>{cartEl.setAttribute('aria-hidden',cartEl.getAttribute('aria-hidden')==='true'?'false':'true');renderCart();};
let cart=[];
function animateToCart(fromImg){const r=fromImg.getBoundingClientRect(), c=cartBtn.getBoundingClientRect(), fly=fromImg.cloneNode(true); fly.className='flying';
Object.assign(fly.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'}); document.body.appendChild(fly);
fly.animate([{transform:`translate(0,0) scale(1)`,opacity:1},{transform:`translate(${(c.left-r.left)/2}px,-100px) scale(0.8)`,opacity:.85},{transform:`translate(${c.left-r.left}px,${c.top-r.top}px) scale(0.1)`,opacity:0}],{duration:600,easing:'ease-in-out'}); setTimeout(()=>fly.remove(),600); cartBtn.classList.add('pulse'); setTimeout(()=>cartBtn.classList.remove('pulse'),400);}
function addToCartFromModal(){const p=currentProduct;if(!p) return; if(p.stock<=0) return alert('Produto esgotado.');
if(!chosenSize) chosenSize=(p.sizes&&p.sizes[0])||'Único'; if(!chosenColor) chosenColor=(p.colors&&p.colors[0])||'Única';
const key=p.id+'|'+chosenSize+'|'+chosenColor; const ex=cart.find(i=>i.key===key); const price=p.discount?(p.price*(1-p.discount)):p.price;
if(ex) ex.qty++; else cart.push({key,id:p.id,name:p.name,price,qty:1,size:chosenSize,color:chosenColor,img:p.img}); renderCart(); animateToCart(document.getElementById('modal-img')); modal.setAttribute('aria-hidden','true');}
document.getElementById('modal-add').onclick=addToCartFromModal;
function removeFromCart(key){cart=cart.filter(i=>i.key!==key);renderCart();}
function changeQty(key,d){const it=cart.find(i=>i.key===key); if(!it) return; it.qty+=d; if(it.qty<1) removeFromCart(key); else renderCart();}
function cartTotal(){return cart.reduce((s,i)=>s+i.price*i.qty,0);}
function renderCart(){document.getElementById('cart-count').textContent=cart.reduce((s,i)=>s+i.qty,0);
const list=document.getElementById('cart-items'); list.innerHTML=(!cart.length)?'<p>Seu carrinho está vazio 🛍️</p>':'';
cart.forEach(i=>{const row=document.createElement('div'); row.className='row';
row.innerHTML=`<div>${i.name}<br><small>${i.size?('Tam '+i.size+' · '):''}${i.color?('Cor '+i.color):''}</small></div>
<div><button onclick="changeQty('${i.key}',-1)">-</button><span style="padding:0 8px">${i.qty}</span><button onclick="changeQty('${i.key}',1)">+</button></div>
<div>R$ ${(i.price*i.qty).toFixed(2).replace('.',',')}</div>
<button onclick="removeFromCart('${i.key}')" class="icon-btn" style="color:#d33">x</button>`; list.appendChild(row);}); calcTotals();}

// Totais + entrega
const paymentEl=document.getElementById('payment'), cashSection=document.getElementById('cash-section'), cashAmountEl=document.getElementById('cash-amount');
paymentEl.onchange=()=>{const cash=paymentEl.value==='Dinheiro'; cashSection.style.display=cash?'block':'none'; if(!cash){document.querySelectorAll('input[name="cash-change"]').forEach(r=>r.checked=false);cashAmountEl.style.display='none';cashAmountEl.value='';}};
document.querySelectorAll('input[name="cash-change"]').forEach(r=>r.onchange=()=>cashAmountEl.style.display=r.value==='sim'?'inline-block':'none');
const deliveryTypeEl=document.getElementById('delivery-type'), addressFields=document.getElementById('address-fields'), neighborhoodEl=document.getElementById('neighborhood');
deliveryTypeEl.onchange=()=>{addressFields.style.display=deliveryTypeEl.value==='entrega'?'block':'none';calcTotals();}; neighborhoodEl.onchange=calcTotals;
function calcTotals(){const base=cartTotal(); document.getElementById('cart-total').textContent=base.toFixed(2).replace('.',','); let fee=0,show=false;
if(deliveryTypeEl.value==='entrega'){const b=neighborhoodEl.value; if(b){const f=FEES[b]; if(f!=='consultar'){fee=f;show=true;}}}
document.getElementById('delivery-fee').style.display=show?'block':'none'; if(show) document.getElementById('fee-value').textContent=fee.toFixed(2).replace('.',','); const final=base+fee;
document.getElementById('final-total').textContent=final.toFixed(2).replace('.',','); return final;}

// Voltar ao topo
const back=document.getElementById('backToTop'); window.addEventListener('scroll',()=>back.classList.toggle('show',window.scrollY>600)); back.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});

// Busca
const searchInput=document.getElementById('search-input'), searchClear=document.getElementById('search-clear'), searchResults=document.getElementById('search-results');
function allProducts(){return Object.values(catalog).flat();}
function doSearch(q){const t=q.trim().toLowerCase(); if(!t){searchResults.hidden=true;searchResults.innerHTML='';return;}
const res=allProducts().filter(p=>p.name.toLowerCase().includes(t)||(p.colors||[]).some(c=>c.toLowerCase().includes(t))||Object.entries(catalog).some(([k,arr])=>arr.includes(p)&&k.includes(t))).slice(0,10);
searchResults.hidden=false; searchResults.innerHTML=res.length?res.map(p=>`
  <div class="search-item" data-id="${p.id}">
    <img src="${p.img}" alt="${p.name}">
    <div><div style="font-weight:700">${p.name}</div><div style="color:#7A3BFD">${priceHTML(p)}</div></div>
    <button class="add-btn" style="padding:8px 10px">Ver</button>
  </div>`).join(''):'<div style="padding:8px">Sem resultados 😅</div>'; }
searchInput.addEventListener('input',()=>doSearch(searchInput.value)); searchClear.onclick=()=>{searchInput.value='';searchResults.hidden=true;searchResults.innerHTML='';};
searchResults.addEventListener('click',e=>{const id=e.target.closest('[data-id]')?.dataset.id; if(!id) return; openModal(id); searchResults.hidden=true; searchResults.innerHTML='';});

// PDF admin
function sanitizeName(n){return (n||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'').slice(0,40)||'Cliente';}
function todayStr(){const d=new Date();return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;}
function generatePDF({name,items,total,payment,cashNote,delivery,address,notes}){const doc=new jsPDF(); let y=15; doc.setFontSize(18); doc.text('LS Store',15,20); y=28;
doc.setFontSize(14); doc.text('Resumo do Pedido',15,y); y+=8; doc.setFontSize(11); doc.text(`Cliente: ${name}`,15,y); y+=6; doc.text(`Data: ${todayStr()}`,15,y); y+=8;
doc.setFont(undefined,'bold'); doc.text('Itens:',15,y); doc.setFont(undefined,'normal'); y+=6;
items.forEach(i=>{doc.text(`• ${i.name} ${i.size?('('+i.size+')'):''} ${i.color?('- '+i.color):''} x${i.qty} — R$ ${(i.price*i.qty).toFixed(2)}`,18,y); y+=6; if(y>270){doc.addPage();y=20;}});
y+=2; doc.text(`Total final: R$ ${total.toFixed(2)}`,15,y); y+=6; doc.text(`Pagamento: ${payment}`,15,y); y+=6; if(cashNote){doc.text(cashNote.replace(/%0A/g,' | '),15,y); y+=6;}
doc.text(`Entrega: ${delivery}`,15,y); y+=6; if(address){doc.text(`Endereço: ${address}`,15,y); y+=6;} if(notes){doc.text(`Obs: ${notes}`,15,y); y+=6;}
doc.save(`pedido-LSSTORE-${sanitizeName(name)}-${todayStr()}.pdf`);}

// Checkout (popup corrigido)
document.getElementById('checkout').onclick=()=>{
  if(!cart.length) return alert('Seu carrinho está vazio.');
  const name=document.getElementById('client-name').value.trim(); if(!name) return alert('Informe seu nome.');
  const payment=document.getElementById('payment').value; let cashNote='';
  if(payment==='Dinheiro'){const choice=[...document.querySelectorAll('input[name="cash-change"]')].find(r=>r.checked); if(!choice) return alert('Informe se precisa de troco.');
    if(choice.value==='sim'){const v=parseFloat((document.getElementById('cash-amount').value||'').replace(',','.')); if(isNaN(v)) return alert('Digite o valor que vai pagar.');
      const total=calcTotals(); if(v<total) return alert('O valor pago é menor que o total.'); const change=(v-total); cashNote=`Valor pago: R$ ${v.toFixed(2)}%0ATroco: R$ ${change.toFixed(2)}`;} else cashNote='Sem troco';}
  const delivery=document.getElementById('delivery-type').value; let address='', feeNote='';
  if(delivery==='entrega'){const street=document.getElementById('street').value.trim();const number=document.getElementById('number').value.trim();const b=neighborhoodEl.value;
    if(!street||!number||!b) return alert('Preencha rua, número e bairro.'); address=`Rua ${street}, Nº ${number}, Bairro ${b}`; const f=FEES[b]; feeNote=(f==='consultar')?'(consultar taxa de entrega)':`(+ R$ ${f.toFixed(2)} de entrega)`;}
  const notes=(document.getElementById('order-notes').value||'').trim(); const items=[...cart]; const final=calcTotals();

  if(ADMIN_MODE){ generatePDF({name,items,total:final,payment,cashNote:payment==='Dinheiro'?cashNote:'',delivery,address:address?`${address} ${feeNote}`:'',notes}); }

  const itemsStr=items.map(i=>`• ${i.name} — Tam ${i.size||'-'} — Cor ${i.color||'-'} — x${i.qty} — R$ ${(i.price*i.qty).toFixed(2)}`).join('%0A');
  const feeDisp=(delivery==='entrega'&&neighborhoodEl.value)?FEES[neighborhoodEl.value]:0;
  let msg=`🛍️ *NOVO PEDIDO - LS STORE*%0A---------------------------------%0A👩‍💖 *Cliente:* ${name}%0A💳 *Pagamento:* ${payment}`;
  msg+=`%0A📦 *Entrega:* ${delivery}`; if(address) msg+=`%0A🏡 *Endereço:* ${address} ${feeNote}`; if(notes) msg+=`%0A💬 *Observações:* ${notes}`;
  msg+=`%0A%0A🧺 *Itens do pedido:*%0A${itemsStr}`; if(feeDisp && feeDisp!=='consultar'){ msg+=`%0A%0A🚚 *Taxa de entrega:* R$ ${feeDisp.toFixed(2)}`; }
  msg+=`%0A💰 *Total final:* R$ ${final.toFixed(2)}%0A---------------------------------%0A✨ *Obrigada por comprar na LS Store!* 💖`;

  const pop=document.getElementById('popup-overlay');
  pop.hidden=false; playChime();
  setTimeout(()=>{ pop.hidden=true; location.href=`https://wa.me/${WHATSAPP}?text=${msg}`; },1600);
};

// Login/Cadastro local (simples)
const accountArea=document.getElementById('account-area');
function renderAccount(){
  const user=JSON.parse(localStorage.getItem('ls_user')||'null');
  if(!user){
    accountArea.innerHTML=`<div class="card" style="padding:12px">
      <h3>Entrar</h3><label>E-mail<input id="login-email" type="email"></label>
      <label>Senha<input id="login-pass" type="password"></label>
      <button id="do-login" class="add-btn" style="margin-top:8px">Entrar</button>
      <hr style="margin:14px 0;border:none;border-top:1px solid #eee">
      <h3>Criar conta</h3>
      <label>Nome<input id="reg-name" type="text"></label>
      <label>E-mail<input id="reg-email" type="email"></label>
      <label>Senha<input id="reg-pass" type="password"></label>
      <button id="do-register" class="add-btn" style="margin-top:8px">Cadastrar</button>
      <p style="font-size:12px;color:#6b5a70;margin-top:8px">Depois podemos migrar para Firebase Auth.</p>
    </div>`;
    document.getElementById('do-login').onclick=()=>{
      const email=document.getElementById('login-email').value.trim(), pass=document.getElementById('login-pass').value.trim();
      const db=JSON.parse(localStorage.getItem('ls_users')||'[]'); const u=db.find(x=>x.email===email&&x.pass===pass); if(!u) return alert('Credenciais inválidas');
      localStorage.setItem('ls_user',JSON.stringify({name:u.name,email:u.email})); renderAccount();
    };
    document.getElementById('do-register').onclick=()=>{
      const name=document.getElementById('reg-name').value.trim(), email=document.getElementById('reg-email').value.trim(), pass=document.getElementById('reg-pass').value.trim();
      if(!name||!email||!pass) return alert('Preencha todos os campos');
      const db=JSON.parse(localStorage.getItem('ls_users')||'[]'); if(db.find(x=>x.email===email)) return alert('E-mail já cadastrado');
      db.push({name,email,pass}); localStorage.setItem('ls_users',JSON.stringify(db)); localStorage.setItem('ls_user',JSON.stringify({name,email})); renderAccount();
    };
  } else {
    accountArea.innerHTML=`<div class="card" style="padding:12px">
      <p><strong>Olá, ${user.name}</strong></p><p>${user.email}</p>
      <button id="logout" class="add-btn" style="background:#eee;color:#333">Sair</button>
    </div>`;
    document.getElementById('logout').onclick=()=>{localStorage.removeItem('ls_user');renderAccount();};
  }
}
renderAccount();
document.getElementById('login-btn').onclick=()=>showSection('minha-conta');

// Totais iniciais
calcTotals();
