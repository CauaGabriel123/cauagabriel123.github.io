// =========================
// LS STORE v13.1 — Suporte a tamanhos e cores variáveis
// Base: v13.0.7 (Cauã, LS Store oficial)
// =========================

const { jsPDF } = window.jspdf;

const WHATSAPP = '5551989235482';
const ADMIN_MODE = new URLSearchParams(location.search).get('admin') === 'true';
const FEES = {
  "Mathias Velho": 5, "Harmonia": 6, "Mato Grande": 7, "São Luís": 8,
  "Centro": 8, "Fátima": 9, "Igara": 10, "Rio Branco": 10, "Industrial": 10,
  "Marechal Rondon": 11, "Estância Velha": 12, "Guajuviras": 15, "Olaria": 16, "Outra Cidade": "consultar"
};
const INSTAGRAM_HANDLE = '@ls_store.fc';

// --- Fallback (caso o arquivo JSON não carregue)
const FALLBACK_PRODUCTS = [
  { "id": "p1", "name": "Vestido Floral Midi", "category": "vestidos", "price": 99.99, "image": "assets/prod-vestido-floral.jpg", "description": "Vestido midi leve e elegante.", "status": "disponivel", "tamanhos": ["P", "M", "G"], "cores": ["Branco", "Rosa"] },
];

// --- Instagram Links
const instaDeepLink = `instagram://user?username=${INSTAGRAM_HANDLE.replace('@','')}`;
const instaWeb = `https://www.instagram.com/${INSTAGRAM_HANDLE.replace('@','')}`;
document.querySelectorAll('#insta-link, #footer-insta').forEach(a => {
  if (!a) return;
  a.href = instaWeb;
  a.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = instaDeepLink;
    setTimeout(() => window.open(instaWeb, '_blank', 'noopener'), 700);
  });
});

// --- Splash
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add('hidden');
    setTimeout(() => splash.remove(), 800);
  }, 2000);
});

// --- Sons leves
let audioCtx;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playChime() { const ctx = getCtx(), t = ctx.currentTime; const o = ctx.createOscillator(); const g = ctx.createGain(); o.type='sine'; o.frequency.setValueAtTime(880,t); o.frequency.exponentialRampToValueAtTime(1318,t+0.35); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.2,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+0.7); o.connect(g).connect(ctx.destination); o.start(t); o.stop(t+0.75); }

// =============================
// MENU e NAVEGAÇÃO
// =============================
const drawer = document.getElementById('drawer');
document.getElementById('menu-btn').onclick = () => drawer.setAttribute('aria-hidden', 'false');
document.getElementById('close-drawer').onclick = () => drawer.setAttribute('aria-hidden', 'true');
drawer.querySelector('.drawer-backdrop').onclick = () => drawer.setAttribute('aria-hidden', 'true');
document.getElementById('sobre-nos-link').onclick = e => { e.preventDefault(); showSection('sobre-nos'); drawer.setAttribute('aria-hidden', 'true'); };

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('visible'));
  document.getElementById(id)?.classList.add('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================
// CAMPO NÚMERO (somente dígitos)
// =============================
const numberInput = document.getElementById('number');
if (numberInput) {
  numberInput.addEventListener('input', () => numberInput.value = numberInput.value.replace(/\D+/g, ''));
  numberInput.addEventListener('keypress', e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); });
}

// =============================
// CATÁLOGO + RENDERIZAÇÃO
// =============================
let catalog = {};
let featured = [];

function buildCatalogAndRender(data) {
  catalog = {};
  data.forEach(p => {
    const cat = p.category || 'outros';
    if (!catalog[cat]) catalog[cat] = [];
    catalog[cat].push({
      id: p.id,
      name: p.name,
      price: p.price,
      imgs: [p.image],
      tamanhos: p.tamanhos || ['P', 'M', 'G'],
      cores: p.cores || ['Preto', 'Branco', 'Rosa'],
      desc: p.description,
      status: p.status || 'disponivel'
    });
  });

  featured = data.slice(0, 5);
  renderAll();
  initCarousel();
  renderFooterProducts(featured);
}

