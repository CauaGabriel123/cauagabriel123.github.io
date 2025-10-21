// =========================
// LS STORE v11.4.0 — Upgrades garantidos (sem alterar layout funcional)
// - Drawer: mantém "Femininos" (dropdown) com subcategorias
// - Carrossel Início: arrastável com o dedo + itens reais do catálogo (clica e abre modal)
// - WhatsApp: abertura garantida com window.location.href
// - NOVO: campo Número só aceita números (bloqueio de letras)
// - NOVO: link "Sobre Nós" no menu abre a seção correspondente
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

// Fallback local para quando o fetch('products.json') falhar
const FALLBACK_PRODUCTS = [
  { "id": "p1", "name": "Vestido Floral Midi", "category": "vestidos", "price": 99.99, "image": "assets/prod-vestido-floral.jpg", "description": "Vestido midi leve com estampa floral e caimento fluido, perfeito para dias ensolarados.", "status": "disponivel" },
  { "id": "p2", "name": "Vestido Curto Preto Elegance", "category": "vestidos", "price": 189.9, "image": "assets/prod-vestido-preto.jpg", "description": "Vestido curto preto com toque sofisticado e caimento perfeito para festas e eventos.", "status": "disponivel" },
  { "id": "p3", "name": "Vestido Longo Rosa Serenity", "category": "vestidos", "price": 229.9, "image": "assets/prod-vestido-longo.jpg", "description": "Longo com tom rosa suave, tecido leve e fenda discreta. Conforto e elegância.", "status": "disponivel" },

  { "id": "p4", "name": "Camiseta Feminina Básica Branca", "category": "blusas", "price": 59.9, "image": "assets/prod-camiseta-branca.jpg", "description": "Camiseta básica em algodão macio, ideal para compor looks casuais.", "status": "disponivel" },
  { "id": "p5", "name": "Blusa Cropped Canelada", "category": "blusas", "price": 79.9, "image": "assets/prod-blusa-cropped.jpg", "description": "Blusa cropped canelada com gola redonda e modelagem confortável.", "status": "disponivel" },
  { "id": "p6", "name": "Blusa Off-Shoulder Bege", "category": "blusas", "price": 89.9, "image": "assets/prod-blusa-bege.jpg", "description": "Blusa ombro a ombro com tecido suave e elegante para qualquer ocasião.", "status": "disponivel" },

  { "id": "p7", "name": "Calça Jeans Cintura Alta", "category": "calcas", "price": 139.9, "image": "assets/prod-calca-jeans.jpg", "description": "Jeans clássico de cintura alta e corte reto. Modela e valoriza o corpo.", "status": "disponivel" },
  { "id": "p8", "name": "Calça Pantalona Rose", "category": "calcas", "price": 159.9, "image": "assets/prod-calca-pantalona.jpg", "description": "Pantalona moderna com tecido fluido e cintura elástica confortável.", "status": "disponivel" },
  { "id": "p9", "name": "Calça de Moletom Feminina", "category": "calcas", "price": 119.9, "image": "assets/prod-calca-moletom.jpg", "description": "Calça comfy de moletom macio, ideal para o dia a dia.", "status": "disponivel" },

  { "id": "p10", "name": "Lingerie Conjunto Rosa Pastel", "category": "intimas", "price": 89.9, "image": "assets/prod-lingerie-rosa.jpg", "description": "Conjunto delicado de renda com modelagem confortável e toque suave.", "status": "disponivel" },
  { "id": "p11", "name": "Sutiã Sem Bojo Confort Lace", "category": "intimas", "price": 59.9, "image": "assets/prod-sutia-lace.jpg", "description": "Sutiã em renda delicada sem bojo, ideal para o conforto do dia a dia.", "status": "disponivel" },

  { "id": "p12", "name": "Sandália Rosa Comfort", "category": "calcados", "price": 169.9, "image": "assets/prod-sandalia-rosa.jpg", "description": "Sandália leve com tiras cruzadas e palmilha macia, em tom rosa LS.", "status": "disponivel" },
  { "id": "p13", "name": "Tênis Branco Casual Feminino", "category": "calcados", "price": 199.9, "image": "assets/prod-tenis-branco.jpg", "description": "Tênis branco clássico, combina com tudo. Estilo e conforto em um só modelo.", "status": "disponivel" },

  { "id": "p14", "name": "Óculos de Sol LS Fashion", "category": "oculos", "price": 89.9, "image": "assets/prod-oculos-fashion.jpg", "description": "Óculos fashion com lentes degradê e hastes douradas, estilo moderno LS.", "status": "disponivel" },
  { "id": "p15", "name": "Óculos de Sol Redondo Vintage", "category": "oculos", "price": 99.9, "image": "assets/prod-oculos-vintage.jpg", "description": "Óculos redondo retrô com lentes levemente rosadas, um charme.", "status": "disponivel" },

  { "id": "p16", "name": "Batom Matte Rosa LS", "category": "cosmeticos", "price": 49.9, "image": "assets/prod-batom-rosa.jpg", "description": "Batom matte de longa duração, tom rosa LS perfeito para todos os tons de pele.", "status": "disponivel" },
  { "id": "p17", "name": "Perfume LS Essence 50ml", "category": "cosmeticos", "price": 129.9, "image": "assets/prod-perfume-ls.jpg", "description": "Perfume feminino floral frutado, aroma leve e sofisticado LS.", "status": "disponivel" },

  { "id": "p18", "name": "Creme Hidratante Corporal LS", "category": "beleza", "price": 69.9, "image": "assets/prod-hidratante.jpg", "description": "Hidratante corporal com fragrância suave e textura leve.", "status": "disponivel" },
  { "id": "p19", "name": "Sérum Facial Iluminador", "category": "beleza", "price": 99.9, "image": "assets/prod-serum-facial.jpg", "description": "Sérum facial com toque seco, ideal para pele radiante e nutrida.", "status": "disponivel" },

  { "id": "p20", "name": "Bolsa Rosa Pastel LS", "category": "acessorios", "price": 149.9, "image": "assets/prod-bolsa-rosa.jpg", "description": "Bolsa estruturada tom rosa LS, moderna e prática para o dia a dia.", "status": "disponivel" }
];

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

