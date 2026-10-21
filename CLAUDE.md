# Pells Keeper School website

Static marketing site for Pells Keeper School, a goalkeeper-only training school in Howard County, Maryland, run by Laurie Pells George. It is plain HTML, CSS and JS with no build step, hosted on Vercel from the `main` branch.

The person asking for changes is usually Laurie, who is not a developer. Keep replies short and plain. Confirm what changed in a sentence or two, with no code talk.

## Files

| What | Where |
|---|---|
| Weekly private training schedule | `private-sessions.js` (the only file that changes weekly) |
| Camp cards, About, FAQ, testimonials, all page text | `index.html` |
| Styles (colors and fonts are tokens at the top in `:root`) | `styles.css` |
| Filters, schedule rendering, nav | `main.js` |
| Photos and logo | `assets/img/` (WebP, max 1600px wide) |

## Common requests

**Private sessions** ("Tuesday 5pm is booked", "add Thursday 6pm HS, 3 spots", "new week"): edit `private-sessions.js` only. The format is documented at the top of that file.
- `level` is one of `elementary`, `middle`, `high`, `all`.
- Open: no extra field. Spots left: `spots: 2`. Full: `booked: true`. Full with a waitlist: `booked: true, waitlist: true`.
- For a new week, set `weekOf` (e.g. `"Nov 2 – 8"`) and replace every day's sessions.
- Never add coach or player names. Every private session is with Laurie.
- Day notes go in `note`, kept short and public-facing. Leave out personal details.

**Camps**: each camp is an `<article class="camp">` card in the `#camps` section of `index.html`.
- Set `data-cat` (`half`, `full` or `boot`) and `data-end` (`YYYY-MM-DD`, the last day). Cards hide themselves after `data-end`.
- Copy an existing card and change the date badge, title, When, Where, Ages, price and note.
- Every Register button links to the ACTIVE registration URL already used on the page. There is no on-site sign-up.

**Testimonials, FAQ, About**: edit the matching section in `index.html`. Keep quotes in the family's own words.

## Rules

- Contact email is `pellsgkschool@gmail.com`. Every email link pre-fills a body that asks for the parent's name and best phone number. Booking phone (call/text) is `(908) 338-7026`. Instagram is `@pellsgkschool`.
- Keep the existing look: brand red, black, Maryland gold; Barlow Condensed headings; Inter body text. Reuse existing classes and don't add new libraries or frameworks.
- Every `<svg>` needs `width` and `height` attributes. Every image needs `alt` text, `width` and `height`.
- Don't invent facts (dates, prices, credentials). If something is unclear, ask Laurie.

## Before saving

1. Run `node --check private-sessions.js && node --check main.js`. A syntax error blanks the schedule.
2. If a browser is available, open `index.html` and check that the changed section renders with no console errors at desktop and phone widths.
3. Commit with a short message that says what changed (e.g. "Private: Tue 5pm booked").

## Going live

Vercel publishes `main` automatically and builds a preview link for any other branch. If the change was made on a working branch, tell Laurie it's ready to preview. When she says it looks good, or asks to publish, merge it into `main`.