// --- Carregar JSON externo
(function loadProducts() {
  fetch('products_v2.json?v=' + Date.now(), { cache: 'no-store' })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(buildCatalogAndRender)
    .catch(() => {
      console.warn('⚠️ Catálogo externo falhou, usando fallback.');
      buildCatalogAndRender(FALLBACK_PRODUCTS);
    });
})();

// =============================
// RENDERIZAÇÃO DE CARDS
// =============================
function priceHTML(p) { return `R$ ${p.price.toFixed(2).replace('.', ',')}`; }
function badgeHTML(p) { return p.status === 'esgotado' ? '<span class="badge">Esgotado</span>' : ''; }

function renderGrid(el, arr) {
  el.innerHTML = arr.map(p => `
    <div class="card ${p.status === 'esgotado' ? 'soldout' : ''}" data-id="${p.id}">
      ${badgeHTML(p)}
      <img src="${p.imgs[0]}" alt="${p.name}">
      <div class="info"><p class="name">${p.name}</p><p class="price">${priceHTML(p)}</p></div>
    </div>
  `).join('');

  el.querySelectorAll('.card:not(.soldout)').forEach(c => c.onclick = () => openModal(c.dataset.id));
}

function renderAll() {
  document.getElementById('featured').innerHTML = '';
  document.querySelectorAll('[data-cat]').forEach(g => {
    const cat = g.getAttribute('data-cat');
    renderGrid(g, catalog[cat] || []);
  });
  const f = document.getElementById('featured');
  if (f) renderGrid(f, featured);
}

// =============================
// MODAL DE PRODUTO
// =============================
const modal = document.getElementById('product-modal');
const modalImgs = document.getElementById('modal-imgs');
const modalName = document.getElementById('modal-name');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const sizeOpt = document.getElementById('size-options');
const colorOpt = document.getElementById('color-options');
const modalClose = document.getElementById('modal-close');

let currentProduct = null;
let selectedSize = '';
let selectedColor = '';

function openModal(id) {
  currentProduct = Object.values(catalog).flat().find(p => p.id === id);
  if (!currentProduct) return;

  modalName.textContent = currentProduct.name;
  modalPrice.textContent = `R$ ${currentProduct.price.toFixed(2).replace('.', ',')}`;
  modalDesc.textContent = currentProduct.desc;
  modalImgs.innerHTML = currentProduct.imgs.map(i => `<img src="${i}" alt="${currentProduct.name}">`).join('');

  // 🟣 Tamanhos personalizados
  const sizes = currentProduct.tamanhos || ['P', 'M', 'G'];
  sizeOpt.innerHTML = sizes.map(s => `<button>${s}</button>`).join('');
  sizeOpt.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      selectedSize = b.textContent;
      sizeOpt.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    };
  });

  // 🎨 Cores personalizadas
  const colors = currentProduct.cores || ['Preto', 'Branco', 'Rosa'];
  colorOpt.innerHTML = colors.map(c => `<button>${c}</button>`).join('');
  colorOpt.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      selectedColor = b.textContent;
      colorOpt.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    };
  });

  modal.setAttribute('aria-hidden', 'false');

  document.getElementById('modal-add').onclick = () => {
    if (currentProduct.status === 'esgotado') return showAlert('Este produto está esgotado 💜');
    if (!selectedSize || !selectedColor) return showAlert('Selecione o tamanho e a cor.');
    addToCart(currentProduct, selectedSize, selectedColor);
    modal.setAttribute('aria-hidden', 'true');
    playChime();
  };
}

modalClose.onclick = () => modal.setAttribute('aria-hidden', 'true');
modal.addEventListener('click', e => { if (e.target === modal) modal.setAttribute('aria-hidden', 'true'); });

