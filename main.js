// Mobile nav drawer
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');
if (toggle && links) {
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  links.parentElement.appendChild(overlay); // true sibling of the drawer
  const setMenu = (open) => {
    links.classList.toggle('open', open);
    toggle.classList.toggle('active', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  overlay.addEventListener('click', () => setMenu(false));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}

// Scroll reveal — fails open
const revs = document.querySelectorAll('.reveal');
if (revs.length) {
  const show = el => el.classList.add('in');
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revs.forEach(show);
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: .12 });
    revs.forEach(el => io.observe(el));
    requestAnimationFrame(() => {
      revs.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) show(el);
      });
    });
    setTimeout(() => revs.forEach(show), 2500);
  }
}

// Gallery filters
const filterBtns = document.querySelectorAll('.filters button');
if (filterBtns.length) {
  const items = document.querySelectorAll('.g-item');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    items.forEach(it => {
      it.style.display = (f === 'all' || it.dataset.cat === f) ? '' : 'none';
    });
  }));
}

// Lightbox — img starts with NO src; set on open, clear on close
const lb = document.getElementById('lightbox');
if (lb) {
  const lbImg = lb.querySelector('img');
  const openLb = (src, alt) => {
    lbImg.src = src; lbImg.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => lbImg.removeAttribute('src'), 250);
  };
  document.querySelectorAll('.g-item, .hero-collage figure, .feat figure, .heroC-strip figure, .workstrip img').forEach(el => {
    const img = el.matches('img') ? el : el.querySelector('img');
    if (!img) return;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    const go = () => openLb(img.currentSrc || img.src, img.alt);
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-close')) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
}

// Quote form — AJAX submit with un-configured guard
const form = document.getElementById('quoteForm');
if (form) {
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.action.includes('YOUR_FORM_ID')) {
      msg.className = 'form-msg err';
      msg.textContent = 'The quote form is not connected yet. For now, reach us by phone or email below and we will get right back to you.';
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        msg.className = 'form-msg ok';
        msg.textContent = 'Thanks for reaching out. Matt will get back to you within a couple of business days.';
      } else { throw new Error(); }
    } catch {
      msg.className = 'form-msg err';
      msg.textContent = 'Something went wrong sending your request. Please try again, or reach us by phone or email below.';
    } finally {
      btn.disabled = false; btn.textContent = 'Send Quote Request';
    }
  });
}

// Footer year
document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());
