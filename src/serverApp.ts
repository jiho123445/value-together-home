import express from "express";
import path from "path";
import fs from "fs";

/**
 * SECURITY NOTE: this Express app is intentionally minimal. All real data
 * lives exclusively in Cloud Firestore, protected by firestore.rules
 * (writes require the admin Firebase Auth UID; participations/inquiries
 * live in their own collections that the public can only create into,
 * never read). This server never exposes a data-read or data-write API of
 * its own — that mistake (an unauthenticated `/api/*` data endpoint) is a
 * real failure mode for small nonprofit sites built this way, so this file
 * deliberately stays limited to:
 *
 *  - `/api/health` — a harmless uptime check.
 *  - `/uploads/:filename` and `/api/image/:filename` — read-only static
 *    file serving, kept only in case an admin ever needs to serve a file
 *    from local disk outside Firebase Storage. New uploads always go
 *    directly to Firebase Storage (see src/utils/uploadToStorage.ts),
 *    which enforces isAdmin() on every write via storage.rules.
 *
 * sitemap.xml is generated at build time by scripts/generate-previews.mjs
 * and served as a static file — not from a serverless route here. (A
 * serverless sitemap route is a known trap for this exact stack: it reads
 * live Firestore data on every crawl request, which is slower, costs a
 * Firestore read per hit, and has a real history of causing production
 * failures. Build-time generation avoids all of that.)
 *
 * Do NOT add a data-mutation or full-data-read endpoint here without real
 * server-side authentication (e.g. verifying a Firebase ID token with the
 * Firebase Admin SDK) first.
 */

export function createExpressApp() {
  const app = express();
  // Vercel terminates TLS at the edge and forwards to this function over
  // plain HTTP, setting X-Forwarded-Proto: https. Trust that header so
  // req.protocol correctly reports "https" in production.
  app.set("trust proxy", true);

  const isVercel = process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  const BASE_DIR = isVercel ? "/tmp" : process.cwd();
  const UPLOADS_DIR = path.join(BASE_DIR, "public", "uploads");

  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Surrogate-Control", "no-store");
    }
    next();
  });

  const serveImageHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const filename = path.basename(req.params.filename || req.path.replace(/^\/(uploads|api\/image)\//, ""));
    if (!filename) return next();

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const primaryPath = path.join(UPLOADS_DIR, filename);
    try {
      if (fs.existsSync(primaryPath)) {
        const ext = path.extname(filename).toLowerCase();
        const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".svg" ? "image/svg+xml" : "image/jpeg";
        res.setHeader("Content-Type", mime);
        return res.sendFile(primaryPath);
      }
    } catch (e) {}

    return res.status(404).json({ error: "Image not found", filename });
  };

  app.get("/uploads/:filename", serveImageHandler);
  app.get("/api/image/:filename", serveImageHandler);

  app.get("/api/health", (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.json({ status: "ok", timestamp: Date.now(), isVercel });
  });

  return app;
}
