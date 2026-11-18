// Al Hikmah Stationery — Grand Opening Invitation Interactive Engine
const WA = '971503997597';
const OPENS = Date.parse('2026-11-29T16:00:00+04:00');
const SITE = 'https://alhikmah-stationery.vercel.app';
const PLUS_CODE = '9CC3+H26, Sharjah, UAE';

/* ---------- Toast helper ---------- */
const toastEl = document.querySelector('[data-toast]');
let toastTimer;
function showToast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('is-shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-shown'), 2600);
}

/* ---------- Live Grand Opening Countdown ---------- */
(() => {
  const box = document.querySelector('[data-countdown]');
  const label = document.querySelector('[data-count-label]');
  if (!box) return;
  const out = {
    d: box.querySelector('[data-d]'),
    h: box.querySelector('[data-h]'),
    m: box.querySelector('[data-m]'),
    s: box.querySelector('[data-s]'),
  };
  let timer;
  const pad = (n) => String(n).padStart(2, '0');

  const tick = () => {
    const left = OPENS - Date.now();
    if (left <= 0) {
      clearInterval(timer);
      if (label) label.textContent = Date.now() - OPENS < 5 * 3600e3 ? 'Opening Celebration Live' : 'Doors Are Open';
      box.innerHTML = '<div class="countdown__live">Welcome to Al Hikmah Stationery · Sharjah</div>';
      return;
    }
    const sec = Math.floor(left / 1000);
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (out.d) out.d.textContent = d;
    if (out.h) out.h.textContent = pad(h);
    if (out.m) out.m.textContent = pad(m);
    if (out.s) out.s.textContent = pad(s);
  };

  tick();
  timer = setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
})();

