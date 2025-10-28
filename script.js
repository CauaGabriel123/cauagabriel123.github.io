// =========================
// LS STORE v11.4.0 — Upgrades garantidos (sem alterar layout funcional)
// - Drawer: mantém "Femininos" (dropdown) com subcategorias
// - Carrossel Início: arrastável com o dedo + itens reais do catálogo (clica e abre modal)
// - WhatsApp: abertura garantida com window.location.href
// - NOVO: campo Número só aceita números (bloqueio de letras)
// - NOVO: link "Sobre Nós" no menu abre a seção correspondente
// =========================

// =========================
// SPLASH SCREEN — VERSÃO OTIMIZADA v14.1.1
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  if (!splash) return;

  // Some suavemente depois de 1.5 s
  setTimeout(() => {
    splash.style.transition = 'opacity 0.6s ease';
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 600);
  }, 1500);
});

// Failsafe leve — se algo travar, força o sumiço após 4 s
setTimeout(() => {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.style.transition = 'opacity 0.4s ease';
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 400);
  }
}, 4000);

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
  const normalizeSizes = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return ['Único'];
    return arr.map(s => {
      const t = String(s).trim();
      if (t.toLowerCase() === 'único' || t.toLowerCase() === 'unico') return 'Único';
      return t.toUpperCase();
    });
  };
  const normalizeColors = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return ['Única'];
    return arr.map(c => {
      const txt = String(c).trim();
      return txt.charAt(0).toUpperCase() + txt.slice(1);
    });
  };

  catalog = {};
  data.forEach(p => {
  // 🧩 NOVO FILTRO — remove produtos com status "indisponível"
  const st = (p.status || '').toLowerCase().trim();
  if (st === 'indisponivel' || st === 'indisponível') {
    console.log(`🚫 Produto ocultado do catálogo: ${p.name} (${p.id})`);
    return; // simplesmente ignora o produto
  }

  let cat = (p.category || 'outros').toLowerCase().trim();
// =============================
// CORREÇÃO PREMIUM v14.1 — Normalização de categorias 100% compatível com o menu LS STORE
// =============================
if (cat === 'intimas' || cat === 'íntimas') cat = 'intimos';
if (cat === 'cosmeticos' || cat === 'cosméticos' || cat === 'beleza') cat = 'belezas';
if (cat === 'oculos' || cat === 'óculos') cat = 'oculos';
if (cat === 'cropped' || cat === 'croppedes') cat = 'croppeds';
if (cat === 'biquini') cat = 'biquinis';
if (cat === 'pijama') cat = 'pijamas';
if (cat === 'short') cat = 'shorts';
if (cat === 'cueca') cat = 'cuecas';
if (cat === 'legging') cat = 'leggings';
if (cat === 'blusa') cat = 'blusas';
if (cat === 'meia') cat = 'meias';
if (cat === 'vestido') cat = 'vestidos';
    if (!catalog[cat]) catalog[cat] = [];

    const sizes = normalizeSizes(p.sizes);
    const colors = normalizeColors(p.colors);

    catalog[cat].push({
      id: p.id,
      name: p.name,
      price: p.price,
      imgs: Array.isArray(p.images)
  ? p.images.slice(0, 10)
  : Array.isArray(p.image)
    ? p.image.slice(0, 10)
    : [p.image],
      sizes,
      colors,
      stock: 5,
      desc: p.description,
      status: p.status
    });
  });
    // Define os produtos em destaque (para o carrossel)
  featured = data
  .slice(0, 5)
  .map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    imgs: Array.isArray(p.images)
  ? p.images.filter(Boolean).slice(0, 10)
  : p.image
    ? (Array.isArray(p.image) ? p.image.filter(Boolean).slice(0, 10) : [p.image])
    : (Array.isArray(p.imgs) ? p.imgs.filter(Boolean).slice(0, 10) : []),
    desc: p.description,
    status: p.status
  }));
  renderAll();
  initCarousel();
  renderFooterProducts(featured.length ? featured : null);
  // ✅ FORÇA SINCRONIZAÇÃO GLOBAL DE PRODUTOS (corrige modal, nomes e descrições)
