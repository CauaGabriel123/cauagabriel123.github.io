/* ================================
   LS STORE v14.0 — Base Premium JS
   Por Cauã Gabriel & GPT-5
   ================================ */

// --- CONFIGURAÇÕES GERAIS ---
const WHATSAPP = '5551989235482';
const INSTAGRAM = '@ls_store.fc';

// --- ÁUDIO SUAVE ---
let audioCtx;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function clickSoft() {
  const ctx = getCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const t = ctx.currentTime;
  o.type = 'triangle';
  o.frequency.setValueAtTime(500, t);
  o.frequency.exponentialRampToValueAtTime(800, t + 0.08);
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.25);
}
function playChime() {
  const ctx = getCtx();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const t = ctx.currentTime;
  o.type = 'sine';
  o.frequency.setValueAtTime(880, t);
  o.frequency.exponentialRampToValueAtTime(1320, t + 0.4);
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(0.25, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.75);
}

// --- SPLASH SCREEN (v14.0 Premium corrigido) ---
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  if (!splash) return;

  // Força remoção em até 4 segundos, mesmo se o load travar
  const forceRemove = setTimeout(() => {
    splash.classList.add('hidden');
    setTimeout(() => splash.remove(), 800);
  }, 4000);

  // Se o site carregar normalmente, remove antes disso
  window.addEventListener('load', () => {
    clearTimeout(forceRemove);
    setTimeout(() => {
      splash.classList.add('hidden');
      setTimeout(() => splash.remove(), 800);
    }, 2000);
  });
});
// --- BASE DO MODAL PREMIUM ---
const modal = document.getElementById('product-modal');
const modalImgs = document.getElementById('modal-imgs');
const modalName = document.getElementById('modal-name');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalClose = document.getElementById('modal-close');

const sizeOpt = document.getElementById('size-options');
const colorOpt = document.getElementById('color-options');

let currentProduct = null;
let selectedSize = '';
let selectedColor = '';

// ---------- FUNÇÃO: abrir modal ----------
function openModalPremium(product) {
  if (!product) return;

  currentProduct = product;
  selectedSize = '';
  selectedColor = '';

  // Define conteúdo
  modalName.textContent = product.name;
  modalPrice.textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
  modalDesc.textContent = product.description;

  // Imagens
  const imgs = Array.isArray(product.images)
    ? product.images
    : [product.image || product.img || 'assets/no-image.jpg'];

  modalImgs.innerHTML = imgs
    .map(i => `<img src="${i}" alt="${product.name}">`)
    .join('');

  // Tamanhos
  const sizes = product.sizes?.length ? product.sizes : ['Único'];
  sizeOpt.innerHTML = sizes
    .map(s => `<button>${s}</button>`)
    .join('');
  sizeOpt.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      selectedSize = btn.textContent;
      sizeOpt.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
  });

  // Cores
  const colors = product.colors?.length ? product.colors : ['Única'];
  colorOpt.innerHTML = colors
    .map(c => `<button>${c}</button>`)
    .join('');
  colorOpt.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      selectedColor = btn.textContent;
      colorOpt.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
  });

  // Parcelamento dinâmico
  const parcelDiv = document.createElement('div');
  parcelDiv.className = 'parcelamento-box';
  const parcelas = 6;
  const valorParcela = (product.price / parcelas).toFixed(2).replace('.', ',');
  parcelDiv.innerHTML = `
    <p><strong>Ou em até ${parcelas}x</strong> de <strong>R$ ${valorParcela}</strong> sem juros 💳</p>
  `;
  modalDesc.insertAdjacentElement('afterend', parcelDiv);

  // Botão WhatsApp Premium
  const addBtn = document.getElementById('modal-add');
  addBtn.className = 'btn-whatsapp';
  addBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Comprar via WhatsApp`;

  addBtn.onclick = () => {
    if (!selectedSize && sizes.length > 1) {
      showAlertPremium('Selecione o tamanho antes de continuar 💜');
      return;
    }
    if (!selectedColor && colors.length > 1) {
      showAlertPremium('Selecione a cor antes de continuar 💜');
      return;
    }

    const msg = `
