// Al Hikmah — grand opening invitation. Small, dependency-free.
const WA = '971503997597';
const OPENS = Date.parse('2026-11-29T16:00:00+04:00');
const SITE = 'https://alhikmah-stationery.vercel.app';

/* ---------- Countdown ---------- */
(() => {
  const root = document.querySelector('[data-countdown]');
  if (!root) return;
  const label = document.querySelector('[data-count-label]');
  const out = { d: root.querySelector('[data-d]'), h: root.querySelector('[data-h]'), m: root.querySelector('[data-m]'), s: root.querySelector('[data-s]') };
  let timer;
  const tick = () => {
    const left = OPENS - Date.now();
    if (left <= 0) {
      clearInterval(timer);
      if (label) label.textContent = Date.now() - OPENS < 4 * 3600e3 ? 'We’re opening' : 'We’re open';
      root.textContent = 'Welcome to Al Hikmah';
      return;
    }
    const s = Math.floor(left / 1000);
    const d = Math.floor(s / 86400);
    out.d.textContent = d;
    out.d.nextSibling.textContent = d === 1 ? ' day' : ' days';
    out.h.textContent = Math.floor((s % 86400) / 3600);
    out.m.textContent = Math.floor((s % 3600) / 60);
    out.s.textContent = s % 60;
  };
  tick();
  timer = setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
})();

/* ---------- Personal invitation + RSVP ---------- */
(() => {
  const form = document.getElementById('rsvp');
  const nameInput = form?.querySelector('input[name="guest"]');
  const party = form?.querySelector('select[name="party"]');
  const en = document.querySelector('[data-guest-en]');
  const ar = document.querySelector('[data-guest-ar]');
  const links = document.querySelectorAll('[data-rsvp-link]');
  const clean = (v) => (v || '').replace(/\s+/g, ' ').trim().slice(0, 40);

  const params = new URLSearchParams(location.search);
  const invited = clean(params.get('to'));
  if (invited && nameInput) nameInput.value = invited;

  const message = () => {
    const name = clean(nameInput?.value);
    const p = party?.value || '1';
    const who = p === '1' ? '' : p === '5+' ? ' with 5 or more of us' : ` with ${p} of us`;
    return `Hello Al Hikmah! ${name ? `This is ${name}. ` : ''}I'll be at the grand opening on Sunday 29 November at 4 PM${who}.`;
  };
  const waUrl = () => `https://wa.me/${WA}?text=${encodeURIComponent(message())}`;

  const render = () => {
    const name = clean(nameInput?.value);
    if (en) en.textContent = name ? `, ${name}` : '';
    if (ar) ar.textContent = name ? `إلى ${name}` : 'لضيفنا الكريم';
    links.forEach((a) => { a.href = waUrl(); });
  };
  nameInput?.addEventListener('input', render);
  party?.addEventListener('change', render);
  render();

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.open(waUrl(), '_blank', 'noopener');
  });

  document.querySelectorAll('[data-rsvp-jump]').forEach((a) => a.addEventListener('click', () => {
    setTimeout(() => nameInput?.focus({ preventScroll: true }), 600);
  }));

  /* Share: native sheet where available, WhatsApp otherwise */
  document.querySelectorAll('[data-share]').forEach((btn) => btn.addEventListener('click', async () => {
    const text = 'You’re invited to the grand opening of Al Hikmah Stationery, Sharjah: Sunday 29 November, 4 PM.';
    if (navigator.share) {
      try { await navigator.share({ title: 'Al Hikmah Stationery — Grand Opening', text, url: SITE }); } catch { /* dismissed */ }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${SITE}`)}`, '_blank', 'noopener');
    }
  }));
})();

/* ---------- Fit display lines to the content width ---------- */
(() => {
  const els = [...document.querySelectorAll('[data-fit]')];
  if (!els.length) return;
  const fit = () => els.forEach((el) => {
    const box = el.parentElement;
    const cs = getComputedStyle(box);
    const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    el.style.fontSize = '100px';
    const w = Math.max(el.getBoundingClientRect().width, el.scrollWidth);
    if (w) el.style.fontSize = `${Math.floor(((100 * avail) / w) * 10) / 10}px`;
  });
  fit();
  document.fonts?.ready.then(fit);
  let raf;
  addEventListener('resize', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });
})();

/* ---------- Entrances (once) ---------- */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('[data-reveal], [data-row], [data-shutter]');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  // stagger children of a group in reading order
  document.querySelectorAll('[data-reveal-group]').forEach((g) => {
    g.querySelectorAll('[data-reveal]').forEach((el, i) => el.style.setProperty('--i', i));
  });
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));
})();