window.PRODUCTS_V2 = data.map(p => ({
  id: p.id,
  name: p.name,
  price: p.price,
  description: p.description || 'Sem descrição disponível.',
  status: p.status || 'disponivel',
  sizes: Array.isArray(p.sizes) ? p.sizes : ['Único'],
  colors: Array.isArray(p.colors) ? p.colors : ['Única'],
  images: Array.isArray(p.images)
    ? p.images.filter(Boolean)
    : (p.image ? [p.image] : (p.imgs ? p.imgs : [])),
  category: (p.category || 'outros').toLowerCase().trim()
}));
    // =============================
  // v14.2 — Renderiza TODOS os produtos na tela inicial (Início)
  // =============================
  function renderHomeAll() {
    const home = document.getElementById('featured');
    if (!home) return;

    // junta todos os produtos de todas as categorias
    let all = [];
    for (const cat in catalog) {
      if (Array.isArray(catalog[cat])) all = all.concat(catalog[cat]);
    }

    // embaralha a ordem (shuffle)
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }

    // renderiza na tela inicial (home)
    renderGrid(home, all);

    // revalida visual "esgotado" para produtos indisponíveis
    home.querySelectorAll('.card').forEach(card => {
      const id = card.getAttribute('data-id');
      const p = all.find(x => x.id === id);
      if (p && p.status && p.status.toLowerCase() === 'esgotado') {
        card.classList.add('soldout');
      }
    });
  }

  renderHomeAll();
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
      try {
        buildCatalogAndRender(data);
        console.log('🟢 Renderização iniciada...');
      } catch (e) {
        console.error('Erro ao montar catálogo:', e);
        showAlert('Opa! Tivemos um erro ao montar o catálogo. Recarregue a página em alguns segundos.');
      }

      // ✅ Este setTimeout precisa estar DENTRO do .then(data => { ... })
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
    })
    .catch(err => {
      console.error('❌ Erro ao carregar o catálogo:', err);
      // Fallback: usa os produtos locais se der erro no fetch
      buildCatalogAndRender(FALLBACK_PRODUCTS);
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
  const sold = (p.status && p.status.toLowerCase() === 'esgotado') || p.stock <= 0;
  return `<div class="card${sold ? ' soldout' : ''}" data-id="${p.id}">
    ${badgeHTML(p)}
    <img src="${(Array.isArray(p.images) ? p.images[0]
  : Array.isArray(p.image) ? p.image[0]
  : (p.images && p.images.length ? p.images[0]
  : (p.imgs && p.imgs.length ? p.imgs[0]
  : p.img || p.image)))}" alt="${p.name}">
    <div class="info">
      <p class="name">${p.name}</p>
      <p class="price">${priceHTML(p)}</p>
    </div>
  </div>`;
}
// 🩶 Força reaplicação global do visual "esgotado"
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.card').forEach(card => {
      const isSold = card.textContent.toLowerCase().includes('esgotado');
      if (isSold) card.classList.add('soldout');
    });
  }, 1200);
});

function renderGrid(el, arr) {
  el.innerHTML = arr.map(p => {
    const sold = (p.status && p.status.toLowerCase() === 'esgotado') || p.stock <= 0;
    const soldClass = sold ? ' soldout' : '';
    return `
      <div class="card${soldClass}" data-id="${p.id}">
        ${badgeHTML(p)}
        <img src="${(p.images && p.images.length ? p.images[0] : (p.imgs && p.imgs.length ? p.imgs[0] : p.img || p.image))}" alt="${p.name}">
        <div class="info">
          <p class="name">${p.name}</p>
          <p class="price">${priceHTML(p)}</p>
        </div>
      </div>
    `;
  }).join('');

  // Só permite clique se o produto NÃO estiver esgotado
  el.querySelectorAll('.card:not(.soldout)').forEach(c => {
    c.onclick = () => LSModal.open(c.getAttribute('data-id'));
  });
}

function renderAll() {
  const f = document.getElementById('featured'); if (f) renderGrid(f, featured);
  // Força aplicação visual dos esgotados nos destaques
if (f) {
  f.querySelectorAll('.card').forEach(c => {
    const isSold = c.textContent.toLowerCase().includes('esgotado');
    if (isSold) c.classList.add('soldout');
  });
}
  document.querySelectorAll('[data-cat]').forEach(g => {
    const cat = g.getAttribute('data-cat');
    renderGrid(g, catalog[cat] || []);
  });
}

// 🩶 Correção — garante selo e efeito "esgotado" nos destaques da semana
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('#featured .card').forEach(card => {
      const id = card.getAttribute('data-id');
      const product = Object.values(catalog).flat().find(p => p.id === id);
      if (product && product.status && product.status.toLowerCase() === 'esgotado') {
        card.classList.add('soldout');
      }
    });
  }, 1000);
});

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
    card.addEventListener('click', () => LSModal.open(card.getAttribute('data-id')));
  });
}