🛍️ *Novo Pedido LS STORE*
------------------------------
👗 *Produto:* ${product.name}
💰 *Preço:* R$ ${product.price.toFixed(2).replace('.', ',')}
📏 *Tamanho:* ${selectedSize || sizes[0]}
🎨 *Cor:* ${selectedColor || colors[0]}
------------------------------
💖 *Envie esta mensagem para confirmar seu pedido!*`;

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
    playChime();
    window.open(url, '_blank');
    modal.setAttribute('aria-hidden', 'true');
  };

  // Exibe modal
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('show');
}

// ---------- FECHAR MODAL ----------
modalClose.onclick = () => {
  modal.classList.remove('show');
  setTimeout(() => modal.setAttribute('aria-hidden', 'true'), 300);
};
modal.addEventListener('click', e => {
  if (e.target === modal) modalClose.click();
});

// ---------- ALERTA PREMIUM ----------
function showAlertPremium(msg) {
  const overlay = document.createElement('div');
  overlay.className = 'alert-overlay';
  overlay.innerHTML = `
    <div class="alert-box">
      <h3>⚠️ Atenção</h3>
      <p>${msg}</p>
      <button>OK</button>
    </div>`;
  overlay.querySelector('button').onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}
/* ================================
   LS STORE v14.0 — Parte 2/7
   Catálogo, Cards e Integração Modal
   ================================ */

// ---------- VARIÁVEIS PRINCIPAIS ----------
const productGrid = document.getElementById('product-grid');
const footerVitrine = document.querySelector('.footer-vitrine .h-scroller');

let PRODUCTS = [];

// ---------- FUNÇÃO: carregar catálogo ----------
async function loadProducts() {
  try {
    const res = await fetch('assets/products.json');
    const data = await res.json();
    PRODUCTS = data;
  } catch (err) {
    console.warn('Catálogo não encontrado. Usando fallback local.');
    PRODUCTS = [
      {
        name: 'Vestido Floral Verão',
        price: 129.90,
        description: 'Vestido leve e elegante com estampa floral exclusiva LS Store.',
        image: 'assets/vestido1.jpg',
        images: ['assets/vestido1.jpg', 'assets/vestido1b.jpg'],
        sizes: ['P', 'M', 'G'],
        colors: ['Rosa', 'Branco'],
        status: 'disponível'
      },
      {
        name: 'Cropped Lilás Premium',
        price: 89.90,
        description: 'Cropped moderno com tecido confortável e toque suave.',
        image: 'assets/cropped1.jpg',
        images: ['assets/cropped1.jpg', 'assets/cropped1b.jpg'],
        sizes: ['P', 'M'],
        colors: ['Lilás', 'Preto'],
        status: 'esgotado'
      }
    ];
  }

  renderProducts();
  renderFooterVitrine();
}

// ---------- FUNÇÃO: renderizar produtos ----------
function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = '';

  PRODUCTS.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'card fade-enter';
    if (product.status === 'esgotado') card.classList.add('soldout');

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="info">
        <div class="name">${product.name}</div>
        <div class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      if (product.status === 'esgotado') {
        showAlertPremium('Este produto está ESGOTADO no momento 💔');
        return;
      }
      openModalPremium(product);
      clickSoft();
    });

    productGrid.appendChild(card);
    setTimeout(() => card.classList.add('fade-enter-active'), 50 * index);
  });
}

// ---------- FUNÇÃO: renderizar vitrine no rodapé ----------
function renderFooterVitrine() {
  if (!footerVitrine) return;
  footerVitrine.innerHTML = '';

  PRODUCTS.slice(0, 8).forEach((p) => {
    const card = document.createElement('div');
    card.className = 'footer-card';
    if (p.status === 'esgotado') card.classList.add('soldout');
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="fc-info">
        <div class="fc-name">${p.name}</div>
        <div class="fc-price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
      </div>
    `;
    card.onclick = () => {
      if (p.status === 'esgotado') {
        showAlertPremium('Produto ESGOTADO 😢');
        return;
      }
      openModalPremium(p);
    };
    footerVitrine.appendChild(card);
  });
}

