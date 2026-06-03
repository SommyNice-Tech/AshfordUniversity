// PAGE NAVIGATION
function showPage(name) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  const target = document.getElementById("page-" + name);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Reset portal to login view when navigating away + back
    if (name !== "portal") {
      const dash = document.getElementById("portalDashbord");
      const login = document.getElementById("portalLogin");
      if (dash && login) {
        dash.classList.add("hidden");
        login.style.display = "flex";
      }
    }
  }
}

// MOBLIE MENU 
function toggleMenu(){
  const menu = document.getElementById('mobileMenu');
  const btn = document.querySelector('.hamburger');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}

// NAVBAR SCROLL EFFECT
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 30) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// FACULTY FILTER 
function filterFaculty(type, btn){
  // Update button state 
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Filter blocks 
  document.querySelectorAll('.faculty-block').forEach(block => {
    if (type === 'all' || block.dataset.faculty === type) {
      block.style.display = '';
      block.style.animation = 'fadeUp 0.4s ease forwards';
    }else{
      block.style.display = 'none';
    }
  });
}

// ADMISSION FORM 
function submitApllication(){
  const formCard = document.querySelector('.apply-form-section .form-card');
  const success = document.getElementById('formSuccess');

  // Simple validation 
  const inputs = formCard.querySelectorAll('input[type="text"], input[type="email"]');
  let valid = true;
  inputs.forEach(inp => {
    if (!inp.ariaValueMax.trim()) {
      inp.style.borderColor = '#e74c3c ';
      valid = false;
      inp.addEventListener('input', () => inp.style.borderColor = '', {once: true});
    }
  });

  if (!valid){
    shakeElement(formCard.querySelector('.full-btn'));
    return;
  }

  formCard.style.opacity ='0';
  formCard.style.transform = 'translateY(-12px)';
  formCard.style.transition = 'all 0.35s ease';

  setTimeout(() => {
    formCard.classList.add('hidden');
    success.classList.remove('hidden');
    success.style.animation = 'fadeUp 0.5s ease forwards';
  }, 350);
}

//PORTAL LOGIN
function doLogin() {
  const email = document.getElementById('loginEmail');
  const pass = document.getElementById('loginPassword');
  const btn = document.querySelector('.login-card .full-btn');

  if (!email.value || !pass.value) {
    [email, pass].forEach(f => {
      if (!f.value) {
        f.style.borderColor = '#e74c3c';
        f.addEventListener('input', () => f.style.borderColor = '', { once: true });
      }
    });
    shakeElement(btn);
    return;
  }

  btn.textContent = 'Signing in…';
  btn.disabled = true;
  btn.style.opacity = '0.75';

  setTimeout(() => {
    const login = document.getElementById('portalLogin');
    const dash = document.getElementById('portalDashboard');
    login.style.display = 'none';
    dash.classList.remove('hidden');

    // Set greeting based on time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    document.getElementById('dbGreeting').textContent = `${greeting}, James`;

    // Scroll to top of portal
    window.scrollTo({ top: 0 });
  }, 1000);
}

function logoutPortal() {
  const login = document.getElementById('portalLogin');
  const dash = document.getElementById('portalDashboard');
  const btn = document.querySelector('.login-card .full-btn');

  dash.classList.add('hidden');
  login.style.display = 'flex';

  // Reset fields
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  if (btn) { btn.textContent = 'Sign In'; btn.disabled = false; btn.style.opacity = '1'; }
}

//DASHBOARD TABS
function showDashTab(name) {
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.db-link').forEach(l => l.classList.remove('active'));

  const tab = document.getElementById('tab-' + name);
  if (tab) tab.classList.add('active');

  // Update sidebar link
  const links = document.querySelectorAll('.db-link');
  const map = { overview: 0, grades: 1, timetable: 2, announcements: 3 };
  if (map[name] !== undefined) links[map[name]].classList.add('active');
}

//UTILITY 
function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}


// Inject shake keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
`;
document.head.appendChild(style);

// ── INTERSECTION OBSERVER for scroll animations ──
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe cards and sections
function attachObservers() {
  const elements = document.querySelectorAll(
    '.program-card, .news-card, .testi-card, .visual-card, ' +
    '.mission-card, .leader-card, .faculty-block, .tl-item, ' +
    '.step, .announce-item, .db-card'
  );
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
    fadeObserver.observe(el);
  });
}

// Run observers on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  attachObservers();

  // Re-run on page change (mutation observer)
  const pagesContainer = document.body;
  const mutObs = new MutationObserver(attachObservers);
  mutObs.observe(pagesContainer, { attributes: true, subtree: true, attributeFilter: ['class'] });
});

// Handle Enter key on login form
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page-portal') {
      doLogin();
    }
  }
});