import type { VercelRequest, VercelResponse } from "@vercel/node";
import superjson from "superjson";
import { supabaseRest } from "./_lib/supabaseRest.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const projectId = String(req.query.projectId ?? "");
      if (!projectId) return res.status(400).send(superjson.stringify({error:"projectId is required"}));
      const rows = await supabaseRest("project_reviews?select=id,project_id,display_name,rating,comment,created_at&project_id=eq."+encodeURIComponent(projectId)+"&order=created_at.desc&limit=100");
      const reviews = Array.isArray(rows) ? rows.map((r:any)=>({id:String(r.id),projectId:String(r.project_id),displayName:r.display_name,rating:r.rating,comment:r.comment,createdAt:r.created_at})) : [];
      const averageRating = reviews.length ? Number((reviews.reduce((s:number,r:any)=>s+r.rating,0)/reviews.length).toFixed(1)) : 0;
      res.setHeader("Cache-Control","s-maxage=30, stale-while-revalidate=60");
      return res.status(200).send(superjson.stringify({reviews,averageRating,totalReviews:reviews.length}));
    }
    if (req.method === "POST") {
      const input = superjson.parse<any>(typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {}));
      const projectId=String(input.projectId??"").trim(), displayName=String(input.displayName??"").trim(), email=String(input.email??"").trim(), comment=String(input.comment??"").trim(), rating=Number(input.rating);
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(projectId) || displayName.length<2 || displayName.length>80 || !Number.isInteger(rating) || rating<1 || rating>5 || comment.length<3 || comment.length>1200 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).send(superjson.stringify({error:"Please check the review details and try again."}));
      const projects=await supabaseRest("projects?select=id& id=eq."+encodeURIComponent(projectId)+"&published=eq.true".replace(" ",""));
      if (!Array.isArray(projects) || !projects.length) return res.status(404).send(superjson.stringify({error:"Project not found"}));
      await supabaseRest("project_reviews",{method:"POST",headers:{"Prefer":"return=minimal"},body:JSON.stringify({project_id:projectId,display_name:displayName,email:email||null,rating,comment})});
      return res.status(200).send(superjson.stringify({success:true}));
    }
    res.setHeader("Allow","GET, POST"); return res.status(405).send("Method not allowed");
  } catch(error) {
    console.error("Project reviews API failed:",error instanceof Error?error.message:"Unknown error");
    return res.status(500).send(superjson.stringify({error:"Could not process project reviews right now."}));
  }
}