function showAlert(msg) {
  const o = document.createElement('div');
  o.style = 'position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:9999;';
  o.innerHTML = `<div style="background:#fff;border-radius:16px;padding:20px;text-align:center;max-width:320px;">
    <p style="font-weight:600;color:#7A3BFD;margin-bottom:10px;">⚠️ Atenção</p>
    <p>${msg}</p>
    <button style="margin-top:12px;background:linear-gradient(90deg,#E96BA8,#7A3BFD);color:#fff;border:0;border-radius:10px;padding:8px 16px;font-weight:600;cursor:pointer;">Ok</button>
  </div>`;
  o.querySelector('button').onclick = () => o.remove();
  document.body.appendChild(o);
}

// =============================
// CARRINHO (mantido igual)
// =============================
// (mantém toda a tua lógica anterior aqui — não removi nada, apenas resumi para caber nesta mensagem)

// [⚠️ Quando colar, mantenha TODO o restante do seu script.js após esta parte exatamente como está — 
// carrinho, checkout, WhatsApp, splash, etc. Nada mais precisa ser alterado.]

// =============================
// FIM — LS STORE v13.1
// =============================

// =============================
// CARRINHO (v11.4.1 — correção estável, sem mudar o visual)
// =============================
const cart = document.getElementById('cart');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const finalTotal = document.getElementById('final-total');
const feeValue = document.getElementById('fee-value');
const deliveryFee = document.getElementById('delivery-fee');
const closeCart = document.getElementById('close-cart');
const checkout = document.getElementById('checkout');

let items = JSON.parse(localStorage.getItem('cartItems') || '[]');

// Abrir e fechar carrinho
cartBtn.onclick = () => {
  cart.setAttribute('aria-hidden', 'false');
  renderCart();
};
closeCart.onclick = () => cart.setAttribute('aria-hidden', 'true');

// Atualiza contador no botão 🛒
function updateCartCount() {
  cartCount.textContent = items.length;
  localStorage.setItem('cartItems', JSON.stringify(items));
}

// Atualiza totais visuais
function refreshTotalsUI() {
  const total = items.reduce((acc, it) => acc + it.price, 0);
  cartTotal.textContent = total.toFixed(2).replace('.', ',');
  finalTotal.textContent = total.toFixed(2).replace('.', ',');
  feeValue.textContent = '0,00';
  updateCartCount();
}

// Renderiza o carrinho com itens e botões de remover
function renderCart() {
  cartItems.innerHTML = '';
  if (items.length === 0) {
    cartItems.innerHTML = '<p class="empty">Seu carrinho está vazio 💕</p>';
    refreshTotalsUI();
    return;
  }

  items.forEach((it, i) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '1fr auto auto';
    row.style.gap = '8px';
    row.innerHTML = `
      <small>${it.name} (${it.size}/${it.color})</small>
      <small>R$ ${it.price.toFixed(2).replace('.', ',')}</small>
      <button data-i="${i}" style="border:0;background:transparent;color:#E96BA8;font-weight:700;cursor:pointer;">✕</button>
    `;
    cartItems.appendChild(row);
  });

  // Liga eventos de remover corretamente
  cartItems.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      const idx = parseInt(b.dataset.i);
      items.splice(idx, 1);
      localStorage.setItem('cartItems', JSON.stringify(items));
      renderCart();
      refreshTotalsUI();
    };
  });

  refreshTotalsUI();
}

