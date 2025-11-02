// =========================
// LS STORE v14.3 Premium Variation Update — Cauã Gabriel
// =========================

const { jsPDF } = window.jspdf;

// --- Configurações principais
const WHATSAPP = '5551989235482';
const ADMIN_MODE = new URLSearchParams(location.search).get('admin') === 'true';
const FEES = {
  "Mathias Velho": 5, "Harmonia": 6, "Mato Grande": 7, "São Luís": 8,
  "Centro": 8, "Fátima": 9, "Igara": 10, "Rio Branco": 10, "Industrial": 10,
  "Marechal Rondon": 11, "Estância Velha": 12, "Guajuviras": 15, "Olaria": 16, "Outra Cidade": "consultar"
};
const INSTAGRAM_HANDLE = '@ls_store.fc';

// Splash aprimorado
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add('hidden');
    setTimeout(() => splash.remove(), 800);
  }, 2000);
});
(function robustSplash() {
  const kill = () => {
    const s = document.getElementById('splash');
    if (s) { s.classList.add('hidden'); setTimeout(() => s.remove(), 800); }
  };
  document.addEventListener('DOMContentLoaded', () => setTimeout(kill, 3500));
  setTimeout(kill, 5000);
})();

// --- Drawer / Áudio suave
let audioCtx;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function clickSoft() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(600, t);
  o.frequency.exponentialRampToValueAtTime(900, t + 0.08);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
  o.connect(g).connect(ctx.destination);
  o.start(t); o.stop(t + 0.18);
}

