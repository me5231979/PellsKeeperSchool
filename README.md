# Pells Keeper School website

A static rebuild of pellskeeperschool.com. It's plain HTML, CSS and JS, with no build step.

- `index.html`: all content (camps, training, coach, FAQ, contact)
- `styles.css`: design tokens at the top (`:root`), then one section per component
- `main.js`: mobile nav, camp filters, scroll-spy, reveal on scroll, form validation
- `assets/img/`: optimized WebP photos and the official crest (`logo.png`)

Preview by opening `index.html`, or run `python3 -m http.server`.

## Before launch, replace these

- [ ] **Camp sessions**: cards in `index.html` match the ACTIVE listing as of Oct 2026. Add new sessions as `<article class="camp">` cards; each hides itself after its `data-end` date.
- [x] **Registration**: every CTA links to ACTIVE (`campscui.active.com/orgs/PellsKeeperSchool`). No on-site sign-up.
- [ ] **Email**: `info@pellskeeperschool.com` is assumed. Confirm it.
- [ ] **Social links**: add Instagram/Facebook to the footer if wanted.
- [ ] **Coach bio**: confirm the wording and credentials with Laurie.