// ---------- CARREGAMENTO AUTOMÁTICO ----------
document.addEventListener('DOMContentLoaded', loadProducts);
/* ================================
   LS STORE v14.0 — Parte 3/7
   Busca inteligente + Scroll suave
   ================================ */

// ---------- ELEMENTOS ----------
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const searchResults = document.querySelector('.search-results');
const backToTop = document.getElementById('backToTop');

// ---------- FUNÇÃO: buscar produtos ----------
function searchProducts(term) {
  if (!term.trim()) {
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
    return;
  }

  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(term.toLowerCase())
  );

  if (!results.length) {
    searchResults.innerHTML = `<p style="padding:10px;text-align:center;color:#888;">Nenhum produto encontrado 😢</p>`;
    searchResults.style.display = 'block';
    return;
  }

  searchResults.innerHTML = results
    .map(p => `
      <div class="search-item" onclick="selectSearchResult('${p.name}')">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <div><strong>${p.name}</strong></div>
          <small>R$ ${p.price.toFixed(2).replace('.', ',')}</small>
        </div>
      </div>
    `)
    .join('');
  searchResults.style.display = 'block';
}

// ---------- FUNÇÃO: selecionar resultado ----------
function selectSearchResult(name) {
  const product = PRODUCTS.find(p => p.name === name);
  if (!product) return;
  searchResults.innerHTML = '';
  searchResults.style.display = 'none';

  if (product.status === 'esgotado') {
    showAlertPremium('Este produto está ESGOTADO no momento 💔');
    return;
  }

  openModalPremium(product);
  clickSoft();
}

// ---------- EVENTOS ----------
if (searchInput) {
  searchInput.addEventListener('input', e => {
    searchProducts(e.target.value);
  });
}

if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
    clickSoft();
  });
}

// ---------- SCROLL SUAVE ----------
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    clickSoft();
  });
}

// ---------- INTERAÇÃO EXTRA ----------
document.addEventListener('click', e => {
  if (!searchResults.contains(e.target) && e.target !== searchInput) {
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
  }
});
/* ================================
   LS STORE v14.0 — Parte 4/7
   Carrinho Premium + WhatsApp integração
   ================================ */

// ---------- VARIÁVEIS ----------
const cart = document.getElementById('cart');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const finalTotal = document.getElementById('final-total');
const deliveryFee = document.getElementById('delivery-fee');
const feeValue = document.getElementById('fee-value');
const checkoutBtn = document.getElementById('checkout');

let CART = [];

// ---------- FUNÇÃO: abrir/fechar carrinho ----------
cartBtn.onclick = () => {
  const hidden = cart.getAttribute('aria-hidden') === 'true';
  cart.setAttribute('aria-hidden', hidden ? 'false' : 'true');
  clickSoft();
};
closeCart.onclick = () => {
  cart.setAttribute('aria-hidden', 'true');
  clickSoft();
};

// ---------- FUNÇÃO: adicionar produto ----------
function addToCart(product, size, color) {
  const item = { ...product, size, color, qty: 1 };
  CART.push(item);
  updateCart();
  playChime();
  showPopup('Produto adicionado ao carrinho! 🛍️');
}

// ---------- FUNÇÃO: remover produto ----------
function removeFromCart(index) {
  CART.splice(index, 1);
  updateCart();
  clickSoft();
}