// Drawer e menu lateral
const drawer = document.getElementById('drawer');
const menuBtn = document.getElementById('menu-btn');
const closeDrawer = document.getElementById('close-drawer');
menuBtn.onclick = () => {
  drawer.setAttribute('aria-hidden', drawer.getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
  clickSoft();
};
closeDrawer.onclick = () => {
  drawer.setAttribute('aria-hidden', 'true');
  clickSoft();
};
drawer.querySelector('.drawer-backdrop').onclick = () => drawer.setAttribute('aria-hidden', 'true');

// --- Navegação entre seções
document.querySelectorAll('.drawer-links a[data-section], .footer a[data-section]').forEach(a => {
  a.onclick = e => {
    e.preventDefault();
    document.querySelectorAll('.section').forEach(s => s.classList.remove('visible'));
    const sec = document.getElementById(a.getAttribute('data-section'));
    if (sec) sec.classList.add('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    drawer.setAttribute('aria-hidden', 'true');
  };
});

// --- Catálogo dinâmico com suporte a VARIAÇÕES
let catalog = {}, featured = [];

function buildCatalogAndRender(data) {
  const normalizeSizes = arr => (Array.isArray(arr) && arr.length ? arr.map(s => String(s).trim().toUpperCase()) : ['ÚNICO']);
  const normalizeColors = arr => (Array.isArray(arr) && arr.length ? arr.map(c => c.charAt(0).toUpperCase() + c.slice(1)) : ['Única']);
  const union = arrays => [...new Set(arrays.flat())];

  catalog = {}; featured = [];

  (Array.isArray(data) ? data : []).forEach(p => {
    if (p.status?.toLowerCase() === 'indisponivel') return;
    const cat = p.category || 'outros';
    let colors = [], sizes = [], primaryImg = '', vmap = null;

    // --- Suporte a VARIAÇÕES ---
    if (p.variations && typeof p.variations === 'object') {
      vmap = {};
      for (const cor in p.variations) {
        const v = p.variations[cor];
        const vsizes = normalizeSizes(v.sizes || []);
        const vstock = typeof v.stock === 'number' ? v.stock : 0;
        const vimg = v.image || null;
        vmap[cor] = { sizes: vsizes, stock: vstock, image: vimg };
        colors.push(cor);
        sizes.push(vsizes);
        if (!primaryImg && vimg) primaryImg = vimg;
      }
      colors = normalizeColors(colors);
      sizes = normalizeSizes(union(sizes));
    } else {
      colors = normalizeColors(p.colors);
      sizes = normalizeSizes(p.sizes);
      primaryImg = Array.isArray(p.images) && p.images[0] ? p.images[0] : (p.img || p.image || '');
    }

    const imgs = Array.isArray(p.images) && p.images.length ? p.images.slice(0, 10)
      : (primaryImg ? [primaryImg] : []);

    const record = {
      id: p.id, name: p.name, price: p.price, imgs, images: p.images,
      sizes, colors, variations: vmap, stock: p.stock || 5,
      description: p.description, status: p.status
    };
    if (!catalog[cat]) catalog[cat] = [];
    catalog[cat].push(record);
  });

  featured = Object.values(catalog).flat().slice(0, 20).sort(() => Math.random() - 0.5);
  renderAll();
  renderFooterProducts(featured);
}
<script>
// =============================
// RENDER PACK v14.3-R (catálogo, categorias, subcategorias, rodapé)
// =============================

// helpers visuais (preço e selo)
function priceHTML(p) {
  const v = p.discount ? (p.price * (1 - p.discount)) : p.price;
  let s = `R$ ${Number(v).toFixed(2).replace('.', ',')}`;
  if (p.discount) {
    s += ` <span style="text-decoration:line-through;color:#8a7aa5;font-size:12px;margin-left:6px">R$ ${Number(p.price).toFixed(2).replace('.', ',')}</span>`;
  }
  return s;
}
function badgeHTML(p) {
  if (p.status && String(p.status).toLowerCase() === 'esgotado') return '<span class="badge">Esgotado</span>';
  if (p.discount) return '<span class="badge">-30%</span>';
  if (p.isNew) return '<span class="badge">Novo</span>';
  return '';
}

// CSS mínimo caso falte (selo + soldout)
(function ensureMinimalCardCSS(){
  if (document.getElementById('ls-render-pack-css')) return;
  const style = document.createElement('style');
  style.id = 'ls-render-pack-css';
  style.textContent = `
    .card{position:relative;background:#fff;border-radius:16px;box-shadow:var(--shadow,0 10px 30px rgba(0,0,0,.08));overflow:hidden;cursor:pointer}
    .card img{width:100%;height:220px;object-fit:cover;display:block}
    .card .info{padding:10px 12px}
    .card .name{font-weight:700;margin:0 0 6px}
    .card .price{font-weight:700;color:#2E2336}
    .badge{position:absolute;left:10px;top:10px;background:linear-gradient(90deg,#E96BA8,#7A3BFD);color:#fff;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:700}
    .card.soldout::after{
      content:'ESGOTADO';
      position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      background:rgba(255,255,255,.65);backdrop-filter:blur(3px);
      color:#7A3BFD;font-weight:900;font-size:22px;letter-spacing:.06em
    }
  `;
  document.head.appendChild(style);
})();

// card de produto
function cardHTML(p) {
  const img0 =
    (Array.isArray(p.images) && p.images[0]) ? p.images[0] :
    (Array.isArray(p.imgs)   && p.imgs[0])   ? p.imgs[0]   :
    (Array.isArray(p.image)  && p.image[0])  ? p.image[0]  :
    (p.img || p.image || '');
  const sold = (p.status && p.status.toLowerCase() === 'esgotado') || (p.stock|0) <= 0;
  return `
    <div class="card${sold ? ' soldout' : ''}" data-id="${p.id}">
      ${badgeHTML(p)}
      <img src="${img0}" alt="${p.name}">
      <div class="info">
        <p class="name">${p.name}</p>
        <p class="price">${priceHTML(p)}</p>
      </div>
    </div>
  `;
}

// grid genérico
function renderGrid(el, arr) {
  el.innerHTML = (arr && arr.length)
    ? arr.map(cardHTML).join('')
    : '<p style="opacity:.6">Nada por aqui ainda…</p>';

  // clique abre modal
  el.querySelectorAll('.card').forEach(c => {
    if (!c.classList.contains('soldout')) {
      c.addEventListener('click', () => LSModal.open(c.getAttribute('data-id')));
    }
  });
}

// destaque da home (#featured) + categorias [data-cat]
function renderAll() {
  // Home - Destaques
  const f = document.getElementById('featured');
  if (f) {
    const pool = featured && featured.length ? featured : Object.values(catalog).flat().slice(0, 12);
    renderGrid(f, pool);
  }

  // Cada seção por categoria (respeita data-cat em teu HTML)
  document.querySelectorAll('[data-cat]').forEach(section => {
    const cat = section.getAttribute('data-cat');
    const list = (catalog[cat] || []);
    renderGrid(section, list);
  });
}

// rodapé horizontal “Veja também”
function renderFooterProducts(listFromData) {
  const box = document.getElementById('footer-products');
  if (!box) return;

  let pool = listFromData && listFromData.length ? listFromData : Object.values(catalog).flat();
  pool = pool.filter(p => (p.status || '').toLowerCase() !== 'esgotado'); // leve priorização
  const slice = pool.slice(0, 12);

  box.innerHTML = slice.map(p => {
    const img0 =
      (Array.isArray(p.images) && p.images[0]) ? p.images[0] :
      (Array.isArray(p.imgs)   && p.imgs[0])   ? p.imgs[0]   :
      (Array.isArray(p.image)  && p.image[0])  ? p.image[0]  :
      (p.img || p.image || '');
    return `
      <div class="footer-card" data-id="${p.id}" role="button" aria-label="${p.name}">
        <img src="${img0}" alt="${p.name}">
        <div class="fc-info">
          <div class="fc-name">${p.name}</div>
          <div class="fc-price">R$ ${Number(p.price).toFixed(2).replace('.', ',')}</div>
        </div>
      </div>
    `;
  }).join('');

  box.querySelectorAll('.footer-card').forEach(card => {
    card.addEventListener('click', () => LSModal.open(card.getAttribute('data-id')));
  });
}

// subcategorias (drawer) auto a partir do catálogo
function mountDrawerSubcats() {
  const wrap = document.getElementById('sub-produtos');
  if (!wrap) return;

  // Mapeia nomes para manter tua organização visual
  const presentCats = Object.keys(catalog); // p.ex.: ['pijamas','meias','leggings',...]
  if (!presentCats.length) { wrap.hidden = true; return; }

  // Gera lista clicável que abre a seção correspondente (precisa existir um [data-cat="<cat>"] na página)
  wrap.hidden = false;
  wrap.innerHTML = presentCats.map(cat => `
    <a href="#" data-goto="${cat}" class="drawer-subitem">${cat.charAt(0).toUpperCase()+cat.slice(1)}</a>
  `).join('');

  wrap.querySelectorAll('[data-goto]').forEach(a => {
    a.onclick = (e) => {
      e.preventDefault();
      const target = a.getAttribute('data-goto');
      const sec = document.querySelector('[data-cat="'+target+'"]');
      if (sec) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('visible'));
        // se tua estrutura usa id/section por categoria, garante que está visível
        const parentSection = sec.closest('.section') || document.getElementById('produtos');
        if (parentSection) parentSection.classList.add('visible');
        window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
      }
      // fecha o drawer
      const drawer = document.getElementById('drawer');
      if (drawer) drawer.setAttribute('aria-hidden','true');
    };
  });
}