// Adiciona item ao carrinho
function addToCart(prod, size, color) {
  // Adiciona item ao carrinho e salva
  items.push({ name: prod.name, size, color, price: prod.price });
  localStorage.setItem('cartItems', JSON.stringify(items));

  // 🛍️ Efeito visual do produto "voando" até o carrinho
  const firstImg = (prod.imgs && prod.imgs[0]) || prod.img || '';
  if (firstImg) {
    const btn = document.getElementById('modal-add');
    if (btn) {
      const rect = btn.getBoundingClientRect();
      flyToCart(firstImg, rect.x, rect.y);
    }
  }

  // 💥 Efeito de explosão no botão do carrinho
  cartBtn.classList.add('pulse');
  setTimeout(() => cartBtn.classList.remove('pulse'), 400);

  // 🔄 Atualiza interface do carrinho
  renderCart();
  refreshTotalsUI();

  // 🧮 Corrige o número no carrinho (atualiza imediatamente)
  const el = document.getElementById('cart-count');
  if (el) el.textContent = items.length;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  refreshTotalsUI();
  updateCartCount();
});

// 🔧 FIX — garante que todos os produtos esgotados fiquem com o visual correto em qualquer seção
document.addEventListener('DOMContentLoaded', () => {
  const applySoldOutVisual = () => {
    document.querySelectorAll('.card, .slide, .footer-card').forEach(el => {
      const isSold = el.textContent.toLowerCase().includes('esgotado');
      if (isSold) el.classList.add('soldout');
    });
  };

  // Executa logo após renderizar
  setTimeout(applySoldOutVisual, 600);

  // Reexecuta depois pra garantir que o catálogo todo esteja na tela
  setTimeout(applySoldOutVisual, 2000);
});

// =============================
// ENTREGA, PAGAMENTO E WHATSAPP
// =============================
const nameInput = document.getElementById('client-name');
const paymentSel = document.getElementById('payment');
const cashSection = document.getElementById('cash-section');
const cashRadios = cashSection.querySelectorAll('input[name="cash-change"]');
const cashAmount = document.getElementById('cash-amount');
const deliveryType = document.getElementById('delivery-type');
const addressFields = document.getElementById('address-fields');
const neighborhood = document.getElementById('neighborhood');
const orderNotes = document.getElementById('order-notes');

paymentSel.onchange = () => {
  const v = paymentSel.value;
  cashSection.style.display = (v === 'Dinheiro') ? 'block' : 'none';
};
cashRadios.forEach(r => r.onchange = () => {
  cashAmount.style.display = (r.value === 'sim') ? 'inline-block' : 'none';
});
deliveryType.onchange = () => {
  addressFields.style.display = (deliveryType.value === 'entrega') ? 'block' : 'none';
  refreshFinalTotals();
};
neighborhood.onchange = refreshFinalTotals;

function calcFee() {
  if (deliveryType.value !== 'entrega') return 0;
  const bairro = neighborhood.value;
  const fee = FEES[bairro];
  return (typeof fee === 'number') ? fee : 0;
}
function refreshFinalTotals() {
  const produtos = parseFloat(cartTotal.textContent.replace(',', '.')) || 0;
  const fee = calcFee();

  if (deliveryType.value === 'entrega') {
    deliveryFee.style.display = 'block';
    const bairro = neighborhood.value;
    const val = FEES[bairro];
    feeValue.textContent = (typeof val === 'number' ? val : 0).toFixed(2).replace('.', ',');
  } else {
    deliveryFee.style.display = 'none';
    feeValue.textContent = '0,00';
  }

  const final = produtos + fee;
  finalTotal.textContent = final.toFixed(2).replace('.', ',');
}
refreshTotalsUI();

