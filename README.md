# Al Hikmah Stationery — Grand Opening invitation

One-page bilingual (English / Arabic) invitation for the grand opening of Al Hikmah Stationery, Sharjah — Sunday 29 November 2026, 4:00 PM.

Live: https://alhikmah-stationery.vercel.app (the printed posters' QR codes point here — keep this project name).

## Stack

Astro (static output), plain CSS, a small vanilla JS file. No framework runtime.

```sh
npm install
npm run dev      # local dev server
npm run build    # static site in dist/
```

## Handy bits

- Personal invitation links: add `?to=Name` to the URL, e.g. `https://alhikmah-stationery.vercel.app/?to=Ahmed`.
- Opening time for the countdown: `OPENS` in `src/scripts/main.js`.
- Department photos: `src/assets/img/dept-*.jpg` (4:5).
- Calendar file: `public/al-hikmah-grand-opening.ics`.