/* ---------- Sticky Navbar, Mobile Drawer & Active Link ---------- */
(() => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('[data-menu-toggle]');
  const drawer = document.getElementById('mobile-drawer');
  const links = [...document.querySelectorAll('.nav__links a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const setDrawer = (open) => {
    if (!drawer || !toggle) return;
    drawer.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle?.addEventListener('click', () => {
    const open = !drawer?.classList.contains('is-open');
    setDrawer(open);
  });

  drawer?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setDrawer(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('is-open')) setDrawer(false);
  });

  const onScroll = () => {
    const y = window.scrollY || 0;
    nav?.classList.toggle('is-scrolled', y > 24);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--scroll-progress', Math.min(1, Math.max(0, y / max)).toFixed(4));

    // Active section highlight
    const probe = y + 160;
    let activeId = '';
    for (const sec of sections) {
      if (sec.offsetTop <= probe) activeId = '#' + sec.id;
    }
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === activeId));
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ---------- Calendar Dropdown Popover ---------- */
(() => {
  const drop = document.querySelector('[data-cal-drop]');
  const btn = drop?.querySelector('[data-cal-btn]');
  if (!drop || !btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = drop.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!drop.contains(e.target)) {
      drop.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ---------- Personalised Invitation, RSVP & Live Pass ---------- */
(() => {
  const form = document.getElementById('rsvp-form');
  const nameInput = form?.querySelector('input[name="guest"]');
  const partySelect = form?.querySelector('select[name="party"]');
  const noteInput = form?.querySelector('input[name="note"]');
  const chips = [...(form?.querySelectorAll('[data-guest-type]') || [])];
  const confirmedBox = document.querySelector('[data-rsvp-confirmed]');

  const enSalut = document.querySelector('[data-guest-en]');
  const arSalut = document.querySelector('[data-guest-ar]');
  const passName = document.querySelector('[data-pass-name]');
  const passMeta = document.querySelector('[data-pass-meta]');
  const rsvpLinks = [...document.querySelectorAll('[data-rsvp-link]')];

  let guestType = 'Family & Friends';
  const clean = (v) => (v || '').replace(/\s+/g, ' ').trim().slice(0, 48);

  const params = new URLSearchParams(location.search);
  const urlGuest = clean(params.get('to'));
  if (urlGuest && nameInput) nameInput.value = urlGuest;

  const partyLabel = (val) => {
    if (val === '1') return 'Admit 1 Honoured Guest';
    if (val === '5+') return 'Admit 5+ Guests';
    return `Admit ${val} Guests`;
  };

  const buildMessage = () => {
    const g = clean(nameInput?.value);
    const p = partySelect?.value || '1';
    const note = clean(noteInput?.value);
    const who = p === '1' ? 'by myself' : p === '5+' ? 'with 5 or more guests' : `with ${p} guests`;
    let msg = `Assalamu Alaikum / Hello Al Hikmah Stationery! ${g ? `This is ${g}. ` : ''}I am confirming my attendance for the Grand Opening on Sunday, 29 November 2026 at 4:00 PM (${who}, ${guestType}).`;
    if (note) msg += ` Note: ${note}`;
    return msg;
  };

  const waHref = () => `https://wa.me/${WA}?text=${encodeURIComponent(buildMessage())}`;

  const sync = () => {
    const g = clean(nameInput?.value);
    const p = partySelect?.value || '1';

    if (enSalut) enSalut.textContent = g || 'Honoured Guest';
    if (arSalut) arSalut.textContent = g ? `إلى ${g}` : 'لضيفنا الكريم';
    if (passName) passName.textContent = g || 'Honoured Guest';
    if (passMeta) passMeta.textContent = `${partyLabel(p)} · ${guestType}`;

    const url = waHref();
    rsvpLinks.forEach((a) => { a.href = url; });
  };

  chips.forEach((btn) => {
    btn.addEventListener('click', () => {
      chips.forEach((c) => {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      guestType = btn.dataset.guestType || 'Family & Friends';
      sync();
    });
  });

  nameInput?.addEventListener('input', sync);
  partySelect?.addEventListener('change', sync);
  noteInput?.addEventListener('input', sync);
  sync();

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    sync();
    if (confirmedBox) {
      const g = clean(nameInput?.value) || 'Guest';
      confirmedBox.textContent = `Thank you, ${g}! Opening WhatsApp to send your RSVP to Al Hikmah Stationery — your digital pass on the right is ready.`;
      confirmedBox.classList.add('is-visible');
    }
    window.open(waHref(), '_blank', 'noopener');
  });

  // Focus name input when jumping to RSVP
  document.querySelectorAll('[data-rsvp-jump]').forEach((a) => {
    a.addEventListener('click', () => {
      setTimeout(() => nameInput?.focus({ preventScroll: true }), 550);
    });
  });

  // Copy Personalised Invite Link
  document.querySelectorAll('[data-copy-invite]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const g = clean(nameInput?.value);
      const url = g ? `${SITE}/?to=${encodeURIComponent(g)}` : SITE;
      try {
        await navigator.clipboard.writeText(url);
        showToast(g ? `Copied invite link for ${g}` : 'Copied invitation link');
      } catch {
        showToast(url);
      }
    });
  });

  // Native Web Share or WhatsApp fallback
  document.querySelectorAll('[data-share]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const g = clean(nameInput?.value);
      const url = g ? `${SITE}/?to=${encodeURIComponent(g)}` : SITE;
      const text = 'You are cordially invited to the Grand Opening of Al Hikmah Stationery in Sharjah on Sunday, 29 November 2026 at 4:00 PM.';
      if (navigator.share) {
        try {
          await navigator.share({ title: 'Al Hikmah Stationery — Grand Opening', text, url });
          return;
        } catch {
          // user dismissed or unsupported
        }
      }
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank', 'noopener');
    });
  });

  // Copy Plus Code
  document.querySelectorAll('[data-copy-code]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(PLUS_CODE);
        showToast('Copied location: 9CC3+H26, Sharjah');
      } catch {
        showToast(PLUS_CODE);
      }
    });
  });

  // Print Invitation Pass
  document.querySelectorAll('[data-print-pass]').forEach((btn) => {
    btn.addEventListener('click', () => window.print());
  });
})();