checkout.onclick = () => {
  if (items.length === 0) { showAlert('Seu carrinho está vazio.'); return; }
  if (!nameInput.value.trim()) { showAlert('Por favor, informe seu nome.'); return; }

  const client = nameInput.value.trim();
  const payment = paymentSel.value;
  const entrega = deliveryType.value;

  let rua = '', numero = '', bairro = neighborhood.value;
  if (entrega === 'entrega') {
    rua = document.getElementById('street').value.trim();
    numero = document.getElementById('number').value.trim();
    if (!rua || !numero || !bairro) {
      showAlert('Para entrega, preencha Rua, Número e Bairro.');
      return;
    }
  }

  const obs = orderNotes.value.trim() || 'Nenhuma';
  const feeRaw = entrega === 'entrega' ? FEES[bairro] || 'consultar' : 0;
  let total = parseFloat(cartTotal.textContent.replace(',', '.'));
  if (typeof feeRaw === 'number') total += feeRaw;

  let valorPago = '', troco = '';
  if (payment === 'Dinheiro') {
    const trocoOp = [...cashRadios].find(r => r.checked)?.value || 'nao';
    if (trocoOp === 'sim' && cashAmount.value) {
      valorPago = parseFloat(cashAmount.value.replace(',', '.')).toFixed(2).replace('.', ',');
      troco = (parseFloat(valorPago.replace(',', '.')) - total).toFixed(2).replace('.', ',');
    } else troco = 'Não precisa';
  }

  const itensTxt = items.map(it => `
---------------------------------
👗 *Produto:* ${it.name}
📏 *Tamanho:* ${it.size}
🎨 *Cor:* ${it.color}
💰 *Preço:* R$ ${it.price.toFixed(2).replace('.', ',')}
---------------------------------`).join('');

  const enderecoTxt = entrega === 'entrega'
    ? `${rua}, ${numero} - ${bairro}`
    : 'Retirada na loja';

  const taxaTxt = (typeof feeRaw === 'number')
    ? `R$ ${feeRaw.toFixed(2).replace('.', ',')}`
    : feeRaw;

  const msg = `🛍️ *NOVO PEDIDO - LS STORE*
---------------------------------
👩‍💖 *Cliente:* ${client}
📦 *Entrega:* ${entrega}
🏡 *Endereço:* ${enderecoTxt}
💬 *Observações:* ${obs}

🧺 *Itens do pedido:*
${itensTxt}

💳 *Pagamento:* ${payment}
🚚 *Taxa de entrega:* ${taxaTxt}
💰 *Total final:* R$ ${total.toFixed(2).replace('.', ',')}
${
  payment === 'Dinheiro'
    ? `${valorPago ? `\n💵 *Valor pago:* R$ ${valorPago}` : ''}\n🔁 *Troco:* ${troco}`
    : ''
}
---------------------------------
✨ *Obrigada por comprar na LS Store!* 💖`;

  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  const pop = document.getElementById('popup-overlay');

  // ✅ Exibe popup e adiciona delay antes de abrir o WhatsApp
  pop.hidden = false;
  pop.classList.add('show');

  setTimeout(() => {
    window.location.href = url;
    pop.hidden = true;
  }, 2000); // <-- Delay de 2 segundos
};

// =============================
// VOLTAR AO TOPO
// =============================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
});
backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// =============================
// LOGIN BONITO (ENTRAR)
// =============================
const loginBtn = document.getElementById('login-btn');
const accountArea = document.getElementById('account-area');

// Garante que o botão existe antes de ativar o clique
if (loginBtn) {
  loginBtn.onclick = () => {
    accountArea.innerHTML = `
    <div class="auth-card">
      <div class="auth-title">
        <h3>Entrar</h3>
        <button class="close-auth">✕</button>
      </div>
      <label>Email
        <input type="email" id="login-email" placeholder="seuemail@email.com">
      </label>
      <label>Senha
        <input type="password" id="login-pass" placeholder="••••••••">
      </label>
      <div class="auth-actions">
        <button class="add-btn" id="login-ok">Entrar</button>
        <button class="add-btn" style="background:linear-gradient(90deg,#E96BA8,#7A3BFD)" id="register">Criar conta</button>
      </div>
    </div>`;

    accountArea.querySelector('.close-auth').onclick = () => accountArea.innerHTML = '';
    accountArea.querySelector('#login-ok').onclick = () => showAlert('Função de login em desenvolvimento 💜');
    accountArea.querySelector('#register').onclick = () => showAlert('Cadastro disponível em breve 💖');
    showSection('minha-conta');
  };
}

