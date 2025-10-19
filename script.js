// =========================
// LS STORE v11.2.6 — Upgrades e Fixes focados (menu, touch, popup/Whats, fly-to-cart)
// Base: v11.2.5 do cliente (sem mudar o layout/estilo visual)
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

// --- Links Instagram (app + web)
const instaDeepLink = `instagram://user?username=${INSTAGRAM_HANDLE.replace('@','')}`;
const instaWeb = `https://www.instagram.com/${INSTAGRAM_HANDLE.replace('@','')}`;
const instaLink = document.getElementById('insta-link');
const footerInsta = document.getElementById('footer-insta');
[instaLink, footerInsta].forEach(a => {
  if (!a) return;
  a.href = instaWeb;
  a.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = instaDeepLink;
    setTimeout(() => window.open(instaWeb, '_blank', 'noopener'), 700);
  });
});

// --- Splash (robusto, sem travar)
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('hidden');
      setTimeout(() => splash.remove(), 800);
    }, 2000);
  }
});

// --- Áudio (lazy init p/ iOS)
let audioCtx;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playChime() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(880, t);
  o.frequency.exponentialRampToValueAtTime(1318, t + 0.35);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.75);
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
  o.start(t);
  o.stop(t + 0.18);
}

// --- Menu Drawer
const drawer = document.getElementById('drawer');
const menuBtn = document.getElementById('menu-btn');
const closeDrawer = document.getElementById('close-drawer');
const drawerGrid = document.getElementById('drawer-grid');
const drawerLinks = document.querySelector('.drawer-links');