// =============================
// MODAL DE PRODUTO (corrigido)
// =============================

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

// 🧾 Itens formatados com emojis corretos
const itensTxt = items.map((it, i) => `
━━━━━━━━━━━━━━━━━━
${i + 1}. 👗 *Produto:* ${it.name}
📏 *Tamanho:* ${it.size}
🎨 *Cor:* ${it.color}
💰 *Preço:* R$ ${it.price.toFixed(2).replace('.', ',')}
`).join('');

// 🧾 Endereço e totais formatados
const enderecoTxt = entrega === 'entrega'
  ? `${rua}, ${numero} - ${bairro}`
  : '🏪 Retirada na loja';

const taxaTxt = (typeof feeRaw === 'number')
  ? `R$ ${feeRaw.toFixed(2).replace('.', ',')}`
  : feeRaw;

// 💬 Mensagem com emojis e formatação fixa (100% compatível)
const message = `
🌸 *Obrigada por comprar na LS Store!* 🌸
━━━━━━━━━━━━━━━━━━
🛍️ *NOVO PEDIDO - LS STORE*
━━━━━━━━━━━━━━━━━━
👩‍💼 *Cliente:* ${client}
🚚 *Entrega:* ${entrega}
📍 *Endereço:* ${enderecoTxt}
📝 *Observações:* ${obs}
━━━━━━━━━━━━━━━━━━
📦 *Itens do pedido:*
${itensTxt}
━━━━━━━━━━━━━━━━━━
💳 *Pagamento:* ${payment}
🚚 *Taxa de entrega:* ${taxaTxt}
💰 *Total final:* R$ ${total.toFixed(2).replace('.', ',')}
${payment === 'Dinheiro'
  ? `${valorPago ? `\n💵 *Valor pago:* R$ ${valorPago}` : ''}\n🔁 *Troco:* ${troco}`
  : ''}
━━━━━━━━━━━━━━━━━━
🌷 *Obrigada por escolher a LS Store!* 💖`;
// ✅ CORREÇÃO DEFINITIVA DE EMOJIS NO WHATSAPP (com encode completo e compatibilidade total)
const encodedURL = encodeURI(`https://wa.me/${WHATSAPP}?text=${message}`);

// Pop-up de confirmação e envio com segurança
const pop = document.getElementById('popup-overlay');
pop.hidden = false;
pop.classList.add('show');

setTimeout(() => {
  window.location.href = encodedURL;
}, 1000);

setTimeout(() => {
  pop.classList.remove('show');
  pop.hidden = true;
}, 3500);

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