// =============================
// ADMIN (gerar PDF pedidos)
// =============================
if (ADMIN_MODE) {
  const pdfBtn = document.createElement('button');
  pdfBtn.textContent = 'Gerar PDF';
  pdfBtn.style = 'position:fixed;bottom:90px;right:16px;background:#7A3BFD;color:#fff;border:0;border-radius:12px;padding:10px 16px;font-weight:700;cursor:pointer;z-index:9999;';
  document.body.appendChild(pdfBtn);
  pdfBtn.onclick = () => {
    const doc = new jsPDF();
    doc.text('Pedidos LS STORE', 20, 20);
    let y = 40;
    items.forEach((it, i) => {
      doc.text(`${i + 1}. ${it.name} - ${it.size}/${it.color} - R$${it.price.toFixed(2)}`, 20, y);
      y += 10;
    });
    doc.save('pedido-lsstore.pdf');
  };
}

// =============================
// CARROSSEL (produtos + swipe)
// =============================
(function initCarousel(){
  const wrap = document.getElementById('carousel');
  if (!wrap) return;
  const slides = document.getElementById('carousel-slides');
  const dotsBox = document.getElementById('carousel-dots');

  // Monta slides a partir de "featured"
  slides.innerHTML = featured.map((p, i) => `
    <div class="slide" data-id="${p.id}" role="button" aria-label="${p.name}">
      <img src="${(p.imgs ? p.imgs[0] : p.img)}" alt="${p.name}">
      ${badgeHTML(p)}
      <div class="slide-caption">
        <strong>${p.name}</strong>
        <span>${priceHTML(p)}</span>
      </div>
    </div>
  `).join('');

  dotsBox.innerHTML = featured.map((_, i) => `<button class="dot ${i===0?'active':''}" data-i="${i}" aria-label="Slide ${i+1}"></button>`).join('');

  const dots = [...dotsBox.querySelectorAll('.dot')];
  let idx = 0;
  let isDown = false;
  let startX = 0;
  let currentX = 0;
  let delta = 0;
  let width = wrap.clientWidth;
  let timer = null;

  function go(i, withAnim = true){
    idx = (i + featured.length) % featured.length;
    if (withAnim) slides.style.transition = 'transform .35s ease';
    else slides.style.transition = 'none';
    slides.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[idx].classList.add('active');
  }

  // Autoplay leve
  function startAuto(){
    stopAuto();
    timer = setInterval(()=>go(idx+1), 6000);
  }
  function stopAuto(){
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Click abre modal
  slides.querySelectorAll('.slide').forEach(sl => {
    sl.addEventListener('click', () => {
      const id = sl.getAttribute('data-id');
      if (Math.abs(delta) < 10) openModal(id); // evita abrir se foi swipe
    });
  });

  // Dots clicáveis
  dots.forEach(d => d.addEventListener('click', () => { go(parseInt(d.dataset.i, 10)); startAuto(); }));

  // Touch/drag
  function onStart(x){
    isDown = true; startX = x; currentX = x; delta = 0;
    stopAuto();
    slides.style.transition = 'none';
  }
  function onMove(x){
    if (!isDown) return;
    currentX = x;
    delta = currentX - startX;
    const percent = (delta / width) * 100;
    slides.style.transform = `translateX(calc(${-idx*100}% + ${percent}%))`;
  }
  function onEnd(){
    if (!isDown) return;
    isDown = false;
    const threshold = width * 0.15; // 15%
    if (delta > threshold) go(idx-1);
    else if (delta < -threshold) go(idx+1);
    else go(idx, true);
    startAuto();
  }

  wrap.addEventListener('touchstart', e => onStart(e.touches[0].clientX), {passive:true});
  wrap.addEventListener('touchmove', e => onMove(e.touches[0].clientX), {passive:true});
  wrap.addEventListener('touchend', onEnd);
  wrap.addEventListener('mousedown', e => onStart(e.clientX));
  window.addEventListener('mousemove', e => onMove(e.clientX));
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('resize', ()=>{ width = wrap.clientWidth; go(idx,false); });

  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);

  // Estado inicial
  go(0,false);
  startAuto();
})();
// 🔧 FIX — garante que produtos esgotados fiquem com o visual "ESGOTADO" mesmo após re-render
document.addEventListener('DOMContentLoaded', () => {
  const applySoldOutVisual = () => {
    document.querySelectorAll('.card').forEach(card => {
      const isSold = card.textContent.toLowerCase().includes('esgotado');
      if (isSold) card.classList.add('soldout');
    });
  };
  applySoldOutVisual();
  // Também reexecuta após carregar catálogo
  setTimeout(applySoldOutVisual, 1500);
});

