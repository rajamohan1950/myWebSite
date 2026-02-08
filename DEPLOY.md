# Deploy to the cloud and use www.rajamohanjabbala.com

**Free option (no payment, works in India):** Use **Vercel + Turso + Vercel Blob** — see [Deploy on Vercel (free)](#deploy-on-vercel-free) below.

**Paid / persistent VM:** Railway or Render (SQLite + disk).

**Storage & deploys:** Each new deploy only updates app code. **Data is not lost:** on Vercel, Turso (DB) and Vercel Blob (resume files) persist across deploys. On Railway/Render, the `/data` volume persists. Do not remove the Turso DB, Blob store, or volume when deploying.

---

## Re-deploy without losing any data

A re-deploy **only replaces the running app with a new build** from your repo. It does **not** delete or reset:

- **Vercel:** Turso (database) or Vercel Blob (resume files) — they stay as-is.
- **Railway / Render:** The `/data` volume (SQLite DB and uploads) — it stays as-is.

**Vercel:** Push to `main` already triggers a new deploy. To redeploy without a new commit: Vercel dashboard → your project → **Deployments** → ⋮ on the latest → **Redeploy** (use same commit). Or from your machine: `npx vercel --prod` (after `vercel link` once).

**Railway:** Push to `main` triggers deploy if `RAILWAY_TOKEN` is set in GitHub Secrets. Or: Railway dashboard → your service → **Deployments** → **Redeploy**.

**Important:** Do **not** delete the Turso database, the Vercel Blob store, or the Railway/Render volume. Only redeploy the application.

---

## Deploy on Vercel (free)

**No credit card.** Good for India (Vercel edge). DB = Turso (free SQLite), files = Vercel Blob (free tier).

### 1. Create Turso DB (free)

```bash
# Install Turso CLI: https://docs.turso.tech/cli/install
turso auth signup   # or turso auth login
turso db create my-website-db
turso db show my-website-db   # copy the URL
turso db tokens create my-website-db   # copy the token
```

### 2. Deploy on Vercel

1. Go to **[vercel.com](https://vercel.com)** → **Sign up with GitHub**.
2. **Add New** → **Project** → **Import** `rajamohan1950/myWebSite`.
3. **Environment Variables** (add these before Deploy):

   | Name | Value |
   |------|--------|
   | `TURSO_DATABASE_URL` | *(URL from `turso db show`)* |
   | `TURSO_AUTH_TOKEN` | *(token from `turso db tokens create`)* |
   | `BLOB_READ_WRITE_TOKEN` | *(create in Vercel: Storage → Create Database → Blob → copy token)* |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.rajamohanjabbala.com` |
   | `NEXT_PUBLIC_LINKEDIN_URL` | `https://www.linkedin.com/in/jabbalarajamohan` |
   | `RESUMES_PASSWORD` | *(your password)* |

4. **Deploy**. After first deploy, run schema once (local with Turso env):

   ```bash
   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npx drizzle-kit push
   ```

5. **Custom domain:** Project → **Settings** → **Domains** → add **www.rajamohanjabbala.com**. Then in GoDaddy (or your DNS), use the **stable** target below — **never** point to a deployment URL like `my-website-xxxxx-rajamohans-projects.vercel.app`, because that changes on every deploy.

Vercel Blob: in dashboard, **Storage** → **Create Database** → **Blob**; then in the Blob store, copy **BLOB_READ_WRITE_TOKEN** into the project env vars. Or run **one command** from your machine: create the Blob store in the dashboard, copy the token into `.env` as `BLOB_READ_WRITE_TOKEN=…`, then `npm run vercel:setup-resumes` (links project, pushes the token to Vercel, redeploys).

### GoDaddy DNS (one-time — URL never changes)

Use this so your domain always points to Vercel without updating after each deploy.

1. In **Vercel**: Project → **Settings** → **Domains** → add **www.rajamohanjabbala.com**. Note the target Vercel shows (usually `cname.vercel-dns.com`).
2. In **GoDaddy**: Domain → **DNS** (or **Manage DNS**).
3. **Remove** any CNAME for `www` that points to an old Vercel deployment URL (e.g. `my-website-ps027f5t1-rajamohans-projects.vercel.app`).
4. **Add** (or edit) a **CNAME** record:
   - **Name:** `www` (or `www.rajamohanjabbala.com` depending on GoDaddy’s UI)
   - **Value / Points to:** `cname.vercel-dns.com`
   - **TTL:** 600 or 1 hour
5. Save. DNS can take up to 48 hours to propagate (often minutes).

After this, **www.rajamohanjabbala.com** always goes to Vercel’s edge; Vercel serves the **current production** deployment. You never need to change GoDaddy when you redeploy.

### 404 even though domain shows “Valid Configuration”

1. **Which URL gives 404?** Try both in an incognito window:
   - **https://www.rajamohanjabbala.com**
   - Your project’s **Vercel URL** (e.g. **https://my-website-phi-ruddy.vercel.app**)
2. **If the Vercel URL works but www does not:** The custom domain may be on a *different* Vercel project. In Vercel → **Settings** → **Domains**, confirm **www.rajamohanjabbala.com** is listed under *this* project (the one you deploy to). If it’s on another project, remove it there and add it to this project.
3. **If both give 404:** There may be no successful Production deployment. In Vercel → **Deployments**, check the latest deployment: status must be **Ready** and it must be **Production**. If the latest failed or is “Preview”, fix the build or use **Redeploy** on a successful one and set it as Production.
4. **If you use GoDaddy forwarding** (e.g. rajamohanjabbala.com → www): set “Forward to” to **https://www.rajamohanjabbala.com** only. Do not forward to any `*.vercel.app` URL.
5. **Clear cache:** Try a different browser or incognito; wait a few minutes and try again.

---

## One-time setup → then every push auto-deploys (Railway)

1. Go to **[railway.app](https://railway.app)** → **Login with GitHub**.
2. **New Project** → **Deploy from GitHub repo** → select **rajamohan1950/myWebSite**.
3. In the new service:
   - **Settings** → **Volumes** → **Add Volume** → mount path **`/data`**.
   - **Variables** → add:

   | Variable | Value |
   |----------|--------|
   | `DATABASE_URL` | `/data/local.db` |
   | `UPLOADS_DIR` | `/data` |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.rajamohanjabbala.com` |
   | `NEXT_PUBLIC_LINKEDIN_URL` | `https://www.linkedin.com/in/jabbalarajamohan` |
   | `RESUMES_PASSWORD` | *(your password)* |
   | `NODE_ENV` | `production` |

   - **Settings** → **Networking** → **Custom Domain** → add **`www.rajamohanjabbala.com`**.
4. In your **DNS** (where rajamohanjabbala.com is managed): add **CNAME** `www` → target shown by Railway (e.g. `my-website-production.up.railway.app`).

Build/start come from **railway.toml** in the repo. Every push to **main** triggers a new deploy. Optional: for CLI deploys from GitHub Actions, create a **Project Token** in Railway (Project → Settings), add it as **RAILWAY_TOKEN** in this repo’s **Secrets**; then `.github/workflows/deploy.yml` will run `railway up` on each push.

---

## One-command deploy (Railway, from your machine)

From the project root, after logging in once:

```bash
npx railway login    # complete in browser (once)
./scripts/deploy-railway.sh
```

The script will: create/link a Railway project, add a volume at `/data`, set env vars (from `.env` where applicable), deploy with `railway up`, add the custom domain `www.rajamohanjabbala.com`, and open the dashboard. In the dashboard, copy the **CNAME** target and add a CNAME record for `www` at your DNS provider pointing to that target.

---

## Option A: Railway (manual steps)

1. **Sign up** at [railway.app](https://railway.app) (GitHub login).

2. **New project from repo**
   - Dashboard → **New Project** → **Deploy from GitHub repo**
   - Choose **rajamohan1950/myWebSite**
   - Railway will clone and build.

3. **Add a volume** (for SQLite + resume files)
   - Open your service → **Variables** tab → **Volumes** (or **Settings**)
   - **Add Volume**, mount path: `/data`
   - This directory will persist across deploys.

4. **Set environment variables**
   - In the service → **Variables**:

   | Variable | Value |
   |----------|--------|
   | `DATABASE_URL` | `/data/local.db` |
   | `UPLOADS_DIR` | `/data` |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.rajamohanjabbala.com` |
   | `RESUMES_PASSWORD` | *(your chosen password)* |
   | `NODE_ENV` | `production` |

   Add any others from `.env.example` (e.g. `MEDIUM_USERNAME`, `NEXT_PUBLIC_LINKEDIN_URL`) if you use them.

5. **Build and start**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`  
     (This runs `drizzle-kit push` then `next start` so the DB schema exists before the app starts.)
   - **Root Directory:** leave blank (repo root).

6. **Deploy**
   - Push to `main` or click **Deploy** in Railway. After the build, Railway will give you a URL like `https://your-app.up.railway.app`.

7. **Custom domain**
   - In the service → **Settings** → **Networking** → **Custom Domain**
   - Add: `www.rajamohanjabbala.com`
   - Railway will show the **CNAME target** (e.g. `your-app.up.railway.app`).

8. **DNS (at your domain registrar)**
   - Add a **CNAME** record:
     - **Name/Host:** `www` (or `www.rajamohanjabbala.com` depending on the UI)
     - **Value/Target:** the Railway CNAME target (e.g. `your-app.up.railway.app`)
   - Optional: redirect **rajamohanjabbala.com** → **www.rajamohanjabbala.com** (many registrars have “Redirect” or “Forwarding”).

9. **SSL**
   - Railway issues HTTPS automatically for your custom domain once DNS is correct. Wait a few minutes after adding the CNAME.

---

## Option B: Render

1. Sign up at [render.com](https://render.com) (GitHub).

2. **New → Web Service**, connect **rajamohan1950/myWebSite**.

3. **Build**
   - Build command: `npm install && npm run build`
   - Start command: `npm run start:prod`

4. **Add a Disk** (persistent storage)
   - In the service → **Disks** → **Add Disk**
   - Mount path: `/data`
   - Set env: `DATABASE_URL=/data/local.db`, `UPLOADS_DIR=/data`, `NEXT_PUBLIC_SITE_URL=https://www.rajamohanjabbala.com`, `RESUMES_PASSWORD=...`

5. **Custom domain**
   - **Settings** → **Custom Domains** → add `www.rajamohanjabbala.com`
   - In your DNS, add a **CNAME** for `www` to the host Render shows (e.g. `your-service.onrender.com`).

---

## After deploy

- Open `https://www.rajamohanjabbala.com` and confirm the site loads.
- Set `NEXT_PUBLIC_SITE_URL=https://www.rajamohanjabbala.com` in production so “Share on LinkedIn” and Open Graph use the correct URL.
- If you use **resumes**, set `RESUMES_PASSWORD` in the host’s env (never commit it).
- DB and uploaded files live under the volume/disk path (`/data`), so they persist across deploys.