/* ---------- Mobile Sticky Action Dock ---------- */
(() => {
  const dock = document.querySelector('[data-mob-dock]');
  const hero = document.getElementById('top');
  const rsvp = document.getElementById('rsvp');
  const foot = document.querySelector('.foot');
  if (!dock || !hero) return;

  let hideForForm = false;

  const update = () => {
    const pastHero = window.scrollY > (hero.offsetHeight * 0.68);
    const rsvpRect = rsvp?.getBoundingClientRect();
    const footRect = foot?.getBoundingClientRect();
    const nearForm = rsvpRect && rsvpRect.top < window.innerHeight - 100 && rsvpRect.bottom > 100;
    const nearFoot = footRect && footRect.top < window.innerHeight - 40;
    const show = pastHero && !nearForm && !nearFoot && !hideForForm;
    dock.classList.toggle('is-visible', Boolean(show));
  };

  document.addEventListener('focusin', (e) => {
    if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
      hideForForm = true;
      update();
    }
  });
  document.addEventListener('focusout', () => {
    hideForForm = false;
    setTimeout(update, 120);
  });

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---------- Bulletproof Scroll Choreography & Parallax ---------- */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('[data-reveal], [data-reveal-photo], [data-rule]')];

  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll('[data-reveal], [data-reveal-photo]').forEach((el, idx) => {
      el.style.setProperty('--i', String(idx % 6));
    });
  });

  const revealInView = () => {
    const vh = window.innerHeight || 900;
    for (const el of reveals) {
      if (el.classList.contains('is-in')) continue;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 1.04) el.classList.add('is-in');
    }
  };

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '80px 0px -4% 0px', threshold: 0.02 }
    );
    reveals.forEach((el) => io.observe(el));
    // Initial check & safety sweep on scroll so nothing ever stays stuck hidden
    revealInView();
    window.addEventListener('scroll', revealInView, { passive: true });
  }

  // Smooth rAF scroll-scrub for parallax cards, hero depth & timeline progress
  if (!reduce) {
    const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
    const heroEl = document.querySelector('.hero');
    const timelineEl = document.querySelector('[data-timeline]');
    let rafId = 0;

    const tickScroll = () => {
      rafId = 0;
      const vh = window.innerHeight || 900;

      if (heroEl) {
        const hr = heroEl.getBoundingClientRect();
        const hp = Math.min(1, Math.max(0, -hr.top / Math.max(1, hr.height)));
        document.documentElement.style.setProperty('--hero-p', hp.toFixed(4));
      }

      if (timelineEl) {
        const tr = timelineEl.getBoundingClientRect();
        const tp = Math.min(1, Math.max(0, (vh * 0.78 - tr.top) / Math.max(1, tr.height + vh * 0.25)));
        timelineEl.style.setProperty('--timeline-p', tp.toFixed(4));
      }

      for (const el of parallaxEls) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > vh + 120) continue;
        const center = rect.top + rect.height * 0.5;
        const norm = Math.max(-1, Math.min(1, (center - vh * 0.5) / (vh * 0.65)));
        el.style.setProperty('--p', norm.toFixed(4));
      }
    };

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(tickScroll);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }
})();

/* ---------- Interactive Gallery Lightbox ---------- */
(() => {
  const modal = document.querySelector('[data-lightbox]');
  const triggers = [...document.querySelectorAll('[data-lightbox-item]')];
  if (!modal || !triggers.length) return;

  const imgEl = modal.querySelector('[data-lb-img]');
  const enEl = modal.querySelector('[data-lb-en]');
  const arEl = modal.querySelector('[data-lb-ar]');
  const countEl = modal.querySelector('[data-lb-count]');
  const closeBtn = modal.querySelector('[data-lb-close]');
  const prevBtn = modal.querySelector('[data-lb-prev]');
  const nextBtn = modal.querySelector('[data-lb-next]');

  let current = 0;
  let lastFocus = null;

  const items = triggers.map((el) => {
    const img = el.querySelector('img');
    return {
      src: el.dataset.full || img?.currentSrc || img?.src || '',
      alt: img?.alt || '',
      en: el.dataset.en || '',
      ar: el.dataset.ar || '',
    };
  });

  const render = (index) => {
    current = (index + items.length) % items.length;
    const item = items[current];
    if (imgEl) {
      imgEl.src = item.src;
      imgEl.alt = item.alt;
    }
    if (enEl) enEl.textContent = item.en;
    if (arEl) arEl.textContent = item.ar;
    if (countEl) countEl.textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  };

  const open = (index) => {
    lastFocus = document.activeElement;
    render(index);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  };

  triggers.forEach((el, idx) => {
    el.addEventListener('click', () => open(idx));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(idx);
      }
    });
  });

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => render(current - 1));
  nextBtn?.addEventListener('click', () => render(current + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') render(current - 1);
    if (e.key === 'ArrowRight') render(current + 1);
  });
})();