// =============================
// BUSCA funcional (nome/cor/categoria)
// =============================
(function initSearch(){
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  const resultsBox = document.getElementById('search-results');

  function allProducts(){
    const arr = [];
    for (const cat in catalog) {
      (catalog[cat]||[]).forEach(p => arr.push({...p, _cat: cat}));
    }
    return arr;
  }

  function renderResults(list){
    if (!list.length){
      resultsBox.innerHTML = '<div class="search-item" style="grid-template-columns:1fr"><small>Nenhum resultado</small></div>';
      resultsBox.hidden = false;
      return;
    }
    resultsBox.innerHTML = list.map(p => `
      <div class="search-item" data-id="${p.id}">
        <img src="${(p.imgs ? p.imgs[0] : p.img)}" alt="${p.name}">
        <div>
          <div style="font-weight:700">${p.name}</div>
          <small>${p._cat}</small>
        </div>
        <div style="font-weight:700">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
      </div>`).join('');
    resultsBox.hidden = false;

    resultsBox.querySelectorAll('.search-item').forEach(it=>{
      it.onclick = ()=>{
        const id = it.getAttribute('data-id');
        openModal(id);
        resultsBox.hidden = true;
      };
    });
  }

  function doSearch(q){
    const txt = q.trim().toLowerCase();
    if (!txt){ resultsBox.hidden = true; return; }
    const pool = allProducts();
    const matches = pool.filter(p=>{
      const inName = p.name.toLowerCase().includes(txt);
      const inColors = (p.colors||[]).some(c=>c.toLowerCase().includes(txt));
      const inCat = (p._cat||'').toLowerCase().includes(txt);
      return inName || inColors || inCat;
    }).slice(0, 8);
    renderResults(matches);
  }

  input.addEventListener('input', ()=>doSearch(input.value));
  input.addEventListener('focus', ()=>{ if (input.value.trim()) doSearch(input.value); });
  clearBtn.addEventListener('click', ()=>{
    input.value = '';
    resultsBox.hidden = true;
    input.focus();
  });
  document.addEventListener('click', (e)=>{
    if (!resultsBox.contains(e.target) && e.target !== input) resultsBox.hidden = true;
  });
})();

// Efeito visual: produto "voando" até o carrinho 🛒
function flyToCart(imgSrc, startX, startY) {
  const cartBtn = document.getElementById('cart-btn');
  const img = document.createElement('img');
  img.src = imgSrc;
  img.style.position = 'fixed';
  img.style.width = '60px';
  img.style.height = '60px';
  img.style.borderRadius = '12px';
  img.style.objectFit = 'cover';
  img.style.zIndex = '9999';
  img.style.left = startX + 'px';
  img.style.top = startY + 'px';
  img.style.transition = 'all 0.8s cubic-bezier(.4,.02,.3,1)';
  document.body.appendChild(img);

  const rect = cartBtn.getBoundingClientRect();
  setTimeout(() => {
    img.style.left = rect.left + rect.width / 2 + 'px';
    img.style.top = rect.top + rect.height / 2 + 'px';
    img.style.opacity = '0';
    img.style.transform = 'scale(0.3)';
  }, 50);

  setTimeout(() => img.remove(), 800);
}
