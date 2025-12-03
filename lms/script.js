// demo data
const COURSES = [
  {id:1,title:"Machine Learning", owner:"Mathu", price:899, img:"ml.jpg", desc:"Intro to ML with practical examples."},
  {id:2,title:"Web Development", owner:"Gowshic", price:499, img:"wd.jpg", desc:"HTML, CSS, JS and Flask basics."},
  {id:3,title:"Java Backend", owner:"Julius Ceaser", price:599, img:"java.jpg", desc:"Spring Boot and REST APIs."}
];

// helpers
const $ = (s)=>document.querySelector(s);
const $$ = (s)=>document.querySelectorAll(s);

// only run relevant scripts per page
document.addEventListener('DOMContentLoaded', ()=>{

  // LOGIN (fake)
  const loginForm = $('#loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      // demo: accept anything and redirect to home
      localStorage.setItem('lms_user', JSON.stringify({email:$('#email').value}));
      location.href = 'home.html';
    });
    $('#fakeSignup')?.addEventListener('click', (e)=>{
      e.preventDefault();
      alert('Demo signup: use any email/password then Login.');
    });
    return;
  }

  // HOME: render course cards
  const courseGrid = $('#courseGrid');
  if(courseGrid){
    courseGrid.innerHTML = COURSES.map(c=>`
      <article class="card">
        <img src="${c.img}" alt="${c.title}">
        <h3>${c.title}</h3>
        <p class="muted">Owner: ${c.owner}</p>
        <div class="row">
          <button class="btn primary" data-id="${c.id}" data-action="view">View Course</button>
          <button class="btn ghost" data-id="${c.id}" data-action="add">Add to Cart</button>
        </div>
      </article>
    `).join('');

    // events (delegation)
    courseGrid.addEventListener('click', (e)=>{
      const btn = e.target.closest('button');
      if(!btn) return;
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      const course = COURSES.find(x=>x.id===id);
      if(action === 'view'){
        openModal(course);
      } else if(action === 'add'){
        addToCart(course);
      }
    });

    // modal controls
    $('#modalClose')?.addEventListener('click', closeModal);
    $('#modalBuy')?.addEventListener('click', ()=>{ alert('Purchased (demo).'); closeModal(); });
    $('#modalAdd')?.addEventListener('click', ()=>{
      const id = Number($('#modalBuy').dataset.id);
      const c = COURSES.find(x=>x.id===id);
      addToCart(c);
      closeModal();
    });

    updateCartCount();
    return;
  }

  // COURSE page interactions
  if($('#buyBtn')){
    $('#buyBtn').addEventListener('click', ()=>alert('Bought demo course!'));
    $('#enrollBtn').addEventListener('click', ()=>alert('Enrolled to demo course!'));
    return;
  }

});

// modal functions
function openModal(course){
  $('#courseModal').classList.remove('hidden');
  $('#courseModal').style.display = 'grid';
  $('#modalImg').src = course.img;
  $('#modalTitle').textContent = course.title;
  $('#modalOwner').textContent = 'Owner: ' + course.owner;
  $('#modalDesc').textContent = course.desc;
  $('#modalPrice').textContent = '₹' + course.price.toFixed(2);
  $('#modalBuy').dataset.id = course.id;
  $('#modalAdd').dataset.id = course.id;
}
function closeModal(){
  $('#courseModal').classList.add('hidden');
  $('#courseModal').style.display = 'none';
}

// cart (localStorage)
function addToCart(course){
  const cart = JSON.parse(localStorage.getItem('lms_cart')||'[]');
  if(cart.find(c=>c.id===course.id)){
    alert('Already in cart');
    return;
  }
  cart.push({id:course.id,title:course.title,price:course.price});
  localStorage.setItem('lms_cart', JSON.stringify(cart));
  updateCartCount();
  alert('Added to cart');
}
function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem('lms_cart')||'[]');
  const el = $('#cartCount');
  if(el) el.textContent = cart.length;
}
