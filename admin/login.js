// login.js
document.getElementById('loginForm').addEventListener('submit', function(e){
  e.preventDefault();
  const u = document.getElementById('user').value;
  const p = document.getElementById('pass').value;
  if(u==='arvind' && p==='babU@5962'){ localStorage.setItem('admin','1'); location.href='panel.html'; }
  else alert('Wrong credentials');
});