// CARROSSEL (produtos + swipe)
window.initCarousel = function(){
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
      if (Math.abs(delta) < 10) LSModal.open(id); // evita abrir se foi swipe
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
};
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
    const product = (window.PRODUCTS_V2 || []).find(p => String(p.id) === String(id));

    // 🔒 Bloqueia produtos esgotados mesmo quando vêm da busca
    if (product && product.status && product.status.toLowerCase() === 'esgotado') {
      showAlert('Este produto está esgotado e não pode ser adicionado ao carrinho.');
      return;
    }

    LSModal.open(id);
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
// =============================
// v13.1.4 — Carrossel Universal (modo inteligente, corrigido)
// =============================
document.addEventListener('DOMContentLoaded', () => {
  function initImageCarousel(container) {
    const imgs = [...container.querySelectorAll('img')];
    if (imgs.length <= 1) return; // modo inteligente

    imgs.forEach((img, i) => img.classList.toggle('active', i === 0));

    const prev = document.createElement('button');
    prev.className = 'img-prev';
    prev.innerHTML = '⟨';
    const next = document.createElement('button');
    next.className = 'img-next';
    next.innerHTML = '⟩';

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'img-dots';
    imgs.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'img-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => showImg(i));
      dotsWrap.appendChild(dot);
    });

    container.appendChild(prev);
    container.appendChild(next);
    container.appendChild(dotsWrap);

    let index = 0;
    function showImg(i) {
      index = (i + imgs.length) % imgs.length;
      imgs.forEach((img, n) => img.classList.toggle('active', n === index));
      dotsWrap.querySelectorAll('.img-dot').forEach((d, n) => d.classList.toggle('active', n === index));
    }
    prev.onclick = () => showImg(index - 1);
    next.onclick = () => showImg(index + 1);
  }

  // aplica nos cards (vitrine)
  document.querySelectorAll('.card').forEach(card => {
    const img = card.querySelector('img');
    const prodId = card.getAttribute('data-id');
    if (!img || !prodId) return;

    const prod = Object.values(window.catalog || {}).flat().find(p => p.id === prodId);
    if (!prod) return;

    // pega qualquer tipo de campo de imagem
    const imgsArr =
      Array.isArray(prod.images) ? prod.images :
      Array.isArray(prod.imgs) ? prod.imgs :
      Array.isArray(prod.image) ? prod.image :
      (prod.img ? [prod.img] :
      (prod.image ? [prod.image] : []));

    if (imgsArr.length <= 1) return; // modo inteligente

    const box = document.createElement('div');
    box.className = 'img-carousel';
    imgsArr.forEach(src => {
      const i = document.createElement('img');
      i.src = src;
      box.appendChild(i);
    });

    card.insertBefore(box, img);
    img.remove();
    initImageCarousel(box);
  });

  // aplica dentro do modal
  const modalImgs = document.getElementById('modal-imgs');
  const observer = new MutationObserver(() => {
    if (!modalImgs) return;
    const imgs = modalImgs.querySelectorAll('img');
    if (imgs.length <= 1) return;
    if (!modalImgs.querySelector('.img-prev')) initImageCarousel(modalImgs);
  });
  if (modalImgs) observer.observe(modalImgs, { childList: true });
});
// =============================
// v13.1.5 — Suporte a Swipe (toque e arraste) no carrossel universal
// =============================
document.addEventListener('DOMContentLoaded', () => {
  // Função para ativar o gesto de deslizar em qualquer container de imagens
  function enableSwipe(container) {
    let startX = 0;
    let deltaX = 0;
    let isDown = false;
    const imgs = container.querySelectorAll('img');
    if (imgs.length <= 1) return; // só ativa se tiver várias imagens

    // Pega os botões (caso existam)
    const prev = container.querySelector('.img-prev');
    const next = container.querySelector('.img-next');

    function startTouch(e) {
      isDown = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      deltaX = 0;
    }

    function moveTouch(e) {
      if (!isDown) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      deltaX = x - startX;
    }

    function endTouch() {
      if (!isDown) return;
      isDown = false;
      const limit = 40; // quantos pixels precisa mover pra trocar
      if (Math.abs(deltaX) > limit) {
        if (deltaX > 0 && prev) prev.click();   // arrastou pra direita → imagem anterior
        else if (deltaX < 0 && next) next.click(); // arrastou pra esquerda → próxima imagem
      }
      deltaX = 0;
    }

    // Eventos de toque (mobile) e mouse (desktop)
    container.addEventListener('touchstart', startTouch, { passive: true });
    container.addEventListener('touchmove', moveTouch, { passive: true });
    container.addEventListener('touchend', endTouch);
    container.addEventListener('mousedown', startTouch);
    container.addEventListener('mousemove', moveTouch);
    container.addEventListener('mouseup', endTouch);
    container.addEventListener('mouseleave', () => isDown = false);
  }

  // Aplica o swipe a todos os carrosseis ativos (vitrine e modal)
  const applySwipeToAll = () => {
    document.querySelectorAll('.img-carousel, .modal-imgs').forEach(enableSwipe);
  };

  // Aplica ao carregar
  setTimeout(applySwipeToAll, 1000);

  // Observa mudanças (ex: quando modal é aberto)
  const observer = new MutationObserver(applySwipeToAll);
  observer.observe(document.body, { childList: true, subtree: true });
});

