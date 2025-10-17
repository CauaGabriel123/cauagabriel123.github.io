
const { jsPDF } = window.jspdf;
const params=new URLSearchParams(location.search);
const adminMode=params.get('admin')==='true';
const whatsapp='5551989235482';
const fees={"Mathias Velho":5,"Harmonia":6,"Mato Grande":7,"São Luís":8,"Centro":8,"Fátima":9,"Igara":10,"Rio Branco":10,"Industrial":10,"Marechal Rondon":11,"Estância Velha":12,"Guajuviras":15,"Olaria":16,"Outra Cidade":"consultar"};
window.addEventListener('load',()=>{const s=document.getElementById('splash');setTimeout(()=>{s.classList.add('hidden');setTimeout(()=>s.remove(),650);},2000);});

const catalog={
  vestidos:[
    {id:'v1',name:'Vestido Floral Midi',price:159.9,img:'assets/vestidos1.jpg',sizes:['P','M','G'],colors:['Rosa','Branco'],stock:5,isNew:true},
    {id:'v2',name:'Vestido Longo Fenda',price:179.9,img:'assets/vestidos2.jpg',sizes:['M','G','GG'],colors:['Preto','Bege'],stock:0},
    {id:'v3',name:'Vestido Tubinho Preto',price:149.9,img:'assets/vestidos3.jpg',sizes:['P','M','G'],colors:['Preto'],stock:8,discount:0.3},
    {id:'v4',name:'Vestido Casual Listrado',price:139.9,img:'assets/vestidos4.jpg',sizes:['P','M'],colors:['Branco','Preto'],stock:3}
  ],
  camisas:[
    {id:'c1',name:'Camisa Social Seda',price:129.9,img:'assets/camisas1.jpg',sizes:['P','M','G'],colors:['Branco'],stock:2,isNew:true},
    {id:'c2',name:'Blusa Canelada',price:89.9,img:'assets/camisas2.jpg',sizes:['P','M','G','GG'],colors:['Rosa','Preto'],stock:0},
    {id:'c3',name:'Cropped Rosa',price:79.9,img:'assets/camisas3.jpg',sizes:['P','M'],colors:['Rosa'],stock:10},
    {id:'c4',name:'Camisa Branca Feminina',price:99.9,img:'assets/camisas4.jpg',sizes:['M','G','GG'],colors:['Branco'],stock:4}
  ],
  calcas:[
    {id:'cj1',name:'Calça Jeans Cintura Alta',price:139.9,img:'assets/calcas1.jpg',sizes:['P','M','G'],colors:['Azul','Preto'],stock:7},
    {id:'cj2',name:'Calça Pantalona',price:149.9,img:'assets/calcas2.jpg',sizes:['P','M','G','GG'],colors:['Bege','Preto'],stock:5},
    {id:'cj3',name:'Calça Legging Confort',price:89.9,img:'assets/calcas3.jpg',sizes:['P','M','G'],colors:['Preto'],stock:0},
    {id:'cj4',name:'Calça Cargo Feminina',price:159.9,img:'assets/calcas4.jpg',sizes:['M','G'],colors:['Verde','Preto'],stock:3,discount:0.3}
  ],
  bolsas:[
    {id:'b1',name:'Bolsa Transversal Nude',price:129.9,img:'assets/bolsas1.jpg',sizes:[],colors:['Bege'],stock:9},
    {id:'b2',name:'Bolsa Ombro Clássica',price:149.9,img:'assets/bolsas2.jpg',sizes:[],colors:['Preto'],stock:2},
    {id:'b3',name:'Clutch Dourada Festa',price:119.9,img:'assets/bolsas3.jpg',sizes:[],colors:['Dourado'],stock:0},
    {id:'b4',name:'Mochila Feminina Minimal',price:139.9,img:'assets/bolsas4.jpg',sizes:[],colors:['Branco'],stock:6,isNew:true}
  ],
  acessorios:[
    {id:'a1',name:'Brinco Pérola Elegante',price:69.9,img:'assets/acessorios1.jpg',sizes:[],colors:['Branco'],stock:0},
    {id:'a2',name:'Colar Dourado Coração',price:79.9,img:'assets/acessorios2.jpg',sizes:[],colors:['Dourado'],stock:5},
    {id:'a3',name:'Pulseira Prata Fina',price:59.9,img:'assets/acessorios3.jpg',sizes:[],colors:['Prata'],stock:7},
    {id:'a4',name:'Óculos de Sol Retro',price:89.9,img:'assets/acessorios4.jpg',sizes:[],colors:['Preto'],stock:4}
  ]
};
const featured=[catalog.vestidos[0], catalog.camisas[2], catalog.calcas[0], catalog.bolsas[1]];
let filterSize=null, filterColor=null;
function priceHTML(p){ if(p.discount){const old=(p.price).toFixed(2).replace('.',',');const np=(p.price*(1-p.discount)).toFixed(2).replace('.',',');return `R$ ${np} <span class="old">R$ ${old}</span>`;} return `R$ ${p.price.toFixed(2).replace('.',',')}`;}
function cardHTML(p){
  const sold=p.stock<=0; const cls=['card']; if(sold) cls.push('soldout');
  const badge = sold ? '<span class="badge">Esgotado</span>' : (p.discount?'<span class="badge discount">-30%</span>':(p.isNew?'<span class="badge new">Novo</span>':''));
  const btn = sold ? '<button disabled>Esgotado</button>' : `<button data-add="${p.id}">Adicionar</button>`;
  return `<div class="${cls.join(' ')}">${badge}<img src="${p.img}" alt="${p.name}"/><div class="info"><p class="name">${p.name}</p><p class="price">${priceHTML(p)}</p>${btn}</div></div>`;
}
function passesFilter(p){
  const s = filterSize ? (p.sizes||[]).includes(filterSize) : true;
  const c = filterColor ? (p.colors||[]).includes(filterColor) : true;
  return s && c;
}
function renderGrid(el, arr){
  const html = arr.filter(p=>passesFilter(p)).map(cardHTML).join('') || '<p>Nenhum item com os filtros selecionados.</p>';
  el.innerHTML=html;
  el.querySelectorAll('[data-add]').forEach(btn=> btn.onclick=(e)=> addToCart(btn.getAttribute('data-add'), e));
}
function renderAll(){
  renderGrid(document.getElementById('featured'), featured);
  document.querySelectorAll('[data-cat]').forEach(g=>{ const cat=g.getAttribute('data-cat'); renderGrid(g, catalog[cat]); });
}
renderAll();

