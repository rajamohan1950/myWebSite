#!/usr/bin/env bash
# Deploy my-website to Railway and set up www.rajamohanjabbala.com
# Prereq: run once: npx railway login
set -e
cd "$(dirname "$0")/.."

echo "=== Checking Railway login ==="
if ! npx -y @railway/cli whoami &>/dev/null; then
  echo "Not logged in. Run: npx railway login"
  exit 1
fi

echo "=== Linking or creating project ==="
if [ ! -f .railway/railway.json ] 2>/dev/null; then
  npx -y @railway/cli init -n my-website
fi

echo "=== Adding volume at /data (if not exists) ==="
npx -y @railway/cli volume add -m /data 2>/dev/null || true

echo "=== Setting variables ==="
# Load RESUMES_PASSWORD from .env if set
source .env 2>/dev/null || true
npx -y @railway/cli variable set DATABASE_URL=/data/local.db
npx -y @railway/cli variable set UPLOADS_DIR=/data
npx -y @railway/cli variable set NEXT_PUBLIC_SITE_URL=https://www.rajamohanjabbala.com
npx -y @railway/cli variable set NODE_ENV=production
npx -y @railway/cli variable set NEXT_PUBLIC_LINKEDIN_URL="${NEXT_PUBLIC_LINKEDIN_URL:-https://www.linkedin.com/in/jabbalarajamohan}"
[ -n "${RESUMES_PASSWORD:-}" ] && npx -y @railway/cli variable set RESUMES_PASSWORD "$RESUMES_PASSWORD"

echo "=== Deploying (railway up) ==="
npx -y @railway/cli up

echo "=== Adding custom domain www.rajamohanjabbala.com ==="
npx -y @railway/cli domain add www.rajamohanjabbala.com 2>/dev/null || true

echo "=== Done. Open dashboard for CNAME and DNS instructions ==="
npx -y @railway/cli open