// --- Splash (corrigido para travamento)
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('hidden');
      setTimeout(() => splash.remove(), 800);
    }, 2000);
  }
});

// --- Áudio (lazy init para iOS)
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

menuBtn.onclick = () => {
  drawer.setAttribute('aria-hidden', drawer.getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
  clickSoft();
};
closeDrawer.onclick = () => {
  drawer.setAttribute('aria-hidden', 'true');
  clickSoft();
};
drawer.querySelector('.drawer-backdrop').onclick = () => drawer.setAttribute('aria-hidden', 'true');

// Accordion Produtos (100% funcional em desktop e mobile)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.drawer-accordion');
  const sub = document.getElementById('sub-produtos');
  if (!btn || !sub) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    sub.hidden = expanded;
    clickSoft(); // som suave no clique
  });
});

// --- Navegação entre seções
document.querySelectorAll('.drawer-links a[data-section], .footer a[data-section]').forEach(a => {
  a.onclick = e => {
    e.preventDefault();
    showSection(a.getAttribute('data-section'));
    drawer.setAttribute('aria-hidden', 'true');
  };
});

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('visible'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- NOVO: link "Sobre Nós" no menu abre a seção correspondente
(function sobreNosNav(){
  const link = document.getElementById('sobre-nos-link');
  if (!link) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('sobre-nos');
    drawer.setAttribute('aria-hidden', 'true');
  });
})();

// =============================
// BLOQUEIO DE LETRAS NO CAMPO "NÚMERO" (somente dígitos 0-9)
// =============================
(function onlyNumericNumberField() {
  const numberInput = document.getElementById('number');
  if (!numberInput) return;

  // Ao digitar/colar, remove tudo que não for dígito
  numberInput.addEventListener('input', () => {
    numberInput.value = numberInput.value.replace(/\D+/g, '');
  });

  // Bloqueia caracteres não-numéricos no keypress
  numberInput.addEventListener('keypress', e => {
    const char = String.fromCharCode(e.which || e.keyCode);
    if (!/[0-9]/.test(char)) e.preventDefault();
  });
})();

// --- Catálogo de produtos dinâmico via products.json (com fallback robusto)
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
      sizes: ['P', 'M', 'G'],
      colors: ['Preto', 'Branco', 'Rosa'],
      stock: 5, // mantém todos visíveis (o visual "esgotado" é tratado pelo CSS)
      desc: p.description
    });
  });

  featured = data
  .slice(0, 5)
  .map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      imgs: [p.image],
      desc: p.description
    }));

  renderAll();
  initCarousel();
  renderFooterProducts(featured.length ? featured : null);
}

// === Carregamento aprimorado do catálogo (corrigido — ignora falsos negativos do fetch) ===
(function loadProducts() {
  const url = 'products_v2.json?v=' + Date.now(); // força sempre nova versão

  // Carrega catálogo com fallback interno
  fetch(url, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('✅ Catálogo carregado do arquivo externo:', url);
      buildCatalogAndRender(data);
      console.log('🟢 Renderização iniciada...');
    })
    .catch(err => {
      console.warn('⚠️ Erro leve ao buscar catálogo:', err.message);

      // Espera um pouco e verifica se os produtos foram renderizados
      setTimeout(() => {
        const produtos = document.querySelectorAll('.product-item, .card');
        if (produtos.length > 0) {
          console.log('🟢 Catálogo carregado com sucesso após verificação.');
          return; // tudo certo, não mostra alerta
        }
        // Só mostra o alerta se realmente não renderizou nada
        showAlert('Não foi possível carregar os produtos atualizados. Recarregue a página em alguns segundos.');
        console.error('❌ Nenhum produto renderizado após verificação.');
      }, 2500); // 2,5 segundos de espera
    });
})();

