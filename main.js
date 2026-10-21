(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const localISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = localISO(new Date());
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mapUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

  // Copy text to the clipboard; falls back to a hidden textarea
  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.append(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    }
  };
  const flash = (btn, text) => {
    if (!btn.dataset.label) btn.dataset.label = btn.textContent;
    btn.textContent = text;
    setTimeout(() => { btn.textContent = btn.dataset.label; }, 1800);
  };

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

  // Copy buttons (e.g. contact email)
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    flash(b, (await copyText(b.dataset.copy)) ? 'Copied' : 'Press Ctrl+C');
  }));

  // ---------- Private training schedule (data in private-sessions.js) ----------
  const pt = window.PRIVATE_SESSIONS;
  const ptGrid = $('[data-pt-grid]');
  const LEVELS = { elementary: 'Elementary', middle: 'Middle school', high: 'High school', all: 'All levels' };
  if (pt && ptGrid) {
    const statusOf = (s) => {
      if (s.booked) return { cls: 'pill-booked', text: 'Booked' };
      if (s.spots === 1) return { cls: 'pill-few', text: '1 spot left' };
      if (s.spots) return { cls: s.spots <= 2 ? 'pill-few' : 'pill-open', text: `${s.spots} spots left` };
      return { cls: 'pill-open', text: 'Open' };
    };
    // "Troy Hill Park or Blandair Park" -> two map links; anything with "TBD" stays plain text
    const placeHTML = (loc) => (/tbd/i.test(loc) ? esc(loc) : loc.split(/\s+or\s+/i).map((p) =>
      `<a href="${mapUrl(`${p}, Howard County, MD`)}" target="_blank" rel="noopener">${esc(p)}<span class="sr-only"> (opens map)</span></a>`).join(' or '));
    const row = (d, di, s, si) => {
      const st = statusOf(s);
      const name = s.label || LEVELS[s.level];
      const meta = [s.label && s.level !== 'all' ? LEVELS[s.level] : '', s.price || ''].filter(Boolean).join(' · ');
      let action = '';
      if (s.booked && s.waitlist) action = `<button class="btn btn-line" type="button" data-req="${di}:${si}:w">Waitlist<span class="sr-only"> for ${esc(d.day)} ${esc(s.time)} ${esc(name)}</span></button>`;
      else if (!s.booked) action = `<button class="btn btn-line btn-line-red" type="button" data-req="${di}:${si}">Request<span class="sr-only"> ${esc(d.day)} ${esc(s.time)} ${esc(name)}</span></button>`;
      return `<li class="pt-session${s.booked ? ' is-booked' : ''}${s.about ? ' is-special' : ''}" data-level="${s.level}">
        <p class="pt-time">${esc(s.time)}</p>
        <div class="pt-info">
          <p class="pt-name">${esc(name)}${s.tag ? ` <span class="tag tag-gold">${esc(s.tag)}</span>` : ''}</p>
          ${meta ? `<p class="pt-meta">${esc(meta)}</p>` : ''}
          ${s.about ? `<p class="pt-about">${esc(s.about)}</p>` : ''}
        </div>
        <p class="pt-status"><span class="pill ${st.cls}">${st.text}</span></p>
        <div class="pt-action">${action}</div>
      </li>`;
    };
    ptGrid.innerHTML = pt.days.map((d, di) => `
      <article class="pt-day" data-pt-day>
        <header>
          <h3>${esc(d.day)}</h3>
          <p class="pt-loc"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg><span>${placeHTML(d.location)}</span></p>
        </header>
        <div class="pt-body">
          <ul class="pt-list">${d.sessions.map((s, si) => row(d, di, s, si)).join('')}</ul>
          <p class="pt-empty" hidden>No sessions for this level this day.</p>
          ${d.note ? `<p class="pt-daynote">${esc(d.note)}</p>` : ''}
        </div>
      </article>`).join('');
    const weekEl = $('[data-pt-week]');
    if (pt.weekOf) weekEl.textContent = `Week of ${pt.weekOf}`; else weekEl.hidden = true;

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

    // ---------- Request sheet: parents fill in details once, then send by text, email, Gmail or copy ----------
    const dlg = $('[data-book]');
    const form = $('[data-book-form]');
    const status = $('[data-book-status]');
    const phone = (pt.phone || '').replace(/[^\d+]/g, '');
    let current = null;
    let opener = null;

    const required = {
      'b-parent': (v) => v.trim().length > 0,
      'b-phone': (v) => v.replace(/\D/g, '').length >= 10,
      'b-keeper': (v) => v.trim().length > 0,
    };
    const check = (id) => {
      const input = $('#' + id);
      const ok = required[id](input.value);
      input.setAttribute('aria-invalid', String(!ok));
      if (ok) input.removeAttribute('aria-describedby'); else input.setAttribute('aria-describedby', id + '-err');
      $('#' + id + '-err').hidden = ok;
      return ok;
    };
    Object.keys(required).forEach((id) => $('#' + id).addEventListener('blur', (e) => { if (e.target.value) check(id); }));

    // Remember the parent's details on this device so repeat requests are quick
    const KEY = 'pks-booking';
    const FIELDS = ['parent', 'phone', 'keeper', 'age', 'team'];
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      FIELDS.forEach((k) => { if (saved[k]) form.elements[k].value = saved[k]; });
    } catch { /* storage unavailable */ }

    const message = () => {
      const f = form.elements;
      const val = (k) => f[k].value.trim();
      const what = `${current.d.day} ${current.s.time} – ${current.name}`;
      const body = [
        `Hi Laurie, I'd like to ${current.waitlist ? 'join the waitlist for' : 'book'} ${what}${pt.weekOf ? ` (week of ${pt.weekOf})` : ''}.`,
        '',
        `Parent: ${val('parent')}`,
        `Phone: ${val('phone')}`,
        `Keeper: ${val('keeper')}`,
        val('age') ? `Age/grade: ${val('age')}` : null,
        val('team') ? `Team & level: ${val('team')}` : null,
        '',
        'Thanks!',
      ].filter((l) => l !== null).join('\n');
      return { subject: `${current.waitlist ? 'Waitlist' : 'Private session request'}: ${what}`, body };
    };

    const openSheet = (btn) => {
      const [di, si, w] = btn.dataset.req.split(':');
      const d = pt.days[+di];
      const s = d.sessions[+si];
      current = { d, s, waitlist: w === 'w', name: s.label || LEVELS[s.level] };
      opener = btn;
      $('[data-book-kind]').textContent = current.waitlist ? 'Join the waitlist' : 'Request a session';
      $('[data-book-title]').textContent = `${d.day} · ${s.time}`;
      $('[data-book-sub]').textContent = `${current.name} · ${d.location}`;
      Object.keys(required).forEach((id) => { $('#' + id + '-err').hidden = true; $('#' + id).removeAttribute('aria-invalid'); });
      status.textContent = '';
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      const first = Object.keys(required).find((id) => !$('#' + id).value) || 'b-parent';
      $('#' + first).focus();
    };
    const closeSheet = () => { if (dlg.open) dlg.close(); };
    dlg.addEventListener('close', () => { if (opener) opener.focus(); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) closeSheet(); }); // tap outside
    $('[data-book-close]').addEventListener('click', closeSheet);
    ptGrid.addEventListener('click', (e) => { const b = e.target.closest('[data-req]'); if (b) openSheet(b); });

    // On desktops (no texting), lead with email instead of text
    if (!window.matchMedia('(pointer: coarse)').matches) $('.sheet-actions').classList.add('is-desktop');

    $$('[data-send]', form).forEach((btn) => btn.addEventListener('click', async () => {
      const bad = Object.keys(required).filter((id) => !check(id));
      if (bad.length) { $('#' + bad[0]).focus(); return; }
      try {
        localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(FIELDS.map((k) => [k, form.elements[k].value]))));
      } catch { /* storage unavailable */ }
      const { subject, body } = message();
      const how = btn.dataset.send;
      if (how === 'copy') {
        const ok = await copyText(`To: ${pt.email}\nSubject: ${subject}\n\n${body}`);
        flash(btn, ok ? 'Copied ✓' : 'Copy failed');
        status.textContent = ok ? `Request copied. Paste it into a text to ${pt.phoneDisplay} or an email to ${pt.email}.` : '';
        return;
      }
      if (how === 'sms') window.location.href = `sms:${phone}?&body=${encodeURIComponent(body)}`;
      if (how === 'email') window.location.href = `mailto:${pt.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (how === 'gmail') window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(pt.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener');
      status.textContent = 'Opening your app with the request filled in.';
    }));
  }

  // ---------- Camps ----------
  const chips = $$('.chip[data-filter]');
  const camps = $$('[data-camp-grid] .camp');
  const empty = $('[data-empty]');
  const isPast = (card) => card.dataset.end && card.dataset.end < today;
  const upcoming = camps.filter((c) => !isPast(c));
  if (!upcoming.length) {
    // Every camp has passed: swap the grid for a friendly holding message
    $('[data-camp-grid]').hidden = true;
    $('#camps .filters').hidden = true;
    empty.innerHTML = 'New camps are on the way. <a href="https://www.instagram.com/pellsgkschool/" target="_blank" rel="noopener">Follow @pellsgkschool</a> for dates, or <a href="#contact">ask us</a> what’s next.';
    empty.hidden = false;
  }
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
    if (upcoming.length) empty.hidden = shown > 0;
  };
  $$('[data-filter]').forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter)));
  applyFilter('all');

  // Camp details from each card: data-date, data-time "09:00-12:00", data-repeat "daily:2" | "weekly:SU:2027-03-14"
  const REG = $('#camps .camp-foot a')?.href;
  const campInfo = (card) => {
    const [t1, t2] = card.dataset.time.split('-');
    const rep = (card.dataset.repeat || '').split(':');
    let first = card.dataset.date;
    if (rep[0] === 'weekly') {
      const want = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].indexOf(rep[1]);
      const d = new Date(`${first}T12:00:00`);
      while (d.getDay() !== want) d.setDate(d.getDate() + 1);
      first = localISO(d);
    }
    return { title: $('h3', card).textContent.trim(), first, start: card.dataset.date, end: card.dataset.end, t1, t2, rep, venue: card.dataset.venue, price: card.dataset.price, note: $('.camp-note', card)?.textContent.trim() || '' };
  };
  // Eastern time offset for a date (US DST: 2nd Sunday of March to 1st Sunday of November)
  const eastern = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    const nthSunday = (month, n) => { const x = new Date(y, month, 1); return 1 + ((7 - x.getDay()) % 7) + (n - 1) * 7; };
    const dst = (m > 3 && m < 11) || (m === 3 && d >= nthSunday(2, 2)) || (m === 11 && d < nthSunday(10, 1));
    return dst ? '-04:00' : '-05:00';
  };

  // Add to calendar: a small .ics file (Apple, Google and Outlook calendars)
  const ics = (c) => {
    const stamp = (d, t) => `${d.replace(/-/g, '')}T${t.replace(':', '')}00`;
    const text = (t) => t.replace(/[,;]/g, (ch) => `\\${ch}`);
    let rrule = '';
    if (c.rep[0] === 'daily') rrule = `RRULE:FREQ=DAILY;COUNT=${c.rep[1]}`;
    if (c.rep[0] === 'weekly') rrule = `RRULE:FREQ=WEEKLY;BYDAY=${c.rep[1]};UNTIL=${c.rep[2].replace(/-/g, '')}T235959Z`;
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Pells Keeper School//Camps//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      `UID:${c.start}-${c.title.replace(/\W+/g, '-').toLowerCase()}@pellskeeperschool.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      `DTSTART;TZID=America/New_York:${stamp(c.first, c.t1)}`,
      `DTEND;TZID=America/New_York:${stamp(c.first, c.t2)}`,
      rrule,
      `SUMMARY:${text(`${c.title} – Pells Keeper School`)}`,
      `LOCATION:${text(c.venue)}`,
      `DESCRIPTION:${text(`${c.note} Register: ${REG}`)}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');
  };
  camps.forEach((card) => {
    const btn = $('[data-cal]', card);
    if (!btn || !card.dataset.date) return;
    btn.addEventListener('click', () => {
      const c = campInfo(card);
      const url = URL.createObjectURL(new Blob([ics(c)], { type: 'text/calendar' }));
      const a = Object.assign(document.createElement('a'), { href: url, download: `${c.title.replace(/\W+/g, '-')}.ics` });
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  });

  // Google: publish upcoming camps as Events (structured data)
  if (upcoming.length) {
    const events = upcoming.map((card) => {
      const c = campInfo(card);
      const [vName, ...rest] = c.venue.split(', ');
      return {
        '@type': 'Event',
        name: `${c.title} – Pells Keeper School`,
        description: `Goalkeeper training camp. ${c.note}`.trim(),
        startDate: `${c.start}T${c.t1}:00${eastern(c.start)}`,
        endDate: `${c.end}T${c.t2}:00${eastern(c.end)}`,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: vName,
          address: { '@type': 'PostalAddress', ...(rest.length > 2 && { streetAddress: rest[0] }), addressLocality: rest[rest.length - 2], addressRegion: 'MD', addressCountry: 'US' },
        },
        image: 'https://pellskeeperschool.com/assets/img/og-image.jpg',
        organizer: { '@id': 'https://pellskeeperschool.com/#school' },
        offers: { '@type': 'Offer', price: c.price, priceCurrency: 'USD', url: REG, availability: 'https://schema.org/InStock' },
      };
    });
    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': events });
    document.head.append(tag);
  }

  // ---------- Career timeline: collapse older entries behind a toggle ----------
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
