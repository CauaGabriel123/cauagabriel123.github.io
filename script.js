// LS STORE v9 — admin-only PDF, WhatsApp, loading & popup
const { jsPDF } = window.jspdf;

// Configs
const whatsapp='5551989235482';
const fees={"Mathias Velho":5,"Harmonia":6,"Mato Grande":7,"São Luís":8,"Centro":8,"Fátima":9,"Igara":10,"Rio Branco":10,"Industrial":10,"Marechal Rondon":11,"Estância Velha":12,"Guajuviras":15,"Olaria":16,"Outra Cidade":"consultar"};
const products=[
  {id:'1',name:'Vestido Floral Midi',price:159.90},
  {id:'2',name:'Bolsa Rosa',price:129.90},
  {id:'3',name:'Camiseta Branca Feminina',price:59.90},
  {id:'4',name:'Calça Jeans Cintura Alta',price:139.90}
];

// Admin mode (?admin=true)
const params=new URLSearchParams(location.search);
const adminMode=params.get('admin')==='true';

// Preload logo for PDF
let logoDataURL=null;
(async()=>{
  try{
    const img=await fetch('assets/logo.png').then(r=>r.blob());
    const reader=new FileReader();
    const p=new Promise(res=>{reader.onload=()=>res(reader.result)});
    reader.readAsDataURL(img);
    logoDataURL=await p;
  }catch(e){ /* silently ignore */ }
})();

// State
let cart=[];

// Render catalog
const grid=document.getElementById('products');
products.forEach(p=>{
  const el=document.createElement('div');
  el.innerHTML=`<h4>${p.name}</h4><b>R$ ${p.price.toFixed(2).replace('.',',')}</b><br><button>Adicionar</button>`;
  el.querySelector('button').onclick=()=>addToCart(p.id);
  grid.appendChild(el);
});

// Cart open/close
document.getElementById('cart-btn').onclick=()=>{document.getElementById('cart').setAttribute('aria-hidden','false');renderCart();};
document.getElementById('close-cart').onclick=()=>{document.getElementById('cart').setAttribute('aria-hidden','true');};

// Inputs & handlers
const paymentEl=document.getElementById('payment');
const cashSection=document.getElementById('cash-section');
const deliveryTypeEl=document.getElementById('delivery-type');
const addressFields=document.getElementById('address-fields');
const neighborhoodEl=document.getElementById('neighborhood');
paymentEl.onchange=()=>{
  const cash=paymentEl.value==='Dinheiro';
  cashSection.style.display=cash?'block':'none';
  if(!cash){
    document.querySelectorAll('input[name="cash-change"]').forEach(r=>r.checked=false);
    const amt=document.getElementById('cash-amount'); amt.style.display='none'; amt.value='';
  }
};
document.querySelectorAll('input[name="cash-change"]').forEach(r=>{
  r.onchange=()=>{
    document.getElementById('cash-amount').style.display = r.value==='sim' ? 'inline-block' : 'none';
  };
});
deliveryTypeEl.onchange=()=>{ addressFields.style.display=deliveryTypeEl.value==='entrega'?'block':'none'; calcTotals(); };
neighborhoodEl.onchange=calcTotals;

// Cart logic
function addToCart(id){
  const p=products.find(x=>x.id===id);
  const ex=cart.find(i=>i.id===id);
  if(ex) ex.qty++; else cart.push({...p,qty:1});
  renderCart();
}
function removeFromCart(id){ cart=cart.filter(i=>i.id!==id); renderCart(); }
function changeQty(id,delta){ const it=cart.find(i=>i.id===id); if(!it) return; it.qty+=delta; if(it.qty<1) removeFromCart(id); else renderCart(); }
function cartTotal(){ return cart.reduce((s,i)=>s+i.price*i.qty,0); }

function renderCart(){
  document.getElementById('cart-count').textContent=cart.reduce((s,i)=>s+i.qty,0);
  const list=document.getElementById('cart-items'); list.innerHTML='';
  if(!cart.length){ list.innerHTML='<p>Seu carrinho está vazio.</p>'; }
  cart.forEach(i=>{
    const row=document.createElement('div');
    row.className='row';
    row.innerHTML=`
      <div>${i.name}</div>
      <div>
        <button onclick="changeQty('${i.id}',-1)">-</button>
        <span style="padding:0 8px">${i.qty}</span>
        <button onclick="changeQty('${i.id}',1)">+</button>
      </div>
      <div>R$ ${(i.price*i.qty).toFixed(2).replace('.',',')}</div>
      <button onclick="removeFromCart('${i.id}')" style="border:0;background:transparent;color:#d33">x</button>
    `;
    list.appendChild(row);
  });
  calcTotals();
}

function calcTotals(){
  const base=cartTotal();
  document.getElementById('cart-total').textContent=base.toFixed(2).replace('.',',');
  // entrega fee
  let fee=0, show=false;
  if(deliveryTypeEl.value==='entrega'){
    const b=neighborhoodEl.value;
    if(b){
      const f=fees[b];
      if(f!=='consultar'){ fee=f; show=true; }
    }
  }
  document.getElementById('delivery-fee').style.display=show?'block':'none';
  if(show) document.getElementById('fee-value').textContent=fee.toFixed(2).replace('.',',');
  const final=base+fee;
  document.getElementById('final-total').textContent=final.toFixed(2).replace('.',',');
  return final;
}