// =============================
// v13.2.0 — Auto-play do carrossel (modo Instagram)
// =============================
document.addEventListener('DOMContentLoaded', () => {
  setInterval(() => {
    document.querySelectorAll('.img-carousel, .modal-imgs').forEach(c => {
      const imgs = c.querySelectorAll('img');
      const active = c.querySelector('img.active');
      if (imgs.length <= 1 || !active) return;
      let idx = [...imgs].indexOf(active);
      imgs[idx].classList.remove('active');
      idx = (idx + 1) % imgs.length;
      imgs[idx].classList.add('active');
    });
  }, 3000); // troca a cada 3 segundos
});
/* ===== LS STORE • Product Modal (Isolado) — v14 FIX PACK ===== */
(function () {
  const $  = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  const els = {
    root: $('#lsxModal'),
    title: $('#lsxModalTitle'),
    breadcrumb: $('#lsxBreadcrumb'),
    imgMain: $('#lsxImageMain'),
    thumbs: $('#lsxThumbs'),
    price: $('#lsxPrice'),
    installments: $('#lsxInstallments'),
    sizes: $('#lsxSizes'),
    colors: $('#lsxColors'),                 // ✅ NOVO
    stock: $('#lsxStock'),
    buyBtn: $('#lsxBuyBtn'),
    addBtn: $('#lsxAddBtn'),                 // ✅ NOVO
    zoomBtn: $('#lsxZoomBtn')                // ✅ habilitado
  };

  let PRODUCTS_CACHE = null;
  let current = {
    product: null,
    selectedSize: null,
    selectedColor: null,
    imgs: [],
    idx: 0
  };

  async function getProducts() {
    if (Array.isArray(window.PRODUCTS_V2) && window.PRODUCTS_V2.length) return window.PRODUCTS_V2;
    if (PRODUCTS_CACHE) return PRODUCTS_CACHE;
    const res = await fetch('products_v2.json', { cache: 'no-store' });
    PRODUCTS_CACHE = await res.json();
    return PRODUCTS_CACHE;
  }

  // util
  const currency = v => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const calcInstallments = v => {
    const n = 12;
    return `${n}x de ${currency(v / n)}`;
  };

  // ====== Galeria com thumbs + swipe + zoom ======
  function showImg(i) {
  current.idx = (i + current.imgs.length) % current.imgs.length;
  const newSrc = current.imgs[current.idx];
  if (els.imgMain.src === newSrc) return;
  els.imgMain.style.opacity = 0;
  setTimeout(() => {
    els.imgMain.src = newSrc;
    els.imgMain.style.opacity = 1;
  }, 150);
  $$('.is-active', els.thumbs).forEach(x => x.classList.remove('is-active'));
  const activeThumb = els.thumbs.querySelector(`img[data-i="${current.idx}"]`);
  if (activeThumb) activeThumb.classList.add('is-active');
}

  function mountGallery(p) {
    current.imgs =
      Array.isArray(p.images) ? p.images :
      Array.isArray(p.imgs)   ? p.imgs   :
      (p.image ? [p.image] : []);
    current.idx = 0;

    els.imgMain.src = current.imgs[0] || '';
    els.imgMain.style.transition = 'opacity 0.35s ease';
    els.thumbs.innerHTML = current.imgs.map((src, i) =>
      `<img src="${src}" class="${i===0?'is-active':''}" data-i="${i}">`
    ).join('');

    // troca por clique no thumb
    els.thumbs.onclick = e => {
      const t = e.target.closest('img'); if (!t) return;
      showImg(parseInt(t.dataset.i, 10));
    };

    // swipe na imagem principal
    const stage = els.imgMain.closest('.lsx-gallery__stage');
    let startX = 0, deltaX = 0, down = false;

    function start(e){ down = true; startX = (e.touches?e.touches[0].clientX:e.clientX); deltaX = 0; }
    function move(e){ if(!down) return; const x = (e.touches?e.touches[0].clientX:e.clientX); deltaX = x - startX; }
    function end(){ if(!down) return; down = false; if (Math.abs(deltaX) > 40) { deltaX > 0 ? showImg(current.idx-1) : showImg(current.idx+1); } }

    stage.addEventListener('touchstart', start, {passive:true});
    stage.addEventListener('touchmove',  move,  {passive:true});
    stage.addEventListener('touchend',   end);
    stage.addEventListener('mousedown',  start);
    stage.addEventListener('mousemove',  move);
    stage.addEventListener('mouseup',    end);
    stage.addEventListener('mouseleave', ()=> { down=false; });

    // zoom (abre overlay com a imagem atual)
    if (els.zoomBtn) {
      els.zoomBtn.onclick = () => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position:fixed; inset:0; background:rgba(0,0,0,.9);
          display:flex; align-items:center; justify-content:center; z-index:10000;
        `;
        const img = document.createElement('img');
        img.src = current.imgs[current.idx];
        img.style.cssText = 'max-width:95vw; max-height:95vh; border-radius:12px';
        overlay.appendChild(img);
        overlay.onclick = () => overlay.remove();
        document.body.appendChild(overlay);
      };
    }
  }

  // ====== Tamanhos e Cores ======
  function mountSizes(p) {
    const sizes = Array.isArray(p.sizes) && p.sizes.length ? p.sizes.map(s=>String(s).toUpperCase()) : ['ÚNICO'];
    els.sizes.innerHTML = sizes.map(s=>`<button class="lsx-size" data-size="${s}">${s}</button>`).join('');
    current.selectedSize = null;

    els.sizes.onclick = e => {
      const b = e.target.closest('.lsx-size'); if (!b) return;
      $$('.lsx-size', els.sizes).forEach(x=>x.classList.remove('is-selected'));
      b.classList.add('is-selected');
      current.selectedSize = b.dataset.size;
    };
  }

  function mountColors(p) {
    const colors = Array.isArray(p.colors) && p.colors.length ? p.colors : ['Única'];
    els.colors.innerHTML = colors.map(c=>`<button class="lsx-color" data-color="${c}">${c}</button>`).join('');
    current.selectedColor = null;

    els.colors.onclick = e => {
      const b = e.target.closest('.lsx-color'); if (!b) return;
      $$('.lsx-color', els.colors).forEach(x=>x.classList.remove('is-selected'));
      b.classList.add('is-selected');
      current.selectedColor = b.dataset.color;
    };
  }

  function needSelectSize(p) {
    const sizes = Array.isArray(p.sizes) && p.sizes.length ? p.sizes.map(s=>String(s).toUpperCase()) : ['ÚNICO'];
    // Se houver mais de 1 opção OU a opção não for literalmente "ÚNICO", exigir seleção explícita
    return (sizes.length > 1 || sizes[0] !== 'ÚNICO');
  }
  function needSelectColor(p) {
    const colors = Array.isArray(p.colors) && p.colors.length ? p.colors : ['Única'];
    return (colors.length > 1 || (colors[0] && colors[0].toLowerCase() !== 'única'));
  }

  function validateSelections(p) {
    if (needSelectSize(p) && !current.selectedSize) {
      showAlert('Por favor, selecione um tamanho antes de continuar.');
      return false;
    }
    if (needSelectColor(p) && !current.selectedColor) {
      showAlert('Por favor, selecione uma cor antes de continuar.');
      return false;
    }
    return true;
  }

  // ====== Preenchimento do modal ======
  function fill(p){
    current.product = p;
    els.title.textContent = p.name;
    els.price.textContent = currency(p.price);
    els.installments.textContent = calcInstallments(p.price);
    els.stock.textContent = ''; // (pode ser usado no futuro)
    els.imgMain.alt = p.name;
    document.getElementById('lsxDescription').textContent = p.description || 'Sem descrição disponível.';


    mountGallery(p);
    mountSizes(p);
    mountColors(p);

    // COMPRAR = adicionar + abrir checkout (sem fechar o carrinho até finalizar)
    els.buyBtn.onclick = () => {
      if (!validateSelections(p)) return;
      const size  = current.selectedSize || 'Único';
      const color = current.selectedColor || 'Única';
      if (typeof addToCart === 'function') {
        addToCart(p, size, color);
      }
      // abre o checkout
      if (typeof cart !== 'undefined') {
        cart.setAttribute('aria-hidden','false');
        setTimeout(() => {
          document.getElementById('client-name')?.focus();
          document.querySelector('.client-info')?.scrollIntoView({ behavior:'smooth' });
        }, 120);
      }
      LSModal.close();
    };

    // ADICIONAR AO CARRINHO = só adiciona (mantém modal aberto)
    if (els.addBtn) {
      els.addBtn.onclick = () => {
        if (!validateSelections(p)) return;
        const size  = current.selectedSize || 'Único';
        const color = current.selectedColor || 'Única';
        if (typeof addToCart === 'function') {
          addToCart(p, size, color);
          try { playChime && playChime(); } catch(_) {}
        }
        LSModal.close();
      };
    }
  }

  // ====== Abrir / Fechar ======
  function open(id){
    getProducts().then(list=>{
      const p = list.find(x=>String(x.id)===String(id));
      if (!p) return;
      fill(p);
      els.root.classList.add('is-open');
      document.body.classList.add('lsx-no-scroll');
    });
  }
  function close(){
    els.root.classList.remove('is-open');
    document.body.classList.remove('lsx-no-scroll');
  }

  els.root.addEventListener('click',e=>{ if(e.target.dataset.close==='true') close(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });

  window.LSModal = { open, close };
})();