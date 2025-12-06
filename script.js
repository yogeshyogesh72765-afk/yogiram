
/* script.js - frontend-only logic */

// Dark mode toggle (simple CSS variable swap)
function toggleDark(btn){
  const root = document.documentElement;
  if (root.style.getPropertyValue('--bg') === '') {
    // no-op
  }
  if (document.body.classList.contains('light')) {
    document.body.classList.remove('light');
    btn.textContent = '🌙';
  } else {
    document.body.classList.add('light');
    btn.textContent = '☀️';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const t = document.getElementById('darkToggle');
  if (t) t.onclick = () => toggleDark(t);
  const t2 = document.getElementById('darkToggleAdmin');
  if (t2) t2.onclick = () => toggleDark(t2);
});

// ------------------ Admin functions ------------------
function initAdmin(){
  // if logged in -> show dashboard
  if (localStorage.getItem('cg_admin_logged') === '1') {
    showDashboard();
  } else {
    document.getElementById('loginSection').style.display = 'block';
  }
  showSavedList();
}

function doLogin(){
  const u = document.getElementById('adminUser').value.trim();
  const p = document.getElementById('adminPass').value.trim();
  if (u === 'admin0214' && p === '0214Y') {
    localStorage.setItem('cg_admin_logged','1');
    showDashboard();
  } else {
    alert('गलत क्रेडेंशियल! (admin / 12345)');
  }
}

function logoutAdmin(){
  localStorage.removeItem('cg_admin_logged');
  location.reload();
}

function showDashboard(){
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  showSavedList();
}

// Add place (reads file as base64)
function addPlace(){
  const title = document.getElementById('title').value.trim();
  const desc = document.getElementById('desc').value.trim();
  const file = document.getElementById('imgFile').files[0];
  if (!title || !desc) return alert('Title and description required');

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e){
      pushPlace({title,desc,image:e.target.result});
      document.getElementById('title').value=''; document.getElementById('desc').value=''; document.getElementById('imgFile').value='';
      showSavedList();
      alert('Place saved!');
    };
    reader.readAsDataURL(file);
  } else {
    // allow adding without custom image (use placeholder)
    pushPlace({title,desc,image:'images/place_1.svg'});
    document.getElementById('title').value=''; document.getElementById('desc').value='';
    showSavedList();
    alert('Place saved with default image!');
  }
}

function pushPlace(obj){
  const arr = JSON.parse(localStorage.getItem('cg_places')||'[]');
  arr.unshift(obj);
  localStorage.setItem('cg_places', JSON.stringify(arr));
}

// Show list in admin
function showSavedList(){
  const arr = JSON.parse(localStorage.getItem('cg_places')||'[]');
  const container = document.getElementById('savedList');
  if (!container) return;
  container.innerHTML = '';
  arr.forEach((p,i)=>{
    const div = document.createElement('div');
    div.className='list-item';
    div.innerHTML = `<img src="${p.image}" alt=""><div style="flex:1"><div style="font-weight:700">${p.title}</div><div class="muted">${p.desc.substring(0,120)}...</div></div>
    <div style="display:flex;flex-direction:column;gap:6px"><button class="btn" onclick="editPlace(${i})">Edit</button><button class="btn ghost" onclick="deletePlace(${i})">Delete</button></div>`;
    container.appendChild(div);
  });
}

// delete
function deletePlace(i){
  if (!confirm('Delete this place?')) return;
  const arr = JSON.parse(localStorage.getItem('cg_places')||'[]');
  arr.splice(i,1);
  localStorage.setItem('cg_places', JSON.stringify(arr));
  showSavedList();
  initIndex();
}

// edit (quick: populate fields then delete original)
function editPlace(i){
  const arr = JSON.parse(localStorage.getItem('cg_places')||'[]');
  const p = arr[i];
  document.getElementById('title').value = p.title;
  document.getElementById('desc').value = p.desc;
  arr.splice(i,1);
  localStorage.setItem('cg_places', JSON.stringify(arr));
  showSavedList();
}

// demo data generator
function demo(){
  const demoPlaces = [];
  for(let i=1;i<=8;i++){
    demoPlaces.push({
      title: 'District Place ' + i,
      desc: 'Demo description for place ' + i + '. यह एक उदाहरण विवरण है जो दिखाने के लिये जोड़ा गया है।',
      image: 'images/place_'+((i%33)||1)+'.svg'
    });
  }
  localStorage.setItem('cg_places', JSON.stringify(demoPlaces));
  alert('Demo data added!');
  showSavedList();
  initIndex();
}

// ------------------ Index functions ------------------
function initIndex(){
  // build places grid and slider
  const grid = document.getElementById('places');
  if (!grid) return;
  grid.innerHTML = '';
  const arr = JSON.parse(localStorage.getItem('cg_places')||'[]');

  // if no data -> add default 10 from images
  if (arr.length === 0) {
    const defaultArr = [];
    for(let i=1;i<=12;i++){
      defaultArr.push({
        title:'District Place '+i,
        desc:'यह छत्तीसगढ़ का एक सुंदर पर्यटन स्थल है।',
        image:'images/place_'+((i%33)||1)+'.svg'
      });
    }
    localStorage.setItem('cg_places', JSON.stringify(defaultArr));
  }

  const places = JSON.parse(localStorage.getItem('cg_places')||'[]');

  places.forEach((p,idx)=>{
    const el = document.createElement('article');
    el.className='place';
    el.innerHTML = `<img src="${p.image}" alt="${p.title}">
      <div class="pbody">
        <div class="huge">${p.title}</div>
        <div class="muted">${p.desc.substring(0,120)}...</div>
        <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">
          <div class="note">Learn more</div>
          <button class="btn ghost" onclick="viewPlace(${idx})">View</button>
        </div>
      </div>`;
    grid.appendChild(el);
  });

  document.getElementById('count').textContent = places.length + ' places';
  // slider autoplay
  setupSlider();
  // search
  const search = document.getElementById('search');
  if (search){
    search.oninput = function(){ filterPlaces(this.value) };
  }
}

// filter
function filterPlaces(q){
  q = q.toLowerCase().trim();
  const grid = document.getElementById('places');
  grid.innerHTML='';
  const places = JSON.parse(localStorage.getItem('cg_places')||'[]');
  const filtered = places.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  filtered.forEach((p,idx)=>{
    const el = document.createElement('article');
    el.className='place';
    el.innerHTML = `<img src="${p.image}" alt="${p.title}">
      <div class="pbody">
        <div class="huge">${p.title}</div>
        <div class="muted">${p.desc.substring(0,120)}...</div>
        <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">
          <div class="note">Learn more</div>
          <button class="btn ghost" onclick="viewPlace(${idx})">View</button>
        </div>
      </div>`;
    grid.appendChild(el);
  });
  document.getElementById('count').textContent = filtered.length + ' places';
}

function viewPlace(i){
  const places = JSON.parse(localStorage.getItem('cg_places')||'[]');
  const p = places[i];
  alert(p.title + "\n\n" + p.desc);
}

// slider
let sliderIndex = 0;
let sliderTimer = null;
function setupSlider(){
  const slides = document.querySelectorAll('.grid .place img');
  const slideImg = document.getElementById('slideImg');
  if (!slideImg) return;
  const places = JSON.parse(localStorage.getItem('cg_places')||'[]');
  if (places.length===0) return;
  // cycle through first 6
  if (sliderTimer) clearInterval(sliderTimer);
  sliderTimer = setInterval(()=>{
    sliderIndex = (sliderIndex + 1) % Math.min(6, places.length);
    slideImg.src = places[sliderIndex].image;
  }, 3000);
}
