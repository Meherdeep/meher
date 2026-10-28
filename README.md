# meherdeepthakur.com

React + Vite build of the portfolio.

## Run locally
```
npm install
npm run dev
```

## Deploy
`npm run build` outputs a static site to `dist/`.

- **Vercel / Netlify:** import the repo. Build command `npm run build`, output `dist`.
- **GitHub Pages:** push `dist/` (or use a Pages action).

Point meherdeepthakur.com at the host. robots.txt, sitemap.xml, og-image.png, favicons and the web manifest are in `public/`.

## Editing
- Content and layout: `src/App.jsx`
- Hero headline / availability badge: props in `src/main.jsx`
  (headline options: "Launch to scale", "Build, ship, invest", "Frontier → products", "Builder, operator, investor", "Builder → Backer", "Operator's view", "Three roles")
- Global styles, hover states, theme: `src/styles.css`

After deploying, submit the sitemap in Google Search Console.