// 🔗 Hooka na tua pipeline atual: chamamos isso ao final do buildCatalogAndRender
const _orig_buildCatalogAndRender = (typeof buildCatalogAndRender === 'function') ? buildCatalogAndRender : null;
if (_orig_buildCatalogAndRender) {
  window.buildCatalogAndRender = function(data) {
    // executa tua montagem original
    _orig_buildCatalogAndRender.call(this, data);
    // e em seguida garante as telas
    try { renderAll(); } catch(e){ console.warn('renderAll falhou', e); }
    try { renderFooterProducts(featured && featured.length ? featured : null); } catch(e){}
    try { mountDrawerSubcats(); } catch(e){}
  };
} else {
  // caso alguém renomeie a função no futuro, ainda temos um plano B
  console.warn('buildCatalogAndRender não encontrado — chamando renderizadores diretamente quando possível.');
  // quando catálogo for setado, você pode chamar manualmente: renderAll(); renderFooterProducts(); mountDrawerSubcats();
}
</script>
// Carregar catálogo
(function loadProducts() {
  fetch('products_v2.json?v=' + Date.now(), { cache: 'no-store' })
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(data => buildCatalogAndRender(data))
    .catch(() => console.warn('⚠️ Usando fallback local de produtos'));
})();
/* ===== LS STORE • Product Modal — v14.3 Premium Variation Update ===== */
(function () {
  const $  = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  const els = {
    root: $('#lsxModal'),
    title: $('#lsxModalTitle'),
    imgMain: $('#lsxImageMain'),
    thumbs: $('#lsxThumbs'),
    price: $('#lsxPrice'),
    installments: $('#lsxInstallments'),
    sizes: $('#lsxSizes'),
    colors: $('#lsxColors'),
    stock: $('#lsxStock'),
    buyBtn: $('#lsxBuyBtn'),
    addBtn: $('#lsxAddBtn'),
    zoomBtn: $('#lsxZoomBtn')
  };

  let current = {
    product: null,
    selectedColor: null,
    selectedSize: null,
    imgs: [],
    idx: 0,
    qty: 1,
    maxStock: Infinity
  };

  const currency = v => Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const calcInstallments = v => `12x de ${currency(v/12)}`;

  // ========= CSS inline Premium (bolinhas alinhadas) =========
  const style = document.createElement('style');
  style.textContent = `
  .lsx-color,.lsx-size{
    display:inline-flex;align-items:center;justify-content:center;
    border:1px solid #ddd;border-radius:10px;padding:6px 10px;
    margin:4px;cursor:pointer;transition:.25s;
    font-weight:600;background:#fff;
  }
  .lsx-color.is-selected,.lsx-size.is-selected{
    border-color:var(--lilac);background:linear-gradient(90deg,#E96BA8,#7A3BFD);
    color:#fff;transform:scale(1.05);
  }
  #lsxColors,#lsxSizes{display:flex;flex-wrap:wrap;justify-content:center;margin-top:6px;}
  `;
  document.head.appendChild(style);

  // ========= Galeria =========
  function showImg(i){
    if(!current.imgs.length)return;
    current.idx=(i+current.imgs.length)%current.imgs.length;
    els.imgMain.style.opacity=0;
    setTimeout(()=>{els.imgMain.src=current.imgs[current.idx];els.imgMain.style.opacity=1;},150);
    $$('.is-active',els.thumbs).forEach(x=>x.classList.remove('is-active'));
    const t=els.thumbs.querySelector(`img[data-i="${current.idx}"]`);
    if(t)t.classList.add('is-active');
  }
  function mountGallery(p){
    let baseImgs=[];
    if(p.variations&&current.selectedColor&&p.variations[current.selectedColor]?.image)
      baseImgs=[p.variations[current.selectedColor].image];
    else if(Array.isArray(p.images)&&p.images.length)baseImgs=p.images;
    else if(p.img)baseImgs=[p.img];
    current.imgs=baseImgs.slice(0,10);
    els.imgMain.src=current.imgs[0]||'';
    els.thumbs.innerHTML=current.imgs.map((s,i)=>`<img src="${s}" data-i="${i}" class="${i===0?'is-active':''}">`).join('');
    els.thumbs.onclick=e=>{
      const t=e.target.closest('img');if(!t)return;showImg(+t.dataset.i);
    };
  }

  // ========= Cores e tamanhos =========
  function mountSizesFromColor(p,color){
    let sizes=[];
    if(p.variations&&p.variations[color])sizes=p.variations[color].sizes||[];
    else sizes=p.sizes||['ÚNICO'];
    els.sizes.innerHTML=sizes.map(s=>`<button class="lsx-size" data-size="${s}">${s}</button>`).join('');
    $$('.lsx-size',els.sizes).forEach(b=>b.onclick=()=>{
      $$('.lsx-size',els.sizes).forEach(x=>x.classList.remove('is-selected'));
      b.classList.add('is-selected');
      current.selectedSize=b.dataset.size;
      refreshStockLabel(p);
    });
  }
  function mountColors(p){
    const colors=p.variations?Object.keys(p.variations):(p.colors||['Única']);
    els.colors.innerHTML=colors.map(c=>`<button class="lsx-color" data-color="${c}">${c}</button>`).join('');
    $$('.lsx-color',els.colors).forEach(b=>b.onclick=()=>{
      $$('.lsx-color',els.colors).forEach(x=>x.classList.remove('is-selected'));
      b.classList.add('is-selected');
      current.selectedColor=b.dataset.color;
      mountSizesFromColor(p,current.selectedColor);
      mountGallery(p);
      refreshStockLabel(p);
    });
  }

  function getMaxStock(p){
    if(p.variations&&current.selectedColor){
      const v=p.variations[current.selectedColor];
      return typeof v.stock==='number'?v.stock:0;
    }
    return p.stock||5;
  }
  function refreshStockLabel(p){
    current.maxStock=getMaxStock(p);
    els.stock.textContent=current.maxStock>0?`Estoque: ${current.maxStock} un.`:`Sem estoque`;
  }

  // ========= Quantidade =========
  function ensureQtyControls(){
    const wrap=document.createElement('div');
    wrap.className='qty-wrap';
    wrap.style.cssText='display:flex;justify-content:center;align-items:center;gap:10px;margin:10px 0;';
    const minus=document.createElement('button');minus.textContent='−';
    const plus=document.createElement('button');plus.textContent='+';
    [minus,plus].forEach(b=>b.style.cssText='width:34px;height:34px;border:1px solid #ccc;border-radius:8px;cursor:pointer;font-size:18px;');
    const num=document.createElement('strong');num.textContent='1';
    minus.onclick=()=>{current.qty=Math.max(1,current.qty-1);num.textContent=current.qty;};
    plus.onclick=()=>{if(current.qty<current.maxStock)current.qty++;num.textContent=current.qty;};
    wrap.append(minus,num,plus);
    els.stock.insertAdjacentElement('afterend',wrap);
  }

  // ========= Preencher e abrir =========
  function fill(p){
    current.product=p;current.qty=1;current.selectedColor=null;current.selectedSize=null;
    els.title.textContent=p.name;
    els.price.textContent=currency(p.price);
    els.installments.textContent=calcInstallments(p.price);
    els.imgMain.alt=p.name;
    document.getElementById('lsxDescription').textContent=p.description||'Sem descrição disponível.';
    mountGallery(p);
    mountColors(p);
    refreshStockLabel(p);
    ensureQtyControls();

    els.buyBtn.onclick=()=>{
      if(current.maxStock<=0)return showAlert('Sem estoque para esta variação.');
      const color=current.selectedColor||'Única';
      const size=current.selectedSize||'ÚNICO';
      addToCart(p,size,color,current.qty);
      cart.setAttribute('aria-hidden','false');
      LSModal.close();
    };
    els.addBtn.onclick=()=>{
      if(current.maxStock<=0)return showAlert('Sem estoque para esta variação.');
      const color=current.selectedColor||'Única';
      const size=current.selectedSize||'ÚNICO';
      addToCart(p,size,color,current.qty);
      try{playChime&&playChime();}catch(_){}
      LSModal.close();
    };
  }

  function open(id){
    const prod=Object.values(catalog).flat().find(p=>String(p.id)===String(id));
    if(!prod)return;
    fill(prod);
    els.root.classList.add('is-open');
    document.body.classList.add('lsx-no-scroll');
  }
  function close(){
    els.root.classList.remove('is-open');
    document.body.classList.remove('lsx-no-scroll');
  }
  els.root.addEventListener('click',e=>{if(e.target.dataset.close==='true')close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});

  window.LSModal={open,close};
})();
// =============================
// ALERTA LS PREMIUM
// =============================
function showAlert(msg){
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:9999;';
  overlay.innerHTML=`
  <div style="background:#fff;border-radius:16px;padding:20px;text-align:center;max-width:320px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
    <p style="font-weight:600;color:#7A3BFD;margin-bottom:8px;">⚠️ Atenção</p>
    <p style="margin-bottom:10px">${msg}</p>
    <button style="background:linear-gradient(90deg,#E96BA8,#7A3BFD);color:#fff;border:0;border-radius:10px;padding:8px 16px;font-weight:600;cursor:pointer;">Ok</button>
  </div>`;
  overlay.querySelector('button').onclick=()=>overlay.remove();
  document.body.appendChild(overlay);
}

