// Mobile nav drawer
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');
if (toggle && links) {
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  links.parentElement.appendChild(overlay); // true sibling of the drawer
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'navLinks');
  const setMenu = (open) => {
    links.classList.toggle('open', open);
    toggle.classList.toggle('active', open);
    overlay.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    // lets the chat launcher get out of the way of the drawer
    document.body.classList.toggle('nav-open', open);
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

// Recent Work strip, phone and tablet.
// Desktop runs a CSS marquee and pauses it on hover. Neither works on a touch
// screen, so below 960 the container is a real scroller and this advances
// scrollLeft by hand: it keeps moving on its own, but a thumb can grab it,
// and it gets out of the way while you are actually touching it.
const strip = document.querySelector('.workstrip');
const stripTrack = strip && strip.querySelector('.workstrip-track');
const stripMQ = matchMedia('(max-width:960px)');
if (strip && stripTrack && stripMQ.matches) {
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const SPEED = 38;              // px per second, close to the desktop marquee
  const RESUME_AFTER = 2200;     // let go, read for a moment, then it drifts on

  let last = 0, paused = false, held = false, resumeAt = 0, onScreen = true;
  // Position is kept here as a float and assigned, never read back off the
  // element and added to. At 38px a second a frame moves about 0.6px, and
  // Safari rounds scrollLeft to whole pixels on read, so `scrollLeft +=` threw
  // the fraction away every frame and the strip sat still on iOS.
  let pos = 0;
  // The track is the photos twice over, so one run ends where the second copy
  // of the first photo begins. Measured off the images rather than halving
  // scrollWidth, because the container's own padding is inside that number and
  // left the reset 3px short, a small jump on every lap. Hidden images are
  // skipped, since the hero shot only joins the strip below 960.
  const onStrip = () => [].slice.call(stripTrack.querySelectorAll('img'))
                          .filter(i => i.offsetParent !== null);
  const runWidth = () => {
    const v = onStrip(), half = v.length >> 1;
    return half > 0 ? v[half].offsetLeft - v[0].offsetLeft : 0;
  };

  const tick = (now) => {
    const dt = last ? (now - last) / 1000 : 0;
    last = now;
    if (!stripMQ.matches) { strip.scrollLeft = 0; requestAnimationFrame(tick); return; }
    if (!paused && !held && onScreen && !reduced.matches && dt > 0 && dt < 0.5) {
      const run = runWidth();
      pos += SPEED * dt;
      // hand back to the start of the first run before the second one ends,
      // which is invisible because the two runs are identical
      if (run > 0 && pos >= run) pos -= run;
      strip.scrollLeft = pos;
    }
    if (resumeAt && now >= resumeAt) { held = false; resumeAt = 0; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const hold = () => { held = true; resumeAt = 0; };
  const release = () => { pos = strip.scrollLeft; resumeAt = performance.now() + RESUME_AFTER; };
  // covers a dragged scrollbar and momentum still settling after a flick
  strip.addEventListener('scroll', () => { if (held) pos = strip.scrollLeft; }, {passive: true});
  strip.addEventListener('touchstart', hold, {passive: true});
  strip.addEventListener('touchend', release, {passive: true});
  strip.addEventListener('touchcancel', release, {passive: true});
  // a trackpad or mouse wheel on a narrow window counts as grabbing it too
  strip.addEventListener('wheel', () => { hold(); release(); }, {passive: true});

  // no reason to burn battery scrolling something nobody is looking at
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { onScreen = es[0].isIntersecting; },
                             {threshold: 0}).observe(strip);
  }
  document.addEventListener('visibilitychange', () => { paused = document.hidden; });
}

// Gallery filters
const filterBtns = document.querySelectorAll('.filters button');
if (filterBtns.length) {
  const items = document.querySelectorAll('.g-item');
  filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('active'))));
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
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
  const close = lb.querySelector('.lb-close');

  // Controls are built here rather than in the markup so all five pages get
  // them from one place.
  const mk = (cls, label, html) => {
    const b = document.createElement('button');
    b.className = cls; b.type = 'button';
    b.setAttribute('aria-label', label); b.innerHTML = html;
    lb.insertBefore(b, close);
    return b;
  };
  const prevBtn = mk('lb-nav lb-prev', 'Previous photo', '&#8249;');
  const nextBtn = mk('lb-nav lb-next', 'Next photo', '&#8250;');
  const cap   = Object.assign(document.createElement('p'), {className: 'lb-cap'});
  const count = Object.assign(document.createElement('p'), {className: 'lb-count'});
  lb.append(cap, count);

  const sources = [];   // every image the lightbox can show, in document order
  let idx = -1;

  // Only walk what is on screen, so a gallery filter narrows the lightbox too.
  const shown = () => sources.filter(s => s.el.offsetParent !== null);

  const paint = (i) => {
    idx = i;
    const s = sources[i];
    lbImg.src = s.img.currentSrc || s.img.src;
    lbImg.alt = s.img.alt || '';
    cap.textContent = s.img.alt || '';
    const list = shown();
    const pos = list.indexOf(s);
    const many = list.length > 1;
    count.textContent = many && pos > -1 ? (pos + 1) + ' / ' + list.length : '';
    prevBtn.hidden = nextBtn.hidden = !many;
  };

  const step = (dir) => {
    const list = shown();
    if (list.length < 2) return;
    let pos = list.indexOf(sources[idx]);
    if (pos === -1) pos = 0;
    paint(sources.indexOf(list[(pos + dir + list.length) % list.length]));
  };

  const openLb = (i) => {
    paint(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    close.focus();
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
    const i = sources.push({el: el, img: img}) - 1;
    const go = () => openLb(i);
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });

  prevBtn.addEventListener('click', e => { e.stopPropagation(); step(-1); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); step(1); });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-close')) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  });

  // Swipe, since this gallery is mostly read on a phone.
  let x0 = null, y0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, {passive: true});
  lb.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    x0 = y0 = null;
  }, {passive: true});
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