function priceHTML(p) {
  const v = p.discount ? (p.price * (1 - p.discount)) : p.price;
  let s = `R$ ${v.toFixed(2).replace('.', ',')}`;
  if (p.discount) {
    s += ` <span style="text-decoration:line-through;color:#8a7aa5;font-size:12px;margin-left:6px">R$ ${p.price.toFixed(2).replace('.', ',')}</span>`;
  }
  return s;
}
function badgeHTML(p) {
  if (p.status && p.status.toLowerCase() === 'esgotado')
    return '<span class="badge">Esgotado</span>';
  if (p.discount) return '<span class="badge">-30%</span>';
  if (p.isNew) return '<span class="badge">Novo</span>';
  return '';
}
function cardHTML(p) {
  const sold = (p.status && p.status.toLowerCase() === 'esgotado');
  return `<div class="card${sold ? ' soldout' : ''}" data-id="${p.id}">
    ${badgeHTML(p)}
    <img src="${(p.imgs ? p.imgs[0] : p.img || p.image)}" alt="${p.name}"/>
    <div class="info">
      <p class="name">${p.name}</p>
      <p class="price">${priceHTML(p)}</p>
    </div>
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

// ===== Rodapé: vitrine horizontal com produtos reais =====
function renderFooterProducts(listFromData) {
  const box = document.getElementById('footer-products');
  if (!box) return;

  // Usa lista enviada ou junta todos do catálogo
  let pool = listFromData;
  if (!pool || !pool.length) {
    pool = [];
    for (const cat in catalog) {
      (catalog[cat] || []).forEach(p => { if (p.stock > 0) pool.push(p); });
    }
  }

  // Limita para não pesar
  const slice = pool.slice(0, 12);

  box.innerHTML = slice.map(p => `
    <div class="footer-card" data-id="${p.id}" role="button" aria-label="${p.name}">
          <img src="${(p.imgs ? p.imgs[0] : p.img || p.image)}" alt="${p.name}">
      <div class="fc-info">
        <div class="fc-name">${p.name}</div>
        <div class="fc-price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
      </div>
    </div>
  `).join('');

  // Clique abre modal de produto
  box.querySelectorAll('.footer-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.getAttribute('data-id')));
  });
}

// =============================
// MODAL DE PRODUTO (corrigido)
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
  currentProduct = null;
  for (const cat in catalog) {
    const prod = (catalog[cat]||[]).find(p => p.id === id);
    if (prod) { currentProduct = prod; break; }
  }
  if (!currentProduct) return;

  modalName.textContent = currentProduct.name;
  modalPrice.textContent = `R$ ${currentProduct.price.toFixed(2).replace('.', ',')}`;
  modalDesc.textContent = currentProduct.desc;
  selectedSize = '';
  selectedColor = '';

  const imgsHTML = (currentProduct.imgs || [currentProduct.img || ''])
    .slice(0, 5)
    .map(i => `<img src="${i}" alt="${currentProduct.name}">`)
    .join('');
  modalImgs.innerHTML = imgsHTML;

  sizeOpt.innerHTML = (currentProduct.sizes || []).map(s => `<button>${s}</button>`).join('');
  sizeOpt.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      selectedSize = b.textContent;
      sizeOpt.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    };
  });

  colorOpt.innerHTML = (currentProduct.colors || []).map(c => `<button>${c}</button>`).join('');
  colorOpt.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      selectedColor = b.textContent;
      colorOpt.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    };
  });

  modal.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    const addBtn = document.getElementById('modal-add');
    if (addBtn) {
      addBtn.onclick = () => {
        // 🔒 bloqueia produtos esgotados
        if (currentProduct.status && currentProduct.status.toLowerCase() === 'esgotado') {
          showAlert('Este produto está esgotado no momento 💜');
          return;
        }
        if (!selectedSize || !selectedColor) {
          showAlert('Por favor, selecione o tamanho e a cor antes de adicionar ao carrinho!');
          return;
        }
        addToCart(currentProduct, selectedSize, selectedColor);
        modal.setAttribute('aria-hidden', 'true');
        playChime();
      };
    }
  }, 100);
}

modalClose.onclick = () => modal.setAttribute('aria-hidden', 'true');
modal.addEventListener('click', e => { if (e.target === modal) modal.setAttribute('aria-hidden', 'true'); });

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
