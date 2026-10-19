import type { VercelRequest, VercelResponse } from "@vercel/node";
import { timingSafeEqual } from "node:crypto";
import { supabaseRest, supabaseRestHeaders } from "../_lib/supabaseRest.js";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const TOKEN = process.env.MEDIA_MIGRATION_TOKEN;
const SOURCE_HOST = "f7e1eaf0-74c7-4c48-bd3a-7f925db03bf6.sandbox.floot.app";
const BUCKET = "portfolio-media";
const MAX_BYTES = 20 * 1024 * 1024;

function authorized(req: VercelRequest) {
  const supplied = req.headers.authorization?.replace(/^Bearer\s+/i, "") ?? "";
  if (!TOKEN || !supplied) return false;
  const a = Buffer.from(supplied);
  const b = Buffer.from(TOKEN);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sourceUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && u.hostname === SOURCE_HOST &&
      u.pathname.startsWith("/_cdn/static/") &&
      /\.(png|jpe?g|webp|gif|avif)$/i.test(u.pathname);
  } catch { return false; }
}

function collect(value: unknown, urls: Set<string>): void {
  if (typeof value === "string") { if (sourceUrl(value)) urls.add(value); return; }
  if (Array.isArray(value)) { for (const item of value) collect(item, urls); return; }
  if (value && typeof value === "object") {
    for (const item of Object.values(value as Record<string, unknown>)) collect(item, urls);
  }
}

function replace(value: unknown, map: Map<string, string>): unknown {
  if (typeof value === "string") return map.get(value) ?? value;
  if (Array.isArray(value)) return value.map(item => replace(item, map));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, replace(v, map)]));
  }
  return value;
}

async function uploadImage(source: string): Promise<string> {
  if (!SUPABASE_URL) throw new Error("SUPABASE_URL is not configured.");
  const u = new URL(source);
  const filename = u.pathname.split("/").pop()!;
  const response = await fetch(source, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Source fetch failed (${response.status}) for ${filename}`);
  const type = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"].includes(type)) {
    throw new Error(`Unexpected image content type for ${filename}: ${type || "missing"}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length || bytes.length > MAX_BYTES) throw new Error(`Invalid image size for ${filename}: ${bytes.length} bytes`);
  const target = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`;
  const put = await fetch(target, {
    method: "POST",
    headers: { ...supabaseRestHeaders({ "Content-Type": type, "x-upsert": "true" }) },
    body: bytes,
    signal: AbortSignal.timeout(30000),
  });
  if (!put.ok) throw new Error(`Storage upload failed (${put.status}) for ${filename}: ${(await put.text()).slice(0, 250)}`);
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  if (!authorized(req)) return res.status(401).json({ error: "Unauthorized" });
  try {
    const projects = await supabaseRest("projects?select=id,slug,cover_image_url,hero_video_url,gallery_items,before_after_items,gallery_urls,video_urls");
    const journals = await supabaseRest("journal_posts?select=id,slug,cover_image_url");
    const rows = [
      ...(Array.isArray(projects) ? projects.map((row: any) => ({ table: "projects", row })) : []),
      ...(Array.isArray(journals) ? journals.map((row: any) => ({ table: "journal_posts", row })) : []),
    ];
    const sources = new Set<string>();
    for (const item of rows) collect(item.row, sources);
    const dryRun = req.body?.dryRun !== false;
    if (dryRun) return res.status(200).json({
      dryRun: true, bucket: BUCKET, projects: Array.isArray(projects) ? projects.length : 0,
      journalPosts: Array.isArray(journals) ? journals.length : 0, uniqueImages: sources.size,
      images: [...sources].map(url => ({ filename: new URL(url).pathname.split("/").pop() })),
      message: "No files uploaded and no database rows changed. Send { dryRun: false } to migrate."
    });

    const mapping = new Map<string, string>();
    const errors: string[] = [];
    for (const url of sources) {
      try { mapping.set(url, await uploadImage(url)); }
      catch (e) { errors.push(e instanceof Error ? e.message : "Unknown image migration error"); }
    }
    if (errors.length) return res.status(502).json({
      migratedImages: mapping.size, failedImages: errors.length, errors,
      message: "Some images failed. Database URLs were not changed; safely retry after fixing the reported issue."
    });

    let updated = 0;
    for (const { table, row } of rows) {
      const next = replace(row, mapping) as Record<string, unknown>;
      const changed = Object.keys(next).some(key => JSON.stringify(next[key]) !== JSON.stringify(row[key]));
      if (!changed) continue;
      await supabaseRest(`${table}?id=eq.${encodeURIComponent(String(row.id))}`, {
        method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(next),
      });
      updated++;
    }
    return res.status(200).json({
      migratedImages: mapping.size, failedImages: 0, updatedRows: updated,
      bucket: BUCKET, message: "Images uploaded and database URLs updated."
    });
  } catch (error) {
    console.error("Media migration failed:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).json({ error: "Migration failed. Check function logs; no credentials are returned." });
  }
}