// =============================
// CARRINHO PREMIUM VARIATION
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

let items=JSON.parse(localStorage.getItem('cartItems')||'[]');
function sumQty(){return items.reduce((a,b)=>a+(b.qty||1),0);}
function sumTotal(){return items.reduce((a,b)=>a+b.price*(b.qty||1),0);}
function updateCartCount(){cartCount.textContent=String(sumQty());localStorage.setItem('cartItems',JSON.stringify(items));}

function renderCart(){
  cartItems.innerHTML='';
  if(!items.length){
    cartItems.innerHTML='<p class="empty">Seu carrinho está vazio 💕</p>';
    cartTotal.textContent='0,00';finalTotal.textContent='0,00';return;
  }
  items.forEach((it,i)=>{
    const lineTotal=it.price*(it.qty||1);
    const row=document.createElement('div');
    row.className='row';
    row.style.cssText='display:grid;grid-template-columns:1fr auto auto auto;gap:8px;margin-bottom:6px;';
    row.innerHTML=`
      <small>${it.name} (${it.size}/${it.color})</small>
      <div style="display:flex;align-items:center;gap:6px">
        <button class="dec" data-i="${i}">−</button>
        <strong>${it.qty||1}</strong>
        <button class="inc" data-i="${i}">+</button>
      </div>
      <small>R$ ${lineTotal.toFixed(2).replace('.',',')}</small>
      <button class="rm" data-i="${i}">✕</button>
    `;
    cartItems.appendChild(row);
  });

  cartItems.querySelectorAll('.rm').forEach(b=>b.onclick=()=>{
    items.splice(+b.dataset.i,1);
    localStorage.setItem('cartItems',JSON.stringify(items));
    renderCart();updateCartCount();
  });

  cartItems.querySelectorAll('.inc').forEach(b=>b.onclick=()=>{
    const idx=+b.dataset.i;
    const it=items[idx];
    const prod=Object.values(catalog).flat().find(p=>p.id===it.id);
    const maxStock=prod?.variations?.[it.color]?.stock||prod?.stock||5;
    if(it.qty>=maxStock)return showAlert(`Estoque máximo atingido: ${maxStock} un.`);
    it.qty++;localStorage.setItem('cartItems',JSON.stringify(items));
    renderCart();updateCartCount();
  });

  cartItems.querySelectorAll('.dec').forEach(b=>b.onclick=()=>{
    const idx=+b.dataset.i;
    const it=items[idx];
    it.qty=Math.max(1,it.qty-1);
    localStorage.setItem('cartItems',JSON.stringify(items));
    renderCart();updateCartCount();
  });

  const subtotal=sumTotal();
  cartTotal.textContent=subtotal.toFixed(2).replace('.',',');
  finalTotal.textContent=subtotal.toFixed(2).replace('.',',');
  updateCartCount();
}
function addToCart(prod,size,color,qty=1){
  const key=(x)=>`${x.id}|${x.size}|${x.color}`;
  const newItem={id:prod.id,name:prod.name,size,color,price:prod.price,qty};
  const maxStock=prod?.variations?.[color]?.stock||prod.stock||5;
  const pos=items.findIndex(it=>key(it)===key(newItem));
  if(pos>=0){
    const total=items[pos].qty+qty;
    if(total>maxStock){items[pos].qty=maxStock;showAlert(`Estoque máximo: ${maxStock} un.`);}
    else items[pos].qty=total;
  }else{
    if(qty>maxStock){newItem.qty=maxStock;showAlert(`Limite ${maxStock} un.`);}
    items.push(newItem);
  }
  localStorage.setItem('cartItems',JSON.stringify(items));
  renderCart();updateCartCount();
  cartBtn.classList.add('pulse');
  setTimeout(()=>cartBtn.classList.remove('pulse'),400);
}
cartBtn.onclick=()=>{cart.setAttribute('aria-hidden','false');renderCart();};
closeCart.onclick=()=>cart.setAttribute('aria-hidden','true');
document.addEventListener('DOMContentLoaded',()=>{renderCart();updateCartCount();});

