# Pells Keeper School website

A static rebuild of pellskeeperschool.com. It's plain HTML, CSS and JS, with no build step.

- `index.html`: all content (camps, training, coach, FAQ, contact)
- `styles.css`: design tokens at the top (`:root`), then one section per component
- `main.js`: mobile nav, camp filters, scroll-spy, reveal on scroll, form validation
- `assets/img/`: optimized WebP photos and the official crest (`logo.png`)

Preview by opening `index.html`, or run `python3 -m http.server`.

## Before launch, replace these

- [ ] **Camp dates, prices and status**: edit the `<article class="camp">` cards in `index.html`. Details came from public listings and may be out of date.
- [ ] **Registration links**: card buttons point to `#contact` for now. Point them at the real registration pages (Coerver for summer).
- [ ] **Email**: `info@pellskeeperschool.com` is assumed. Confirm it, or wire the form to a form service (Formspree, Netlify Forms, etc.) in place of `mailto:`.
- [ ] **Social links**: add Instagram/Facebook to the footer if wanted.
- [ ] **Coach bio**: confirm the wording and credentials with Laurie.
