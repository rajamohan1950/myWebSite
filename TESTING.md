# Testing Guide

All features must be **fully tested** before handover. No server start or demo until automated tests pass.

## Rule

- **Write** detailed, comprehensive test cases (API + critical UI).
- **Run** automated tests; fix until all pass.
- **Only then** bring up the server or hand over.

## Automated Tests (API)

Run:

```bash
npm test
```

This uses a separate **test database** (`test.db`, gitignored). Schema is pushed before tests (`pretest`).

### Coverage

| Area | What is tested |
|------|----------------|
| **Posts API** | Create post (draft + published), GET by id, GET by slug, list all, list published only, PATCH update, DELETE |
| **Validation** | Missing title returns 400; invalid id returns 400/404 |
| **Slug** | Auto slug from title; custom slug; slug normalization |

## Manual Test Checklist (after `npm test` passes)

Run the dev server only after `npm test` passes:

```bash
npm run dev
```

Then verify:

### Blog & posts

- [ ] **Create post** – Dashboard → Posts → New post. Fill title, content, optional excerpt/category. Save as draft → post appears in list as draft.
- [ ] **Publish** – Edit the post, check “Published”, Save. Post appears on `/blog` and at `/blog/[slug]`.
- [ ] **Preview** – On edit screen, click “Preview”. New tab opens `/blog/preview/[id]` with post content (draft or published). “Preview (draft)” badge when not published.
- [ ] **Unpublished hidden** – Unpublish the post. It disappears from `/blog` and `/blog/[slug]` returns 404; preview still works.

### LinkedIn share

- [ ] **Blog post page** – Open a published post. “Share on LinkedIn” button present; click opens LinkedIn share dialog with correct post URL (uses `NEXT_PUBLIC_SITE_URL` or localhost:5001).
- [ ] **Dashboard list** – “Share on LinkedIn” only on published posts; link uses same base URL.

**Why “Can’t preview” and Post button disabled on localhost:** LinkedIn’s servers must fetch the URL you share. They cannot reach `http://localhost:5001`, so they show “Cannot display preview” and **keep the Post button disabled**. This is a LinkedIn limitation, not a bug in this app.

- **To test LinkedIn share locally:** Run `npx ngrok http 5001`, open the ngrok URL (e.g. `https://abc123.ngrok-free.app/blog/your-slug`), then click “Share on LinkedIn” from that page. Use the ngrok URL as the shared link so LinkedIn can fetch it; preview and Post button will work.
- **Production:** Once the site is deployed and `NEXT_PUBLIC_SITE_URL` is set to your public domain, sharing the production blog URL will show the preview and enable the Post button.

### Blog list & filters

- [ ] **Search** – `/blog`: type in search box; list filters by title/excerpt. URL has `?q=...`.
- [ ] **Category** – Select category; URL has `?category=...`. Combined with search works.
- [ ] **Medium** – After syncing Medium, articles appear with “Medium” badge and link.

### Medium sync

- [ ] **Sync** – Dashboard → Sync Medium. Latest articles (RSS) appear in blog list with “Medium” badge.

### Other pages

- [ ] **Home, Profile, Video Resume, Book a Call** – Load and that Calendly/YouTube links work.

## Test database

- **File**: `test.db` (created by `pretest`, gitignored).
- **Reset**: Delete `test.db` and run `npm test` again (schema is re-pushed).
