import type { VercelRequest, VercelResponse } from "@vercel/node";
import superjson from "superjson";
import { supabaseRest } from "./_lib/supabaseRest";

function toFrontendProject(row: Record<string, any>) {
  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    location: row.location,
    projectType: row.project_type,
    category: row.category,
    year: row.year,
    squareFootage: row.square_footage,
    clientBrief: row.client_brief,
    vision: row.vision,
    spatialChallenge: row.spatial_challenge,
    craftedSolution: row.crafted_solution,
    challenge: row.challenge,
    solution: row.solution,
    narrative: row.narrative,
    coverImageUrl: row.cover_image_url,
    heroVideoUrl: row.hero_video_url,
    heroAltText: row.hero_alt_text,
    galleryItems: row.gallery_items ?? [],
    beforeAfterItems: row.before_after_items ?? [],
    galleryUrls: row.gallery_urls ?? [],
    videoUrls: row.video_urls ?? [],
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  try {
    const rows = await supabaseRest(
      "projects?select=*&published=eq.true&order=year.desc,created_at.desc"
    );
    const projects = (Array.isArray(rows) ? rows : []).map(toFrontendProject);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).send(superjson.stringify({ projects }));
  } catch (error) {
    console.error("Projects API failed:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).send(
      superjson.stringify({ error: "Could not load projects. Check server-side Supabase configuration." })
    );
  }
}