// Let's Chat launcher.
// Skipped on the quote page, which already carries the form this would point at,
// and where a fixed button lands squarely on top of a field.
if (!document.getElementById('quoteForm')) {
  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.type = 'button';
  fab.setAttribute('aria-expanded', 'false');
  fab.setAttribute('aria-controls', 'chatPanel');
  fab.setAttribute('aria-label', 'Get in touch');
  fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 ' +
    '8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 ' +
    '1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
    '<span class="fab-label">Let\u2019s Chat</span>';

  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.id = 'chatPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Get in touch with ML Designs');
  // REPLACE THIS: the phone and email rows go live once Matt supplies them.
  // Tracked in README.md. Until then the form is the only real channel, so it
  // leads rather than sitting under a dead phone number.
  panel.innerHTML =
      '<button class="chat-close" type="button" aria-label="Close">&times;</button>'
    + '<h3>Tell us about the project</h3>'
    + '<p>Send a few details and Matt will get back to you within a couple of business days.</p>'
    + '<div class="row"><span class="lbl">Quote</span><a href="quote.html">Start a quote request</a></div>'
    + '<div class="row"><span class="lbl">Phone</span><span>Coming soon</span></div>'
    + '<div class="row"><span class="lbl">Email</span><span>Coming soon</span></div>'
    + '<div class="row"><span class="lbl">Social</span><a href="https://www.instagram.com/ml_designs_const_woodworking/" target="_blank" rel="noopener">Instagram</a></div>'
    + '<div class="row"><span class="lbl">Area</span><span>St. John, plus Lake and Porter counties</span></div>';

  document.body.appendChild(panel);
  document.body.appendChild(fab);

  const setChat = (open) => {
    panel.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('.chat-close').focus(); else fab.focus();
  };
  fab.addEventListener('click', () => setChat(!panel.classList.contains('open')));
  panel.querySelector('.chat-close').addEventListener('click', () => setChat(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) setChat(false); });
  // tapping the page behind it should dismiss, the way the nav drawer does
  document.addEventListener('click', e => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && !fab.contains(e.target)) setChat(false);
  });
}

// Footer year
document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());
