import type { VercelRequest, VercelResponse } from "@vercel/node";
import superjson from "superjson";
import { supabaseRest } from "./_lib/supabaseRest.js";
export default async function handler(req: VercelRequest,res:VercelResponse) {
  if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).send("Method not allowed");}
  try{
    const rows=await supabaseRest("journal_posts?select=id,title,slug,excerpt,body,cover_image_url,published_at&published=eq.true&order=published_at.desc");
    const posts=(Array.isArray(rows)?rows:[]).map((p:any)=>({id:String(p.id),title:p.title,slug:p.slug,excerpt:p.excerpt,body:p.body,coverImageUrl:p.cover_image_url,publishedAt:p.published_at}));
    res.setHeader("Cache-Control","s-maxage=60, stale-while-revalidate=300");
    return res.status(200).send(superjson.stringify({posts}));
  }catch(error){console.error("Journal API failed:",error instanceof Error?error.message:"Unknown error");return res.status(500).send(superjson.stringify({error:"Could not load journal."}));}
}
