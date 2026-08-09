# Berlin <> Zagreb prijevoz

A lightweight ride-sharing MVP for drivers and passengers travelling between Berlin and Zagreb.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and add the URL and public anonymous key from your Supabase project. Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` locally and `NEXT_PUBLIC_SITE_URL=https://berlin-zagreb.vercel.app` in Vercel.
3. Run `supabase/migrations/202608060001_initial_schema.sql` in the Supabase SQL editor.
4. Add `http://localhost:3000/auth/callback` to the allowed redirect URLs in Supabase Authentication.
5. Start the app with `npm run dev`.

Without Supabase credentials, the public trip list is empty. Authentication and protected pages require a configured Supabase project.

## Production authentication URLs

In Supabase Dashboard → Authentication → URL Configuration:

- Set **Site URL** to `https://berlin-zagreb.vercel.app`.
- Add `https://berlin-zagreb.vercel.app/auth/callback` to **Redirect URLs**.

These settings are required so email confirmations return to the production callback instead of Supabase falling back to localhost.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
