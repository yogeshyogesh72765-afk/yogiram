// blog.js - display article by id, increase views
const params = new URLSearchParams(location.search);
const id = params.get('id');
let posts = JSON.parse(localStorage.getItem('posts')||'[]');
const article = document.getElementById('article');
const p = posts.find(x=>String(x.id)===String(id));
if(p){
  article.innerHTML = `<h1>${p.title}</h1><p class="meta">${p.category} • ${new Date(p.publishedAt).toLocaleString()}</p><img src="${p.image||'assets/placeholder.jpg'}" alt="" style="max-width:100%;border-radius:8px"><div class="content">${p.content}</div>`;
  p.views = (p.views||0)+1;
  localStorage.setItem('posts', JSON.stringify(posts));
} else {
  article.innerHTML = '<p>Article not found.</p>';
}