// =============================
// CHECKOUT WHATSAPP
// =============================
checkout.onclick=()=>{
  if(!items.length)return showAlert('Carrinho vazio!');
  const client=document.getElementById('client-name')?.value.trim();
  if(!client)return showAlert('Informe seu nome.');
  const entrega=document.getElementById('delivery-type').value;
  const bairro=document.getElementById('neighborhood').value;
  const rua=document.getElementById('street').value.trim();
  const numero=document.getElementById('number').value.trim();
  const payment=document.getElementById('payment-sel').value;
  const obs=document.getElementById('order-notes').value.trim()||'Nenhuma';

  let taxa=0;
  if(entrega==='entrega'&&FEES[bairro])taxa=typeof FEES[bairro]==='number'?FEES[bairro]:0;
  const subtotal=sumTotal();
  const total=subtotal+taxa;

  const itensTxt=items.map(it=>`
---------------------------------
👗 *Produto:* ${it.name}
🎨 *Cor:* ${it.color}
📏 *Tamanho:* ${it.size}
🔢 *Qtd:* ${it.qty}
💰 *Subtotal:* R$ ${(it.price*it.qty).toFixed(2).replace('.',',')}
---------------------------------`).join('');

  const endereco=entrega==='entrega'?`${rua}, ${numero} - ${bairro}`:'Retirada na loja';
  const msg=`
💖 *NOVA COMPRA - LS STORE*
👩‍💖 *Cliente:* ${client}
🏡 *Entrega:* ${entrega}
📍 *Endereço:* ${endereco}
💬 *Observações:* ${obs}
💳 *Pagamento:* ${payment}
🛍️ *Itens:*
${itensTxt}
🚚 *Taxa:* R$ ${taxa.toFixed(2).replace('.',',')}
💵 *Total:* R$ ${total.toFixed(2).replace('.',',')}
✨ *Obrigada por comprar na LS Store!* 💕`;

  const url=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  window.location.href=url;
};