const categories = [
  { key: 'blusas', name: 'Blusas', img: 'https://images.unsplash.com/photo-1624996379697-a7c8d6df7a70?q=80&w=1200&auto=format&fit=crop' },
  { key: 'calcas', name: 'Calças', img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop' },
  { key: 'vestidos', name: 'Vestidos', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop' },
  { key: 'intimas', name: 'Roupas Íntimas', img: 'https://images.unsplash.com/photo-1583496661160-fb5886a95736?q=80&w=1200&auto=format&fit=crop' },
  { key: 'calcados', name: 'Calçados', img: 'https://images.unsplash.com/photo-1460355296524-6c2fd3f3a3f4?q=80&w=1200&auto=format&fit=crop' },
  { key: 'oculos', name: 'Óculos', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop' },
  { key: 'cosmeticos', name: 'Cosméticos', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop' },
  { key: 'beleza', name: 'Beleza', img: 'https://images.unsplash.com/photo-1608222351212-69c3ab3b1bda?q=80&w=1200&auto=format&fit=crop' }
];
drawerGrid.innerHTML = categories.map(c => `
  <div class="cat-card" data-target="${c.key}">
    <img src="${c.img}" alt="${c.name}">
    <div class="label">${c.name}</div>
  </div>`).join('');

drawerGrid.addEventListener('click', e => {
  const card = e.target.closest('.cat-card');
  if (!card) return;
  const sec = card.dataset.target;
  showSection(sec);
  drawer.setAttribute('aria-hidden', 'true');
});

menuBtn.onclick = () => {
  drawer.setAttribute('aria-hidden', drawer.getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
  clickSoft();
};
closeDrawer.onclick = () => {
  drawer.setAttribute('aria-hidden', 'true');
  clickSoft();
};
drawer.querySelector('.drawer-backdrop').onclick = () => drawer.setAttribute('aria-hidden', 'true');

// --- Navegação entre seções (inclui "Femininos" → abre 'vestidos' por padrão)
document.querySelectorAll('.drawer-links a[data-section], .footer a[data-section]').forEach(a => {
  a.onclick = e => {
    e.preventDefault();
    const sec = a.getAttribute('data-section');
    if (sec === 'femininos') {
      // ponto único de entrada para as categorias femininas
      showSection('vestidos');
    } else {
      showSection(sec);
    }
    drawer.setAttribute('aria-hidden', 'true');
  };
});

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('visible'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Catálogo de produtos
const catalog = {
  blusas: [
    {
      id: 'b1', name: 'Blusa Cropped Renda', price: 89.9,
      imgs: ['https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop'],
      sizes: ['P','M','G'], colors: ['Branco','Preto'], stock: 6,
      desc: 'Cropped delicado com renda e ajuste confortável.'
    }
  ],
  vestidos: [
    {
      id: 'v1', name: 'Vestido Floral Midi', price: 159.9,
      imgs: [
        'https://images.unsplash.com/photo-1614691812260-0b2152d5f83e?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614691812260-0b2152d5f83e?q=80&w=1200&auto=format&fit=crop'
      ],
      sizes: ['P', 'M', 'G'], colors: ['Rosa', 'Branco'], stock: 5, isNew: true,
      desc: 'Vestido midi floral em tecido leve, caimento perfeito.'
    },
    {
      id: 'v2', name: 'Vestido Longo Fenda', price: 179.9,
      imgs: [
        'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop'
      ],
      sizes: ['M', 'G', 'GG'], colors: ['Preto', 'Bege'], stock: 3,
      desc: 'Longo com fenda lateral e cintura marcada.'
    }
  ],
  calcas: [
    {
      id: 'c1', name: 'Calça Jeans Cintura Alta', price: 139.9,
      imgs: [
        'https://images.unsplash.com/photo-1618354691438-25e01c74f8b1?q=80&w=1200&auto=format&fit=crop'
      ],
      sizes: ['P', 'M', 'G'], colors: ['Azul', 'Preto'], stock: 7,
      desc: 'Jeans com stretch e cintura alta.'
    }
  ]
};

// --- Destaques
const featured = [catalog.vestidos[0], catalog.calcas[0]];

function priceHTML(p) {
  const v = p.discount ? (p.price * (1 - p.discount)) : p.price;
  let s = `R$ ${v.toFixed(2).replace('.', ',')}`;
  if (p.discount) {
    s += ` <span style="text-decoration:line-through;color:#8a7aa5;font-size:12px;margin-left:6px">R$ ${p.price.toFixed(2).replace('.', ',')}</span>`;
  }
  return s;
}
function badgeHTML(p) {
  if (p.stock <= 0) return '<span class="badge">Esgotado</span>';
  if (p.discount) return '<span class="badge">-30%</span>';
  if (p.isNew) return '<span class="badge">Novo</span>';
  return '';
}
function cardHTML(p) {
  return `<div class="card" data-id="${p.id}">
    ${badgeHTML(p)}
    <img src="${(p.imgs ? p.imgs[0] : p.img)}" alt="${p.name}"/>
    <div class="info"><p class="name">${p.name}</p><p class="price">${priceHTML(p)}</p></div>
  </div>`;
}
function renderGrid(el, arr) {
  el.innerHTML = arr.map(cardHTML).join('');
  el.querySelectorAll('.card').forEach(c => c.onclick = () => openModal(c.getAttribute('data-id')));
}
function renderAll() {
  const f = document.getElementById('featured'); if (f) renderGrid(f, featured);
  document.querySelectorAll('[data-cat]').forEach(g => {
    const cat = g.getAttribute('data-cat');
    renderGrid(g, catalog[cat] || []);
  });
}
renderAll();

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
  // busca o produto correto
  currentProduct = null;
  for (const cat in catalog) {
    const prod = catalog[cat].find(p => p.id === id);
    if (prod) {
      currentProduct = prod;
      break;
    }
  }
  if (!currentProduct) return;

  // preenche infos
  modalName.textContent = currentProduct.name;
  modalPrice.textContent = `R$ ${currentProduct.price.toFixed(2).replace('.', ',')}`;
  modalDesc.textContent = currentProduct.desc;
  selectedSize = '';
  selectedColor = '';

  // imagens (até 5)
  const imgsHTML = (currentProduct.imgs || [currentProduct.img || ''])
    .slice(0, 5)
    .map(i => `<img src="${i}" alt="${currentProduct.name}">`)
    .join('');
  modalImgs.innerHTML = imgsHTML;

  // tamanhos
  sizeOpt.innerHTML = (currentProduct.sizes || [])
    .map(s => `<button>${s}</button>`)
    .join('');
  sizeOpt.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      selectedSize = b.textContent;
      sizeOpt.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    };
  });

  // cores
  colorOpt.innerHTML = (currentProduct.colors || [])
    .map(c => `<button>${c}</button>`)
    .join('');
  colorOpt.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      selectedColor = b.textContent;
      colorOpt.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    };
  });

  // exibe modal
  modal.setAttribute('aria-hidden', 'false');

  // evento do botão após montar as opções
  setTimeout(() => {
    const addBtn = document.getElementById('modal-add');
    if (addBtn) {
      addBtn.onclick = () => {
        if (!selectedSize || !selectedColor) {
          showAlert('Por favor, selecione o tamanho e a cor antes de adicionar ao carrinho!');
          return;
        }
        // animação voando até o carrinho
        const img = modalImgs.querySelector('img');
        if (img) animateFlyToCart(img, document.getElementById('cart-btn'));
        addToCart(currentProduct, selectedSize, selectedColor);
        modal.setAttribute('aria-hidden', 'true');
        playChime();
      };
    }
  }, 100);
}

