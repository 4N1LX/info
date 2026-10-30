// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', false);
}));

// Starfield background
(function stars() {
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  let w, h, pts;
  function init() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    const n = Math.floor((w * h) / 9000);
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.3 + .2, s: Math.random() * .25 + .03,
      t: Math.random() * Math.PI * 2
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.t += .02;
      p.y += p.s;
      if (p.y > h) { p.y = 0; p.x = Math.random() * w; }
      ctx.globalAlpha = .4 + Math.sin(p.t) * .35;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', init);
  init();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
  else { draw(); }
})();

// Scroll reveal + skill bars + counters
const counters = document.querySelectorAll('[data-count]');
function runCounter(el) {
  const target = +el.dataset.count, suffix = el.dataset.suffix || '';
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const id = setInterval(() => {
    cur = Math.min(target, cur + step);
    el.textContent = cur + suffix;
    if (cur >= target) clearInterval(id);
  }, 35);
}
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('.track i').forEach(i => i.style.width = i.dataset.w + '%');
    io.unobserve(e.target);
  });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
  });
}, { threshold: .6 });
counters.forEach(c => cio.observe(c));

// Active nav link
const links = document.querySelectorAll('.nav a');
const secs = [...links].map(a => document.querySelector(a.getAttribute('href')));
const sio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
secs.forEach(s => s && sio.observe(s));

// Back to top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 500));
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Contact form -> opens the visitor's email app addressed to Anil
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  [form.name, form.email, form.message].forEach(f => f.classList.remove('invalid'));
  let ok = true;
  if (!name) { form.name.classList.add('invalid'); ok = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { form.email.classList.add('invalid'); ok = false; }
  if (!message) { form.message.classList.add('invalid'); ok = false; }
  if (!ok) { note.textContent = 'Please fill all fields correctly.'; return; }
  const subject = encodeURIComponent('Website enquiry from ' + name);
  const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');
  window.location.href = 'mailto:anilx576@hotmail.com?subject=' + subject + '&body=' + body;
  note.textContent = 'Opening your email app… thank you!';
  form.reset();
});
