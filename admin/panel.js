// panel.js - admin panel logic (localStorage based)
if(localStorage.getItem('admin')!=='1') location.href='login.html';

const title = document.getElementById('title');
const category = document.getElementById('category');
const image = document.getElementById('image');
const summary = document.getElementById('summary');
const content = document.getElementById('content');
const list = document.getElementById('list');
const publish = document.getElementById('publish');
const importSample = document.getElementById('importSample');
const logout = document.getElementById('logout');

let posts = JSON.parse(localStorage.getItem('posts')||'[]');

function renderList(){
  list.innerHTML = posts.map(p=>`<div class="item"><div><strong>${p.title}</strong><div style="font-size:13px;color:#666">${p.category} • ${new Date(p.publishedAt).toLocaleString()}</div></div><div><button onclick="editPost(${p.id})">Edit</button><button onclick="deletePost(${p.id})">Delete</button></div></div>`).join('');
}
window.editPost = function(id){
  const p = posts.find(x=>x.id===id);
  if(!p) return alert('Not found');
  title.value = p.title; category.value=p.category; image.value=p.image; summary.value=p.summary; content.value=p.content;
  // remove old and allow publish to replace
  posts = posts.filter(x=>x.id!==id);
  localStorage.setItem('posts', JSON.stringify(posts));
  renderList();
}

window.deletePost = function(id){
  if(!confirm('Delete this post?')) return;
  posts = posts.filter(x=>x.id!==id);
  localStorage.setItem('posts', JSON.stringify(posts));
  renderList();
}

publish.addEventListener('click', ()=>{
  const newPost = {
    id: Date.now(),
    title: title.value.trim() || 'Untitled',
    category: category.value.trim() || 'General',
    image: image.value.trim(),
    summary: summary.value.trim(),
    content: content.value.trim(),
    publishedAt: Date.now(),
    views: 0
  };
  posts.unshift(newPost);
  localStorage.setItem('posts', JSON.stringify(posts));
  title.value='';category.value='';image.value='';summary.value='';content.value='';
  renderList();
  alert('Published!');
});

importSample.addEventListener('click', ()=>{
  // sample posts for demo
  const sample = [
    { id: Date.now()+1, title:'Statewide Festival Begins', category:'Culture', summary:'Colors and rituals...', content:'<p>Full article content about festival.</p>', image:'assets/placeholder.jpg', publishedAt:Date.now()-1000000, views:5 },
    { id: Date.now()+2, title:'New Rail Line Inaugurated', category:'Transport', summary:'Faster commutes...', content:'<p>Rail link opened.</p>', image:'assets/placeholder.jpg', publishedAt:Date.now()-2000000, views:8 },
    { id: Date.now()+3, title:'Startup Boom in City', category:'Business', summary:'Young entrepreneurs...', content:'<p>Startups getting funding.</p>', image:'assets/placeholder.jpg', publishedAt:Date.now()-3000000, views:3 }
  ];
  posts = sample.concat(posts);
  localStorage.setItem('posts', JSON.stringify(posts));
  renderList();
  alert('Sample posts added');
});

logout.addEventListener('click', ()=>{ localStorage.removeItem('admin'); location.href='login.html'; });

renderList();
