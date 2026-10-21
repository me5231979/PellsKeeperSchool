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

  // Private training schedule (data in private-sessions.js)
  const pt = window.PRIVATE_SESSIONS;
  const ptGrid = $('[data-pt-grid]');
  if (pt && ptGrid) {
    const LEVELS = { elementary: 'Elementary', middle: 'Middle school', high: 'High school', all: 'All levels' };
    const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const statusOf = (s) => {
      if (s.booked) return { cls: 'pill-booked', text: 'Booked' };
      if (s.spots === 1) return { cls: 'pill-few', text: '1 spot left' };
      if (s.spots) return { cls: s.spots <= 2 ? 'pill-few' : 'pill-open', text: `${s.spots} spots left` };
      return { cls: 'pill-open', text: 'Open' };
    };
    const mailto = (d, s, waitlist) => {
      const what = `${d.day} ${s.time} – ${s.label || LEVELS[s.level]}`;
      const subject = `${waitlist ? 'Waitlist' : 'Private session request'}: ${what}`;
      const body = `Hi Laurie,\n\nI'd like to ${waitlist ? 'join the waitlist for' : 'book'} ${what}${pt.weekOf ? ` (week of ${pt.weekOf})` : ''}.\n\nKeeper's name:\nAge / grade:\nTeam & level:\nParent phone:\n\nThanks!`;
      return `mailto:${pt.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };
    const row = (d, s) => {
      const st = statusOf(s);
      const name = s.label || LEVELS[s.level];
      const meta = [s.label && s.level !== 'all' ? LEVELS[s.level] : '', s.coach ? `with ${s.coach}` : '', s.price || ''].filter(Boolean).join(' · ');
      let action;
      if (s.booked && s.waitlist) action = `<a class="btn btn-ghost-dark btn-sm" href="${mailto(d, s, true)}">Join waitlist<span class="sr-only"> for ${esc(d.day)} ${esc(s.time)}</span></a>`;
      else if (s.booked) action = '';
      else action = `<a class="btn btn-dark btn-sm" href="${mailto(d, s, false)}">Request<span class="sr-only"> ${esc(d.day)} ${esc(s.time)} ${esc(name)}</span></a>`;
      return `<li class="pt-session${s.booked ? ' is-booked' : ''}${s.about ? ' is-special' : ''}" data-level="${s.level}">
        <p class="pt-time">${esc(s.time)}</p>
        <div class="pt-info">
          <p class="pt-name">${esc(name)}${s.tag ? ` <span class="tag tag-gold">${esc(s.tag)}</span>` : ''}</p>
          ${meta ? `<p class="pt-meta">${esc(meta)}</p>` : ''}
          <p class="pt-status"><span class="pill ${st.cls}">${st.text}</span></p>
          ${s.about ? `<p class="pt-about">${esc(s.about)}</p>` : ''}
        </div>
        <div class="pt-action">${action}</div>
      </li>`;
    };
    ptGrid.innerHTML = pt.days.map((d) => `
      <article class="pt-day" data-pt-day>
        <header>
          <h3>${esc(d.day)}</h3>
          <p class="pt-loc"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>${esc(d.location)}</p>
        </header>
        <ul class="pt-list">${d.sessions.map((s) => row(d, s)).join('')}</ul>
        <p class="pt-empty" hidden>No sessions for this level.</p>
        ${d.note ? `<p class="pt-daynote">${esc(d.note)}</p>` : ''}
      </article>`).join('');
    if (pt.weekOf) $('[data-pt-week]').textContent = `Week of ${pt.weekOf}`;

    const levelChips = $$('[data-level]', $('#private .filters'));
    const applyLevel = (lvl) => {
      levelChips.forEach((c) => { const on = c.dataset.level === lvl; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
      $$('[data-pt-day]', ptGrid).forEach((day) => {
        let shown = 0;
        $$('.pt-session', day).forEach((li) => {
          const ok = lvl === 'all' || li.dataset.level === lvl || li.dataset.level === 'all';
          li.hidden = !ok; if (ok) shown++;
        });
        $('.pt-empty', day).hidden = shown > 0;
        day.classList.toggle('is-dim', shown === 0);
      });
    };
    levelChips.forEach((c) => c.addEventListener('click', () => applyLevel(c.dataset.level)));
  }

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


  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Career timeline: collapse older entries behind a toggle
  const tlBtn = $('[data-tl-toggle]');
  if (tlBtn) {
    const wrap = tlBtn.closest('.tl-wrap');
    const more = $$('.tl-item.is-more', wrap);
    const label = $('[data-tl-label]', tlBtn);
    const closedText = label.textContent;
    const setOpen = (open) => {
      tlBtn.setAttribute('aria-expanded', String(open));
      wrap.classList.toggle('is-collapsed', !open);
      more.forEach((li) => {
        li.classList.toggle('is-hidden', !open);
        li.classList.toggle('is-revealed', open);
      });
      label.textContent = open ? 'Show less' : closedText;
    };
    tlBtn.hidden = false;
    setOpen(false);
    tlBtn.addEventListener('click', () => {
      const open = tlBtn.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
      if (!open) wrap.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    });
  }

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
  const revealEls = $$('.section-head, .camp, .pt-day, .skills li, .coach > *, .career-head, .quote, .faq details, .contact > *');
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