// =============================
// BUSCA
// =============================
(function initSearch(){
  const input=document.getElementById('search-input');
  const clear=document.getElementById('search-clear');
  const results=document.getElementById('search-results');
  function all(){return Object.values(catalog).flat();}
  function render(list){
    results.innerHTML=list.map(p=>`
    <div class="search-item" data-id="${p.id}">
      <img src="${p.imgs[0]}" alt="${p.name}">
      <div><strong>${p.name}</strong><br><small>${p.category||''}</small></div>
      <div>R$ ${p.price.toFixed(2).replace('.',',')}</div>
    </div>`).join('');
    results.hidden=!list.length;
    results.querySelectorAll('.search-item').forEach(i=>i.onclick=()=>{
      LSModal.open(i.dataset.id);
      results.hidden=true;
    });
  }
  input.oninput=()=>{
    const q=input.value.toLowerCase().trim();
    if(!q){results.hidden=true;return;}
    const list=all().filter(p=>p.name.toLowerCase().includes(q)||(p.colors||[]).some(c=>c.toLowerCase().includes(q)));
    render(list.slice(0,8));
  };
  clear.onclick=()=>{input.value='';results.hidden=true;};
  document.addEventListener('click',e=>{if(!results.contains(e.target)&&e.target!==input)results.hidden=true;});
})();

