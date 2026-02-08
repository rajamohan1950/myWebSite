#!/usr/bin/env node
/**
 * One-shot: set up Vercel Blob for resumes and push BLOB_READ_WRITE_TOKEN to Vercel.
 * 1. Link project if needed
 * 2. Create Blob store "my-website-resumes" (if not exists)
 * 3. If .env has BLOB_READ_WRITE_TOKEN, add it to Vercel (Production + Preview)
 * 4. Redeploy production
 *
 * First time: Create the Blob store in Vercel Dashboard (Storage → Create Database → Blob),
 * copy the token, add to .env as BLOB_READ_WRITE_TOKEN=your_token, then run this script.
 * Or run this script and when prompted for the token, paste it.
 */

import { execSync, spawnSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const root = resolve(__dirname, "..");
process.chdir(root);

function run(cmd, options = {}) {
  return spawnSync(cmd, { shell: true, stdio: options.silent ? "pipe" : "inherit", ...options });
}

function runOut(cmd) {
  return execSync(cmd, { encoding: "utf8", maxBuffer: 1024 * 1024 });
}

function readEnvValue(name) {
  if (!existsSync(".env")) return null;
  const content = readFileSync(".env", "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(new RegExp(`^\\s*${name}\\s*=\\s*(.*)$`));
    if (m) {
      const v = m[1].trim();
      return v.replace(/^["']|["']$/g, "");
    }
  }
  return null;
}

async function main() {
  console.log("=== Vercel: ensure CLI and link ===\n");
  let vercelOk = run("npx vercel --version", { silent: true });
  if (vercelOk.status !== 0) {
    console.log("Installing Vercel CLI…");
    run("npx -y vercel --version");
  }
  if (!existsSync(".vercel/project.json")) {
    console.log("Linking project (follow prompts)…");
    const link = run("npx vercel link");
    if (link.status !== 0) process.exit(link.status);
  }

  console.log("\n=== Create Blob store (ignore error if it already exists) ===\n");
  run("npx vercel blob store add my-website-resumes", { silent: true });

  const token = readEnvValue("BLOB_READ_WRITE_TOKEN");
  if (token) {
    console.log("\n=== Adding BLOB_READ_WRITE_TOKEN to Vercel (Production and Preview) ===\n");
    for (const env of ["production", "preview"]) {
      const r = spawnSync("npx", ["vercel", "env", "add", "BLOB_READ_WRITE_TOKEN", env, "--force"], {
        input: token,
        stdio: ["pipe", "inherit", "inherit"],
        shell: false,
        cwd: root,
      });
      if (r.status !== 0) console.warn(`Warning: env add ${env} exited ${r.status}`);
    }
    console.log("BLOB_READ_WRITE_TOKEN set on Vercel.\n");
  } else {
    console.log("\nBLOB_READ_WRITE_TOKEN not found in .env.");
    console.log("Add it: Vercel Dashboard → Storage → Create Database → Blob → copy token → add to .env as BLOB_READ_WRITE_TOKEN=…");
    console.log("Then run: npx vercel env add BLOB_READ_WRITE_TOKEN production");
    console.log("        npx vercel env add BLOB_READ_WRITE_TOKEN preview");
    console.log("Or paste the token when prompted by running:");
    console.log("  npx vercel env add BLOB_READ_WRITE_TOKEN production");
    console.log("  npx vercel env add BLOB_READ_WRITE_TOKEN preview\n");
  }

  console.log("=== Redeploying production ===\n");
  const deploy = run("npx vercel --prod");
  if (deploy.status !== 0) process.exit(deploy.status);
  console.log("\nDone. Resumes upload should work after this deploy.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
