// main.js - loads posts from localStorage and renders UI (search/category/pagination/slider/trending)
const PER_PAGE = 6;
let posts = JSON.parse(localStorage.getItem('posts')||'[]');
let filtered = posts.slice();
let currentPage = 1;

const postsEl = document.getElementById('posts');
const trendingEl = document.getElementById('trending');
const catList = document.getElementById('catList');
const categoryFilter = document.getElementById('categoryFilter');
const searchBox = document.getElementById('search');
const heroSlider = document.getElementById('heroSlider');
const paginationEl = document.getElementById('pagination');

function uniqueCats(){ return [...new Set(posts.map(p=>p.category).filter(Boolean))]; }

function renderCategories(){
  const cats = uniqueCats();
  catList.innerHTML = cats.map(c=>`<li><a href="#" onclick="filterCategory('${c}')">${c}</a></li>`).join('');
  categoryFilter.innerHTML = '<option value="">All Categories</option>' + cats.map(c=>`<option value="${c}">${c}</option>`).join('');
}

function renderTrending(){
  const top = posts.slice().sort((a,b)=> (b.views||0)-(a.views||0)).slice(0,6);
  trendingEl.innerHTML = top.map(t=>`<li><a href="blog.html?id=${t.id}">${t.title}</a></li>`).join('');
}

function renderHero(){
  const top = posts.slice().sort((a,b)=> (b.publishedAt||0)-(a.publishedAt||0)).slice(0,3);
  heroSlider.innerHTML = top.map(p=>`<div class="slide"><div style="background-image:url('${p.image||'assets/placeholder.jpg'}');position:absolute;inset:0;background-size:cover;border-radius:8px;opacity:0.85"></div><div style="position:relative"><h2>${p.title}</h2><p>${p.summary||''}</p><a href="blog.html?id=${p.id}">Read</a></div></div>`).join('');
  // simple auto scroll
  let idx=0;
  setInterval(()=>{ idx=(idx+1)%Math.max(1,heroSlider.children.length); heroSlider.scrollTo({left: idx*heroSlider.clientWidth, behavior:'smooth'}) }, 3500);
}

function renderPosts(page=1){
  filtered = posts.filter(p=>{
    const q = searchBox.value.trim().toLowerCase();
    const cat = categoryFilter.value;
    return (!q || (p.title+p.summary+p.content).toLowerCase().includes(q)) && (!cat || p.category===cat);
  });
  currentPage = page;
  const start = (page-1)*PER_PAGE, end = start+PER_PAGE;
  const pageItems = filtered.slice(start,end);
  postsEl.innerHTML = pageItems.map(p=>`<div class="card"><img src="${p.image||'assets/placeholder.jpg'}" alt=""><h3>${p.title}</h3><p>${p.summary||''}</p><a href="blog.html?id=${p.id}">Read More</a></div>`).join('') || '<p>No posts found.</p>';
  renderPagination();
}

function renderPagination(){
  const total = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  let html = '';
  for(let i=1;i<=total;i++) html += `<button ${i===currentPage?'disabled':''} onclick="renderPosts(${i})">${i}</button>`;
  paginationEl.innerHTML = html;
}

function filterCategory(cat){ categoryFilter.value = cat; renderPosts(1); }

searchBox.addEventListener('input', ()=> renderPosts(1));
categoryFilter.addEventListener('change', ()=> renderPosts(1));

function init(){
  // ensure id and publishedAt
  posts = posts.map((p,i)=> ({ id: p.id || i, publishedAt: p.publishedAt || Date.now() - i*1000, views: p.views||0, ...p }));
  renderCategories();
  renderTrending();
  renderHero();
  renderPosts(1);
  // theme toggle
  const themeBtn = document.getElementById('toggleTheme');
  themeBtn.addEventListener('click', ()=>{ document.body.classList.toggle('dark'); themeBtn.textContent = document.body.classList.contains('dark') ? 'Light' : 'Dark'; });
}

init();
