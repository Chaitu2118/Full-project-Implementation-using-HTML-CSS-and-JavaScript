// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks){
  menuBtn.addEventListener('click', ()=>{
    navLinks.classList.toggle('open');
  });
}

// Active link
const links = document.querySelectorAll('#navLinks a');
links.forEach(a=>{
  if (a.getAttribute('href') && location.pathname.endsWith(a.getAttribute('href'))) {
    a.classList.add('active');
  }
});

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl){ yearEl.textContent = new Date().getFullYear(); }

// Contact form validation (front-end only demo)
const form = document.getElementById('contactForm');
if (form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const status = document.getElementById('status');

    if(!name || !email || !message){
      status.style.display='inline-block';
      status.textContent='Please fill all fields.';
      status.style.background='#fee2e2';
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!emailOk){
      status.style.display='inline-block';
      status.textContent='Enter a valid email.';
      status.style.background='#fef9c3';
      return;
    }
    status.style.display='inline-block';
    status.textContent='Thanks! Your message was “sent” (demo).';
    status.style.background='';
    form.reset();
  });
}



// ---------- To-Do App ----------
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

function loadTodos(){
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todoList.innerHTML = '';
  todos.forEach((t, i)=>{
    const li = document.createElement('li');
    li.className='card';
    li.style.display='flex';
    li.style.justifyContent='space-between';
    li.style.alignItems='center';
    li.style.marginBottom='.6rem';
    li.innerHTML = `<span>${t}</span> <button data-i="${i}" class="btn">❌</button>`;
    todoList.appendChild(li);
  });
}

if (todoForm){
  loadTodos();
  todoForm.addEventListener('submit', e=>{
    e.preventDefault();
    const val = todoInput.value.trim();
    if(!val) return;
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos.push(val);
    localStorage.setItem('todos', JSON.stringify(todos));
    todoInput.value='';
    loadTodos();
  });

  todoList.addEventListener('click', e=>{
    if(e.target.tagName==='BUTTON'){
      const i = e.target.getAttribute('data-i');
      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      todos.splice(i,1);
      localStorage.setItem('todos', JSON.stringify(todos));
      loadTodos();
    }
  });
}



// ---------- Products Page ----------
const productsGrid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');

let products = [];

function renderProducts(list){
  if (!productsGrid) return;
  productsGrid.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className='card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price} • ⭐ ${p.rating}</p>
      <span class="badge">${p.category}</span>
    `;
    productsGrid.appendChild(card);
  });
}

function filterAndSort(){
  let list = [...products];
  const cat = categoryFilter.value;
  if (cat !== 'all') list = list.filter(p=>p.category===cat);
  const sort = sortSelect.value;
  if (sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  if (sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  if (sort==='rating-asc') list.sort((a,b)=>a.rating-b.rating);
  if (sort==='rating-desc') list.sort((a,b)=>b.rating-a.rating);
  renderProducts(list);
}

if (productsGrid){
  fetch('products.json')
    .then(r=>r.json())
    .then(data=>{
      products = data;
      // Fill categories
      const cats = [...new Set(products.map(p=>p.category))];
      cats.forEach(c=>{
        const opt=document.createElement('option');
        opt.value=c; opt.textContent=c;
        categoryFilter.appendChild(opt);
      });
      filterAndSort();
    });

  categoryFilter?.addEventListener('change', filterAndSort);
  sortSelect?.addEventListener('change', filterAndSort);
}