/* ---------- Grand Opening Celebration Music Controller ---------- */
(() => {
  const audio = document.getElementById('bg-music');
  const toggles = [...document.querySelectorAll('[data-music-toggle]')];
  const labelEl = document.querySelector('[data-music-label]');
  const drawerLabelEl = document.querySelector('[data-music-drawer-label]');
  if (!(audio instanceof HTMLAudioElement) || !toggles.length) return;

  const TARGET_VOLUME = 0.42;
  let userPaused = false;
  let wasPlayingOnHide = false;
  let fadeRaf = 0;
  let unlockArmed = false;

  const stopFade = () => {
    if (fadeRaf) {
      cancelAnimationFrame(fadeRaf);
      fadeRaf = 0;
    }
  };

  const fadeTo = (targetVol, duration = 1400) => {
    stopFade();
    const startVol = audio.volume;
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      audio.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * eased));
      if (t < 1 && !audio.paused) {
        fadeRaf = requestAnimationFrame(step);
      } else {
        fadeRaf = 0;
      }
    };
    fadeRaf = requestAnimationFrame(step);
  };

  const syncUI = (playing) => {
    toggles.forEach((btn) => {
      btn.classList.toggle('is-playing', playing);
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? 'Pause opening song' : 'Play opening song');
    });
    if (labelEl) labelEl.textContent = playing ? 'Playing' : 'Play Song';
    if (drawerLabelEl) drawerLabelEl.textContent = playing ? 'Pause Opening Song' : 'Play Opening Song';
  };

  const disarmUnlock = () => {
    if (!unlockArmed) return;
    unlockArmed = false;
    window.removeEventListener('pointerdown', onFirstGesture, true);
    window.removeEventListener('keydown', onFirstGesture, true);
  };

  const startMusic = async ({ withToast = false } = {}) => {
    disarmUnlock();
    try {
      stopFade();
      audio.volume = 0;
      await audio.play();
      syncUI(true);
      fadeTo(TARGET_VOLUME, 1400);
      if (withToast) showToast('Playing opening theme music');
      return true;
    } catch {
      syncUI(false);
      return false;
    }
  };

  const pauseMusic = ({ manual = false, withToast = false } = {}) => {
    if (manual) {
      userPaused = true;
      disarmUnlock();
    }
    stopFade();
    audio.pause();
    syncUI(false);
    if (withToast) showToast('Music paused');
  };

  function onFirstGesture(e) {
    if (userPaused) {
      disarmUnlock();
      return;
    }
    if (e.target instanceof Element && e.target.closest('[data-music-toggle]')) return;
    startMusic();
  }

  const armUnlock = () => {
    if (unlockArmed || userPaused) return;
    unlockArmed = true;
    window.addEventListener('pointerdown', onFirstGesture, { capture: true, passive: true });
    window.addEventListener('keydown', onFirstGesture, { capture: true, passive: true });
  };

  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!audio.paused) {
        pauseMusic({ manual: true, withToast: true });
      } else {
        userPaused = false;
        startMusic({ withToast: true });
      }
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      wasPlayingOnHide = !audio.paused;
      if (wasPlayingOnHide) pauseMusic({ manual: false });
    } else if (wasPlayingOnHide && !userPaused) {
      wasPlayingOnHide = false;
      startMusic();
    }
  });

  // Attempt gentle autoplay; if browser requires gesture, unlock smoothly on first interaction
  startMusic().then((ok) => {
    if (!ok && !userPaused) armUnlock();
  });
})();