// ---------- FUNÇÃO: atualizar carrinho ----------
function updateCart() {
  if (!cartItems) return;
  cartItems.innerHTML = '';
  let total = 0;

  CART.forEach((item, i) => {
    total += item.price * item.qty;

    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <div><strong>${item.name}</strong><br><small>${item.size || ''} ${item.color || ''}</small></div>
      <div><small>R$ ${(item.price).toFixed(2).replace('.', ',')}</small></div>
      <div><small>x${item.qty}</small></div>
      <button class="remove-btn">✕</button>
    `;
    row.querySelector('.remove-btn').onclick = () => removeFromCart(i);
    cartItems.appendChild(row);
  });

  cartTotal.textContent = total.toFixed(2).replace('.', ',');
  finalTotal.textContent = total.toFixed(2).replace('.', ',');

  document.getElementById('cart-count').textContent = CART.length;
}

// ---------- POPUP DE SUCESSO ----------
function showPopup(msg) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `<p>${msg}</p>`;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add('show'), 50);
  setTimeout(() => popup.remove(), 2200);
}

// ---------- CALCULAR ENTREGA ----------
const neighborhoodSelect = document.getElementById('neighborhood');
const deliveryType = document.getElementById('delivery-type');
const fees = {
  "Mathias Velho": 5, "Harmonia": 6, "Mato Grande": 7, "São Luís": 8,
  "Centro": 8, "Fátima": 9, "Igara": 10, "Rio Branco": 10, "Industrial": 11,
  "Guajuviras": 11, "Marechal Rondon": 12, "Estância Velha": 13, "Olaria": 13, "Outra Cidade": 15
};

function updateFee() {
  const tipo = deliveryType.value;
  if (tipo === 'retirada') {
    deliveryFee.style.display = 'none';
    feeValue.textContent = '0,00';
  } else {
    const bairro = neighborhoodSelect.value;
    const fee = fees[bairro] || 0;
    deliveryFee.style.display = fee > 0 ? 'block' : 'none';
    feeValue.textContent = fee.toFixed(2).replace('.', ',');
    const total = parseFloat(cartTotal.textContent.replace(',', '.')) + fee;
    finalTotal.textContent = total.toFixed(2).replace('.', ',');
  }
}
neighborhoodSelect.addEventListener('change', updateFee);
deliveryType.addEventListener('change', updateFee);

// ---------- FUNÇÃO: finalizar compra ----------
checkoutBtn.onclick = () => {
  if (CART.length === 0) {
    showAlertPremium('Seu carrinho está vazio 💔');
    return;
  }

  const name = document.getElementById('client-name').value.trim();
  const payment = document.getElementById('payment').value;
  const entrega = deliveryType.value;
  const bairro = neighborhoodSelect.value;
  const notes = document.getElementById('order-notes').value.trim();
  const total = finalTotal.textContent;

  if (!name) {
    showAlertPremium('Informe seu nome completo 💖');
    return;
  }

  let message = `🛍️ *Novo Pedido LS STORE*%0A%0A`;
  message += `👩 Cliente: *${name}*%0A`;
  message += `💳 Pagamento: *${payment}*%0A`;
  message += `🚚 Entrega: *${entrega === 'entrega' ? 'Com entrega' : 'Retirada'}*%0A`;
  if (entrega === 'entrega') message += `🏘️ Bairro: *${bairro}*%0A`;
  message += `%0A*Itens:*%0A`;

  CART.forEach((item, i) => {
    message += `${i + 1}. ${item.name} — R$ ${item.price.toFixed(2).replace('.', ',')}%0A`;
    if (item.size) message += `   Tamanho: ${item.size}%0A`;
    if (item.color) message += `   Cor: ${item.color}%0A`;
  });

  message += `%0A💰 *Total Final:* R$ ${total}%0A`;
  if (notes) message += `%0A📋 Observações: ${notes}%0A`;
  message += `%0A💬 Envie esta mensagem para confirmar seu pedido!`;

  const url = `https://wa.me/${WHATSAPP}?text=${message}`;
  playChime();
  window.open(url, '_blank');
  showPopup('Abrindo WhatsApp Premium 💬');
  CART = [];
  updateCart();
  cart.setAttribute('aria-hidden', 'true');
};
/* ================================
   LS STORE v14.0 — Parte 5/7
   Conta do Cliente + Favoritos + Histórico
   ================================ */

// ---------- VARIÁVEIS ----------
const accountArea = document.getElementById('account-area');
const loginBtn = document.getElementById('login-btn');
const favBtn = document.getElementById('fav-btn');
const favCount = document.getElementById('fav-count');

let FAVORITES = JSON.parse(localStorage.getItem('favorites') || '[]');
let RECENT = JSON.parse(localStorage.getItem('recent') || '[]');

// ---------- FUNÇÃO: abrir conta ----------
if (loginBtn) {
  loginBtn.onclick = () => {
    clickSoft();
    accountArea.innerHTML = `
      <div class="auth-card">
        <div class="auth-title">
          <h3>Minha Conta</h3>
          <button class="close-auth">✕</button>
        </div>
        <label>Seu nome
          <input type="text" id="user-name" placeholder="Ex: Maria Eduarda">
        </label>
        <label>Email
          <input type="email" id="user-email" placeholder="seuemail@email.com">
        </label>
        <label>Telefone
          <input type="tel" id="user-phone" placeholder="(51) 99999-9999">
        </label>
        <button class="add-btn" id="save-account">Salvar</button>
      </div>
    `;

    accountArea.querySelector('.close-auth').onclick = () => {
      accountArea.innerHTML = '';
    };

    accountArea.querySelector('#save-account').onclick = () => {
      const name = document.getElementById('user-name').value.trim();
      const email = document.getElementById('user-email').value.trim();
      const phone = document.getElementById('user-phone').value.trim();

      if (!name || !email) {
        showAlertPremium('Preencha todos os campos obrigatórios 💖');
        return;
      }

      localStorage.setItem('userData', JSON.stringify({ name, email, phone }));
      showPopup('Conta salva com sucesso! 💎');
      accountArea.innerHTML = '';
    };
  };
}

// ---------- FUNÇÃO: adicionar/remover favoritos ----------
function toggleFavorite(product) {
  const exists = FAVORITES.find(p => p.name === product.name);
  if (exists) {
    FAVORITES = FAVORITES.filter(p => p.name !== product.name);
    showPopup('Removido dos favoritos 💔');
  } else {
    FAVORITES.push(product);
    showPopup('Adicionado aos favoritos 💖');
  }
  localStorage.setItem('favorites', JSON.stringify(FAVORITES));
  updateFavCount();
}

// ---------- FUNÇÃO: atualizar contador ----------
function updateFavCount() {
  if (favCount) favCount.textContent = FAVORITES.length;
}
updateFavCount();

// ---------- FUNÇÃO: exibir favoritos ----------
if (favBtn) {
  favBtn.onclick = () => {
    clickSoft();
    showSection('favoritos');
    const favSection = document.getElementById('favoritos-list');
    if (!favSection) return;

    if (!FAVORITES.length) {
      favSection.innerHTML = '<p style="text-align:center;color:#999;">Nenhum favorito ainda 💔</p>';
      return;
    }

    favSection.innerHTML = FAVORITES.map(p => `
      <div class="fav-card">
        <img src="${p.image}" alt="${p.name}">
        <div class="info">
          <div class="name">${p.name}</div>
          <div class="price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
          <button class="add-btn" onclick='openModalPremium(${JSON.stringify(p)})'>Ver Produto</button>
        </div>
      </div>
    `).join('');
  };
}

// ---------- FUNÇÃO: histórico de visualização ----------
function addRecent(product) {
  RECENT = RECENT.filter(p => p.name !== product.name);
  RECENT.unshift(product);
  if (RECENT.length > 5) RECENT.pop();
  localStorage.setItem('recent', JSON.stringify(RECENT));
}

// ---------- MOSTRAR HISTÓRICO NA HOME ----------
function renderRecent() {
  const container = document.getElementById('recent-products');
  if (!container || RECENT.length === 0) return;

  container.innerHTML = RECENT.map(p => `
    <div class="card" onclick='openModalPremium(${JSON.stringify(p)})'>
      <img src="${p.image}" alt="${p.name}">
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
      </div>
    </div>
  `).join('');
}

// Renderiza o histórico ao carregar
document.addEventListener('DOMContentLoaded', renderRecent);
/* ================================
   LS STORE v14.0 — Parte 6/7
   Efeitos, sons e alertas Premium
   ================================ */

// ---------- ÁUDIO PREMIUM ----------
let audioCtx;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Som de clique suave
function clickSoft() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(500, t);
  o.frequency.exponentialRampToValueAtTime(800, t + 0.12);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.3);
}

