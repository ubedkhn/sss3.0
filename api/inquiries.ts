import type { VercelRequest, VercelResponse } from "@vercel/node";
import superjson from "superjson";
import { supabaseRest } from "./_lib/supabaseRest";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") { res.setHeader("Allow","POST"); return res.status(405).send("Method not allowed"); }
  try {
    const input = superjson.parse<any>(typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {}));
    const name = String(input.name ?? "").trim();
    const email = String(input.email ?? "").trim();
    const phone = String(input.phone ?? "").trim();
    const projectScope = String(input.projectScope ?? "").trim();
    const geographicLocation = String(input.geographicLocation ?? "").trim();
    const desiredTimeline = String(input.desiredTimeline ?? "").trim();
    const investmentRange = String(input.investmentRange ?? "").trim();
    const message = String(input.message ?? "").trim();
    if (name.length < 2 || projectScope.length < 2 || geographicLocation.length < 2 || desiredTimeline.length < 2 || investmentRange.length < 2 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).send(superjson.stringify({error:"Please complete the required fields with valid details."}));
    await supabaseRest("inquiries", {method:"POST",headers:{"Prefer":"return=minimal"},body:JSON.stringify({name,email,phone:phone||null,project_scope:projectScope,geographic_location:geographicLocation,desired_timeline:desiredTimeline,investment_range:investmentRange,message:message||null})});
    return res.status(200).send(superjson.stringify({success:true}));
  } catch (error) {
    console.error("Inquiry API failed:", error instanceof Error ? error.message : "Unknown error");
    return res.status(500).send(superjson.stringify({error:"Could not submit inquiry right now. Please try again."}));
  }
}
