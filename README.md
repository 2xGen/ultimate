# Ultimate Travel Tips

Next.js app for branded Viator redirect links and shareable `/go/...` URLs.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Features

- Homepage generator to convert a Viator URL into `https://ultimate-travel-tips.com/go/...`
- Dynamic `/go/[...path]` route with:
  - social OG/Twitter preview tags
  - bot-safe preview handling (no redirect for social crawlers)
  - user redirect to Viator with affiliate params