// Overlays & audio
const loading=document.getElementById('loading-overlay');
const popup=document.getElementById('popup-overlay');
function showLoading(){ loading.style.display='flex'; setTimeout(()=>loading.classList.add('show'),30); }
function hideLoading(cb){ loading.classList.remove('show'); setTimeout(()=>{loading.style.display='none'; cb&&cb();},250); }
function showPopup(){ popup.style.display='flex'; setTimeout(()=>popup.classList.add('show'),30); document.getElementById('ping-sound').play(); setTimeout(()=>{ popup.classList.remove('show'); setTimeout(()=>popup.style.display='none',400); },2000); }

// PDF
function sanitizeName(n){ return (n||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'').slice(0,40) || 'Cliente'; }
function todayStr(){ const d=new Date(); const dd=String(d.getDate()).padStart(2,'0'); const mm=String(d.getMonth()+1).padStart(2,'0'); const yy=d.getFullYear(); return `${dd}-${mm}-${yy}`; }
function generatePDF({name,items,total,payment,cashNote,delivery,address,notes}){
  const doc=new jsPDF();
  // Header with logo
  let y=15;
  if(logoDataURL){
    try{ doc.addImage(logoDataURL,'PNG',15,10,20,20); }catch(e){/* ignore */}
    doc.setFontSize(18); doc.text('LS STORE', 40, 22);
    y=36;
  }else{
    doc.setFontSize(18); doc.text('LS STORE', 15, 20); y=28;
  }
  doc.setFontSize(14); doc.text('Resumo do Pedido', 15, y); y+=8;
  doc.setFontSize(11); doc.text(`Cliente: ${name}`,15,y); y+=6;
  doc.text(`Data: ${todayStr()}`,15,y); y+=8;
  doc.setFont(undefined,'bold'); doc.text('Itens:',15,y); doc.setFont(undefined,'normal'); y+=6;
  items.forEach(i=>{ doc.text(`• ${i.name} x${i.qty} — R$ ${(i.price*i.qty).toFixed(2)}`, 18, y); y+=6; if(y>270){ doc.addPage(); y=20; } });
  y+=2; doc.text(`Total final: R$ ${total.toFixed(2)}`,15,y); y+=6;
  doc.text(`Pagamento: ${payment}`,15,y); y+=6;
  if(cashNote){ doc.text(cashNote.replace(/%0A/g,' | '),15,y); y+=6; }
  doc.text(`Entrega: ${delivery}`,15,y); y+=6;
  if(address){ doc.text(`Endereço: ${address}`,15,y); y+=6; }
  if(notes){ doc.text(`Obs: ${notes}`,15,y); y+=6; }
  const fname=`pedido-LSSTORE-${sanitizeName(name)}-${todayStr()}.pdf`;
  doc.save(fname);
}

// Checkout
document.getElementById('checkout').onclick=()=>{
  if(!cart.length) return alert('Carrinho vazio.');
  const name=document.getElementById('client-name').value.trim();
  if(!name) return alert('Informe seu nome.');
  const payment=document.getElementById('payment').value;

  // Cash logic
  let cashNote='';
  if(payment==='Dinheiro'){
    const chosen=[...document.querySelectorAll('input[name="cash-change"]')].find(r=>r.checked);
    if(!chosen) return alert('Informe se precisa de troco.');
    if(chosen.value==='sim'){
      const v=parseFloat((document.getElementById('cash-amount').value||'').replace(',','.'));
      if(isNaN(v)) return alert('Digite o valor para quanto precisa de troco.');
      const total=calcTotals();
      if(v<total) return alert('O valor pago é menor que o total.');
      const change=(v-total);
      cashNote=`Valor pago: R$ ${v.toFixed(2)}%0ATroco: R$ ${change.toFixed(2)}`;
    }else{
      cashNote='Sem troco';
    }
  }

  // Delivery / pickup
  const delivery=document.getElementById('delivery-type').value;
  let address='', feeNote='';
  if(delivery==='entrega'){
    const street=document.getElementById('street').value.trim();
    const number=document.getElementById('number').value.trim();
    const b=neighborhoodEl.value;
    if(!street||!number||!b) return alert('Preencha rua, número e bairro.');
    address=`Rua ${street}, Nº ${number}, Bairro ${b}`;
    feeNote = (fees[b]==='consultar') ? '(consultar taxa de entrega)' : `(+ R$ ${fees[b].toFixed(2)} de entrega)`;
  }

  const notes=(document.getElementById('order-notes').value||'').trim();
  const items=cart.map(i=>({name:i.name,qty:i.qty,price:i.price}));
  const final=calcTotals();

  // Visual flow
  showLoading();
  setTimeout(()=>{
    hideLoading(()=>{
      // Generate PDF only for admin
      if(adminMode){
        generatePDF({
          name, items, total: final, payment,
          cashNote: payment==='Dinheiro' ? cashNote : '',
          delivery, address: address ? `${address} ${feeNote}` : '', notes
        });
      }
      showPopup();
      // WhatsApp
      const itemsStr=items.map(i=>`${i.name} x${i.qty} - R$ ${(i.price*i.qty).toFixed(2)}`).join('%0A');
      let msg=`Olá, sou ${name}! Quero finalizar minha compra:%0A%0A${itemsStr}%0A%0ATotal final: R$ ${final.toFixed(2)}%0APagamento: ${payment}`;
      if(payment==='Dinheiro') msg+=`%0A${cashNote}`;
      msg+=`%0AEntrega: ${delivery}`;
      if(address) msg+=`%0AEndereço: ${address} ${feeNote}`;
      if(notes) msg+=`%0AObservações: ${notes}`;
      setTimeout(()=>{
        window.open(`https://wa.me/${whatsapp}?text=${msg}`,'_blank');
      }, 600);
    });
  }, 1500);
};