// Som de confirmação (compra)
function playChime() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(660, t);
  o.frequency.exponentialRampToValueAtTime(990, t + 0.3);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.7);
}

// ---------- ALERTA PREMIUM ----------
function showAlertPremium(msg) {
  const overlay = document.createElement('div');
  overlay.className = 'alert-overlay';
  overlay.innerHTML = `
    <div class="alert-card">
      <div class="alert-header">⚠️ Atenção</div>
      <p>${msg}</p>
      <button class="alert-btn">Ok</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const btn = overlay.querySelector('.alert-btn');
  btn.onclick = () => {
    overlay.classList.add('hide');
    setTimeout(() => overlay.remove(), 300);
    clickSoft();
  };
}

// ---------- POPUP PREMIUM ----------
function showPopup(msg) {
  const popup = document.createElement('div');
  popup.className = 'popup-premium';
  popup.innerHTML = `<p>${msg}</p>`;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add('show'), 50);
  setTimeout(() => popup.remove(), 2600);
}

// ---------- ANIMAÇÃO DE ENTRADA ----------
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');
  setTimeout(() => document.body.classList.add('ready'), 500);
});

// ---------- OBSERVADOR DE ELEMENTOS (aparece ao rolar) ----------
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-on-scroll').forEach(el => observer.observe(el));
/* ================================
   LS STORE v14.0 — Parte 7/7
   Modal Premium Final: Parcelas + Ver Mais Fotos + Confirmação WhatsApp
   ================================ */

(function () {
  // Configurações de parcelamento (sem juros)
  const MAX_INSTALLMENTS = 8; // até 8x sem juros
  const MIN_PER_INSTALLMENT = 20; // parcela mínima (R$)

  const modal = document.getElementById('product-modal');
  const modalImgs = document.getElementById('modal-imgs');
  const modalName = document.getElementById('modal-name');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const sizeOpt = document.getElementById('size-options');
  const colorOpt = document.getElementById('color-options');
  const addBtn = document.getElementById('modal-add');
  const modalClose = document.getElementById('modal-close');

  let currentProduct = null;
  let selectedSize = '';
  let selectedColor = '';

  // Utilitários
  const fmt = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`;

  function calcInstallments(price) {
    // Gera opções até MAX_INSTALLMENTS respeitando parcela mínima
    const opts = [];
    for (let i = 2; i <= MAX_INSTALLMENTS; i++) {
      const val = price / i;
      if (val >= MIN_PER_INSTALLMENT) {
        opts.push({ n: i, value: val });
      }
    }
    return opts;
  }

  function buildParcelamentoUI(price) {
    const box = document.createElement('div');
    box.className = 'parcelamento-box';
    const opts = calcInstallments(price);

    if (!opts.length) {
      box.innerHTML = `<p><strong>Em 1x no cartão</strong> de <strong>${fmt(price)}</strong> ou Pix/Dinheiro.</p>`;
      return box;
    }

    const best = opts.at(-1);
    const list = opts
      .map(({ n, value }) => `<li>${n}x de <strong>${fmt(value)}</strong> sem juros</li>`)
      .join('');

    box.innerHTML = `
      <p><strong>Parcelamento sem juros</strong> 💳</p>
      <ul style="margin:8px 0 0 18px; padding:0; color:#4d3a66; font-weight:600; line-height:1.6">
        ${list}
      </ul>
      <p style="margin-top:8px">Melhor opção: <strong>${best.n}x</strong> de <strong>${fmt(best.value)}</strong></p>
    `;
    return box;
  }

  function makeVerMaisFotosBtn(images) {
    if (!images || images.length <= 1) return null;
    const btn = document.createElement('button');
    btn.className = 'text-btn';
    btn.style.cssText = 'margin-top:10px;font-weight:800;color:#7A3BFD';
    btn.textContent = 'Ver mais fotos';
    btn.onclick = () => openLightbox(images);
    return btn;
  }

  // Lightbox fullscreen com swipe, setas e ESC
  function openLightbox(images, startIndex = 0) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,.9);
      display:flex;align-items:center;justify-content:center;z-index:99999;
    `;

    const img = document.createElement('img');
    img.style.cssText = 'max-width:92vw;max-height:86vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.6);transition:opacity .25s ease';
    let idx = startIndex;

    const btnStyle = `
      position:fixed;top:50%;transform:translateY(-50%);
      width:46px;height:46px;border-radius:50%;border:0;background:rgba(255,255,255,.15);
      color:#fff;font-size:22px;display:flex;align-items:center;justify-content:center;cursor:pointer
    `;
    const prev = document.createElement('button');
    prev.style.cssText = btnStyle + ';left:18px';
    prev.textContent = '⟨';
    const next = document.createElement('button');
    next.style.cssText = btnStyle + ';right:18px';
    next.textContent = '⟩';

    const close = document.createElement('button');
    close.style.cssText = `
      position:fixed;top:18px;right:18px;width:42px;height:42px;border-radius:50%;
      border:0;background:rgba(255,255,255,.15);color:#fff;font-size:20px;cursor:pointer
    `;
    close.textContent = '✕';

    function show(i) {
      idx = (i + images.length) % images.length;
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = images[idx];
        img.onload = () => (img.style.opacity = '1');
      }, 120);
    }

    function onKey(e) {
      if (e.key === 'Escape') kill();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    }

    // Swipe
    let startX = 0, dx = 0, down = false;
    const start = (x) => { down = true; startX = x; dx = 0; };
    const move = (x) => { if (!down) return; dx = x - startX; };
    const end = () => { if (!down) return; down = false; if (dx > 40) show(idx - 1); else if (dx < -40) show(idx + 1); };

    overlay.addEventListener('click', (e) => { if (e.target === overlay) kill(); });
    prev.onclick = (e) => { e.stopPropagation(); show(idx - 1); };
    next.onclick = (e) => { e.stopPropagation(); show(idx + 1); };
    close.onclick = (e) => { e.stopPropagation(); kill(); };

    overlay.addEventListener('touchstart', (e) => start(e.touches[0].clientX), { passive: true });
    overlay.addEventListener('touchmove', (e) => move(e.touches[0].clientX), { passive: true });
    overlay.addEventListener('touchend', end);
    overlay.addEventListener('mousedown', (e) => start(e.clientX));
    overlay.addEventListener('mousemove', (e) => move(e.clientX));
    overlay.addEventListener('mouseup', end);

    function kill() {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
    }

    document.addEventListener('keydown', onKey);
    overlay.append(img, prev, next, close);
    document.body.appendChild(overlay);
    show(idx);
  }

  // Confirmação WhatsApp Premium
  function confirmWhatsApp(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay show';
    overlay.innerHTML = `
      <div class="popup-box">
        <h3>Enviar no WhatsApp</h3>
        <p>Vamos abrir seu WhatsApp com o pedido pré-preenchido. Tudo certo?</p>
        <div class="loading" style="margin-top:10px"></div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:14px">
          <button class="add-btn" style="padding:10px 14px;border-radius:12px;border:0">Sim, abrir</button>
          <button class="text-btn" style="padding:10px 14px;border-radius:12px;border:0">Cancelar</button>
        </div>
      </div>
    `;
    const [ok, cancel] = overlay.querySelectorAll('button');
    ok.onclick = () => {
      overlay.classList.remove('show');
      overlay.remove();
      onConfirm();
    };
    cancel.onclick = () => {
      overlay.classList.remove('show');
      overlay.remove();
    };
    document.body.appendChild(overlay);
  }

  // ===== Reimplementa (upgrade) o openModalPremium com tudo integrado =====
  window.openModalPremium = function (product) {
    if (!product) return;

    currentProduct = product;
    selectedSize = '';
    selectedColor = '';

    const images = Array.isArray(product.images) && product.images.length
      ? product.images
      : product.imgs?.length ? product.imgs
      : product.image ? [product.image]
      : [product.img || 'assets/no-image.jpg'];

    // Conteúdo básico
    modalName.textContent = product.name;
    modalPrice.textContent = fmt(product.price);
    modalDesc.textContent = product.description || '';

    // Imagens no modal (mostra a primeira ativa)
    modalImgs.innerHTML = images.map((src, i) => `<img src="${src}" alt="${product.name}" class="${i===0?'active':''}">`).join('');

    // Botões de navegação do carrossel (no modal)
    if (!modalImgs.querySelector('.img-prev')) {
      const prev = document.createElement('button');
      prev.className = 'img-prev';
      prev.textContent = '⟨';
      const next = document.createElement('button');
      next.className = 'img-next';
      next.textContent = '⟩';
      const dots = document.createElement('div');
      dots.className = 'img-dots';

      images.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'img-dot' + (i === 0 ? ' active' : '');
        d.onclick = () => showImg(i);
        dots.appendChild(d);
      });

      modalImgs.append(prev, next, dots);

      let index = 0;
      function showImg(i) {
        const imgs = [...modalImgs.querySelectorAll('img')];
        const ds = [...modalImgs.querySelectorAll('.img-dot')];
        index = (i + imgs.length) % imgs.length;
        imgs.forEach((im, n) => im.classList.toggle('active', n === index));
        ds.forEach((d, n) => d.classList.toggle('active', n === index));
      }
      prev.onclick = () => showImg(index - 1);
      next.onclick = () => showImg(index + 1);
    }

    // Tamanhos
    const sizes = product.sizes?.length ? product.sizes : ['Único'];
    sizeOpt.innerHTML = sizes.map(s => `<button>${s}</button>`).join('');
    sizeOpt.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        selectedSize = btn.textContent;
        sizeOpt.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
    });

    // Cores
    const colors = product.colors?.length ? product.colors : ['Única'];
    colorOpt.innerHTML = colors.map(c => `<button>${c}</button>`).join('');
    colorOpt.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        selectedColor = btn.textContent;
        colorOpt.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      };
    });

    // Parcelamento avançado (lista dinâmica)
    const oldBox = modalDesc.nextElementSibling;
    if (oldBox?.classList.contains('parcelamento-box')) oldBox.remove();
    modalDesc.insertAdjacentElement('afterend', buildParcelamentoUI(product.price));

    // Botão "Ver mais fotos"
    // Remove anterior, se houver
    const oldVMF = modalDesc.parentElement.querySelector('.btn-ver-mais-fotos');
    if (oldVMF) oldVMF.remove();
    const vmf = makeVerMaisFotosBtn(images);
    if (vmf) {
      vmf.classList.add('btn-ver-mais-fotos');
      modalDesc.parentElement.appendChild(vmf);
    }

    // Botão principal = WhatsApp Premium (com confirmação)
    addBtn.className = 'btn-whatsapp';
    addBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Comprar via WhatsApp`;
    addBtn.onclick = () => {
      const needSize = sizes.length > 1 && !selectedSize;
      const needColor = colors.length > 1 && !selectedColor;
      if (needSize || needColor) {
        showAlertPremium('Selecione o tamanho e a cor antes de continuar 💜');
        return;
      }
      const size = selectedSize || sizes[0];
      const color = selectedColor || colors[0];

      const msg =
        `🛍️ *Novo Pedido LS STORE*\n` +
        `------------------------------\n` +
        `👗 *Produto:* ${product.name}\n` +
        `💰 *Preço:* ${fmt(product.price)}\n` +
        `📏 *Tamanho:* ${size}\n` +
        `🎨 *Cor:* ${color}\n` +
        `------------------------------\n` +
        `💖 Envie esta mensagem para confirmar seu pedido!`;

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      confirmWhatsApp(msg, () => {
        playChime();
        window.open(url, '_blank', 'noopener');
        modal.setAttribute('aria-hidden', 'true');
      });
    };

    // Abre modal
    modal.setAttribute('aria-hidden', 'false');
  };

  // Fechar modal (garantia)
  if (modalClose) {
    modalClose.onclick = () => modal.setAttribute('aria-hidden', 'true');
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.setAttribute('aria-hidden', 'true'); });
  }
})();