// fecha modal
modalClose.onclick = () => modal.setAttribute('aria-hidden', 'true');
modal.addEventListener('click', e => {
  if (e.target === modal) modal.setAttribute('aria-hidden', 'true');
});

// alerta
function showAlert(msg) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,.4)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:20px 24px;text-align:center;max-width:320px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
      <p style="font-weight:600;color:#7A3BFD;margin-bottom:10px;">⚠️ Atenção</p>
      <p style="margin-bottom:12px">${msg}</p>
      <button style="background:linear-gradient(90deg,#E96BA8,#7A3BFD);color:#fff;border:0;border-radius:10px;padding:8px 16px;font-weight:600;cursor:pointer;">Ok</button>
    </div>`;
  overlay.querySelector('button').onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}

// =============================
// CARRINHO (com UI da taxa/total e explosão)
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

let items = [];

cartBtn.onclick = () => cart.setAttribute('aria-hidden', 'false');
closeCart.onclick = () => cart.setAttribute('aria-hidden', 'true');

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  items.forEach((it, i) => {
    const row = document.createElement('div');
    row.className = 'row';
    // força 3 colunas sem alterar CSS global
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '1fr auto auto';
    row.style.gap = '8px';
    row.innerHTML = `
      <small>${it.name} (${it.size}/${it.color})</small>
      <small>R$ ${it.price.toFixed(2).replace('.', ',')}</small>
      <button data-i="${i}" style="border:0;background:transparent;color:#E96BA8;font-weight:700;cursor:pointer;">✕</button>`;
    cartItems.appendChild(row);
    total += it.price;
  });
  cartTotal.textContent = total.toFixed(2).replace('.', ',');
  cartCount.textContent = items.length;
  cartItems.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      items.splice(b.dataset.i, 1);
      updateCart();
      refreshTotalsUI();
    };
  });
}

function addToCart(prod, size, color) {
  items.push({ name: prod.name, size, color, price: prod.price });
  // explosão/pulse no carrinho
  cartBtn.classList.add('pulse');
  makeCartExplosion(cartBtn);
  setTimeout(() => cartBtn.classList.remove('pulse'), 400);
  updateCart();
  refreshTotalsUI();
}

// =============================
// ENTREGA, PAGAMENTO E WHATSAPP (popup antes do WhatsApp)
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
  refreshTotalsUI();
};
neighborhood.onchange = refreshTotalsUI;

function calcFee() {
  if (deliveryType.value !== 'entrega') return 0;
  const bairro = neighborhood.value;
  const fee = FEES[bairro];
  return (typeof fee === 'number') ? fee : 0;
}
function refreshTotalsUI() {
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

  // Mostra popup primeiro, depois abre o WhatsApp
  const pop = document.getElementById('popup-overlay');
  pop.hidden = false;
  pop.classList.add('show');

  setTimeout(() => {
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }, 1200);

  setTimeout(() => { pop.hidden = true; }, 5000);
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
// CARROSSEL (dots clicáveis)
// =============================
(function initCarousel(){
  const wrap = document.getElementById('carousel');
  if (!wrap) return;
  const slides = wrap.querySelector('.slides');
  const dots = [...wrap.querySelectorAll('.dot')];
  let idx = 0;

  function go(i){
    idx = (i + dots.length) % dots.length;
    slides.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[idx].classList.add('active');
  }
  dots.forEach(d => d.addEventListener('click', () => go(parseInt(d.dataset.i, 10))));
  let timer = setInterval(()=>go(idx+1), 6000);
  wrap.addEventListener('mouseenter', ()=>clearInterval(timer));
  wrap.addEventListener('mouseleave', ()=>timer = setInterval(()=>go(idx+1), 6000));
})();

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

// =============================
// Animação: voar até o carrinho + explosão
// =============================
function animateFlyToCart(sourceImg, cartButton){
  const rectStart = sourceImg.getBoundingClientRect();
  const rectEnd = cartButton.getBoundingClientRect();

  const clone = sourceImg.cloneNode(true);
  clone.style.position = 'fixed';
  clone.style.left = rectStart.left + 'px';
  clone.style.top = rectStart.top + 'px';
  clone.style.width = rectStart.width + 'px';
  clone.style.height = rectStart.height + 'px';
  clone.style.borderRadius = '12px';
  clone.style.zIndex = 9999;
  clone.style.transition = 'transform .6s ease, opacity .6s ease, left .6s ease, top .6s ease, width .6s ease, height .6s ease';
  document.body.appendChild(clone);

  // destino (encolhe e vai pro carrinho)
  requestAnimationFrame(()=> {
    clone.style.left = (rectEnd.left + rectEnd.width/2 - rectStart.width*0.2) + 'px';
    clone.style.top = (rectEnd.top + rectEnd.height/2 - rectStart.height*0.2) + 'px';
    clone.style.width = (rectStart.width * 0.4) + 'px';
    clone.style.height = (rectStart.height * 0.4) + 'px';
    clone.style.opacity = '0.6';
  });

  setTimeout(()=> {
    clone.style.opacity = '0';
    setTimeout(()=> clone.remove(), 200);
    // pequena explosão no carrinho
    makeCartExplosion(cartButton);
  }, 620);
}

function makeCartExplosion(cartButton){
  const spark = document.createElement('span');
  spark.style.position = 'fixed';
  const r = cartButton.getBoundingClientRect();
  spark.style.left = (r.left + r.width/2) + 'px';
  spark.style.top = (r.top + r.height/2) + 'px';
  spark.style.width = '6px';
  spark.style.height = '6px';
  spark.style.borderRadius = '50%';
  spark.style.background = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(233,107,168,0.8) 60%, rgba(122,59,253,0.6) 100%)';
  spark.style.boxShadow = '0 0 18px rgba(122,59,253,.6), 0 0 8px rgba(233,107,168,.6)';
  spark.style.zIndex = 9999;
  spark.style.transform = 'translate(-50%, -50%) scale(1)';
  spark.style.transition = 'transform .35s ease, opacity .35s ease';
  document.body.appendChild(spark);

  requestAnimationFrame(()=> {
    spark.style.transform = 'translate(-50%, -50%) scale(6)';
    spark.style.opacity = '0';
  });
  setTimeout(()=> spark.remove(), 380);
}
