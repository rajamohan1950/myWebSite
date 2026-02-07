# Deploy to the cloud and use www.rajamohanjabbala.com

Your app uses **SQLite** and **file uploads** (resumes), so you need a host that allows persistent storage. **Railway** and **Render** both support this and free tiers.

---

## One-command deploy (Railway, from this repo)

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
