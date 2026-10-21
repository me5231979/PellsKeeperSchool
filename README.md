# Pells Keeper School website

A static rebuild of pellskeeperschool.com. It's plain HTML, CSS and JS, with no build step.

- `index.html`: all content (camps, training, coach, FAQ, contact)
- `styles.css`: design tokens at the top (`:root`), then one section per component
- `main.js`: mobile nav, camp filters, scroll-spy, reveal on scroll, form validation
- `assets/img/`: optimized WebP photos and the official crest (`logo.png`)

Preview by opening `index.html`, or run `python3 -m http.server`.

## Updating private training each week

Edit **`private-sessions.js`**. The schedule on the site is built from it, so there's no HTML to touch.

1. Set `weekOf` (e.g. `"Nov 2 – 8"`).
2. For each day, set the `location` and list the `sessions`.
3. For each session, set the `time` and the `level` (`elementary`, `middle`, `high` or `all`). Then add whichever of these apply:
   - `spots: 2`: shows "2 spots left"
   - `booked: true`: shows "Booked"
   - `waitlist: true`: with `booked`, adds a Join waitlist button
   - `price`, `tag`, `about`, `label`: optional extras
4. Bump `private-sessions.js?v=` in `index.html` (any new number) so browsers fetch the new week.

The Request and Join waitlist buttons open an email to `email`, with the day, time and group already filled in.

## Before launch, replace these

- [ ] **Camp sessions**: cards in `index.html` match the ACTIVE listing as of Oct 2026. Add new sessions as `<article class="camp">` cards; each hides itself after its `data-end` date.
- [x] **Registration**: every CTA links to ACTIVE (`campscui.active.com/orgs/PellsKeeperSchool`). No on-site sign-up.
- [x] **Email**: pellsgkschool@gmail.com
- [x] **Social links**: Instagram and Facebook in the footer and contact section.
- [ ] **About & testimonials**: copied from the old site. Confirm wording and the career timeline with Laurie.

## Cache busting

`index.html` loads `styles.css?v=…` and `main.js?v=…`. After changing either file, bump the `v` value (any new string) so returning visitors get the new version.