// Drawer & navigation
const drawer=document.getElementById('drawer');
document.getElementById('menu-btn').onclick=()=>drawer.setAttribute('aria-hidden','false');
document.getElementById('close-drawer').onclick=()=>drawer.setAttribute('aria-hidden','true');
drawer.addEventListener('click',e=>{ if(e.target===drawer) drawer.setAttribute('aria-hidden','true'); });
document.querySelectorAll('nav a[data-section], .footer a[data-section]').forEach(a=>{
  a.onclick=(e)=>{ e.preventDefault(); const sec=a.getAttribute('data-section');
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('visible'));
    document.getElementById(sec).classList.add('visible');
    document.querySelectorAll('nav a').forEach(x=>x.classList.remove('active'));
    const link=[...document.querySelectorAll('nav a[data-section]')].find(n=>n.getAttribute('data-section')===sec); if(link) link.classList.add('active');
    drawer.setAttribute('aria-hidden','true'); window.scrollTo({top:0,behavior:'smooth'}); };
});
// Carousel with swipe
const slides=document.querySelector('.slides'); const dots=[...document.querySelectorAll('.dot')];
let idx=0, autoTimer=null; function go(i){ idx=(i+dots.length)%dots.length; slides.style.transform=`translateX(-${idx*100}%)`; dots.forEach((d,j)=>d.classList.toggle('active', j===idx)); }
dots.forEach(d=> d.onclick=()=>{ go(parseInt(d.dataset.i,10)); resetAuto(); });
function resetAuto(){ clearInterval(autoTimer); autoTimer=setInterval(()=>go(idx+1), 5000); } resetAuto();
const carousel=document.getElementById('carousel'); let startX=0, delta=0;
carousel.addEventListener('touchstart',e=>{ startX=e.touches[0].clientX; delta=0; }, {passive:true});
carousel.addEventListener('touchmove',e=>{ delta=e.touches[0].clientX-startX; slides.style.transform=`translateX(calc(-${idx*100}% + ${delta}px))`; }, {passive:true});
carousel.addEventListener('touchend',()=>{ if(Math.abs(delta)>60){ go(idx + (delta<0?1:-1)); } else { go(idx); } resetAuto(); });
// Filters UI
document.querySelectorAll('[data-size]').forEach(b=>{ b.onclick=()=>{ const v=b.getAttribute('data-size'); filterSize=(filterSize===v)?null:v; document.querySelectorAll('[data-size]').forEach(x=>x.classList.toggle('active', x.getAttribute('data-size')===filterSize)); renderAll(); }; });
document.querySelectorAll('[data-color]').forEach(b=>{ b.onclick=()=>{ const v=b.getAttribute('data-color'); filterColor=(filterColor===v)?null:v; document.querySelectorAll('[data-color]').forEach(x=>x.classList.toggle('active', x.getAttribute('data-color')===filterColor)); renderAll(); }; });
document.getElementById('clear-filters').onclick=()=>{ filterSize=null; filterColor=null; document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active')); renderAll(); };
// Back to top
const back=document.getElementById('backToTop'); window.addEventListener('scroll',()=> back.classList.toggle('show', window.scrollY>600)); back.onclick=()=> window.scrollTo({top:0,behavior:'smooth'});
// Cart
let cart=[]; const cartEl=document.getElementById('cart'); const cartBtn=document.getElementById('cart-btn');
document.getElementById('cart-btn').onclick=()=>{ cartEl.setAttribute('aria-hidden','false'); renderCart(); };
document.getElementById('close-cart').onclick=()=> cartEl.setAttribute('aria-hidden','true');
function addToCart(id, event){ const p=Object.values(catalog).flat().find(x=>x.id===id); if(!p||p.stock<=0) return;
  const ex=cart.find(i=>i.id===id); if(ex) ex.qty++; else cart.push({...p,qty:1}); renderCart();
  const imgEl=event.target.closest('.card').querySelector('img'); const r=imgEl.getBoundingClientRect(); const fly=imgEl.cloneNode(true);
  fly.className='flying'; fly.style.left=r.left+'px'; fly.style.top=r.top+'px'; fly.style.width=r.width+'px'; fly.style.height=r.height+'px'; document.body.appendChild(fly);
  const cartR=cartBtn.getBoundingClientRect(); const dx=cartR.left-r.left; const dy=cartR.top-r.top; requestAnimationFrame(()=>{ fly.style.transform=`translate(${dx}px, ${dy}px) scale(0.1)`; fly.style.opacity='0.2'; });
  setTimeout(()=> fly.remove(), 650); cartBtn.classList.add('pulse'); setTimeout(()=> cartBtn.classList.remove('pulse'), 500);
}
function removeFromCart(id){ cart=cart.filter(i=>i.id!==id); renderCart(); }
function changeQty(id,delta){ const it=cart.find(i=>i.id===id); if(!it) return; it.qty+=delta; if(it.qty<1) removeFromCart(id); else renderCart(); }
function cartTotal(){ return cart.reduce((s,i)=>s+i.price*i.qty*(1-(i.discount||0)),0); }
function renderCart(){ document.getElementById('cart-count').textContent=cart.reduce((s,i)=>s+i.qty,0);
  const list=document.getElementById('cart-items'); list.innerHTML=''; if(!cart.length){ list.innerHTML='<p>Seu carrinho está vazio.</p>'; }
  cart.forEach(i=>{ const totalItem=(i.price*(1-(i.discount||0)))*i.qty; const row=document.createElement('div'); row.className='row';
    row.innerHTML=`<div>${i.name}</div><div><button onclick="changeQty('${i.id}',-1)">-</button><span style="padding:0 8px">${i.qty}</span><button onclick="changeQty('${i.id}',1)">+</button></div><div>R$ ${totalItem.toFixed(2).replace('.',',')}</div><button onclick="removeFromCart('${i.id}')" class="icon-btn" style="color:#d33">x</button>`; list.appendChild(row); });
  calcTotals();
}
// Form behaviours
const paymentEl=document.getElementById('payment'); const cashSection=document.getElementById('cash-section'); const cashAmountEl=document.getElementById('cash-amount');
paymentEl.onchange=()=>{ const cash=paymentEl.value==='Dinheiro'; cashSection.style.display=cash?'block':'none'; if(!cash){ document.querySelectorAll('input[name="cash-change"]').forEach(r=>r.checked=false); cashAmountEl.style.display='none'; cashAmountEl.value=''; } };
document.querySelectorAll('input[name="cash-change"]').forEach(r=>{ r.onchange=()=>{ cashAmountEl.style.display=r.value==='sim'?'inline-block':'none'; }; });
const deliveryTypeEl=document.getElementById('delivery-type'); const addressFields=document.getElementById('address-fields'); const neighborhoodEl=document.getElementById('neighborhood');
deliveryTypeEl.onchange=()=>{ addressFields.style.display=deliveryTypeEl.value==='entrega'?'block':'none'; calcTotals(); }; neighborhoodEl.onchange=calcTotals;
// Totals
function calcTotals(){ const base=cartTotal(); document.getElementById('cart-total').textContent=base.toFixed(2).replace('.',',');
  let fee=0, show=false; if(deliveryTypeEl.value==='entrega'){ const b=neighborhoodEl.value; if(b){ const f=fees[b]; if(f!=='consultar'){ fee=f; show=true; } } }
  document.getElementById('delivery-fee').style.display=show?'block':'none'; if(show) document.getElementById('fee-value').textContent=fee.toFixed(2).replace('.',',');
  const final=base+fee; document.getElementById('final-total').textContent=final.toFixed(2).replace('.',','); return final; }
// Overlays & sounds
const loading=document.getElementById('loading-overlay'); const popup=document.getElementById('popup-overlay');
function showPopup(){ popup.style.display='flex'; setTimeout(()=>popup.classList.add('show'),30); document.getElementById('ping-sound').play(); setTimeout(()=>{ popup.classList.remove('show'); setTimeout(()=>popup.style.display='none',400); },2000); }
// PDF helpers
let logoDataURL=null; (async()=>{ try{ const img=await fetch('assets/logo.png').then(r=>r.blob()); const reader=new FileReader(); const p=new Promise(res=>reader.onload=()=>res(reader.result)); reader.readAsDataURL(img); logoDataURL=await p; }catch(e){} })();
function sanitizeName(n){ return (n||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'').slice(0,40) || 'Cliente'; }
function todayStr(){ const d=new Date(); const dd=String(d.getDate()).padStart(2,'0'); const mm=String(d.getMonth()+1).padStart(2,'0'); const yy=d.getFullYear(); return `${dd}-${mm}-${yy}`; }
function generatePDF({name,items,total,payment,cashNote,delivery,address,notes}){ const doc=new jsPDF(); let y=15;
  if(logoDataURL){ try{ doc.addImage(logoDataURL,'PNG',15,10,20,20); }catch(e){} doc.setFontSize(18); doc.text('LS STORE',40,22); y=36; } else { doc.setFontSize(18); doc.text('LS STORE',15,20); y=28; }
  doc.setFontSize(14); doc.text('Resumo do Pedido',15,y); y+=8; doc.setFontSize(11); doc.text(`Cliente: ${name}`,15,y); y+=6; doc.text(`Data: ${todayStr()}`,15,y); y+=8;
  doc.setFont(undefined,'bold'); doc.text('Itens:',15,y); doc.setFont(undefined,'normal'); y+=6;
  items.forEach(i=>{ const pr=i.price*(1-(i.discount||0)); doc.text(`• ${i.name} x${i.qty} — R$ ${(pr*i.qty).toFixed(2)}`,18,y); y+=6; if(y>270){ doc.addPage(); y=20; } });
  y+=2; doc.text(`Total final: R$ ${total.toFixed(2)}`,15,y); y+=6; doc.text(`Pagamento: ${payment}`,15,y); y+=6; if(cashNote){ doc.text(cashNote.replace(/%0A/g,' | '),15,y); y+=6; } doc.text(`Entrega: ${delivery}`,15,y); y+=6; if(address){ doc.text(`Endereço: ${address}`,15,y); y+=6; } if(notes){ doc.text(`Obs: ${notes}`,15,y); y+=6; }
  const fname=`pedido-LSSTORE-${sanitizeName(name)}-${todayStr()}.pdf`; doc.save(fname); }
// Checkout
document.getElementById('checkout').onclick=()=>{
  if(!cart.length) return alert('Seu carrinho está vazio.');
  const name=document.getElementById('client-name').value.trim(); if(!name) return alert('Informe seu nome.');
  const payment=document.getElementById('payment').value; let cashNote='';
  if(payment==='Dinheiro'){ const chosen=[...document.querySelectorAll('input[name="cash-change"]')].find(r=>r.checked); if(!chosen) return alert('Informe se precisa de troco.');
    if(chosen.value==='sim'){ const v=parseFloat((document.getElementById('cash-amount').value||'').replace(',','.')); if(isNaN(v)) return alert('Digite o valor que vai pagar.');
      const total=calcTotals(); if(v<total) return alert('O valor pago é menor que o total.'); const change=(v-total); cashNote=`Valor pago: R$ ${v.toFixed(2)}%0ATroco: R$ ${change.toFixed(2)}`; }
    else { cashNote='Sem troco'; } }
  const delivery=document.getElementById('delivery-type').value; let address='', feeNote='';
  if(delivery==='entrega'){ const street=document.getElementById('street').value.trim(); const number=document.getElementById('number').value.trim(); const b=neighborhoodEl.value;
    if(!street||!number||!b) return alert('Preencha rua, número e bairro.'); address=`Rua ${street}, Nº ${number}, Bairro ${b}`; feeNote=(fees[b]==='consultar')?'(consultar taxa de entrega)':`(+ R$ ${fees[b].toFixed(2)} de entrega)`; }
  const notes=(document.getElementById('order-notes').value||'').trim(); const items=[...cart]; const final=calcTotals();
  if(adminMode){ generatePDF({ name, items, total:final, payment, cashNote: payment==='Dinheiro'?cashNote:'', delivery, address: address?`${address} ${feeNote}`:'', notes }); }
  const itemsStr=items.map(i=>{ const pr=i.price*(1-(i.discount||0)); return `${i.name} x${i.qty} - R$ ${(pr*i.qty).toFixed(2)}`; }).join('%0A');
  let msg=`Olá, sou ${name}! Quero finalizar minha compra:%0A%0A${itemsStr}%0A%0ATotal final: R$ ${final.toFixed(2)}%0APagamento: ${payment}`;
  if(payment==='Dinheiro') msg+=`%0A${cashNote}`; msg+=`%0AEntrega: ${delivery}`; if(address) msg+=`%0AEndereço: ${address} ${feeNote}`; if(notes) msg+=`%0AObservações: ${notes}`;
  showPopup(); location.href = `https://wa.me/${whatsapp}?text=${msg}`;
};
