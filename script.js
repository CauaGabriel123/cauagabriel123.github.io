// LS STORE v11.1 — script final com popup corrigido e animação suave

const WHATSAPP = '5551989235482';
const FEES = {
  "Mathias Velho":5,"Harmonia":6,"Mato Grande":7,"São Luís":8,"Centro":8,"Fátima":9,
  "Igara":10,"Rio Branco":10,"Industrial":10,"Marechal Rondon":11,"Estância Velha":12,
  "Guajuviras":15,"Olaria":16,"Outra Cidade":"consultar"
};

// Splash (logo inicial)
window.addEventListener('load',()=>{
  setTimeout(()=>{
    const s=document.getElementById('splash'); 
    if(!s) return;
    s.classList.add('hidden'); 
    setTimeout(()=>s.remove(),650);
  },2000);
});

// Sons
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playChime(){
  const t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type='sine';
  o.frequency.setValueAtTime(880,t);
  o.frequency.exponentialRampToValueAtTime(1318,t+0.35);
  g.gain.setValueAtTime(.001,t);
  g.gain.exponentialRampToValueAtTime(.25,t+0.03);
  g.gain.exponentialRampToValueAtTime(.001,t+0.7);
  o.connect(g).connect(audioCtx.destination);
  o.start(t);o.stop(t+0.75);
}
function clickSoft(){
  const t=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type='triangle';
  o.frequency.setValueAtTime(500,t);
  o.frequency.exponentialRampToValueAtTime(700,t+0.1);
  g.gain.setValueAtTime(.001,t);
  g.gain.exponentialRampToValueAtTime(.1,t+0.02);
  g.gain.exponentialRampToValueAtTime(.001,t+0.2);
  o.connect(g).connect(audioCtx.destination);
  o.start(t);o.stop(t+0.25);
}

// Carrinho
let cart = [];
const cartBtn = document.getElementById('cart-btn');
const cartBox = document.getElementById('cart');
const itemsList = document.getElementById('cart-items');
const totalSpan = document.getElementById('cart-total');

cartBtn.addEventListener('click',()=>{
  cartBox.classList.toggle('open');
  clickSoft();
});

document.querySelectorAll('.add-cart').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const product = btn.closest('.product');
    const name = product.querySelector('h3').innerText;
    const price = parseFloat(product.querySelector('p').innerText.replace('R$','').replace(',','.'));
    cart.push({name,price,qty:1});
    updateCart();
    animateToCart(product.querySelector('img'));
  });
});

function updateCart(){
  itemsList.innerHTML='';
  cart.forEach((i)=>{
    const li=document.createElement('li');
    li.textContent=`${i.name} - R$ ${(i.price*i.qty).toFixed(2)}`;
    itemsList.appendChild(li);
  });
  const total = cart.reduce((a,b)=>a+b.price*b.qty,0);
  totalSpan.textContent=`R$ ${total.toFixed(2)}`;
}

function calcTotals(){
  return cart.reduce((a,b)=>a+b.price*b.qty,0);
}

// Animação produto → carrinho
function animateToCart(fromImg){
  const r=fromImg.getBoundingClientRect();
  const c=cartBtn.getBoundingClientRect();
  const clone=fromImg.cloneNode(true);
  clone.className='fly';
  clone.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:1000;border-radius:8px;transition:all .6s ease;`;
  document.body.appendChild(clone);
  setTimeout(()=>{
    clone.style.left=c.left+'px';
    clone.style.top=c.top+'px';
    clone.style.opacity='0';
    clone.style.transform='scale(0.2)';
  },10);
  setTimeout(()=>clone.remove(),600);
}

// Checkout corrigido
document.getElementById('checkout').onclick = () => {
  if (!cart.length) return alert('Seu carrinho está vazio.');

  const name = document.getElementById('client-name').value.trim();
  if (!name) return alert('Informe seu nome.');

  const payment = document.getElementById('payment').value;
  const delivery = document.getElementById('delivery-type').value;
  const notes = (document.getElementById('order-notes').value || '').trim();
  const b = document.getElementById('neighborhood').value;
  const total = calcTotals();
  const taxa = (delivery === 'entrega' && FEES[b] && FEES[b] !== 'consultar') ? FEES[b] : 0;
  const totalFinal = taxa ? total + taxa : total;

  const itemsStr = cart.map(i=>`• ${i.name} — R$ ${(i.price*i.qty).toFixed(2)}`).join('%0A');
  let msg = `🛍️ *NOVO PEDIDO - LS STORE*%0A---------------------------------%0A👩‍💖 *Cliente:* ${name}%0A💳 *Pagamento:* ${payment}%0A📦 *Entrega:* ${delivery}`;
  if (delivery==='entrega'){ msg+=`%0A🏡 *Bairro:* ${b}`; }
  if (notes) msg+=`%0A💬 *Observações:* ${notes}`;
  msg+=`%0A%0A🧺 *Itens:*%0A${itemsStr}`;
  if (taxa) msg+=`%0A🚚 *Taxa de entrega:* R$ ${taxa.toFixed(2)}`;
  msg+=`%0A💰 *Total final:* R$ ${totalFinal.toFixed(2)}%0A---------------------------------%0A✨ *Obrigada por comprar na LS Store!* 💖`;

  const pop=document.getElementById('popup-overlay');
  pop.hidden=false; playChime();
  setTimeout(()=>{
    pop.hidden=true;
    setTimeout(()=>{
      window.open(`https://wa.me/${WHATSAPP}?text=${msg}`,'_blank');
    },400);
  },1500);
};
