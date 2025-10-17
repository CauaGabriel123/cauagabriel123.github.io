/* LS STORE - script.js */
const PRODUCTS_URL = 'products.json';
const WHATSAPP_NUMBER = '5551989235482'; // +55 51 98923-5482

let products = [];
let cart = JSON.parse(localStorage.getItem('ls_cart') || '[]');

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  await loadProducts();
  renderCartCount();
  setupHandlers();
  renderProducts(products);
});

async function loadProducts(){
  try {
    const res = await fetch(PRODUCTS_URL);
    products = await res.json();
  } catch(e){
    console.error('Falha ao carregar products.json', e);
    products = [];
  }
}

function setupHandlers(){
  const search = document.getElementById('search');
  const filter = document.getElementById('filter');
  if(search) search.addEventListener('input', handleSearchFilter);
  if(filter) filter.addEventListener('change', handleSearchFilter);

  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Mensagem enviada — responderemos por email/Instagram.');
      e.target.reset();
    });
  }
}

function handleSearchFilter(){
  const q = document.getElementById('search').value.trim().toLowerCase();
  const cat = document.getElementById('filter').value;
  const filtered = products.filter(p => {
    const matchesQ = p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
    const matchesCat = cat === 'all' ? true : p.category === cat;
    return matchesQ && matchesCat;
  });
  renderProducts(filtered);
}

function renderProducts(list){
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';
  if(!list.length){
    grid.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }
  list.forEach(p => {
    const isOut = (p.status || '').toLowerCase() === 'esgotado';
    const card = document.createElement('article');
    card.className = 'product-card' + (isOut ? ' out-of-stock' : '');
    const price = `R$ ${Number(p.price).toFixed(2).replace('.',',')}`;
    const waText = `Olá, quero comprar: ${p.name} (${price})`;
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

    card.innerHTML = `
      <img src="${p.image}" alt="${escapeHtml(p.name)}" onerror="this.src='assets/image-placeholder.png'">
      <div class="product-info">
        <h4>${escapeHtml(p.name)}</h4>
        <p class="muted">${escapeHtml(p.description || '')}</p>
        <div class="product-actions">
          <div class="price">${price}</div>
          ${isOut ? '' : `<button class="btn-add" data-id="${p.id}">Adicionar</button>`}
        </div>
        ${isOut ? `<span class="sold-out">ESGOTADO</span>` : `<a href="${waLink}" target="_blank" class="btn-primary" style="margin-top:6px; display:block; text-align:center;">Comprar pelo WhatsApp</a>`}
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.btn-add').forEach(btn=>{
    btn.addEventListener('click', () => addToCart(btn.dataset.id));
  });
}

function addToCart(id){
  const prod = products.find(p => p.id === id);
  if(!prod) return;
  const existing = cart.find(i => i.id === id);
  if(existing) existing.qty++;
  else cart.push({id:prod.id,name:prod.name,price:prod.price,image:prod.image,qty:1});
  saveCart();
  renderCartCount();
}

function saveCart(){
  localStorage.setItem('ls_cart', JSON.stringify(cart));
}

function renderCartCount(){
  const n = cart.reduce((s,i)=>s+i.qty,0);
  const node = document.getElementById('cart-count');
  if(node) node.textContent = n;
}

function escapeHtml(str){
  return String(str).replace(/[&<>"]/g, function(s){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]);
  });
}
