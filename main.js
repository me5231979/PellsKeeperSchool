(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Header shadow on scroll
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav
  const toggle = $('[data-nav-toggle]');
  const list = $('[data-nav-list]');
  const setNav = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    list.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
  list.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && list.classList.contains('is-open')) { setNav(false); toggle.focus(); }
  });

  // Camp filters
  const chips = $$('.chip[data-filter]');
  const camps = $$('[data-camp-grid] .camp');
  const empty = $('[data-empty]');
  // Hide sessions once their last day has passed
  const today = new Date().toISOString().slice(0, 10);
  const isPast = (card) => card.dataset.end && card.dataset.end < today;
  const applyFilter = (f) => {
    chips.forEach((c) => {
      const on = c.dataset.filter === f;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
    let shown = 0;
    camps.forEach((card) => {
      const match = !isPast(card) && (f === 'all' || card.dataset.cat.split(' ').includes(f));
      card.hidden = !match;
      if (match) shown++;
    });
    empty.hidden = shown > 0;
  };
  $$('[data-filter]').forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter)));
  applyFilter('all');


  // Active nav link
  const links = $$('.nav-list a[href^="#"]:not(.btn)');
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => {
        if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  // Reveal on scroll
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = $$('.section-head, .camp, .skills li, .coach > *, .career > *, .quote, .faq details, .contact > *');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 3) * 60}ms`;
      io.observe(el);
    });
  }


  $('[data-year]').textContent = new Date().getFullYear();
})();
