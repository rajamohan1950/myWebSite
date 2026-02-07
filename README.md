# Personal website — rajamohanjabbala.com

Personal site for www.rajamohanjabbala.com. Built with Next.js (App Router), TypeScript, Tailwind CSS, and SQLite (Drizzle).

## Setup

```bash
npm install
cp .env.example .env   # optional: set DATABASE_URL
npm run db:push        # create SQLite DB (already run once)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

- **Public**: Home (`/`), Blog (`/blog`, `/blog/[slug]`), Profile, Video Resume, Book a Call
- **Dashboard**: `/dashboard`, **Posts (CMS)** at `/dashboard/posts` — create/edit posts, publish or save as draft
- **DB**: SQLite via Drizzle — schema in `lib/db/schema.ts`, `npm run db:push` to apply. Posts are also optionally written to `content/posts/{slug}.md` for version control.

## Next steps

- Replace the Book a Call link in `app/(public)/book-a-call/page.tsx` with your Cal.com or Calendly URL
- Add your video in `public/` and embed it on the Video Resume page (or use a YouTube/Vimeo embed)
- Edit Profile content (manual for now; dashboard + LinkedIn sync later)

## Note

The folder is `my-website` (npm naming). You can rename it to `myWebSite` locally; the package name in `package.json` stays `my-website`.