// =============================
// EFEITO VISUAL (voar pro carrinho)
// =============================
function flyToCart(imgSrc){
  const cartBtn=document.getElementById('cart-btn');
  const img=document.createElement('img');
  img.src=imgSrc;img.style.cssText='position:fixed;width:60px;height:60px;border-radius:12px;object-fit:cover;z-index:9999;transition:all .8s cubic-bezier(.4,.02,.3,1);';
  document.body.appendChild(img);
  const rect=cartBtn.getBoundingClientRect();
  img.style.left=rect.left+'px';img.style.top=rect.top+'px';
  setTimeout(()=>{
    img.style.transform='translateY(-120px) scale(0.3)';
    img.style.opacity='0';
  },50);
  setTimeout(()=>img.remove(),800);
}

// =============================
// ADMIN PDF
// =============================
if(ADMIN_MODE){
  const btn=document.createElement('button');
  btn.textContent='Gerar PDF';
  btn.style.cssText='position:fixed;bottom:80px;right:16px;background:#7A3BFD;color:#fff;border:0;border-radius:12px;padding:10px 16px;font-weight:700;cursor:pointer;z-index:9999;';
  btn.onclick=()=>{
    const doc=new jsPDF();doc.text('Pedidos LS STORE',20,20);
    let y=40;items.forEach((it,i)=>{doc.text(`${i+1}. ${it.name} - ${it.size}/${it.color} - R$${it.price.toFixed(2)}`,20,y);y+=10;});
    doc.save('pedido-lsstore.pdf');
  };
  document.body.appendChild(btn);
}

// =============================
// VOLTAR AO TOPO + SPLASH FAILSAFE FINAL
// =============================
const backToTop=document.getElementById('backToTop');
window.addEventListener('scroll',()=>{
  if(window.scrollY>400)backToTop.classList.add('show');
  else backToTop.classList.remove('show');
});
backToTop.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});

window.addEventListener('load',()=>{
  setTimeout(()=>{
    const splash=document.getElementById('splash');
    if(splash){splash.classList.add('hidden');setTimeout(()=>splash.remove(),800);}
  },5000);
});